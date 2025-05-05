<script lang="ts">
    import { currentUser, pb } from "./pocketbase";
    let username: string = "";
    let password: string = "";
    let errorMessage: string = "";

    async function login() {
        try {
            await pb.collection("users").authWithPassword(`${username}@dummy.com`, password);
            errorMessage = "";
        } catch (error: any) {
            console.log('Login error details:', error.data?.data);
            errorMessage = "Login failed: " + (error.message || "null");
           
        }
    }

    async function signup() {
        try {
            const data = {
                username: username,
                email: `${username}@dummy.com`,
                password: password,
                passwordConfirm: password

            };
            const createdUser = await pb.collection("users").create(data);
            await login();
            errorMessage = "";
        
            console.log("User created and logged in:", createdUser);
        } catch (error: any) {
            console.log('Signup error details:', error.data?.data);
            errorMessage = "Signup failed: " + (error.message || "null");
            
            console.error("Error creating user:", error);
        }
    }

    function logout() {
        pb.authStore.clear();
    }
</script>

{#if $currentUser}
    <p>Welcome, {$currentUser.username}!</p>
    <button on:click={logout}>Logout</button>
{:else}
    <p>Please log in.</p>
    {#if errorMessage}
        <p style="color: red">{errorMessage}</p>
    {/if}
    <form on:submit|preventDefault>
        <input type="text" placeholder="Username" required bind:value={username} />
        <input type="password" placeholder="Password" required bind:value={password} />
        <button on:click={signup}>Sign Up</button>
        <button on:click={login}>Login</button>
    </form>
{/if}