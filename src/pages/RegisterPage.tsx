import PageMeta from '../components/common/PageMeta';
import AuthForm from '../components/games/AuthForm';

export default function RegisterPage() {
  return (
    <>
      <PageMeta
        title="Register"
        description="Create a new account and verify your email to join multiplayer rooms."
      />
      <AuthForm mode="register" />
    </>
  );
}
