export type User = {
  id: string;
  email: string;
  password: string;
};

export type RequestItem = {
  id: string;
  userId: string;
  title: string;
  body: string;
  status: "draft";
};

export type Store = {
  users: Map<string, User>;
  requests: Map<string, RequestItem>;
  tokens: Map<string, string>;
};

export function createStore(): Store {
  return {
    users: new Map(),
    requests: new Map(),
    tokens: new Map(),
  };
}
