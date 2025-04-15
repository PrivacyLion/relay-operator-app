// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn start_relay() -> String {
    use std::process::Command;

    let result = Command::new("/home/scotty/Desktop/Privacy_Lion/nostr-rs-relay/target/release/nostr-rs-relay")
        .spawn();

    match result {
        Ok(_) => "Relay started!".to_string(),
        Err(e) => format!("Failed to start relay: {}", e),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_relay])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

