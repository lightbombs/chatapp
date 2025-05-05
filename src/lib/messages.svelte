<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { currentUser,pb } from './pocketbase';

    let newMessage: string = '';
    let messages: any[] = [];
    let unsubscribe: () => void;

    onMount(async () => {
   
            const resultList = await pb.collection('messages').getList(1, 50, {
                sort: 'created',
                expand: 'user',
            });
            console.log('Fetched messages:', resultList.items);
            messages = resultList.items;

            unsubscribe = await pb.collection('messages').subscribe('*', async ({action,record}) => {
                if (action === 'create') {
                    const user = await pb.collection('users').getOne(record.user);
                    record.expand = { user };
                    messages = [...messages, record];
                } else if (action === 'delete') {
                    messages = messages.filter((message) => message.id !== record.id);
                }
            });
        
    });

    onDestroy(() => {
        unsubscribe?.();
    });

    async function sendMessage() {
        
        if ($currentUser){
            const data = {
                text: newMessage,
                user: $currentUser.id,
            };
            const createdMessage = await pb.collection('messages').create(data);
        }
        
    }
</script>

{#if $currentUser}
    <div class="messages">
        {#each messages as message (message.id)}
            <div class="message">
                <img 
                    class="avatar" 
                    src={`https://api.dicebear.com/9.x/bottts/svg?seed=${message.expand?.user?.username}`}
                    alt="avatar"
                    width="40px"
                />  
                <div>
                    <small>Sent by @{message.expand?.user?.username}</small>
                    <p class="message-text">{message.text}</p>
                </div>
            </div>
        {/each}
    </div>

    <form on:submit|preventDefault={sendMessage}>
        <input type="text" placeholder="Type your message" bind:value={newMessage}  />
        <button type="submit">Send</button>
    </form>
{/if}