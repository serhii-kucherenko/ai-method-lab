const state = { token: null, donation: null };
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
  $("donation-view").textContent = state.donation
    ? JSON.stringify(state.donation, null, 2)
    : "";
  $("screen").disabled = !(state.donation && state.donation.state === "booked");
  $("donate").disabled = !(state.donation && state.donation.state === "screened");
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
    const data = await api("POST", "/donations", { title: $("title").value });
    state.donation = data.donation;
    $("flow-status").textContent = "Booked.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("screen").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/donations/${state.donation.id}/transition`, {
      to: "screened",
      version: state.donation.version,
    });
    state.donation = data.donation;
    $("flow-status").textContent = "Screened.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("donate").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/donations/${state.donation.id}/transition`, {
      to: "donated",
      version: state.donation.version,
    });
    state.donation = data.donation;
    $("flow-status").textContent = "Donated.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
