import { ChatRoom } from "../../../components/chatRoom";

// This is now a client component wrapper
export default function ChatRoomPage({
  params
}: {
  params: {
    slug: string
  }
}) {
  return <ChatRoom slug={params.slug} />;
}

// ============= components/chatRoom.tsx (FIXED) =============
