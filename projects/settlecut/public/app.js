const out = document.getElementById("out");
document.getElementById("go").addEventListener("click", async () => {
  const reg = await fetch("/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: `ui-${Date.now()}@ex.com`,
      password: "pw",
    }),
  });
  const { token } = await reg.json();
  const acc = await fetch("/accounts", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: "Demo LSE" }),
  });
  const { account } = await acc.json();
  const interval = await fetch(`/accounts/${account.id}/intervals`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      interval_start: "2026-07-01T14:00:00-05:00",
      meter_kwh: Number(document.getElementById("meter").value),
      schedule_kwh: Number(document.getElementById("sched").value),
      delivery_factor: Number(document.getElementById("df").value),
      imbalance_price: 0.05,
    }),
  });
  out.textContent = JSON.stringify(await interval.json(), null, 2);
});
