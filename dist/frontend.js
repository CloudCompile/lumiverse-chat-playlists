// src/frontend.ts
var STORAGE_KEY = "lumiverse:chatPlaylists:v1";
var SETTLE_MS = 400;
var MAX_RESULTS = 40;
var RECENT_LIMIT = 200;
var ICON = '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 5h9M3 10h9M3 15h5.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M14.2 11.3v5.4l4.3-2.7-4.3-2.7z" fill="currentColor"/></svg>';
var CSS = `
.cpw-root { display: flex; flex-direction: column; gap: 10px; padding: 12px; font-size: 13px; color: var(--lumiverse-text, #e6e6e6); }
.cpw-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.cpw-head-actions { display: flex; gap: 6px; }
.cpw-title { margin: 0; font-size: 14px; font-weight: 600; letter-spacing: .01em; }
.cpw-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: var(--lumiverse-text-muted, #9a9a9a); }
.cpw-name { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cpw-sub { font-size: 11.5px; color: var(--lumiverse-text-muted, #9a9a9a); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cpw-meta { font-size: 11.5px; color: var(--lumiverse-text-muted, #9a9a9a); }
.cpw-hint { margin: 0; font-size: 11.5px; line-height: 1.5; color: var(--lumiverse-text-muted, #9a9a9a); }
.cpw-warn { color: #e5a04c; }
.cpw-btn { font: inherit; font-size: 12px; line-height: 1.2; padding: 6px 10px; border-radius: var(--lumiverse-radius, 8px); border: 1px solid var(--lumiverse-border, rgba(140,140,150,.28)); background: var(--lumiverse-fill, rgba(140,140,150,.12)); color: var(--lumiverse-text, #e6e6e6); cursor: pointer; white-space: nowrap; }
.cpw-btn:hover:not(:disabled) { background: var(--lumiverse-fill-subtle, rgba(140,140,150,.2)); }
.cpw-btn:disabled { opacity: .45; cursor: default; }
.cpw-btn-primary { background: var(--lumiverse-primary, #7c6bd6); border-color: transparent; color: #fff; }
.cpw-btn-primary:hover:not(:disabled) { filter: brightness(1.08); background: var(--lumiverse-primary, #7c6bd6); }
.cpw-btn-ghost { background: transparent; border-color: transparent; padding-left: 4px; padding-right: 6px; }
.cpw-btn-danger { color: #ef7a7a; }
.cpw-icon-btn { padding: 5px 8px; min-width: 30px; }
.cpw-banner { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 9px 10px; border-radius: var(--lumiverse-radius, 8px); border: 1px solid var(--lumiverse-primary, #7c6bd6); background: color-mix(in srgb, var(--lumiverse-primary, #7c6bd6) 14%, transparent); }
.cpw-banner-text { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.cpw-banner-name { font-size: 12.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cpw-list { display: flex; flex-direction: column; gap: 8px; }
.cpw-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: var(--lumiverse-radius, 8px); border: 1px solid var(--lumiverse-border, rgba(140,140,150,.22)); background: var(--lumiverse-fill, rgba(140,140,150,.08)); }
.cpw-card-main { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 3px; }
.cpw-actions { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }
.cpw-empty { padding: 18px 12px; text-align: center; border-radius: var(--lumiverse-radius, 8px); border: 1px dashed var(--lumiverse-border, rgba(140,140,150,.28)); display: flex; flex-direction: column; gap: 6px; }
.cpw-empty-title { font-size: 12.5px; font-weight: 600; }
.cpw-editor { display: flex; flex-direction: column; gap: 10px; }
.cpw-field { display: flex; flex-direction: column; gap: 5px; }
.cpw-input { font: inherit; font-size: 12.5px; width: 100%; box-sizing: border-box; padding: 7px 9px; border-radius: var(--lumiverse-radius, 8px); border: 1px solid var(--lumiverse-border, rgba(140,140,150,.28)); background: var(--lumiverse-fill-subtle, rgba(140,140,150,.12)); color: var(--lumiverse-text, #e6e6e6); }
.cpw-input:focus { outline: 1px solid var(--lumiverse-primary, #7c6bd6); outline-offset: 0; }
.cpw-check { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--lumiverse-text-muted, #9a9a9a); }
.cpw-rows { display: flex; flex-direction: column; gap: 6px; }
.cpw-row { display: flex; align-items: center; gap: 8px; padding: 7px 8px; border-radius: var(--lumiverse-radius, 8px); border: 1px solid var(--lumiverse-border, rgba(140,140,150,.2)); background: var(--lumiverse-fill, rgba(140,140,150,.07)); }
.cpw-row-idx { width: 18px; flex-shrink: 0; font-size: 11px; text-align: center; color: var(--lumiverse-text-muted, #9a9a9a); }
.cpw-row-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.cpw-row-actions { display: flex; gap: 4px; flex-shrink: 0; }
.cpw-editor-actions { display: flex; gap: 6px; flex-wrap: wrap; }
.cpw-editor-footer { display: flex; justify-content: flex-end; gap: 6px; padding-top: 4px; }
.cpw-results { display: flex; flex-direction: column; gap: 4px; max-height: 240px; overflow-y: auto; }
.cpw-result { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; text-align: left; font: inherit; padding: 7px 9px; border-radius: var(--lumiverse-radius, 8px); border: 1px solid transparent; background: transparent; color: inherit; cursor: pointer; }
.cpw-result:hover { background: var(--lumiverse-fill-subtle, rgba(140,140,150,.16)); border-color: var(--lumiverse-border, rgba(140,140,150,.24)); }
.cpw-result-add { flex-shrink: 0; font-size: 11px; color: var(--lumiverse-primary, #a795ef); }
.cpw-pill { position: fixed; left: 50%; bottom: 96px; transform: translateX(-50%); display: flex; align-items: center; gap: 10px; max-width: min(420px, calc(100vw - 24px)); padding: 8px 8px 8px 14px; border-radius: 999px; border: 1px solid var(--lumiverse-border, rgba(140,140,150,.3)); background: var(--lumiverse-fill, rgba(28,28,32,.96)); color: var(--lumiverse-text, #e6e6e6); font: 12px/1.25 system-ui, -apple-system, sans-serif; box-shadow: 0 8px 26px rgba(0,0,0,.32); z-index: 9999; }
.cpw-pill-text { min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.cpw-pill-text b { font-weight: 600; }
.cpw-pill-stop { font: inherit; font-size: 11.5px; padding: 5px 11px; border-radius: 999px; border: 1px solid var(--lumiverse-border, rgba(140,140,150,.32)); background: transparent; color: #ef8b8b; cursor: pointer; flex-shrink: 0; }
.cpw-pill-stop:hover { background: rgba(239,139,139,.14); }
@media (max-width: 640px) { .cpw-pill { bottom: 136px; } }
`;
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className)
    node.className = className;
  if (text !== undefined)
    node.textContent = text;
  return node;
}
function makeButton(label, className, onClick) {
  const button = element("button", `cpw-btn ${className}`.trim(), label);
  button.type = "button";
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick();
  });
  return button;
}
function errorMessage(error) {
  if (error instanceof Error)
    return error.message;
  if (typeof error === "string")
    return error;
  return "Something went wrong.";
}
function isPlaylist(value) {
  if (!value || typeof value !== "object")
    return false;
  const candidate = value;
  return typeof candidate.id === "string" && typeof candidate.name === "string" && Array.isArray(candidate.chatIds) && candidate.chatIds.every((id) => typeof id === "string");
}
function loadPlaylists() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
      return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed))
      return [];
    return parsed.filter(isPlaylist).map((playlist) => ({
      ...playlist,
      loop: playlist.loop !== false
    }));
  } catch {
    return [];
  }
}
function setup(ctx) {
  const removeStyle = ctx.dom.addStyle(CSS);
  let playlists = loadPlaylists();
  let session = null;
  let chats = new Map;
  let catalogLoaded = false;
  let catalogError = null;
  let status = null;
  let view = "list";
  let draft = null;
  let draftIsNew = false;
  let search = "";
  const tab = ctx.ui.registerDrawerTab({
    id: "playlists",
    title: "Chat Playlists",
    shortName: "Lists",
    description: "Walk through an ordered list of chats and advance automatically when you send a message",
    keywords: ["playlist", "rotation", "multi", "cycle", "characters", "queue"],
    headerTitle: "Chat Playlists",
    iconSvg: ICON
  });
  const pill = document.createElement("div");
  pill.className = "cpw-pill";
  pill.style.display = "none";
  document.body.appendChild(pill);
  pill.addEventListener("click", (event) => {
    const target = event.target?.closest?.('[data-role="stop"]');
    if (target)
      stopSession("Playlist stopped");
  });
  const unsubscribeMessages = ctx.events.on("MESSAGE_SENT", (payload) => {
    handleMessageSent(payload);
  });
  loadCatalog();
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
    } catch {}
  }
  function describeChat(chatId) {
    return chats.get(chatId) ?? { id: chatId, label: `Chat ${chatId.slice(0, 6)}`, sub: "Not in your recent chats" };
  }
  async function loadCatalog() {
    const readRecent = ctx.chats?.listRecent;
    if (!readRecent) {
      catalogError = "This Lumiverse build does not expose your chat list to extensions. You can still use “Add current chat” on whichever chat you have open.";
      render();
      return;
    }
    try {
      const page = await readRecent.call(ctx.chats, {
        limit: RECENT_LIMIT,
        sort: "recent",
        direction: "desc"
      });
      const next = new Map;
      for (const row of page.data) {
        const label = row.character_name || row.name || row.id;
        const sub = row.name && row.name !== label ? row.name : row.last_message_preview || "";
        next.set(row.id, { id: row.id, label, sub });
      }
      chats = next;
      catalogLoaded = true;
      catalogError = null;
    } catch (error) {
      catalogError = `Could not load your chats: ${errorMessage(error)}`;
    }
    render();
  }
  function handleMessageSent(payload) {
    if (!session)
      return;
    const data = payload;
    if (!data?.chatId || data.message?.is_user !== true)
      return;
    const playlist = playlists.find((candidate) => candidate.id === session?.playlistId);
    if (!playlist) {
      stopSession("That playlist no longer exists");
      return;
    }
    if (data.chatId !== playlist.chatIds[session.index])
      return;
    const messageId = data.message.id ?? null;
    if (messageId && messageId === session.lastMessageId)
      return;
    if (Date.now() - session.lastAdvanceAt < SETTLE_MS)
      return;
    session.lastMessageId = messageId;
    advance(playlist);
  }
  function advance(playlist) {
    if (!session)
      return;
    const nextIndex = session.index + 1;
    if (nextIndex >= playlist.chatIds.length) {
      if (!playlist.loop) {
        stopSession(`Finished “${playlist.name}”`);
        return;
      }
      goToChat(playlist, 0);
      return;
    }
    goToChat(playlist, nextIndex);
  }
  async function goToChat(playlist, index) {
    const chatId = playlist.chatIds[index];
    if (!chatId) {
      stopSession(`“${playlist.name}” has no chats`);
      return;
    }
    session = {
      playlistId: playlist.id,
      index,
      lastAdvanceAt: Date.now(),
      lastMessageId: null
    };
    status = null;
    render();
    try {
      await navigateToChat(chatId);
    } catch (error) {
      stopSession(errorMessage(error));
    }
  }
  async function navigateToChat(chatId) {
    const surfaces = ctx.host?.surfaces;
    if (!surfaces) {
      throw new Error("This Lumiverse build cannot switch chats from an extension (host navigation unavailable).");
    }
    await surfaces.invoke({ kind: "route", id: "/chat/:chatId" }, { chatId });
  }
  function startPlaylist(playlist) {
    if (playlist.chatIds.length === 0) {
      status = { kind: "error", text: "Add at least one chat to this playlist first." };
      render();
      return;
    }
    goToChat(playlist, 0);
  }
  function stopSession(text) {
    session = null;
    if (text)
      status = { kind: "info", text };
    render();
  }
  function render() {
    const wrapper = element("div", "cpw-root");
    if (view === "edit" && draft)
      renderEditor(wrapper);
    else
      renderList(wrapper);
    tab.root.replaceChildren(wrapper);
    renderPill();
  }
  function renderList(wrapper) {
    const head = element("div", "cpw-head");
    head.appendChild(element("h2", "cpw-title", "Chat Playlists"));
    const headActions = element("div", "cpw-head-actions");
    headActions.appendChild(makeButton("New playlist", "cpw-btn-primary", beginCreate));
    head.appendChild(headActions);
    wrapper.appendChild(head);
    wrapper.appendChild(element("p", "cpw-hint", "Start a playlist, send your message, and the next chat opens automatically. Replies keep generating in the background."));
    if (catalogError)
      wrapper.appendChild(element("p", "cpw-warn cpw-hint", catalogError));
    if (status) {
      wrapper.appendChild(element("p", status.kind === "error" ? "cpw-warn cpw-hint" : "cpw-hint", status.text));
    }
    const running = session ? playlists.find((candidate) => candidate.id === session?.playlistId) : undefined;
    if (session && running) {
      const banner = element("div", "cpw-banner");
      const text = element("div", "cpw-banner-text");
      text.appendChild(element("div", "cpw-banner-name", running.name));
      const nextChatId = running.chatIds.length > 1 ? running.chatIds[(session.index + 1) % running.chatIds.length] : undefined;
      text.appendChild(element("div", "cpw-sub", `${session.index + 1} of ${running.chatIds.length}${nextChatId ? ` · next: ${describeChat(nextChatId).label}` : ""}`));
      banner.appendChild(text);
      banner.appendChild(makeButton("Stop", "cpw-btn", () => stopSession("Playlist stopped")));
      wrapper.appendChild(banner);
    }
    if (playlists.length === 0) {
      const empty = element("div", "cpw-empty");
      empty.appendChild(element("div", "cpw-empty-title", "No playlists yet"));
      empty.appendChild(element("p", "cpw-hint", "Create one, then add the chats you want to rotate through, in order."));
      wrapper.appendChild(empty);
      return;
    }
    const list = element("div", "cpw-list");
    for (const playlist of playlists)
      list.appendChild(renderPlaylistCard(playlist));
    wrapper.appendChild(list);
  }
  function renderPlaylistCard(playlist) {
    const card = element("div", "cpw-card");
    const main = element("div", "cpw-card-main");
    main.appendChild(element("div", "cpw-name", playlist.name));
    main.appendChild(element("div", "cpw-meta", `${playlist.chatIds.length} chat${playlist.chatIds.length === 1 ? "" : "s"}${playlist.loop ? " · loops" : ""}`));
    const preview = element("div", "cpw-sub");
    preview.textContent = playlist.chatIds.length ? playlist.chatIds.map((chatId) => describeChat(chatId).label).join(" → ") : "Empty playlist";
    main.appendChild(preview);
    card.appendChild(main);
    const actions = element("div", "cpw-actions");
    const isRunning = session?.playlistId === playlist.id;
    actions.appendChild(isRunning ? makeButton("Stop", "cpw-btn", () => stopSession("Playlist stopped")) : makeButton("Start", "cpw-btn cpw-btn-primary", () => startPlaylist(playlist)));
    actions.appendChild(makeButton("Edit", "cpw-btn", () => beginEdit(playlist)));
    actions.appendChild(makeButton("Delete", "cpw-btn cpw-btn-danger", () => void confirmDelete(playlist)));
    card.appendChild(actions);
    return card;
  }
  async function confirmDelete(playlist) {
    let confirmed = false;
    try {
      const result = await ctx.ui.showConfirm({
        title: "Delete playlist",
        message: `Delete “${playlist.name}”? Your chats are not affected.`,
        variant: "danger",
        confirmLabel: "Delete"
      });
      confirmed = result.confirmed;
    } catch (error) {
      status = { kind: "error", text: `Could not ask for confirmation: ${errorMessage(error)}` };
      render();
      return;
    }
    if (!confirmed)
      return;
    playlists = playlists.filter((candidate) => candidate.id !== playlist.id);
    if (session?.playlistId === playlist.id)
      session = null;
    persist();
    render();
  }
  function beginCreate() {
    draft = { id: crypto.randomUUID(), name: "", chatIds: [], loop: true };
    draftIsNew = true;
    search = "";
    status = null;
    view = "edit";
    render();
  }
  function beginEdit(playlist) {
    draft = { ...playlist, chatIds: [...playlist.chatIds] };
    draftIsNew = false;
    search = "";
    status = null;
    view = "edit";
    render();
  }
  function cancelEdit() {
    draft = null;
    view = "list";
    status = null;
    render();
  }
  function renderEditor(wrapper) {
    const playlist = draft;
    if (!playlist)
      return;
    const head = element("div", "cpw-head");
    head.appendChild(makeButton("← Back", "cpw-btn cpw-btn-ghost", cancelEdit));
    head.appendChild(element("h2", "cpw-title", draftIsNew ? "New playlist" : "Edit playlist"));
    wrapper.appendChild(head);
    const editor = element("div", "cpw-editor");
    const nameField = element("label", "cpw-field");
    nameField.appendChild(element("span", "cpw-label", "Name"));
    const nameInput = element("input", "cpw-input");
    nameInput.type = "text";
    nameInput.value = playlist.name;
    nameInput.placeholder = "Daily rotation";
    nameInput.addEventListener("input", () => {
      playlist.name = nameInput.value;
    });
    nameField.appendChild(nameInput);
    editor.appendChild(nameField);
    const loopField = element("label", "cpw-check");
    const loopInput = element("input");
    loopInput.type = "checkbox";
    loopInput.checked = playlist.loop;
    loopInput.addEventListener("change", () => {
      playlist.loop = loopInput.checked;
    });
    loopField.appendChild(loopInput);
    loopField.appendChild(element("span", undefined, "Loop back to the first chat after the last one"));
    editor.appendChild(loopField);
    editor.appendChild(element("div", "cpw-label", "Chats, in order"));
    if (playlist.chatIds.length === 0) {
      editor.appendChild(element("p", "cpw-hint", "Add chats below, or open a chat and use “Add current chat”."));
    } else {
      const rows = element("div", "cpw-rows");
      playlist.chatIds.forEach((chatId, index) => {
        const info = describeChat(chatId);
        const row = element("div", "cpw-row");
        row.appendChild(element("div", "cpw-row-idx", String(index + 1)));
        const text = element("div", "cpw-row-text");
        text.appendChild(element("div", "cpw-name", info.label));
        text.appendChild(element("div", "cpw-sub", info.sub));
        row.appendChild(text);
        const controls = element("div", "cpw-row-actions");
        const up = makeButton("↑", "cpw-btn cpw-icon-btn", () => moveChat(index, -1));
        up.disabled = index === 0;
        const down = makeButton("↓", "cpw-btn cpw-icon-btn", () => moveChat(index, 1));
        down.disabled = index === playlist.chatIds.length - 1;
        controls.appendChild(up);
        controls.appendChild(down);
        controls.appendChild(makeButton("✕", "cpw-btn cpw-icon-btn cpw-btn-danger", () => {
          playlist.chatIds.splice(index, 1);
          render();
        }));
        row.appendChild(controls);
        rows.appendChild(row);
      });
      editor.appendChild(rows);
    }
    const editorActions = element("div", "cpw-editor-actions");
    editorActions.appendChild(makeButton("Add current chat", "cpw-btn", addCurrentChat));
    editorActions.appendChild(makeButton("Refresh chat list", "cpw-btn", () => void loadCatalog()));
    editor.appendChild(editorActions);
    const searchField = element("label", "cpw-field");
    searchField.appendChild(element("span", "cpw-label", "Add a chat"));
    const searchInput = element("input", "cpw-input");
    searchInput.type = "search";
    searchInput.placeholder = catalogLoaded ? "Search your recent chats…" : "Loading chats…";
    searchInput.value = search;
    const results = element("div", "cpw-results");
    searchInput.addEventListener("input", () => {
      search = searchInput.value;
      renderResults(results, playlist);
    });
    searchField.appendChild(searchInput);
    searchField.appendChild(results);
    editor.appendChild(searchField);
    const footer = element("div", "cpw-editor-footer");
    footer.appendChild(makeButton("Cancel", "cpw-btn", cancelEdit));
    footer.appendChild(makeButton(draftIsNew ? "Create playlist" : "Save changes", "cpw-btn cpw-btn-primary", saveDraft));
    editor.appendChild(footer);
    wrapper.appendChild(editor);
    renderResults(results, playlist);
  }
  function renderResults(container, playlist) {
    container.replaceChildren();
    if (!catalogLoaded) {
      if (catalogError)
        container.appendChild(element("p", "cpw-warn cpw-hint", catalogError));
      return;
    }
    const needle = search.trim().toLowerCase();
    const matches = [...chats.values()].filter((info) => !playlist.chatIds.includes(info.id)).filter((info) => !needle || info.label.toLowerCase().includes(needle) || info.sub.toLowerCase().includes(needle)).slice(0, MAX_RESULTS);
    if (matches.length === 0) {
      container.appendChild(element("p", "cpw-hint", needle ? "No chats match that search." : "Every recent chat is already in this playlist."));
      return;
    }
    for (const info of matches) {
      const row = element("button", "cpw-result");
      row.type = "button";
      const text = element("div", "cpw-result-text");
      text.appendChild(element("div", "cpw-name", info.label));
      if (info.sub)
        text.appendChild(element("div", "cpw-sub", info.sub));
      row.appendChild(text);
      row.appendChild(element("span", "cpw-result-add", "+ Add"));
      row.addEventListener("click", () => {
        if (playlist.chatIds.includes(info.id))
          return;
        playlist.chatIds.push(info.id);
        render();
      });
      container.appendChild(row);
    }
  }
  function moveChat(index, delta) {
    if (!draft)
      return;
    const target = index + delta;
    if (target < 0 || target >= draft.chatIds.length)
      return;
    const [moved] = draft.chatIds.splice(index, 1);
    draft.chatIds.splice(target, 0, moved);
    render();
  }
  function addCurrentChat() {
    if (!draft)
      return;
    const active = ctx.getActiveChat();
    if (!active.chatId) {
      status = { kind: "error", text: "Open a chat first, then come back to this playlist." };
      render();
      return;
    }
    if (draft.chatIds.includes(active.chatId)) {
      status = { kind: "info", text: "That chat is already in this playlist." };
      render();
      return;
    }
    draft.chatIds.push(active.chatId);
    if (!chats.has(active.chatId)) {
      chats.set(active.chatId, { id: active.chatId, label: "Current chat", sub: active.chatId });
    }
    status = null;
    render();
  }
  function saveDraft() {
    if (!draft)
      return;
    const name = draft.name.trim();
    if (!name) {
      status = { kind: "error", text: "Give the playlist a name first." };
      render();
      return;
    }
    if (draft.chatIds.length === 0) {
      status = { kind: "error", text: "Add at least one chat first." };
      render();
      return;
    }
    const next = { ...draft, name };
    const wasNew = draftIsNew;
    if (wasNew)
      playlists = [...playlists, next];
    else
      playlists = playlists.map((candidate) => candidate.id === next.id ? next : candidate);
    if (session?.playlistId === next.id) {
      if (next.chatIds.length === 0)
        session = null;
      else if (session.index >= next.chatIds.length)
        session.index = 0;
    }
    draft = null;
    view = "list";
    status = { kind: "info", text: wasNew ? "Playlist created." : "Playlist saved." };
    persist();
    render();
  }
  function renderPill() {
    if (!session) {
      pill.style.display = "none";
      pill.replaceChildren();
      return;
    }
    const playlist = playlists.find((candidate) => candidate.id === session?.playlistId);
    if (!playlist) {
      session = null;
      pill.style.display = "none";
      pill.replaceChildren();
      return;
    }
    const index = Math.min(session.index, Math.max(playlist.chatIds.length - 1, 0));
    const nextChatId = playlist.chatIds.length > 1 ? playlist.chatIds[(index + 1) % playlist.chatIds.length] : undefined;
    pill.style.display = "flex";
    pill.replaceChildren();
    const text = element("div", "cpw-pill-text");
    const title = element("div");
    title.appendChild(element("b", undefined, playlist.name));
    title.appendChild(document.createTextNode(`  ${index + 1}/${playlist.chatIds.length}`));
    text.appendChild(title);
    if (nextChatId)
      text.appendChild(element("div", "cpw-sub", `Next: ${describeChat(nextChatId).label}`));
    pill.appendChild(text);
    const stop = element("button", "cpw-pill-stop", "Stop");
    stop.type = "button";
    stop.dataset.role = "stop";
    pill.appendChild(stop);
  }
  return () => {
    unsubscribeMessages();
    tab.destroy();
    pill.remove();
    removeStyle();
  };
}
export {
  setup
};
