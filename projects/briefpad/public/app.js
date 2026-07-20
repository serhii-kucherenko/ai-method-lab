const state = { token: null, note: null };
const $ = (id) => document.getElementById(id);

async function api(method, path, body) {
  const headers = { "content-type": "application/json" };
  if (state.token) headers.authorization = `Bearer ${state.token}`;
  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = res.status === 204 ? {} : await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

function showNote() {
  $("note-view").textContent = state.note
    ? JSON.stringify(state.note, null, 2)
    : "";
  $("publish").disabled = !(state.note && state.note.state === "draft");
  $("archive").disabled = !(state.note && state.note.state === "published");
}

$("register").addEventListener("click", async () => {
  try {
    const data = await api("POST", "/auth/register", {
      email: $("email").value,
      password: $("password").value,
    });
    state.token = data.token;
    $("auth-status").textContent = "Registered.";
    $("flow").hidden = false;
  } catch (err) {
    $("auth-status").textContent = String(err.message || err);
  }
});

$("login").addEventListener("click", async () => {
  try {
    const data = await api("POST", "/auth/login", {
      email: $("email").value,
      password: $("password").value,
    });
    state.token = data.token;
    $("auth-status").textContent = "Logged in.";
    $("flow").hidden = false;
  } catch (err) {
    $("auth-status").textContent = String(err.message || err);
  }
});

$("create").addEventListener("click", async () => {
  try {
    const data = await api("POST", "/notes", { title: $("title").value });
    state.note = data.note;
    $("flow-status").textContent = "Drafted.";
    showNote();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/notes/${state.note.id}/transition`, {
      to: "published",
      version: state.note.version,
    });
    state.note = data.note;
    $("flow-status").textContent = "Published.";
    showNote();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/notes/${state.note.id}/transition`, {
      to: "archived",
      version: state.note.version,
    });
    state.note = data.note;
    $("flow-status").textContent = "Archived.";
    showNote();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
