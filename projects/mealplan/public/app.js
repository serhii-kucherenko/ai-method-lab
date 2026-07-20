const state = { token: null, meal: null };
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
  $("meal-view").textContent = state.meal
    ? JSON.stringify(state.meal, null, 2)
    : "";
  $("prep").disabled = !(state.meal && state.meal.state === "planned");
  $("serve").disabled = !(state.meal && state.meal.state === "prepped");
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
    const data = await api("POST", "/meals", { title: $("title").value });
    state.meal = data.meal;
    $("flow-status").textContent = "Planned.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("prep").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/meals/${state.meal.id}/transition`, {
      to: "prepped",
      version: state.meal.version,
    });
    state.meal = data.meal;
    $("flow-status").textContent = "Preped.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("serve").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/meals/${state.meal.id}/transition`, {
      to: "served",
      version: state.meal.version,
    });
    state.meal = data.meal;
    $("flow-status").textContent = "Served.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
