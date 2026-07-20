const state = { token: null, appointment: null };
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

function showAppointment() {
  $("appointment-view").textContent = state.appointment
    ? JSON.stringify(state.appointment, null, 2)
    : "";
  $("publish").disabled = !(state.appointment && state.appointment.state === "booked");
  $("archive").disabled = !(state.appointment && state.appointment.state === "checked_in");
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
    const data = await api("POST", "/appointments", { title: $("title").value });
    state.appointment = data.appointment;
    $("flow-status").textContent = "Bookeded.";
    showAppointment();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/appointments/${state.appointment.id}/transition`, {
      to: "checked_in",
      version: state.appointment.version,
    });
    state.appointment = data.appointment;
    $("flow-status").textContent = "Checked_in.";
    showAppointment();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/appointments/${state.appointment.id}/transition`, {
      to: "completed",
      version: state.appointment.version,
    });
    state.appointment = data.appointment;
    $("flow-status").textContent = "Completed.";
    showAppointment();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
