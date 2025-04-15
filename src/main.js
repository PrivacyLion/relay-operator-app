import { invoke } from '@tauri-apps/api/tauri';

document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('button');

  button.addEventListener('click', async () => {
    const result = await invoke('start_relay');
    alert(result); // shows "Relay started!" message from backend
  });
});

