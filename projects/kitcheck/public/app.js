const state = { token: null, loan: null };
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

function showLoan() {
  $("loan-view").textContent = state.loan
    ? JSON.stringify(state.loan, null, 2)
    : "";
  $("checkout").disabled = !(state.loan && state.loan.state === "requested");
  $("return").disabled = !(state.loan && state.loan.state === "checked_out");
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
    const data = await api("POST", "/loans", { itemName: $("item").value });
    state.loan = data.loan;
    $("flow-status").textContent = "Requested.";
    showLoan();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("checkout").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/loans/${state.loan.id}/transition`, {
      to: "checked_out",
      version: state.loan.version,
    });
    state.loan = data.loan;
    $("flow-status").textContent = "Checked out.";
    showLoan();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});

$("return").addEventListener("click", async () => {
  try {
    const data = await api("POST", `/loans/${state.loan.id}/transition`, {
      to: "returned",
      version: state.loan.version,
    });
    state.loan = data.loan;
    $("flow-status").textContent = "Returned.";
    showLoan();
  } catch (err) {
    $("flow-status").textContent = String(err.message || err);
  }
});
