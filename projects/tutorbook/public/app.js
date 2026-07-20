const state = { token: null, lesson: null };
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
  $("lesson-view").textContent = state.lesson
    ? JSON.stringify(state.lesson, null, 2)
    : "";
  $("teach").disabled = !(state.lesson && state.lesson.state === "booked");
  $("review").disabled = !(state.lesson && state.lesson.state === "taught");
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
    const data = await api("POST", "/lessons", { title: $("title").value });
    state.lesson = data.lesson;
    $("flow-status").textContent = "Booked.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("teach").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/lessons/${state.lesson.id}/transition`, {
      to: "taught",
      version: state.lesson.version,
    });
    state.lesson = data.lesson;
    $("flow-status").textContent = "Teached.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("review").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/lessons/${state.lesson.id}/transition`, {
      to: "reviewed",
      version: state.lesson.version,
    });
    state.lesson = data.lesson;
    $("flow-status").textContent = "Reviewd.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
