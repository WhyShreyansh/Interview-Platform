export type RunResult = { logs: string[]; error: string | null };

const WORKER_TIMEOUT_MS = 5000;

const WORKER_SOURCE = `
  self.onmessage = (e) => {
    const logs = [];
    const push = (...args) => {
      logs.push(args.map(a => {
        try { return typeof a === "string" ? a : JSON.stringify(a); }
        catch { return String(a); }
      }).join(" "));
    };
    self.console = { log: push, error: push, warn: push, info: push };

    try {
      const fn = new Function(e.data);
      fn();
      self.postMessage({ logs, error: null });
    } catch (err) {
      self.postMessage({ logs, error: err instanceof Error ? err.message : String(err) });
    }
  };
`;

export async function runJavaScript(code: string): Promise<RunResult> {
  return new Promise((resolve) => {
    const blob = new Blob([WORKER_SOURCE], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));

    const timeout = setTimeout(() => {
      worker.terminate();
      resolve({ logs: [], error: `Execution timed out after ${WORKER_TIMEOUT_MS / 1000}s (possible infinite loop)` });
    }, WORKER_TIMEOUT_MS);

    worker.onmessage = (e: MessageEvent<RunResult>) => {
      clearTimeout(timeout);
      worker.terminate();
      resolve(e.data);
    };
    worker.onerror = (e) => {
      clearTimeout(timeout);
      worker.terminate();
      resolve({ logs: [], error: e.message });
    };
    worker.postMessage(code);
  });
}

export async function runTypeScript(code: string): Promise<RunResult> {
  const res = await fetch("/api/code/transpile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  if (!res.ok) return { logs: [], error: data.error ?? "Failed to transpile TypeScript" };
  return runJavaScript(data.js);
}