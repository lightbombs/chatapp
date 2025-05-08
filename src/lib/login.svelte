<script lang="ts">
    import { currentUser, pb } from "./pocketbase";  // Importiert die Pocketbase-Instanz und den Store für den aktuellen Benutzer
    let username: string = "";
    let password: string = "";
    let errorMessage: string = "";

    // Funktion zum Einloggen des Benutzers
    async function login() {
        try {
            // Authentifiziert den Benutzer mit der Pocketbase API unter Verwendung der E-Mail (mit @dummy.com) und dem Passwort
            await pb.collection("users").authWithPassword(`${username}@dummy.com`, password);
            errorMessage = "";  // Löscht Fehlermeldung, wenn Login erfolgreich
        } catch (error: any) {
            // Falls ein Fehler beim Login auftritt, wird die Fehlermeldung gesetzt und Fehlerdetails geloggt
            console.log('Login error details:', error.data?.data);
            errorMessage = "Login failed: " + (error.message || "null");
        }
    }

    // Funktion zur Registrierung eines neuen Benutzers
    async function signup() {
        try {
            const data = {
                username: username,  
                email: `${username}@dummy.com`,  // Erzeugt eine E-Mail aus dem Benutzernamen
                password: password,  
                passwordConfirm: password  
            };

            // Erstellt den Benutzer in der Pocketbase und meldet ihn danach automatisch an
            const createdUser = await pb.collection("users").create(data);
            await login();  //  Einloggen nach erfolgreicher Registrierung
            errorMessage = "";  // Löscht Fehlermeldung bei erfolgreicher Registrierung und Login
            console.log("User created and logged in:", createdUser);
        } catch (error: any) {
            // Wenn ein Fehler bei der Registrierung auftritt, wird die Fehlermeldung gesetzt und Fehlerdetails ausgegeben
            console.log('Signup error details:', error.data?.data);
            errorMessage = "Signup failed: " + (error.message || "null");
            console.error("Error creating user:", error);
        }
    }

    // Funktion zum Ausloggen des Benutzers
    function logout() {
        pb.authStore.clear();  // Löscht die Authentifizierungsdaten und loggt den Benutzer aus
    }
</script>

{#if $currentUser}
    <div style="margin-bottom: 20px;">
        <p style="display: inline; margin-right: 10px;">Welcome, {$currentUser.username}!</p>
        <button style="background: none;  padding: 0; font-weight: bold; color: white; text-decoration: underline;" on:click={logout}>Logout</button>
    </div>
{:else}
    <p>Please log in.</p>
    {#if errorMessage}
        <p style="color: red">{errorMessage}</p>  <!-- anzeigen Fehlermeldung, falls vorhanden -->
    {/if}
    <form on:submit|preventDefault>
        <input type="text" placeholder="Username" required bind:value={username} />
        <input type="password" placeholder="Password" required bind:value={password} />
        <button on:click={signup}>Sign Up</button>  
        <button on:click={login}>Login</button>  
    </form>
{/if}
