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