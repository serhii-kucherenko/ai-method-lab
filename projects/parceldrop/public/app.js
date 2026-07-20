const state = { token: null, parcel: null };
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
  $("parcel-view").textContent = state.parcel
    ? JSON.stringify(state.parcel, null, 2)
    : "";
  $("notify").disabled = !(state.parcel && state.parcel.state === "arrived");
  $("pickup").disabled = !(state.parcel && state.parcel.state === "notified");
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
    const data = await api("POST", "/parcels", { title: $("title").value });
    state.parcel = data.parcel;
    $("flow-status").textContent = "Arrived.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("notify").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/parcels/${state.parcel.id}/transition`, {
      to: "notified",
      version: state.parcel.version,
    });
    state.parcel = data.parcel;
    $("flow-status").textContent = "Notifyed.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("pickup").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/parcels/${state.parcel.id}/transition`, {
      to: "picked_up",
      version: state.parcel.version,
    });
    state.parcel = data.parcel;
    $("flow-status").textContent = "Pickupd.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
