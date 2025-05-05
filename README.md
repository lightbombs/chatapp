
A real-time chat app using Svelte and PocketBase.

## Requirements

- Node.js
- [PocketBase](https://pocketbase.io/) server

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Download and start PocketBase server:
   - Download from https://pocketbase.io/
   - Extract and run:
```bash
pocketbase.exe serve
```
4. Create two collections in PocketBase Admin UI (http://127.0.0.1:8090/_/):
   - `users` (use default auth settings)
   - `messages` with fields:
     - `text` (text)
     - `user` (relation to users)

5. Start the app:
```bash
npm run dev
```

Visit http://localhost:5173 to use the chat app.