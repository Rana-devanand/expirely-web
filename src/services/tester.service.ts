import { api } from "./api";

export const testerService = {
  register: (data: { username: string; email: string; notes?: string }) =>
    api.post("/tester", data),
};
