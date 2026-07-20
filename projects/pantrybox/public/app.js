const state = { token: null, stock: null };
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
  $("stock-view").textContent = state.stock
    ? JSON.stringify(state.stock, null, 2)
    : "";
  $("reserve").disabled = !(state.stock && state.stock.state === "listed");
  $("pickup").disabled = !(state.stock && state.stock.state === "reserved");
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
    const data = await api("POST", "/stocks", { title: $("title").value });
    state.stock = data.stock;
    $("flow-status").textContent = "Listed.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("reserve").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/stocks/${state.stock.id}/transition`, {
      to: "reserved",
      version: state.stock.version,
    });
    state.stock = data.stock;
    $("flow-status").textContent = "Reserveed.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("pickup").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/stocks/${state.stock.id}/transition`, {
      to: "picked_up",
      version: state.stock.version,
    });
    state.stock = data.stock;
    $("flow-status").textContent = "Pickupd.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
