<script lang="ts">
    import { pb } from './pocketbase';
    
    // Props für die Komponente
    export let userId: string;
    export let onBack: () => void;
    
    // Zustandsvariablen
    let user: any = null;
    let userMessages: any[] = [];
    let loading = true;
    
    // Benutzerdaten und deren Nachrichten laden
    async function loadUserProfile() {
        try {
            loading = true;
            
            // Benutzerdaten abrufen
            user = await pb.collection('users').getOne(userId);
            
            // Nachrichten des Benutzers abrufen
            const messagesList = await pb.collection('messages').getList(1, 20, {
                filter: `user = "${userId}"`,
                sort: '-created',
            });
            
            userMessages = messagesList.items;
        } catch (error) {
            console.error("Fehler beim Laden des Profils:", error);
        } finally {
            loading = false;
        }
    }
    
    // Profildaten laden, wenn die Komponente mit einer userId angezeigt wird
    $: if (userId) {
        loadUserProfile();
    }
</script>

<div style="width: 600px; margin: 0 auto; text-align: left;">
    <div>
        <button on:click={onBack} style="margin-bottom: 20px;">← Back to Chat</button>
    </div>
    
    {#if loading}
        <div style="text-align: center; padding: 20px;">Loading profile...</div>
    {:else if user}
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <img 
                src={`https://api.dicebear.com/9.x/bottts/svg?seed=${user.username}`}
                alt="avatar" 
                width="80px"
                style="margin-right: 20px;"
            />
            <div>
                <h2 style="margin: 0 0 5px 0;">@{user.username}</h2>
                <p style="margin: 0; color: #666;">Member since {new Date(user.created).toLocaleDateString()}</p>
            </div>
        </div>
        
        <h3>Recent Messages</h3>
        {#if userMessages.length === 0}
            <p>This user hasn't posted any messages yet.</p>
        {:else}
            <div style="border: 1px solid #eee; border-radius: 5px;">
                {#each userMessages as message}
                    <div style="padding: 10px; border-bottom: 1px solid #eee;">
                        <div style="color: #888; font-size: 0.8em;">{new Date(message.created).toLocaleString()}</div>
                        <div>{message.text}</div>
                    </div>
                {/each}
            </div>
        {/if}
    {:else}
        <div style="text-align: center; padding: 20px;">User not found</div>
    {/if}
</div>