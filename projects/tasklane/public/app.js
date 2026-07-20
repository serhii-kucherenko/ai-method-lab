const state = { token: null, card: null };
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

function showClip() {
  $("card-view").textContent = state.card
    ? JSON.stringify(state.card, null, 2)
    : "";
  $("start").disabled = !(state.card && state.card.state === "todo");
  $("finish").disabled = !(state.card && state.card.state === "doing");
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
    const data = await api("POST", "/cards", { title: $("title").value });
    state.card = data.card;
    $("flow-status").textContent = "Queued.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("start").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/cards/${state.card.id}/transition`, {
      to: "doing",
      version: state.card.version,
    });
    state.card = data.card;
    $("flow-status").textContent = "Started.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("finish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/cards/${state.card.id}/transition`, {
      to: "done",
      version: state.card.version,
    });
    state.card = data.card;
    $("flow-status").textContent = "Finishd.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
