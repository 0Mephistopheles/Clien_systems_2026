import { useEffect, useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import PageMeta from '../components/common/PageMeta';
import ProfileSummary from '../components/games/ProfileSummary';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../context/AuthContext';
import { demoAchievements } from '../data/mockData';
import {
  listFriends,
  listMatches,
  listNotifications,
  markNotificationRead,
} from '../services/gameService';
import type { Friend, Match, NotificationItem } from '../types';
import { formatDate } from '../utils/format';
import Badge from '../components/ui/Badge';

export default function ProfilePage() {
  const { profile, updateProfile } = useAuth();
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [username, setUsername] = useState(profile?.username ?? '');
  const [matches, setMatches] = useState<Match[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!profile) return;

    setBio(profile.bio);
    setUsername(profile.username);

    void (async () => {
      const [matchList, friendList, notificationList] = await Promise.all([
        listMatches(profile.id),
        listFriends(profile.id),
        listNotifications(profile.id),
      ]);
      setMatches(matchList);
      setFriends(friendList);
      setNotifications(notificationList);
    })();
  }, [profile]);

  if (!profile) {
    return <EmptyState title="Profile unavailable" description="Please sign in to access your profile." />;
  }

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await updateProfile({ bio, username });
      toast.success('Profile saved.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save profile.');
    }
  };

  return (
    <>
      <PageMeta title="Profile" description="Edit your player profile, review match history, and achievements." />
      <SectionHeader eyebrow="Player profile" title="Your arena identity" />
      <div className="profile-layout">
        <ProfileSummary profile={profile} />
        <Card>
          <form className="stack" onSubmit={saveProfile}>
            <Input label="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
            <Textarea label="Bio" value={bio} onChange={(event) => setBio(event.target.value)} rows={5} />
            <Button type="submit">Save profile</Button>
          </form>
        </Card>
      </div>

      <section className="page-section">
        <SectionHeader eyebrow="History" title="Recent matches" />
        <div className="stack">
          {matches.map((match) => (
            <Card key={match.id} className="history-row">
              <strong>{match.status}</strong>
              <span>{formatDate(match.startedAt)}</span>
              <span>Score {match.score}</span>
            </Card>
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeader eyebrow="Progress" title="Achievements" />
        <div className="grid grid--3">
          {profile.achievements.length ? (
            profile.achievements.map((code) => {
              const achievement = demoAchievements.find((item) => item.code === code);
              return (
                <Card key={code}>
                  <div className="stack">
                    <strong>{achievement?.title ?? code}</strong>
                    <p>{achievement?.description ?? 'Unlocked achievement'}</p>
                    <Badge tone="accent">{achievement?.points ?? 0} pts</Badge>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card>
              <p>No achievements unlocked yet. Keep playing to build your collection.</p>
            </Card>
          )}
        </div>
      </section>

      <section className="page-section">
        <SectionHeader eyebrow="Social" title="Friends and notifications" />
        <div className="grid grid--2">
          <Card>
            <h3>Friends</h3>
            <ul className="stack">
              {friends.map((friend) => (
                <li key={friend.id}>{friend.status}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3>Notifications</h3>
            <ul className="stack">
              {notifications.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                    <small>{formatDate(item.createdAt)}</small>
                  </div>
                  {!item.readAt ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={async () => {
                        await markNotificationRead(item.id);
                        setNotifications((current) =>
                          current.map((notification) =>
                            notification.id === item.id ? { ...notification, readAt: new Date().toISOString() } : notification,
                          ),
                        );
                      }}
                    >
                      Mark read
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>
    </>
  );
}
