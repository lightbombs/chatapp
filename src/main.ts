import { mount } from 'svelte'        // Holt die Funktion, um eine Svelte-App zu starten
import './app.css'                    // Lädt das Styling der App
import App from './App.svelte'        // Importiert die Haupt-App-Komponente

const app = mount(App, {
  target: document.getElementById('app')!, // Findet das <div id="app"> im HTML und hängt die App daran
})

