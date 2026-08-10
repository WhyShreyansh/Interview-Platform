import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { auth } from "@/lib/auth";
import { getInterviewByRoomId } from "@/features/interviews/queries/interviews.queries";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const roomId = req.nextUrl.searchParams.get("roomId");
  if (!roomId) return NextResponse.json({ error: "roomId is required" }, { status: 400 });

  const interview = await getInterviewByRoomId(roomId);
  const isParticipant =
    interview &&
    (interview.interviewer.id === session.user.id || interview.candidate.id === session.user.id);

  if (!isParticipant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ error: "LiveKit is not configured on the server" }, { status: 500 });
  }

  const token = new AccessToken(apiKey, apiSecret, {
    identity: session.user.id,
    name: session.user.name ?? "Participant",
  });
  token.addGrant({ room: roomId, roomJoin: true, canPublish: true, canSubscribe: true });

  return NextResponse.json({ token: await token.toJwt() });
}