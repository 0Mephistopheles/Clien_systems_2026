import PageMeta from '../components/common/PageMeta';
import AuthForm from '../components/games/AuthForm';

export default function LoginPage() {
  return (
    <>
      <PageMeta title="Login" description="Sign in to access multiplayer rooms and your profile." />
      <AuthForm mode="login" />
    </>
  );
}
