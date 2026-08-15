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