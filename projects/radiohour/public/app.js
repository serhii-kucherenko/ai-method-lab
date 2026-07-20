const state = { token: null, show: null };
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

function showShow() {
  $("show-view").textContent = state.show
    ? JSON.stringify(state.show, null, 2)
    : "";
  $("publish").disabled = !(state.show && state.show.state === "scheduled");
  $("archive").disabled = !(state.show && state.show.state === "onair");
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
    const data = await api("POST", "/shows", { title: $("title").value });
    state.show = data.show;
    $("flow-status").textContent = "Scheduleded.";
    showShow();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/shows/${state.show.id}/transition`, {
      to: "onair",
      version: state.show.version,
    });
    state.show = data.show;
    $("flow-status").textContent = "Onair.";
    showShow();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/shows/${state.show.id}/transition`, {
      to: "wrapped",
      version: state.show.version,
    });
    state.show = data.show;
    $("flow-status").textContent = "Wrapped.";
    showShow();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
