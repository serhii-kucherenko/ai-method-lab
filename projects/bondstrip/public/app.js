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
  const desk = await fetch("/desks", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ name: "FI Desk" }),
  }).then((r) => r.json());
  const strip = await fetch(`/desks/${desk.desk.id}/strips`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({
      day_count: document.getElementById("dc").value,
      face: Number(document.getElementById("face").value),
      coupon_rate: Number(document.getElementById("rate").value),
      freq: Number(document.getElementById("freq").value),
      prev_coupon: document.getElementById("prev").value,
      next_coupon: document.getElementById("next").value,
      settle: document.getElementById("settle").value,
    }),
  }).then((r) => r.json());
  out.textContent = JSON.stringify(strip, null, 2);
});
