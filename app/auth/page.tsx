'use client';

import { useEffect, useState, useRef } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { gsap } from 'gsap';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const formRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push('/');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  useEffect(() => {
    if (formRef.current) {
      gsap.to(formRef.current, { opacity: 1, y: 20, duration: 1 });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div ref={formRef} className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <Input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 block w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password:</label>
            <Input
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 block w-full"
              required
            />
          </div>
          <Button type="submit" className="w-full mt-4 bg-black hover:scale-105 transition-transform">
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </form>
        <Button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 w-full text-white bg-black hover:scale-105 transition-transform"
        >
          {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
        </Button>
      </div>
    </div>
  );
}
