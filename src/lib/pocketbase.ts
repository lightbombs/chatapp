import Pocketbase from 'pocketbase';
import { writable } from 'svelte/store';

// Erstellt eine PocketBase-Instanz mit der lokalen Server-URL
export const pb = new Pocketbase('http://127.0.0.1:8090/');

// Speichert den aktuell eingeloggten Benutzer als Svelte-Store
export const currentUser = writable(pb.authStore.record);

// Aktualisiert den Store, wenn sich der Authentifizierungsstatus ändert
pb.authStore.onChange((auth) => {
    console.log('Auth store changed:', auth);
    currentUser.set(pb.authStore.record);
});
