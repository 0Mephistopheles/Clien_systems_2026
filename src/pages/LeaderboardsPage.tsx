import { useEffect, useMemo, useState } from 'react';
import PageMeta from '../components/common/PageMeta';
import LeaderboardTable from '../components/games/LeaderboardTable';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import { listGames, listLeaderboard } from '../services/gameService';
import type { Game, LeaderboardEntry } from '../types';
import { formatNumber } from '../utils/format';

export default function LeaderboardsPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>('all');

  useEffect(() => {
    void (async () => {
      const [nextGames, nextEntries] = await Promise.all([listGames(), listLeaderboard()]);
      setGames(nextGames);
      setEntries(nextEntries);
    })();
  }, []);

  const filteredEntries = useMemo(
    () => (selectedGame === 'all' ? entries : entries.filter((entry) => entry.gameId === selectedGame)),
    [entries, selectedGame],
  );

  return (
    <>
      <PageMeta title="Leaderboards" description="See the top ranked players and live scoring statistics." />
      <SectionHeader eyebrow="Rankings" title="Leaderboards" description="Filter by game and track your climb." />
      <div className="leaderboards__filters">
        <button className={selectedGame === 'all' ? 'chip chip--active' : 'chip'} onClick={() => setSelectedGame('all')}>
          All games
        </button>
        {games.map((game) => (
          <button
            key={game.id}
            className={selectedGame === game.id ? 'chip chip--active' : 'chip'}
            onClick={() => setSelectedGame(game.id)}
          >
            {game.title}
          </button>
        ))}
      </div>
      <div className="grid grid--3">
        <Card>
          <p>Total players</p>
          <strong>{formatNumber(entries.length)}</strong>
        </Card>
        <Card>
          <p>Top score</p>
          <strong>{formatNumber(entries[0]?.points ?? 0)}</strong>
        </Card>
        <Card>
          <p>Games tracked</p>
          <strong>{formatNumber(games.length)}</strong>
        </Card>
      </div>
      {filteredEntries.length ? (
        <LeaderboardTable entries={filteredEntries} />
      ) : (
        <Skeleton className="leaderboard-table" style={{ minHeight: 240 }} />
      )}
    </>
  );
}
