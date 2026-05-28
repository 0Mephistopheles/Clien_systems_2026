import PageMeta from '../components/common/PageMeta';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';

export default function AboutPage() {
  return (
    <>
      <PageMeta title="About" description="About the multiplayer mini games platform project." />
      <SectionHeader
        eyebrow="Course project"
        title="Designed for labs 1 to 6"
        description="Static layouts, AJAX, SPA routing, realtime gameplay, testing, and websocket syncing."
      />
      <div className="grid grid--2">
        <Card>
          <h3>Academic goals</h3>
          <p>
            The project demonstrates a complete frontend architecture built with React, Vite, SCSS,
            Supabase Auth, Postgres, and Realtime.
          </p>
        </Card>
        <Card>
          <h3>Product goals</h3>
          <p>
            The UI behaves like a real gaming platform with profiles, chat, leaderboards, room
            management, and moderation.
          </p>
        </Card>
      </div>
    </>
  );
}
