import { sleep } from "k6";
import http from "k6/http";

export const options = {
  stages: [
    { duration: "12s", target: 500 },
    { duration: "12s", target: 500 },
    { duration: "12s", target: 1000 },
    { duration: "12s", target: 1000 },
    { duration: "12s", target: 0 },
  ],
  ext: {
    loadimpact: {
      distribution: {
        "amazon:us:ashburn": { loadZone: "amazon:us:ashburn", percent: 100 },
      },
    },
  },
};

export default function main() {
  let response;

  response = http.get("http://localhost:3000/qa/questions/918046", {
    headers: {
      Authorization: "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",
    },
  });
  sleep(1);
}