import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageMeta from '../components/common/PageMeta';
import GameCard from '../components/games/GameCard';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import { createRoom, listGames, listRooms } from '../services/gameService';
import type { Game, Room } from '../types';
import toast from 'react-hot-toast';

export default function GamesPage() {
  const navigate = useNavigate();
  const { gameSlug } = useParams();
  const { profile, isAuthenticated } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    void (async () => {
      const [nextGames, nextRooms] = await Promise.all([listGames(), listRooms()]);
      setGames(nextGames);
      setRooms(nextRooms);
    })();
  }, []);

  const roomsByGame = useMemo(
    () =>
      rooms.reduce<Record<string, Room[]>>((acc, room) => {
        acc[room.gameId] = [...(acc[room.gameId] ?? []), room];
        return acc;
      }, {}),
    [rooms],
  );

  const spotlightGame = useMemo(
    () => games.find((game) => game.slug === gameSlug) ?? games[0] ?? null,
    [games, gameSlug],
  );

  const handleCreateRoom = async (game: Game) => {
    try {
      if (!isAuthenticated || !profile) {
        toast.error('Sign in first to create a room.');
        navigate('/login');
        return;
      }

      const room = await createRoom({
        gameId: game.id,
        name: `${game.title} Room`,
        maxPlayers: game.playersMax,
        hostId: profile.id,
        isPrivate: false,
      });

      navigate(`/games/${game.slug}/rooms/${room.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create room.');
    }
  };

  return (
    <>
      <PageMeta title="Games" description="Browse mini games, active rooms, and create multiplayer lobbies." />
      <SectionHeader
        eyebrow="Catalog"
        title={spotlightGame ? spotlightGame.title : 'Choose a mini game'}
        description="Create or join a room, then jump into realtime play."
      />
      {spotlightGame ? (
        <Card className="spotlight-card">
          <strong>{spotlightGame.title}</strong>
          <p>{spotlightGame.description}</p>
        </Card>
      ) : null}
      <div className="grid grid--3">
        {games.length
          ? games.map((game) => <GameCard key={game.id} game={game} onCreateRoom={handleCreateRoom} />)
          : Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="game-card" style={{ minHeight: 260 }} />)}
      </div>

      <section className="page-section">
        <SectionHeader eyebrow="Open rooms" title="Active lobbies" />
        <div className="grid grid--2">
          {rooms.length
            ? rooms.map((room) => {
                const game = games.find((entry) => entry.id === room.gameId);
                const roomPath = game ? `/games/${game.slug}/rooms/${room.id}` : `/games/rooms/${room.id}`;

                return (
                  <article key={room.id} className="room-preview">
                    <div>
                      <strong>{room.name}</strong>
                      <p>{room.code}</p>
                    </div>
                    <div>
                      <span>
                        {room.currentPlayers}/{room.maxPlayers}
                      </span>
                      <span>{room.status}</span>
                    </div>
                    <div className="room-preview__actions">
                      <Link className="btn btn--secondary btn--sm" to={roomPath}>
                        Join room
                      </Link>
                    </div>
                  </article>
                );
              })
            : Array.from({ length: 2 }).map((_, index) => <Skeleton key={index} className="room-preview" style={{ minHeight: 120 }} />)}
        </div>
        <p className="muted">
          {Object.entries(roomsByGame).map(([gameId, entries]) => `${gameId}: ${entries.length}`).join(' | ')}
        </p>
      </section>
    </>
  );
}
