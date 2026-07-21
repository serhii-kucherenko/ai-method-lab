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
  const car = await fetch("/carriers", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: "Demo" }),
  });
  const { carrier } = await car.json();
  const pairing = await fetch(`/carriers/${carrier.id}/pairings`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      report_local: document.getElementById("report").value,
      segments: Number(document.getElementById("segments").value),
      fdp_hours: Number(document.getElementById("fdp").value),
      acclimated: document.getElementById("acclimated").checked,
      rest_hours: 11,
    }),
  });
  out.textContent = JSON.stringify(await pairing.json(), null, 2);
});
