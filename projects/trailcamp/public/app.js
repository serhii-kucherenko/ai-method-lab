const state = { token: null, site: null };
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

function showSite() {
  $("site-view").textContent = state.site
    ? JSON.stringify(state.site, null, 2)
    : "";
  $("publish").disabled = !(state.site && state.site.state === "reserved");
  $("archive").disabled = !(state.site && state.site.state === "occupied");
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
    const data = await api("POST", "/sites", { title: $("title").value });
    state.site = data.site;
    $("flow-status").textContent = "Reserveded.";
    showSite();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/sites/${state.site.id}/transition`, {
      to: "occupied",
      version: state.site.version,
    });
    state.site = data.site;
    $("flow-status").textContent = "Occupied.";
    showSite();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/sites/${state.site.id}/transition`, {
      to: "vacated",
      version: state.site.version,
    });
    state.site = data.site;
    $("flow-status").textContent = "Vacated.";
    showSite();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
