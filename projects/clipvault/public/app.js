const state = { token: null, clip: null };
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
  $("clip-view").textContent = state.clip
    ? JSON.stringify(state.clip, null, 2)
    : "";
  $("publish").disabled = !(state.clip && state.clip.state === "draft");
  $("archive").disabled = !(state.clip && state.clip.state === "published");
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
    const data = await api("POST", "/clips", { title: $("title").value });
    state.clip = data.clip;
    $("flow-status").textContent = "Drafted.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("publish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/clips/${state.clip.id}/transition`, {
      to: "published",
      version: state.clip.version,
    });
    state.clip = data.clip;
    $("flow-status").textContent = "Published.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("archive").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/clips/${state.clip.id}/transition`, {
      to: "archived",
      version: state.clip.version,
    });
    state.clip = data.clip;
    $("flow-status").textContent = "Archived.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
