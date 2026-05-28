import { Link } from 'react-router-dom';
import PageMeta from '../components/common/PageMeta';
import EmptyState from '../components/ui/EmptyState';

export default function NotFoundPage() {
  return (
    <>
      <PageMeta title="404" description="Page not found." />
      <EmptyState
        title="404 - arena not found"
        description="The page you are looking for does not exist."
        actionLabel="Back to home"
        onAction={() => {
          window.location.assign('/');
        }}
      />
      <div className="not-found__link">
        <Link to="/">Return home</Link>
      </div>
    </>
  );
}
