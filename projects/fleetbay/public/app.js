const state = { token: null, vehicle: null };
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

function showVehicle() {
  $("vehicle-view").textContent = state.vehicle
    ? JSON.stringify(state.vehicle, null, 2)
    : "";
  $("publish").disabled = !(state.vehicle && state.vehicle.state === "staged");
  $("archive").disabled = !(state.vehicle && state.vehicle.state === "rented");
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
    const data = await api("POST", "/vehicles", { title: $("title").value });
    state.vehicle = data.vehicle;
    $("flow-status").textContent = "Stageded.";
    showVehicle();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/vehicles/${state.vehicle.id}/transition`, {
      to: "rented",
      version: state.vehicle.version,
    });
    state.vehicle = data.vehicle;
    $("flow-status").textContent = "Rented.";
    showVehicle();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/vehicles/${state.vehicle.id}/transition`, {
      to: "returned",
      version: state.vehicle.version,
    });
    state.vehicle = data.vehicle;
    $("flow-status").textContent = "Returned.";
    showVehicle();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
