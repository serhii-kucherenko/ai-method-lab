const state = { token: null, match: null };
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

function showMatch() {
  $("match-view").textContent = state.match
    ? JSON.stringify(state.match, null, 2)
    : "";
  $("publish").disabled = !(state.match && state.match.state === "paired");
  $("archive").disabled = !(state.match && state.match.state === "playing");
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
    const data = await api("POST", "/matches", { title: $("title").value });
    state.match = data.match;
    $("flow-status").textContent = "Paireded.";
    showMatch();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/matches/${state.match.id}/transition`, {
      to: "playing",
      version: state.match.version,
    });
    state.match = data.match;
    $("flow-status").textContent = "Playing.";
    showMatch();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/matches/${state.match.id}/transition`, {
      to: "scored",
      version: state.match.version,
    });
    state.match = data.match;
    $("flow-status").textContent = "Scored.";
    showMatch();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
