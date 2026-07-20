const state = { token: null, share: null };
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
  $("share-view").textContent = state.share
    ? JSON.stringify(state.share, null, 2)
    : "";
  $("claim").disabled = !(state.share && state.share.state === "available");
  $("deliver").disabled = !(state.share && state.share.state === "claimed");
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
    const data = await api("POST", "/shares", { title: $("title").value });
    state.share = data.share;
    $("flow-status").textContent = "Listed.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("claim").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/shares/${state.share.id}/transition`, {
      to: "claimed",
      version: state.share.version,
    });
    state.share = data.share;
    $("flow-status").textContent = "Claimed.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("deliver").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/shares/${state.share.id}/transition`, {
      to: "delivered",
      version: state.share.version,
    });
    state.share = data.share;
    $("flow-status").textContent = "Deliverd.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
