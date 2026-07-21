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
    const study = (await api("POST", "/studies", { name: "Demo Trial" })).study;
    await api("POST", `/studies/${study.id}/members`, {
      userId: state.userId,
      role: "sponsor",
    });
    await api("PUT", `/studies/${study.id}/important-codes`, { codes: ["EFF"] });
    await api("POST", `/studies/${study.id}/versions`, {
      version: {
        id: "V1",
        effective_at: "2026-01-01",
        visits: { EFF: { target_day: 14, before: 1, after: 1 } },
      },
    });
    const subject = (
      await api("POST", `/studies/${study.id}/subjects`, { enrollment: "2026-01-01" })
    ).subject;
    const visit = (
      await api("POST", `/studies/${study.id}/visits`, {
        subject_id: subject.id,
        code: "EFF",
        actual: "2026-01-20",
      })
    ).visit;
    const important = await api("GET", `/studies/${study.id}/important`);
    $("flow-status").textContent = "Visit scored.";
    $("view").textContent = JSON.stringify({ visit, important }, null, 2);
  } catch (e) {
    $("flow-status").textContent = e.message;
  }
};
