import type { Room } from '../../types';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

type RoomLobbyProps = {
  room: Room | null;
};

export default function RoomLobby({ room }: RoomLobbyProps) {
  if (!room) {
    return (
      <Card>
        <p>Room details are loading...</p>
      </Card>
    );
  }

  return (
    <Card className="room-lobby">
      <div className="room-lobby__header">
        <div>
          <h3>{room.name}</h3>
          <p>Room code: <strong>{room.code}</strong></p>
        </div>
        <Badge tone={room.status === 'playing' ? 'success' : 'neutral'}>{room.status}</Badge>
      </div>
      <dl className="room-lobby__stats">
        <div>
          <dt>Players</dt>
          <dd>
            {room.currentPlayers}/{room.maxPlayers}
          </dd>
        </div>
        <div>
          <dt>Turn</dt>
          <dd>Player {room.currentTurn}</dd>
        </div>
        <div>
          <dt>Private</dt>
          <dd>{room.isPrivate ? 'Yes' : 'No'}</dd>
        </div>
      </dl>
    </Card>
  );
}
