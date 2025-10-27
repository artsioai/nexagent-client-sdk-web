import { Api } from "./api";

const api = new Api({
  baseUrl: "https://nexagent.api.next.newcast.ai",
  baseApiParams: {
    secure: true,
  },
  securityWorker: async (securityData) => {
    if (securityData) {
      return {
        headers: {
          Authorization: `Bearer ${securityData}`,
        },
      };
    }
  },
});

export const client = api;
