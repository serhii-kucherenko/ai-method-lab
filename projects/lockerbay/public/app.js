const state = { token: null, locker: null };
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

function showLocker() {
  $("locker-view").textContent = state.locker
    ? JSON.stringify(state.locker, null, 2)
    : "";
  $("publish").disabled = !(state.locker && state.locker.state === "reserved");
  $("archive").disabled = !(state.locker && state.locker.state === "occupied");
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
    const data = await api("POST", "/lockers", { title: $("title").value });
    state.locker = data.locker;
    $("flow-status").textContent = "Reserveded.";
    showLocker();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/lockers/${state.locker.id}/transition`, {
      to: "occupied",
      version: state.locker.version,
    });
    state.locker = data.locker;
    $("flow-status").textContent = "Occupied.";
    showLocker();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/lockers/${state.locker.id}/transition`, {
      to: "released",
      version: state.locker.version,
    });
    state.locker = data.locker;
    $("flow-status").textContent = "Released.";
    showLocker();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
