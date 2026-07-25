"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
type Pack = { id: string; label: string }; type Allele = { id: string; label: string; kind: string; alleleHint: string; status: string };
export function AllelesPage() {
 const [packs,setPacks]=useState<Pack[]>([]),[items,setItems]=useState<Allele[]>([]),[packId,setPackId]=useState(""),[label,setLabel]=useState(""),[kind,setKind]=useState("hla_class_i"),[alleleHint,setHint]=useState(""),[error,setError]=useState("");
 const load=async()=>{try{const [p,a]=await Promise.all([api<{items:Pack[]}>("/api/peptides"),api<{items:Allele[]}>("/api/alleles")]);setPacks(p.items);setItems(a.items);setPackId(v=>v||p.items[0]?.id||"");}catch(e){setError(e instanceof Error?e.message:"Could not load alleles");}}; useEffect(()=>{void load();},[]);
 const create=async(e:React.FormEvent)=>{e.preventDefault();try{await api("/api/alleles",{method:"POST",body:JSON.stringify({packId,label,kind,alleleHint})});setLabel("");setHint("");await load();}catch(x){setError(x instanceof Error?x.message:"Could not create allele");}};
 return <StudioShell title="Allele panels" subtitle="Attach MHC assumptions to a peptide pack."><div className="grid gap-8 lg:grid-cols-[20rem_1fr]"><form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4"><Label>Peptide pack</Label><select className="w-full rounded-md border p-2" value={packId} onChange={e=>setPackId(e.target.value)}>{packs.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select><Label htmlFor="allele-label">Label</Label><Input id="allele-label" value={label} onChange={e=>setLabel(e.target.value)} required/><Label>Kind</Label><select className="w-full rounded-md border p-2" value={kind} onChange={e=>setKind(e.target.value)}>{["hla_class_i","hla_class_ii","mixed_panel","custom"].map(x=><option key={x}>{x}</option>)}</select><Label htmlFor="hint">Allele hint</Label><Input id="hint" value={alleleHint} onChange={e=>setHint(e.target.value)}/><Button>Create allele</Button></form><section className="space-y-3">{error&&<p className="text-sm text-red-700">{error}</p>}{items.map(a=><article key={a.id} className="rounded-lg border bg-white p-4"><h2 className="font-semibold">{a.label}</h2><p className="text-sm text-slate-600">{a.kind} · {a.alleleHint||"No hint"} · {a.status}</p></article>)}</section></div></StudioShell>;
}
export default AllelesPage;
