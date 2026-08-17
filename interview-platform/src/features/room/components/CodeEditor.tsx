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