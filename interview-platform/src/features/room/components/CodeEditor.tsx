"use client";

import { useEffect, useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { Socket } from "socket.io-client";
import { Play, Loader2, X } from "lucide-react";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  CodeState,
} from "@/features/room/types/events";
import { runCode, type RunResult } from "@/features/room/lib/run-code";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const LANGUAGES: { value: CodeState["language"]; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
];

export function CodeEditor({ socket, roomId }: { socket: AppSocket | null; roomId: string }) {
  const [code, setCode] = useState("// Start coding here\n");
  const [language, setLanguage] = useState<CodeState["language"]>("javascript");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    if (!socket) return;

    const handleState = ({ code: initial }: { code: CodeState }) => {
      isRemoteUpdate.current = true;
      setCode(initial.code);
      setLanguage(initial.language);
    };
    const handleChange = ({ code: incoming }: { code: string }) => {
      isRemoteUpdate.current = true;
      setCode(incoming);
    };
    const handleLanguage = ({ language: incoming }: { language: CodeState["language"] }) => {
      setLanguage(incoming);
    };

    socket.on("room:state", handleState);
    socket.on("code:change", handleChange);
    socket.on("code:language", handleLanguage);

    return () => {
      socket.off("room:state", handleState);
      socket.off("code:change", handleChange);
      socket.off("code:language", handleLanguage);
    };
  }, [socket]);

  const handleEditorChange = (value: string | undefined) => {
    const next = value ?? "";
    setCode(next);

    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }
    socket?.emit("code:change", { roomId, code: next });
  };

  const handleLanguageChange = (value: CodeState["language"]) => {
    setLanguage(value);
    socket?.emit("code:language", { roomId, language: value });
  };

  const handleMount: OnMount = (editor) => {
    editor.focus();
  };

  const handleRun = async () => {
    setIsRunning(true);
    setShowOutput(true);
    try {
      const runResult = await runCode(code, language);
      setResult(runResult);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b bg-muted/40 p-2">
        <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
          Code editor
        </span>
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={handleRun} disabled={isRunning}>
            {isRunning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Run
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleEditorChange}
          onMount={handleMount}
          theme="vs-dark"
          options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
        />
      </div>