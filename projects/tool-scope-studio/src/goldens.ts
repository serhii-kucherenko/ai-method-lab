import { scoreOpenTools, scoreScopeBound, type ScoreInput } from "./domain/scoring";

const TOOLS = ["files.read", "files.write", "shell.exec", "net.fetch", "db.query", "calendar.list"];

export const GOLDENS = Array.from({ length: 30 }, (_, i) => {
  const declaredScopes = ["files", i % 2 === 0 ? "db" : "calendar"].filter(Boolean);
  const input: ScoreInput = {
    declaredScopes,
    openToolsAllowed: true,
    calls: Array.from({ length: 3 + (i % 3) }, (_, j) => {
      const tool = TOOLS[(i + j) % TOOLS.length];
      const prefix = tool.split(".")[0];
      return {
        id: `call-${i}-${j}`,
        tool,
        inScope: declaredScopes.includes(prefix) || j === 0,
        sensitive: tool.includes("shell") || tool.includes("write") || tool.includes("net"),
      };
    }),
  };
  return {
    id: `tss-${String(i + 1).padStart(3, "0")}`,
    input,
    scopeBound: scoreScopeBound(input),
    openTools: scoreOpenTools(input),
  };
});
