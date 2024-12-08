import React from 'react';
import { Card, CardBody, Input, Button } from '@nextui-org/react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const { signUp, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      navigate('/signin', { 
        state: { 
          successMessage: 'Account created successfully! Please sign in.' 
        } 
      });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-background/50 backdrop-blur-md">
        <CardBody className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-400">Sign up to get started</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-danger/20 border border-danger rounded-lg text-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              startContent={<Mail className="text-gray-400" size={20} />}
              classNames={{
                input: "bg-background text-white",
                inputWrapper: "bg-background border-gray-800"
              }}
            />

            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              startContent={<Lock className="text-gray-400" size={20} />}
              classNames={{
                input: "bg-background text-white",
                inputWrapper: "bg-background border-gray-800"
              }}
            />

            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={loading}
              endContent={<ArrowRight size={20} />}
            >
              Sign Up
            </Button>

            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default SignUp;