<script lang="ts">
    import Login from "./lib/login.svelte";      
    import Messages from "./lib/messages.svelte";
    import Profile from "./lib/profile.svelte";
    import { currentUser } from "./lib/pocketbase";
    
    // Zustand, der verfolgt, ob wir ein Profil oder den Chat anzeigen
    let viewingProfileId: string | null = null;
    
    // Funktion zum Anzeigen des Profils eines Benutzers
    function viewProfile(userId: string) {
        viewingProfileId = userId;
    }
    
    // Funktion zum Zurückkehren zum Chat
    function backToChat() {
        viewingProfileId = null;
    }

    // Setzt den Anzeigestatus zurück, wenn sich der Benutzer abmeldet
    currentUser.subscribe(user => {
        if (!user && viewingProfileId) {
            viewingProfileId = null;
        }
    });
</script>

<h1>Chat app</h1>

<Login />

{#if $currentUser && viewingProfileId}
    <Profile userId={viewingProfileId} onBack={backToChat} />
{:else if $currentUser}
    <Messages onUserClick={viewProfile} />
{/if}