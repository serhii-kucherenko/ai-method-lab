const state = { token: null, ride: null };
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
  $("ride-view").textContent = state.ride
    ? JSON.stringify(state.ride, null, 2)
    : "";
  $("book").disabled = !(state.ride && state.ride.state === "offered");
  $("finish").disabled = !(state.ride && state.ride.state === "booked");
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
    const data = await api("POST", "/rides", { title: $("title").value });
    state.ride = data.ride;
    $("flow-status").textContent = "Offered.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("book").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/rides/${state.ride.id}/transition`, {
      to: "booked",
      version: state.ride.version,
    });
    state.ride = data.ride;
    $("flow-status").textContent = "Booked.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("finish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/rides/${state.ride.id}/transition`, {
      to: "finished",
      version: state.ride.version,
    });
    state.ride = data.ride;
    $("flow-status").textContent = "Finishd.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
