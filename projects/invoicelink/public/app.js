const state = { token: null, invoice: null };
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
  $("invoice-view").textContent = state.invoice
    ? JSON.stringify(state.invoice, null, 2)
    : "";
  $("send").disabled = !(state.invoice && state.invoice.state === "draft");
  $("pay").disabled = !(state.invoice && state.invoice.state === "sent");
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
    const data = await api("POST", "/invoices", { title: $("title").value });
    state.invoice = data.invoice;
    $("flow-status").textContent = "Drafted.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("send").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/invoices/${state.invoice.id}/transition`, {
      to: "sent",
      version: state.invoice.version,
    });
    state.invoice = data.invoice;
    $("flow-status").textContent = "Sended.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("pay").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/invoices/${state.invoice.id}/transition`, {
      to: "paid",
      version: state.invoice.version,
    });
    state.invoice = data.invoice;
    $("flow-status").textContent = "Payd.";
    showClip();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
