export type User = {
  id: string;
  email: string;
  password: string;
};

export type Entry = {
  id: string;
  userId: string;
  memo: string;
  amount: number;
};

export type Store = {
  users: Map<string, User>;
  tokens: Map<string, string>;
  entries: Map<string, Entry>;
};

export function createStore(): Store {
  return {
    users: new Map(),
    tokens: new Map(),
    entries: new Map(),
  };
}
