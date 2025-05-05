<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { currentUser, pb } from './pocketbase';

    let newMessage: string = '';
    let messages: any[] = [];
    let messagesDiv: HTMLElement;  // Referenz auf den Scroll-Container
    let unsubscribe: () => void;    // Funktion zum Abbestellen der Echtzeit-Updates
    let page = 1;
    let hasMore = true;

    // Scrollt nach unten, damit neu hinzugefügte Nachrichten sichtbar werden
    function scrollToBottom() {
        setTimeout(() => {
            messagesDiv?.scrollTo(0, messagesDiv.scrollHeight);
        }, 50);
    }

    // Lädt eine Seite Nachrichten; Seite 1 initial, höhere Seiten zum Nachladen
    async function loadMessages(pageNum: number) {
        const resultList = await pb.collection('messages').getList(pageNum, 50, {
            sort: '-created',    // Neueste zuerst
            expand: 'user',      // User-Daten in jedem Eintrag ausklappen
        });
        
        if (pageNum === 1) {
            // Erster Aufruf: komplette Liste ersetzen und nach unten scrollen
            messages = [...resultList.items].reverse();  // Umkehrung der Reihenfolge, damit die neuesten Nachrichten unten stehen
            scrollToBottom();
        } else {
            // Weitere Seiten: nur neue, noch nicht vorhandene Nachrichten hinzufügen
            const newMessages = resultList.items
                .reverse() // Umkehrung der Reihenfolge, um die neuesten Nachrichten unten anzuzeigen
                .filter(msg => !messages.find(m => m.id === msg.id));
            messages = [...newMessages, ...messages];
        }
        
        hasMore = resultList.totalPages > pageNum;  // Prüfen, ob es noch weitere Seiten gibt
        page = pageNum;
    }

    // Aufruf für „Load More“-Button
    async function loadMore() {
        if (hasMore) {
            await loadMessages(page + 1);
        }
    }

    // Beim Mounten erstmal Seite 1 laden und Echtzeit-Abonnement starten
    onMount(async () => {
        await loadMessages(1);

        unsubscribe = await pb.collection('messages').subscribe('*', async ({ action, record }) => {
            if (action === 'create') {
                // Neue Nachricht an User-Store expandieren und ans Ende hängen
                const user = await pb.collection('users').getOne(record.user);
                record.expand = { user };
                messages = [...messages, record];
            } else if (action === 'delete') {
                // Gelöschte Nachricht entfernen
                messages = messages.filter(message => message.id !== record.id);
            }
        });
    });

    // Beim Verlassen der Komponente das Abonnement beenden
    onDestroy(() => {
        unsubscribe?.();
    });

    // Neue Nachricht senden, wenn eingeloggt und nicht leer
    async function sendMessage() {
        if ($currentUser && newMessage.trim()) {
            await pb.collection('messages').create({
                text: newMessage,
                user: $currentUser.id,
            });
            newMessage = '';
            scrollToBottom();
        }
    }
</script>

{#if $currentUser}
    <div style="width: 600px; margin: 0 auto;">
        {#if hasMore}
            <div style="text-align: center">
                <button on:click={loadMore}>Load More</button>
            </div>
        {/if}
        
        <!-- Container für Nachrichten, bind:this ermöglicht Scroll-Referenz -->
        <div
            bind:this={messagesDiv}
            style="height: 400px; overflow-y: auto; border: 1px solid #ccc; margin: 10px 0;"
        >
            {#each messages as message (message.id)}
               <!-- Keyed each block optimiert das Rendering, indem nur geänderte Elemente aktualisiert werden. -->
                <div style="display: flex; padding: 8px; border-bottom: 1px solid #eee; min-width: 0;">
                    <img
                        src={`https://api.dicebear.com/9.x/bottts/svg?seed=${message.expand?.user?.username}`}
                        alt="avatar"
                        width="40px"
                        style="flex-shrink: 0;"
                    />
                    <div style="margin-left: 8px; flex: 1; min-width: 0; overflow-wrap: break-word; text-align: left;">
                        <div style="color: #666;">@{message.expand?.user?.username}</div>
                        <div style="word-wrap: break-word; word-break: break-word;">{message.text}</div>
                    </div>
                </div>
            {/each}
        </div>

        <!-- Eingabefeld und Button zum Senden -->
        <form on:submit|preventDefault={sendMessage} style="display: flex;">
            <input
                type="text"
                placeholder="Type your message"
                bind:value={newMessage}
                style="flex: 1; margin-right: 8px; padding: 4px;"
            />
            <button type="submit">Send</button>
        </form>
    </div>
{/if}
