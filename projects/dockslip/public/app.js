const state = { token: null, slip: null };
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

function showSlip() {
  $("slip-view").textContent = state.slip
    ? JSON.stringify(state.slip, null, 2)
    : "";
  $("publish").disabled = !(state.slip && state.slip.state === "held");
  $("archive").disabled = !(state.slip && state.slip.state === "docked");
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
    const data = await api("POST", "/slips", { title: $("title").value });
    state.slip = data.slip;
    $("flow-status").textContent = "Helded.";
    showSlip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/slips/${state.slip.id}/transition`, {
      to: "docked",
      version: state.slip.version,
    });
    state.slip = data.slip;
    $("flow-status").textContent = "Docked.";
    showSlip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/slips/${state.slip.id}/transition`, {
      to: "cleared",
      version: state.slip.version,
    });
    state.slip = data.slip;
    $("flow-status").textContent = "Cleared.";
    showSlip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
