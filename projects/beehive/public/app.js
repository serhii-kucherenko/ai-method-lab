const state = { token: null, check: null };
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

function showCheck() {
  $("check-view").textContent = state.check
    ? JSON.stringify(state.check, null, 2)
    : "";
  $("publish").disabled = !(state.check && state.check.state === "scheduled");
  $("archive").disabled = !(state.check && state.check.state === "inspected");
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
    const data = await api("POST", "/checks", { title: $("title").value });
    state.check = data.check;
    $("flow-status").textContent = "Scheduleded.";
    showCheck();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/checks/${state.check.id}/transition`, {
      to: "inspected",
      version: state.check.version,
    });
    state.check = data.check;
    $("flow-status").textContent = "Inspected.";
    showCheck();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/checks/${state.check.id}/transition`, {
      to: "logged",
      version: state.check.version,
    });
    state.check = data.check;
    $("flow-status").textContent = "Logged.";
    showCheck();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
