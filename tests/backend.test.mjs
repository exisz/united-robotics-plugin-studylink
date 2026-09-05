import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";

const backend = new URL("../dist/rpc.mjs", import.meta.url);

function invoke(input) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [backend.pathname], { stdio: ["pipe", "pipe", "pipe"] });
    const stdout = [];
    const stderr = [];
    child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.stderr.on("data", (chunk) => stderr.push(chunk));
    child.once("error", reject);
    child.once("close", (code) => resolve({
      code,
      stderr: Buffer.concat(stderr).toString("utf8"),
      response: JSON.parse(Buffer.concat(stdout).toString("utf8")),
    }));
    child.stdin.end(typeof input === "string" ? input : JSON.stringify(input));
  });
}

test("education.status reports the placeholder as pending", async () => {
  const result = await invoke({ version: 1, method: "education.status" });
  assert.equal(result.code, 0);
  assert.equal(result.stderr, "");
  assert.deepEqual(result.response, { version: 1, ok: true, result: { status: "pending" } });
});

test("unknown methods and malformed input return bounded protocol errors", async () => {
  const unknown = await invoke({ version: 1, method: "system.exec" });
  assert.deepEqual(unknown.response, { version: 1, ok: false, error: { code: "method_not_found" } });

  const malformed = await invoke("not-json");
  assert.deepEqual(malformed.response, { version: 1, ok: false, error: { code: "invalid_json" } });
});
