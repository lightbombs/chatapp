<script lang="ts">
    import Login from "./lib/login.svelte";
    import Messages from "./lib/messages.svelte";
    import { currentUser } from "./lib/pocketbase";
    </script>
    
    <h1>Chat app</h1>
 
    <Login />
    <Messages />
