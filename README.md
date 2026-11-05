# Chat Playlists

A [Lumiverse](https://lumiverse.chat) Spindle extension that walks you through an ordered list of chats.

Start a playlist and it opens the first chat. Every time you send a message in the chat it expects, it moves you to the next chat in the playlist — so all of them generate in parallel while you keep writing. After the last chat it loops back to the first (or stops, if you turn Loop off).

This is a walker, not a broadcaster: it never sends messages for you. It only advances when you actually send one.

## Install

### From GitHub (recommended)

In Lumiverse, open **Extensions → Install from GitHub** and paste this repository's URL.

### Local

Copy this repository into your instance's extension directory as `chat_playlists`, then use **Extensions → Import local** (or `POST /api/v1/spindle/import-local`):

```bash
cp -r . /path/to/lumiverse/data/extensions/chat_playlists
```

## Usage

1. Open the **Chat Playlists** tab in the drawer.
2. **New playlist** → name it, then add chats in order. You can search your recent chats, or open a chat and press **Add current chat**.
3. Leave **Loop** on to cycle forever, or turn it off to stop after the last chat.
4. Press **Start**. You land in the first chat.
5. Type and send. The next chat opens as soon as your message is created.

While a playlist is running, a pill at the bottom of the screen shows your position and the next chat, with a **Stop** button.

## Permissions

None. The extension uses only free host surfaces:

- `ctx.chats.listRecent` for the chat picker (session-authenticated read)
- `ctx.host.surfaces.invoke({ kind: 'route', id: '/chat/:chatId' })` for navigation
- `MESSAGE_SENT` events to know when to advance
- a drawer tab and `localStorage` for the playlists themselves

## Development

```bash
bun install
bun run typecheck
bun run build     # writes dist/frontend.js
```

The manifest is `spindle.json`. There is no backend module.

## Limitations

- Playlists are stored in this browser's `localStorage`, so they do not follow you across devices.
- The chat picker covers your 200 most recent chats.
- The drawer stays open after pressing Start; Lumiverse's frontend API has no way for an extension to close it.
- If a chat in a playlist is deleted, the run stops with an error rather than skipping it.
