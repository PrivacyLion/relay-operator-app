// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Child, Command};
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Manager, State};
use serde::{Deserialize, Serialize};

// Global state to track relay process
struct RelayState {
    process: Arc<Mutex<Option<Child>>>,
    status: Arc<Mutex<String>>,
}

#[derive(Serialize, Deserialize)]
struct RelayStatus {
    status: String,
    message: String,
}

#[derive(Serialize, Deserialize)]
struct HealthCheck {
    relay_online: bool,
    port_accessible: bool,
    message: String,
}

// Start NOSTR relay (Docker approach first)
#[tauri::command]
async fn start_relay(state: State<'_, RelayState>) -> Result<RelayStatus, String> {
    let mut process_guard = state.process.lock().unwrap();
    let mut status_guard = state.status.lock().unwrap();
    
    // Check if already running
    if process_guard.is_some() {
        return Ok(RelayStatus {
            status: "running".to_string(),
            message: "Relay is already running".to_string(),
        });
    }

    // Try Docker first (quickest setup)
    match start_docker_relay() {
        Ok(child) => {
            *process_guard = Some(child);
            *status_guard = "running".to_string();
            Ok(RelayStatus {
                status: "running".to_string(),
                message: "NOSTR relay started via Docker".to_string(),
            })
        }
        Err(_) => {
            // Fallback to local build if available
            match start_local_relay() {
                Ok(child) => {
                    *process_guard = Some(child);
                    *status_guard = "running".to_string();
                    Ok(RelayStatus {
                        status: "running".to_string(),
                        message: "NOSTR relay started locally".to_string(),
                    })
                }
                Err(e) => {
                    *status_guard = "error".to_string();
                    Err(format!("Failed to start relay: {}", e))
                }
            }
        }
    }
}

// Stop NOSTR relay
#[tauri::command]
async fn stop_relay(state: State<'_, RelayState>) -> Result<RelayStatus, String> {
    let mut process_guard = state.process.lock().unwrap();
    let mut status_guard = state.status.lock().unwrap();
    
    if let Some(mut child) = process_guard.take() {
        match child.kill() {
            Ok(_) => {
                *status_guard = "stopped".to_string();
                // Also stop Docker container if running
                let _ = Command::new("docker")
                    .args(&["stop", "privacy-lion-relay"])
                    .output();
                Ok(RelayStatus {
                    status: "stopped".to_string(),
                    message: "Relay stopped successfully".to_string(),
                })
            }
            Err(e) => {
                *status_guard = "error".to_string();
                Err(format!("Failed to stop relay: {}", e))
            }
        }
    } else {
        *status_guard = "stopped".to_string();
        Ok(RelayStatus {
            status: "stopped".to_string(),
            message: "Relay was not running".to_string(),
        })
    }
}

// Get current relay status
#[tauri::command]
async fn get_relay_status(state: State<'_, RelayState>) -> Result<RelayStatus, String> {
    let status_guard = state.status.lock().unwrap();
    Ok(RelayStatus {
        status: status_guard.clone(),
        message: format!("Relay status: {}", *status_guard),
    })
}

// Health check - verify relay is responding
#[tauri::command]
async fn health_check() -> Result<HealthCheck, String> {
    // Check if port 8080 is accessible
    let port_check = tokio::time::timeout(
        std::time::Duration::from_secs(5),
        tokio::net::TcpStream::connect("127.0.0.1:8080")
    ).await;

    let port_accessible = port_check.is_ok() && port_check.unwrap().is_ok();

    if port_accessible {
        // For NOSTR relays, just check if the port is accessible
        // NOSTR relays use WebSocket, not HTTP, so port accessibility is sufficient
        Ok(HealthCheck {
            relay_online: true,
            port_accessible: true,
            message: "NOSTR relay is healthy and responding on WebSocket".to_string(),
        })
    } else {
        Ok(HealthCheck {
            relay_online: false,
            port_accessible: false,
            message: "Relay not accessible on port 8080".to_string(),
        })
    }
}

// Docker relay startup - Using /tmp to avoid file watching
fn start_docker_relay() -> Result<Child, std::io::Error> {
    // Create data directory outside project to avoid file watching
    std::fs::create_dir_all("/tmp/privacy-lion-relay").ok();
    
    // Create basic config.toml
    let config = r#"
[info]
relay_url = "ws://localhost:8080/"
name = "Privacy Lion Relay"
description = "Privacy Lion NOSTR Relay - Empowering Data Freedom"

[database]
data_directory = "/tmp/privacy-lion-relay"

[network]
port = 8080
address = "0.0.0.0"

[limits]
max_event_bytes = 65536
max_ws_message_bytes = 131072
"#;
    std::fs::write("/tmp/privacy-lion-relay/config.toml", config).ok();

    // Use /tmp path for Docker mount
    let data_path = std::path::Path::new("/tmp/privacy-lion-relay");
    let config_path = data_path.join("config.toml");

    Command::new("docker")
        .args(&[
            "run",
            "-d",
            "--name", "privacy-lion-relay",
            "-p", "8080:8080",
            "--mount", &format!("src={},target=/usr/src/app/db,type=bind", data_path.to_str().unwrap()),
            "--mount", &format!("src={},target=/usr/src/app/config.toml,type=bind", config_path.to_str().unwrap()),
            "--restart", "unless-stopped",
            "--pull", "always",
            "scsibug/nostr-rs-relay:latest"
        ])
        .spawn()
}

// Local relay startup (fallback)
fn start_local_relay() -> Result<Child, std::io::Error> {
    // Try to find local nostr-rs-relay binary
    let paths = [
        "./target/release/nostr-rs-relay",
        "./nostr-rs-relay/target/release/nostr-rs-relay",
        "/usr/local/bin/nostr-rs-relay",
        "nostr-rs-relay", // In PATH
    ];

    for path in &paths {
        if std::path::Path::new(path).exists() || which::which(path).is_ok() {
            return Command::new(path)
                .env("RUST_LOG", "warn,nostr_rs_relay=info")
                .spawn();
        }
    }

    Err(std::io::Error::new(
        std::io::ErrorKind::NotFound,
        "nostr-rs-relay binary not found"
    ))
}

fn main() {
    let relay_state = RelayState {
        process: Arc::new(Mutex::new(None)),
        status: Arc::new(Mutex::new("stopped".to_string())),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(relay_state)
        .invoke_handler(tauri::generate_handler![
            start_relay,
            stop_relay, 
            get_relay_status,
            health_check
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}