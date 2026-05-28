import Card from '../ui/Card';

type PresenceListProps = {
  presence: Record<string, unknown[]>;
};

export default function PresenceList({ presence }: PresenceListProps) {
  const users = Object.keys(presence);

  return (
    <Card className="presence-list">
      <h3>Online Players</h3>
      {users.length ? (
        <ul>
          {users.map((userId) => (
            <li key={userId}>{userId}</li>
          ))}
        </ul>
      ) : (
        <p>No realtime presence yet. Invite a second player to light it up.</p>
      )}
    </Card>
  );
}
