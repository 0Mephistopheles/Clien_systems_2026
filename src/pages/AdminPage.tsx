import { useEffect, useState } from 'react';
import PageMeta from '../components/common/PageMeta';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { banUser, listProfiles, updateUserRole } from '../services/gameService';
import type { Profile, Role } from '../types';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [users, setUsers] = useState<Profile[]>([]);

  useEffect(() => {
    void (async () => {
      setUsers(await listProfiles());
    })();
  }, []);

  const applyPatch = async (userId: string, patch: Partial<Profile>) => {
    const nextUsers = await Promise.all(
      users.map(async (user) => {
        if (user.id !== userId) return user;
        return { ...user, ...(patch as Profile) };
      }),
    );
    setUsers(nextUsers);
  };

  const changeRole = async (userId: string, role: Role) => {
    await updateUserRole(userId, role);
    await applyPatch(userId, { role });
    toast.success('Role updated.');
  };

  const toggleBan = async (userId: string, isBanned: boolean) => {
    await banUser(userId, isBanned);
    await applyPatch(userId, { isBanned });
    toast.success(isBanned ? 'User banned.' : 'User unbanned.');
  };

  return (
    <>
      <PageMeta title="Admin" description="Moderate users, rooms, and platform behavior." />
      <SectionHeader eyebrow="Administration" title="User management" />
      <div className="stack">
        {users.map((user) => (
          <Card key={user.id} className="admin-row">
            <div>
              <strong>{user.username}</strong>
              <p>{user.email}</p>
            </div>
            <Badge tone={user.isBanned ? 'danger' : 'success'}>{user.role}</Badge>
            <div className="admin-row__actions">
              <Button variant="secondary" size="sm" onClick={() => void changeRole(user.id, 'user')}>
                User
              </Button>
              <Button variant="secondary" size="sm" onClick={() => void changeRole(user.id, 'admin')}>
                Admin
              </Button>
              <Button variant="danger" size="sm" onClick={() => void toggleBan(user.id, !user.isBanned)}>
                {user.isBanned ? 'Unban' : 'Ban'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
