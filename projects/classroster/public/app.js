const state = { token: null, seat: null };
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
  $("seat-view").textContent = state.seat
    ? JSON.stringify(state.seat, null, 2)
    : "";
  $("attend").disabled = !(state.seat && state.seat.state === "enrolled");
  $("graduate").disabled = !(state.seat && state.seat.state === "attending");
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
    const data = await api("POST", "/seats", { title: $("title").value });
    state.seat = data.seat;
    $("flow-status").textContent = "Enrolled.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("attend").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/seats/${state.seat.id}/transition`, {
      to: "attending",
      version: state.seat.version,
    });
    state.seat = data.seat;
    $("flow-status").textContent = "Attended.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("graduate").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/seats/${state.seat.id}/transition`, {
      to: "graduated",
      version: state.seat.version,
    });
    state.seat = data.seat;
    $("flow-status").textContent = "Graduated.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
