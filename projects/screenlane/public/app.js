const state = {
  token: null,
  boardId: null,
  jobId: null,
  criterionId: null,
  application: null,
};

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
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

function show(obj) {
  $("view").textContent = JSON.stringify(obj, null, 2);
}

async function auth(kind) {
  try {
    const data = await api("POST", `/auth/${kind}`, {
      email: $("email").value,
      password: $("password").value,
    });
    state.token = data.token;
    $("auth-status").textContent = `Signed in as ${data.user.email}`;
    $("flow").hidden = false;
  } catch (err) {
    $("auth-status").textContent = err.message;
  }
}

$("register").onclick = () => auth("register");
$("login").onclick = () => auth("login");

$("start").onclick = async () => {
  try {
    const board = await api("POST", "/boards", { name: $("board-name").value });
    state.boardId = board.board.id;
    const job = await api("POST", `/boards/${state.boardId}/jobs`, {
      title: $("job-title").value,
    });
    state.jobId = job.job.id;
    const crit = await api("POST", `/jobs/${state.jobId}/criteria`, {
      label: "Systems design",
      weight: 2,
    });
    state.criterionId = crit.criterion.id;
    const cand = await api("POST", `/boards/${state.boardId}/candidates`, {
      name: $("cand-name").value,
      email: "candidate@screenlane.local",
    });
    const app = await api("POST", `/jobs/${state.jobId}/applications`, {
      candidateId: cand.candidate.id,
    });
    state.application = app.application;
    $("screen").disabled = false;
    $("score").disabled = true;
    $("hire").disabled = true;
    $("flow-status").textContent = "Application applied — add screening next.";
    show(state.application);
  } catch (err) {
    $("flow-status").textContent = err.message;
  }
};

$("screen").onclick = async () => {
  try {
    const data = await api(
      "POST",
      `/applications/${state.application.id}/transition`,
      { to: "screening", version: state.application.version },
    );
    state.application = data.application;
    $("score").disabled = false;
    $("flow-status").textContent = "In screening — submit a score.";
    show(state.application);
  } catch (err) {
    $("flow-status").textContent = err.message;
  }
};

$("score").onclick = async () => {
  try {
    const data = await api("POST", `/applications/${state.application.id}/scores`, {
      criterionId: state.criterionId,
      value: 4,
    });
    state.application = data.application;
    $("hire").disabled = false;
    $("flow-status").textContent = `Scored — avg ${data.application.scoreAverage}.`;
    show(data);
  } catch (err) {
    $("flow-status").textContent = err.message;
  }
};

$("hire").onclick = async () => {
  try {
    const data = await api(
      "POST",
      `/applications/${state.application.id}/transition`,
      {
        to: "decided",
        version: state.application.version,
        decision: "hired",
      },
    );
    state.application = data.application;
    $("flow-status").textContent = "Hired — lane complete.";
    show(state.application);
  } catch (err) {
    $("flow-status").textContent = err.message;
  }
};
