const PROTOCOL_VERSION = 1;
const MAX_REQUEST_BYTES = 16 * 1024;
const METHOD = "education.status";

class ProtocolError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

async function readRequest() {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of process.stdin) {
    bytes += chunk.length;
    if (bytes > MAX_REQUEST_BYTES) throw new ProtocolError("request_too_large");
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new ProtocolError("invalid_json");
  }
}

function validateRequest(request) {
  if (!isRecord(request) || request.version !== PROTOCOL_VERSION || request.method !== METHOD) {
    throw new ProtocolError(request?.method === METHOD ? "invalid_request" : "method_not_found");
  }
  if (request.params !== undefined && (!isRecord(request.params) || Object.keys(request.params).length > 0)) {
    throw new ProtocolError("invalid_request");
  }
}

function writeResponse(response) {
  process.stdout.write(`${JSON.stringify(response)}\n`);
}

try {
  const request = await readRequest();
  validateRequest(request);
  writeResponse({ version: PROTOCOL_VERSION, ok: true, result: { status: "pending" } });
} catch (error) {
  writeResponse({
    version: PROTOCOL_VERSION,
    ok: false,
    error: { code: error instanceof ProtocolError ? error.code : "internal_error" },
  });
  if (!(error instanceof ProtocolError)) process.exitCode = 1;
}
