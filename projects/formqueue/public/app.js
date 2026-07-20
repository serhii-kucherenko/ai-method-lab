const state = { token: null, form: null };
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
  $("form-view").textContent = state.form
    ? JSON.stringify(state.form, null, 2)
    : "";
  $("review").disabled = !(state.form && state.form.state === "submitted");
  $("close").disabled = !(state.form && state.form.state === "reviewed");
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
    const data = await api("POST", "/forms", { title: $("title").value });
    state.form = data.form;
    $("flow-status").textContent = "Submitted.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("review").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/forms/${state.form.id}/transition`, {
      to: "reviewed",
      version: state.form.version,
    });
    state.form = data.form;
    $("flow-status").textContent = "Reviewed.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("close").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/forms/${state.form.id}/transition`, {
      to: "closed",
      version: state.form.version,
    });
    state.form = data.form;
    $("flow-status").textContent = "Closed.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
