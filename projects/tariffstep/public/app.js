const out = document.getElementById("out");
const go = document.getElementById("go");

go?.addEventListener("click", async () => {
  const email = `ui-${Date.now()}@ex.com`;
  const reg = await fetch("/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password: "pw" }),
  }).then((r) => r.json());
  const token = reg.token;
  const account = await fetch("/accounts", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ name: "Rate desk" }),
  }).then((r) => r.json());
  const bill = await fetch(`/accounts/${account.account.id}/bills`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({
      total_kwh: Number(document.getElementById("kwh").value),
      current_peak_kw: Number(document.getElementById("cur").value),
      prior_peak_kw: Number(document.getElementById("prior").value),
      ratchet_pct: Number(document.getElementById("ratchet").value),
      demand_rate: Number(document.getElementById("dr").value),
      blocks: [
        { up_to_kwh: 100, rate: 0.1 },
        { up_to_kwh: 200, rate: 0.15 },
        { up_to_kwh: null, rate: 0.2 },
      ],
    }),
  }).then((r) => r.json());
  out.textContent = JSON.stringify(bill, null, 2);
});
