const state = { token: null, job: null };
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
  $("job-view").textContent = state.job
    ? JSON.stringify(state.job, null, 2)
    : "";
  $("schedule").disabled = !(state.job && state.job.state === "requested");
  $("finish").disabled = !(state.job && state.job.state === "scheduled");
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
    const data = await api("POST", "/jobs", { title: $("title").value });
    state.job = data.job;
    $("flow-status").textContent = "Requested.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("schedule").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/jobs/${state.job.id}/transition`, {
      to: "scheduled",
      version: state.job.version,
    });
    state.job = data.job;
    $("flow-status").textContent = "Scheduleed.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("finish").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/jobs/${state.job.id}/transition`, {
      to: "done",
      version: state.job.version,
    });
    state.job = data.job;
    $("flow-status").textContent = "Finishd.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
