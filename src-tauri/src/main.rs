use std::sync::{Arc, Mutex};
use std::path::PathBuf;
use tauri::{command, AppHandle, Manager, State};
use tauri_plugin_shell::{ShellExt, process::CommandChild};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RelayStatus {
    pub running: bool,
    pub port: u16,
    pub message: String,
    pub data_dir: Option<String>,
    pub config_file: Option<String>,
}

impl Default for RelayStatus {
    fn default() -> Self {
        Self {
            running: false,
            port: 8080,
            message: "Stopped".to_string(),
            data_dir: None,
            config_file: None,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RelayConfig {
    pub port: u16,
    pub data_directory: String,
    pub max_conn: u32,
    pub relay_name: String,
    pub relay_description: String,
}

impl Default for RelayConfig {
    fn default() -> Self {
        Self {
            port: 8080,
            data_directory: "./relay_data".to_string(),
            max_conn: 128,
            relay_name: "Privacy Lion Relay".to_string(),
            relay_description: "A Privacy Lion relay for decentralized data sharing.".to_string(),
        }
    }
}

// Shared state for the relay process
type RelayState = Arc<Mutex<Option<CommandChild>>>;
type ConfigState = Arc<Mutex<RelayConfig>>;

#[command]
async fn start_relay(
    app_handle: AppHandle,
    relay_state: State<'_, RelayState>,
    config_state: State<'_, ConfigState>,
) -> Result<RelayStatus, String> {
    // Get config and check existing process (release locks immediately)
    let config = {
        let config_guard = config_state.lock().map_err(|e| e.to_string())?;
        config_guard.clone()
    };
    
    let already_running = {
        let child_guard = relay_state.lock().map_err(|e| e.to_string())?;
        if let Some(ref child) = *child_guard {
            child.pid() > 0
        } else {
            false
        }
    };
    
    if already_running {
        return Ok(RelayStatus {
            running: true,
            port: config.port,
            message: "Already running".to_string(),
            data_dir: Some(config.data_directory.clone()),
            config_file: None,
        });
    }

    // Setup directories and config
    let app_data_dir = app_handle.path().app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;
    
    let relay_data_dir = app_data_dir.join("relay_data");
    let config_file_path = app_data_dir.join("config.toml");
    
    // Create directories
    std::fs::create_dir_all(&relay_data_dir)
        .map_err(|e| format!("Failed to create relay data directory: {}", e))?;
    
    // Create config file if it doesn't exist
    if !config_file_path.exists() {
        create_default_config(&config_file_path, &relay_data_dir, &config)?;
    }

    // Start the relay using sidecar
    let sidecar_command = app_handle
        .shell()
        .sidecar("nostr-rs-relay")
        .map_err(|e| format!("Failed to create sidecar command: {}", e))?
        .args([
            "--config", 
            config_file_path.to_str().unwrap_or("config.toml")
        ]);

    let (mut _rx, child) = sidecar_command
        .spawn()
        .map_err(|e| format!("Failed to spawn relay: {}", e))?;

    // Store the child process
    {
        let mut child_guard = relay_state.lock().map_err(|e| e.to_string())?;
        *child_guard = Some(child);
    } // Guard is dropped here

    // Give the relay a moment to start
    tokio::time::sleep(tokio::time::Duration::from_millis(3000)).await;

    // Verify relay is responding
    match verify_relay_running(config.port).await {
        Ok(true) => Ok(RelayStatus {
            running: true,
            port: config.port,
            message: "Running successfully".to_string(),
            data_dir: Some(relay_data_dir.to_string_lossy().to_string()),
            config_file: Some(config_file_path.to_string_lossy().to_string()),
        }),
        Ok(false) => {
            // Clean up if verification failed
            {
                let mut child_guard = relay_state.lock().map_err(|e| e.to_string())?;
                if let Some(child) = child_guard.take() {
                    let _ = child.kill();
                }
            }
            Err("Relay failed to start properly - check if port is available".to_string())
        }
        Err(e) => {
            // Clean up on error
            {
                let mut child_guard = relay_state.lock().map_err(|e| e.to_string())?;
                if let Some(child) = child_guard.take() {
                    let _ = child.kill();
                }
            }
            Err(format!("Failed to verify relay: {}", e))
        }
    }
}

#[command]
async fn stop_relay(
    relay_state: State<'_, RelayState>,
    config_state: State<'_, ConfigState>,
) -> Result<RelayStatus, String> {
    let mut child_guard = relay_state.lock().map_err(|e| e.to_string())?;
    let config = config_state.lock().map_err(|e| e.to_string())?.clone();
    
    if let Some(child) = child_guard.take() {
        child.kill().map_err(|e| format!("Failed to kill relay process: {}", e))?;
        
        Ok(RelayStatus {
            running: false,
            port: config.port,
            message: "Stopped successfully".to_string(),
            data_dir: None,
            config_file: None,
        })
    } else {
        Ok(RelayStatus {
            running: false,
            port: config.port,
            message: "Already stopped".to_string(),
            data_dir: None,
            config_file: None,
        })
    }
}

#[command]
async fn get_relay_status(
    relay_state: State<'_, RelayState>,
    config_state: State<'_, ConfigState>,
) -> Result<RelayStatus, String> {
    let config = {
        let config_guard = config_state.lock().map_err(|e| e.to_string())?;
        config_guard.clone()
    };
    
    let is_running = {
        let child_guard = relay_state.lock().map_err(|e| e.to_string())?;
        child_guard.is_some()
    };
    
    if is_running {
        // Verify it's responsive
        match verify_relay_running(config.port).await {
            Ok(true) => Ok(RelayStatus {
                running: true,
                port: config.port,
                message: "Running".to_string(),
                data_dir: Some(config.data_directory.clone()),
                config_file: None,
            }),
            Ok(false) => {
                // Process exists but not responding
                let mut child_guard = relay_state.lock().map_err(|e| e.to_string())?;
                if let Some(child) = child_guard.take() {
                    let _ = child.kill();
                }
                Ok(RelayStatus {
                    running: false,
                    port: config.port,
                    message: "Error - Process not responding".to_string(),
                    data_dir: None,
                    config_file: None,
                })
            }
            Err(_) => Ok(RelayStatus {
                running: true,
                port: config.port,
                message: "Running (status unknown)".to_string(),
                data_dir: Some(config.data_directory.clone()),
                config_file: None,
            }),
        }
    } else {
        Ok(RelayStatus {
            running: false,
            port: config.port,
            message: "Stopped".to_string(),
            data_dir: None,
            config_file: None,
        })
    }
}

#[command]
async fn get_relay_config(config_state: State<'_, ConfigState>) -> Result<RelayConfig, String> {
    let config = config_state.lock().map_err(|e| e.to_string())?.clone();
    Ok(config)
}

#[command]
async fn update_relay_config(
    new_config: RelayConfig,
    config_state: State<'_, ConfigState>,
) -> Result<RelayConfig, String> {
    let mut config = config_state.lock().map_err(|e| e.to_string())?;
    *config = new_config.clone();
    Ok(new_config)
}

async fn verify_relay_running(port: u16) -> Result<bool, Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let url = format!("http://localhost:{}", port);
    
    let response = client
        .get(&url)
        .timeout(std::time::Duration::from_secs(5))
        .send()
        .await?;
    
    let status_success = response.status().is_success();
    let text = response.text().await?;
    
    Ok(text.contains("Please use a Nostr client to connect") || 
       text.contains("nostr") || 
       status_success)
}

#[command]
async fn open_relay_url(config_state: State<'_, ConfigState>) -> Result<(), String> {
    let config = config_state.lock().map_err(|e| e.to_string())?.clone();
    let url = format!("http://localhost:{}", config.port);
    
    #[cfg(target_os = "macos")]
    std::process::Command::new("open")
        .arg(&url)
        .spawn()
        .map_err(|e| e.to_string())?;

    #[cfg(target_os = "windows")]
    std::process::Command::new("rundll32")
        .args(["url.dll,FileProtocolHandler", &url])
        .spawn()
        .map_err(|e| e.to_string())?;

    #[cfg(target_os = "linux")]
    std::process::Command::new("xdg-open")
        .arg(&url)
        .spawn()
        .map_err(|e| e.to_string())?;

    Ok(())
}

fn create_default_config(
    config_path: &PathBuf, 
    data_dir: &PathBuf, 
    config: &RelayConfig
) -> Result<(), String> {
    let config_content = format!(r#"# Privacy Lion Relay Configuration
[info]
relay_url = "ws://localhost:{}/"
name = "{}"
description = "{}"

[database]
data_directory = "{}"

[network]
port = {}
address = "0.0.0.0"
remote_ip_header = "x-forwarded-for"

[limits]
max_conn = {}
max_subs_per_client = 20
max_filters_per_sub = 10
max_limit = 5000
max_event_bytes = 65536
max_ws_message_bytes = 65536
max_ws_frame_bytes = 65536

[retention]
# Keep events for 24 hours by default (86400 seconds)
# Set to 0 for unlimited retention
max_seconds = 86400

[logging]
# Logging will be handled by Privacy Lion
"#, 
        config.port,
        config.relay_name,
        config.relay_description,
        data_dir.to_string_lossy(),
        config.port,
        config.max_conn
    );

    std::fs::write(config_path, config_content)
        .map_err(|e| format!("Failed to write config file: {}", e))?;
    
    Ok(())
}

fn main() {
    // Initialize shared state
    let relay_state: RelayState = Arc::new(Mutex::new(None));
    let config_state: ConfigState = Arc::new(Mutex::new(RelayConfig::default()));

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(relay_state)
        .manage(config_state)
        .invoke_handler(tauri::generate_handler![
            start_relay,
            stop_relay,
            get_relay_status,
            get_relay_config,
            update_relay_config,
            open_relay_url
        ])
        .setup(|app| {
            // Create app data directory
            let app_data_dir = app.path().app_data_dir()?;
            std::fs::create_dir_all(&app_data_dir).map_err(|e| {
                format!("Failed to create app data directory: {}", e)
            })?;
            
            println!("Privacy Lion Relay starting...");
            println!("App data directory: {}", app_data_dir.display());
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}