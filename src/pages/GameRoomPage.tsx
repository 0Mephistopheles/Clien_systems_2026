import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import PageMeta from '../components/common/PageMeta';
import TicTacToeBoard from '../components/games/TicTacToeBoard';
import ChatPanel from '../components/games/ChatPanel';
import RoomLobby from '../components/games/RoomLobby';
import PresenceList from '../components/games/PresenceList';
import SectionHeader from '../components/ui/SectionHeader';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useRealtimeRoom } from '../hooks/useRealtimeRoom';

export default function GameRoomPage() {
  const { roomId, gameSlug } = useParams();
  const { profile } = useAuth();
  const { room, messages, board, presence, loading, sendChatMessage, makeMove } = useRealtimeRoom(
    roomId,
    profile?.id,
  );

  const currentPlayer = useMemo(() => room?.currentTurn ?? 'X', [room?.currentTurn]);

  if (!roomId) {
    return <EmptyState title="Room not found" description="The room identifier is missing." />;
  }

  if (loading) {
    return <EmptyState title="Loading room" description="Fetching realtime room data..." />;
  }

  return (
    <>
      <PageMeta title={`Room ${roomId}`} description="Realtime room with synchronized gameplay and chat." />
      <SectionHeader
        eyebrow={gameSlug ?? 'Room'}
        title={room?.name ?? 'Game room'}
        description="At least one multiplayer game is wired for live sync through Supabase Realtime."
      />
      <div className="room-layout">
        <div className="room-layout__main">
          <RoomLobby room={room} />
          <TicTacToeBoard
            board={board}
            currentPlayer={currentPlayer as 'X' | 'O'}
            winner={room?.winner ?? null}
            onMove={makeMove}
          />
          <ChatPanel messages={messages} onSend={sendChatMessage} />
        </div>
        <aside className="room-layout__side">
          <PresenceList presence={presence} />
        </aside>
      </div>
    </>
  );
}
