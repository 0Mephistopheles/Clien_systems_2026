import PageMeta from '../components/common/PageMeta';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';

export default function ContactPage() {
  return (
    <>
      <PageMeta title="Contact" description="Contact and support page for the platform." />
      <SectionHeader eyebrow="Support" title="Contact the team" description="Questions, feedback, or moderation reports." />
      <div className="grid grid--2">
        <Card>
          <form className="stack">
            <Input label="Name" placeholder="Your name" />
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Textarea label="Message" placeholder="Tell us what you need" rows={6} />
            <Button type="submit">Send message</Button>
          </form>
        </Card>
        <Card>
          <h3>Contact details</h3>
          <p>Email: support@multiplayer-mini-games.example</p>
          <p>Moderation: admin@multiplayer-mini-games.example</p>
          <p>Global access: public deployment on Vercel or GitHub Pages.</p>
        </Card>
      </div>
    </>
  );
}
