"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import type { Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents, ChatMessage } from "@/features/room/types/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;