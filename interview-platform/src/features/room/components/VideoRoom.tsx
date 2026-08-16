"use client";

import { useEffect, useState } from "react";
import {
  LiveKitRoom, GridLayout, ParticipantTile, useTracks, RoomAudioRenderer, ControlBar,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";

function VideoGrid() {
  const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: true }]);
  return (
    <GridLayout tracks={tracks} style={{ height: "100%" }}>
      <ParticipantTile />
    </GridLayout>
  );
}

export function VideoRoom({ roomId }: { roomId: string }) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/livekit/token?roomId=${encodeURIComponent(roomId)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to get video token");
        if (!cancelled) setToken(data.token);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Video unavailable");
      });
    return () => { cancelled = true; };
  }, [roomId]);

  const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!livekitUrl) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Video isn&apos;t configured yet</p>
        <p>
          Set <code className="rounded bg-muted px-1 py-0.5">LIVEKIT_API_KEY</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5">LIVEKIT_API_SECRET</code>, and{" "}
          <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_LIVEKIT_URL</code> in{" "}
          <code className="rounded bg-muted px-1 py-0.5">.env</code>, then restart the dev server.
        </p>
      </div>
    );
  }