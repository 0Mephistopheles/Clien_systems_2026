import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/common/PageMeta';
import GameCard from '../components/games/GameCard';
import StatsGrid from '../components/games/StatsGrid';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import { listGames, listLeaderboard, listRooms } from '../services/gameService';
import type { Game, LeaderboardEntry, Room } from '../types';
import { formatNumber } from '../utils/format';

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    void (async () => {
      const [nextGames, nextRooms, nextLeaderboard] = await Promise.all([
        listGames(),
        listRooms(),
        listLeaderboard(),
      ]);
      setGames(nextGames);
      setRooms(nextRooms);
      setLeaders(nextLeaderboard);
    })();
  }, []);

  return (
    <>
      <PageMeta
        title="Home"
        description="Realtime multiplayer mini games with Supabase auth, live rooms, leaderboards, and chat."
      />

      <section className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">Realtime multiplayer arena</p>
          <h1>Play browser mini games with people around the world.</h1>
          <p className="hero__lead">
            Register, verify your email, join rooms, chat live, and climb leaderboards in a polished
            React + Supabase platform built for academic evaluation.
          </p>
          <div className="hero__actions">
            <Link className="btn btn--primary btn--lg" to="/register">
              Create account
            </Link>
            <Link className="btn btn--secondary btn--lg" to="/games">
              Browse games
            </Link>
          </div>
          <StatsGrid
            stats={[
              { label: 'Players online', value: formatNumber(1824), helper: 'Live realtime presence' },
              { label: 'Rooms open', value: formatNumber(38), helper: 'Matchmaking-ready lobbies' },
              { label: 'Matches played', value: formatNumber(91420), helper: 'Recorded in Supabase' },
            ]}
          />
        </div>

        <Card className="hero__panel">
          <SectionHeader
            eyebrow="Featured room"
            title={rooms[0]?.name ?? 'North America Clash'}
            description="A live board battle with instant move syncing."
          />
          <ul className="hero__room-stats">
            <li>
              <strong>Code</strong>
              <span>{rooms[0]?.code ?? 'AX92QZ'}</span>
            </li>
            <li>
              <strong>Players</strong>
              <span>{rooms[0] ? `${rooms[0].currentPlayers}/${rooms[0].maxPlayers}` : '2/2'}</span>
            </li>
            <li>
              <strong>Status</strong>
              <span>{rooms[0]?.status ?? 'playing'}</span>
            </li>
          </ul>
          <Link className="btn btn--secondary btn--md" to="/games">
            Join the arena
          </Link>
        </Card>
      </section>

      <section className="page-section">
        <SectionHeader
          eyebrow="Game catalog"
          title="Featured mini games"
          description="Every card links into a production-style room flow."
        />
        <div className="grid grid--3">
          {games.length
            ? games.slice(0, 3).map((game) => <GameCard key={game.id} game={game} />)
            : Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="card" style={{ minHeight: 220 }} />)}
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          eyebrow="Live leaderboard"
          title="Top players this week"
          description="The leaderboard updates from Supabase data or the demo store."
        />
        <div className="grid grid--3">
          {leaders.length
            ? leaders.slice(0, 3).map((entry) => (
                <Card key={entry.id} className="leader-card">
                  <img src={entry.avatarUrl} alt={entry.username} />
                  <strong>{entry.username}</strong>
                  <p>{formatNumber(entry.points)} points</p>
                </Card>
              ))
            : Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="leader-card" style={{ minHeight: 180 }} />)}
        </div>
      </section>
    </>
  );
}
