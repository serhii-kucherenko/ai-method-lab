# Vision — Edge Quant Studio

**Display name:** Edge Quant Studio  
**Slug:** `edge-quant-studio`  
**Paper input:** [PolyQ (arXiv:2607.14618)](https://arxiv.org/abs/2607.14618v1) — codesigning end-to-end quantization for scalable edge CPU LLM inference  
**Authors’ code:** none published in digest  

## Who pays / who uses

ML platform and edge infrastructure engineers who must ship LLMs onto CPUs (laptop, workstation, mobile SoC) without locking every channel to one bit width and hoping memory and latency still fit.

## Outcome

Before a model leaves the lab for an edge CPU target, the team can:

1. Register a **model pack** and an **edge target** with a fractional average-bit budget  
2. Build a **channel bit-width plan** (activation-aware, palette-aligned)  
3. Compare that plan against a **naive uniform bit-width baseline**  
4. Emit a soft-sim **compile / runtime plan** (cluster → kernel path → layout merge)  
5. Read a **latency / memory honesty fence** that never pretends to be measured silicon  

## Why this is not PolyQ

This is a Method Lab soft-simulation studio inspired by PolyQ’s *pattern* (channel-wise budget + CPU compile co-design). It is **not** a rebrand, not a port of authors’ code (none published), and not measured silicon.

## Money story (tier B infra / cost)

Toolchain seats for teams who today waste weeks between “pick W3 or W4” dashboards and surprise OOM / latency on edge CPUs. Moat: channel-aware plan quality vs uniform quant dashboards, plus compile/runtime honesty in one place.

## Success signal

A stranger recognizes a **quantization / edge-CPU planning product** — not a noun-swapped desk, not Legacy Infer devices, not Prompt Cache console.
