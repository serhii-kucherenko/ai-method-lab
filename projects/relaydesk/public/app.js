const state = { token: null, ticket: null };
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
  $("ticket-view").textContent = state.ticket
    ? JSON.stringify(state.ticket, null, 2)
    : "";
  $("start").disabled = !(state.ticket && state.ticket.state === "triaged");
  $("resolve").disabled = !(state.ticket && state.ticket.state === "in_progress");
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
    const data = await api("POST", "/tickets", { title: $("title").value });
    state.ticket = data.ticket;
    $("flow-status").textContent = "Triaged.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("start").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/tickets/${state.ticket.id}/transition`, {
      to: "in_progress",
      version: state.ticket.version,
    });
    state.ticket = data.ticket;
    $("flow-status").textContent = "Started.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("resolve").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/tickets/${state.ticket.id}/transition`, {
      to: "resolved",
      version: state.ticket.version,
    });
    state.ticket = data.ticket;
    $("flow-status").textContent = "Resolved.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
