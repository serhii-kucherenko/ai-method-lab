export type User = { id: string; email: string; password: string };
export type Status = {
  id: string;
  userId: string;
  title: string;
  body: string;
};

export type Store = {
  users: Map<string, User>;
  tokens: Map<string, string>;
  statuses: Map<string, Status>;
};

export function createStore(): Store {
  return {
    users: new Map(),
    tokens: new Map(),
    statuses: new Map(),
  };
}
