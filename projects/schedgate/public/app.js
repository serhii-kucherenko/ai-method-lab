const state = { token: null, userId: null };
const $ = (id) => document.getElementById(id);

async function api(method, path, body) {
  const headers = { "content-type": "application/json" };
  if (state.token) headers.authorization = `Bearer ${state.token}`;
  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

async function auth(kind) {
  try {
    const data = await api("POST", `/auth/${kind}`, {
      email: $("email").value,
      password: $("password").value,
    });
    state.token = data.token;
    state.userId = data.user.id;
    $("auth-status").textContent = `Signed in as ${data.user.email}`;
    $("flow").hidden = false;
  } catch (e) {
    $("auth-status").textContent = e.message;
  }
}

$("register").onclick = () => auth("register");
$("login").onclick = () => auth("login");

$("run").onclick = async () => {
  try {
    const admin = await api("POST", "/auth/register", {
      email: `admin-${Date.now()}@schedgate.local`,
      password: "demo",
    });
    const cal = await api("POST", "/calendars", { name: "Demo Calendar" });
    await api("POST", `/calendars/${cal.calendar.id}/members`, {
      userId: admin.user.id,
      role: "admin",
    });
    let first = (
      await api("POST", `/calendars/${cal.calendar.id}/bookings`, {
        title: "Block A",
        startsAt: 100,
        endsAt: 200,
      })
    ).booking;
    first = (
      await api("POST", `/bookings/${first.id}/transition`, {
        to: "confirmed",
        version: first.version,
      })
    ).booking;
    let conflict = (
      await api("POST", `/calendars/${cal.calendar.id}/bookings`, {
        title: "Block B",
        startsAt: 150,
        endsAt: 250,
      })
    ).booking;
    await api("POST", `/bookings/${conflict.id}/override`, {});
    await fetch(`/bookings/${conflict.id}/override`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${admin.token}`,
      },
    });
    conflict = (
      await api("POST", `/bookings/${conflict.id}/transition`, {
        to: "confirmed",
        version: conflict.version,
      })
    ).booking;
    $("flow-status").textContent = "Confirmed after dual admin override.";
    $("view").textContent = JSON.stringify({ first, conflict }, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
