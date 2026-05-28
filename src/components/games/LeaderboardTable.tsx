import type { LeaderboardEntry } from '../../types';
import { formatNumber } from '../../utils/format';
import Card from '../ui/Card';

type LeaderboardTableProps = {
  entries: LeaderboardEntry[];
};

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <Card className="leaderboard-table">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Points</th>
            <th>Wins</th>
            <th>Matches</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>#{entry.rank}</td>
              <td>
                <div className="leaderboard-table__player">
                  <img src={entry.avatarUrl} alt={entry.username} />
                  <span>{entry.username}</span>
                </div>
              </td>
              <td>{formatNumber(entry.points)}</td>
              <td>{entry.wins}</td>
              <td>{entry.matches}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
