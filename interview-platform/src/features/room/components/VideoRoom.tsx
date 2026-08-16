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