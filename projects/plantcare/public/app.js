const state = { token: null, plant: null };
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
  $("plant-view").textContent = state.plant
    ? JSON.stringify(state.plant, null, 2)
    : "";
  $("grow").disabled = !(state.plant && state.plant.state === "seeded");
  $("harvest").disabled = !(state.plant && state.plant.state === "growing");
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
    const data = await api("POST", "/plants", { title: $("title").value });
    state.plant = data.plant;
    $("flow-status").textContent = "Seeded.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("grow").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/plants/${state.plant.id}/transition`, {
      to: "growing",
      version: state.plant.version,
    });
    state.plant = data.plant;
    $("flow-status").textContent = "Growed.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("harvest").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/plants/${state.plant.id}/transition`, {
      to: "harvested",
      version: state.plant.version,
    });
    state.plant = data.plant;
    $("flow-status").textContent = "Harvestd.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
