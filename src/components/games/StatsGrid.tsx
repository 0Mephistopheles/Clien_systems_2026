import Card from '../ui/Card';

type Stat = {
  label: string;
  value: string;
  helper: string;
};

type StatsGridProps = {
  stats: Stat[];
};

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section className="stats-grid">
      {stats.map((stat) => (
        <Card key={stat.label} className="stats-card">
          <p>{stat.label}</p>
          <strong>{stat.value}</strong>
          <span>{stat.helper}</span>
        </Card>
      ))}
    </section>
  );
}
