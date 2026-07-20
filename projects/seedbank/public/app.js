const state = { token: null, packet: null };
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

function showPacket() {
  $("packet-view").textContent = state.packet
    ? JSON.stringify(state.packet, null, 2)
    : "";
  $("publish").disabled = !(state.packet && state.packet.state === "cataloged");
  $("archive").disabled = !(state.packet && state.packet.state === "reserved");
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
    const data = await api("POST", "/packets", { title: $("title").value });
    state.packet = data.packet;
    $("flow-status").textContent = "Catalogeded.";
    showPacket();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/packets/${state.packet.id}/transition`, {
      to: "reserved",
      version: state.packet.version,
    });
    state.packet = data.packet;
    $("flow-status").textContent = "Reserved.";
    showPacket();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/packets/${state.packet.id}/transition`, {
      to: "sown",
      version: state.packet.version,
    });
    state.packet = data.packet;
    $("flow-status").textContent = "Sown.";
    showPacket();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
