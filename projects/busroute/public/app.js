const state = { token: null, trip: null };
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

function showTrip() {
  $("trip-view").textContent = state.trip
    ? JSON.stringify(state.trip, null, 2)
    : "";
  $("publish").disabled = !(state.trip && state.trip.state === "scheduled");
  $("archive").disabled = !(state.trip && state.trip.state === "boarding");
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
    const data = await api("POST", "/trips", { title: $("title").value });
    state.trip = data.trip;
    $("flow-status").textContent = "Scheduleded.";
    showTrip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/trips/${state.trip.id}/transition`, {
      to: "boarding",
      version: state.trip.version,
    });
    state.trip = data.trip;
    $("flow-status").textContent = "Boarding.";
    showTrip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/trips/${state.trip.id}/transition`, {
      to: "arrived",
      version: state.trip.version,
    });
    state.trip = data.trip;
    $("flow-status").textContent = "Arrived.";
    showTrip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
