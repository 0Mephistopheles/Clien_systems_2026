import type { Profile } from '../../types';
import { formatNumber } from '../../utils/format';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

type ProfileSummaryProps = {
  profile: Profile;
};

export default function ProfileSummary({ profile }: ProfileSummaryProps) {
  return (
    <Card className="profile-summary">
      <div className="profile-summary__head">
        <img src={profile.avatarUrl} alt={profile.username} />
        <div>
          <h3>{profile.username}</h3>
          <p>{profile.bio}</p>
          <div className="profile-summary__badges">
            <Badge tone={profile.role === 'admin' ? 'accent' : 'neutral'}>{profile.role}</Badge>
            <Badge tone={profile.isBanned ? 'danger' : 'success'}>{profile.isBanned ? 'Banned' : 'Active'}</Badge>
          </div>
        </div>
      </div>
      <dl className="profile-summary__stats">
        <div>
          <dt>Level</dt>
          <dd>{profile.level}</dd>
        </div>
        <div>
          <dt>Wins</dt>
          <dd>{formatNumber(profile.wins)}</dd>
        </div>
        <div>
          <dt>Losses</dt>
          <dd>{formatNumber(profile.losses)}</dd>
        </div>
        <div>
          <dt>ELO</dt>
          <dd>{formatNumber(profile.elo)}</dd>
        </div>
      </dl>
    </Card>
  );
}
