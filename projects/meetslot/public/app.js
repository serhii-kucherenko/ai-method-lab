const state = { token: null, booking: null };
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

function showBooking() {
  $("booking-view").textContent = state.booking
    ? JSON.stringify(state.booking, null, 2)
    : "";
  $("confirm").disabled = !(state.booking && state.booking.state === "held");
  $("complete").disabled = !(state.booking && state.booking.state === "confirmed");
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
    const data = await api("POST", "/bookings", { roomName: $("room").value });
    state.booking = data.booking;
    $("flow-status").textContent = "Held.";
    showBooking();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("confirm").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/bookings/${state.booking.id}/transition`, {
      to: "confirmed",
      version: state.booking.version,
    });
    state.booking = data.booking;
    $("flow-status").textContent = "Confirmed.";
    showBooking();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("complete").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/bookings/${state.booking.id}/transition`, {
      to: "completed",
      version: state.booking.version,
    });
    state.booking = data.booking;
    $("flow-status").textContent = "Completed.";
    showBooking();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
