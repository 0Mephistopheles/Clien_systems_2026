import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { isStrongPassword, isValidEmail, isValidUsername } from '../../utils/validation';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';

type AuthFormProps = {
  mode: 'login' | 'register';
};

export default function AuthForm({ mode }: AuthFormProps) {
  const { login, register, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const isLogin = mode === 'login';

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email.');
      }

      if (!isLogin && !isValidUsername(username)) {
        throw new Error('Username must be 3-20 characters and may include underscores.');
      }

      if (!isStrongPassword(password)) {
        throw new Error('Password must be at least 8 characters with upper, lower, and number.');
      }

      if (isLogin) {
        await login(email, password);
        navigate('/profile');
      } else {
        const result = await register({ email, password, username });
        navigate(result.requiresVerification ? '/login' : '/profile');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const requestReset = async () => {
    if (!email) {
      toast.error('Enter an email first.');
      return;
    }
    await resetPassword(email);
  };

  return (
    <Card className="auth-card">
      <form onSubmit={submit} className="auth-card__form">
        <div>
          <p className="auth-card__eyebrow">{isLogin ? 'Welcome back' : 'Start your account'}</p>
          <h1>{isLogin ? 'Sign in to play' : 'Create your player profile'}</h1>
          <p>
            {isLogin
              ? 'Use your Supabase verified account or the local demo session.'
              : 'Register to create your account and start playing.'}
          </p>
        </div>
        {!isLogin ? (
          <Input label="Username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="arena_runner" />
        ) : null}
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
        </Button>
        {isLogin ? (
          <Button type="button" variant="ghost" onClick={() => void requestReset()}>
            Reset password
          </Button>
        ) : null}
        <p className="auth-card__switch">
          {isLogin ? (
            <>
              New here? <Link to="/register">Create an account</Link>
            </>
          ) : (
            <>
              Already registered? <Link to="/login">Sign in</Link>
            </>
          )}
        </p>
      </form>
    </Card>
  );
}
