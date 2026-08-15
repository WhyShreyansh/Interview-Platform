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

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

type PyodideInterface = {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
};

let pyodidePromise: Promise<PyodideInterface> | null = null;

function loadPyodideScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.loadPyodide) return resolve();
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Python runtime"));
    document.head.appendChild(script);
  });
}

async function getPyodide(): Promise<PyodideInterface> {
  if (!pyodidePromise) {
    pyodidePromise = loadPyodideScript().then(() =>
      window.loadPyodide!({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/" })
    );
  }
  return pyodidePromise;
}

export async function runPython(code: string): Promise<RunResult> {
  const logs: string[] = [];
  try {
    const pyodide = await getPyodide();
    pyodide.setStdout({ batched: (s: string) => logs.push(s) });
    pyodide.setStderr({ batched: (s: string) => logs.push(s) });
    await pyodide.runPythonAsync(code);
    return { logs, error: null };
  } catch (err) {
    return { logs, error: err instanceof Error ? err.message : "Failed to run Python" };
  }
}

export async function runCode(code: string, language: "javascript" | "typescript" | "python"): Promise<RunResult> {
  if (language === "javascript") return runJavaScript(code);
  if (language === "typescript") return runTypeScript(code);
  return runPython(code);
}