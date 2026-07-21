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
  const ph = await fetch("/pharmacies", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: "Demo Rx" }),
  });
  const { pharmacy } = await ph.json();
  const script = await fetch(`/pharmacies/${pharmacy.id}/scripts`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      prescribed_ndc: "00093012301",
      candidate_ndc: "00173045601",
      te_code_prescribed: document.getElementById("teP").value,
      te_code_candidate: document.getElementById("teC").value,
      same_ingredient_strength_form: true,
      daw: Number(document.getElementById("daw").value),
      brand_medically_necessary: false,
    }),
  });
  out.textContent = JSON.stringify(await script.json(), null, 2);
});
