'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { gsap } from 'gsap';

export default function HomePage() {
  const linksRef = useRef<HTMLUListElement>(null); 

  useEffect(() => {
    if (linksRef.current) {
      gsap.fromTo(
        linksRef.current.children,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to Socratic Solver</h1>

      <ul
        ref={linksRef}
        className="flex flex-col md:flex-row w-full max-w-2xl justify-center items-center gap-6 py-4"
      >
        <li className="w-full md:w-auto">
          <Link href="/auth" passHref>
            <Button className="w-full hover:scale-105 transition-transform">
              Login/Sign Up
            </Button>
          </Link>
        </li>
        
        <li className="w-full md:w-auto">
          <Link href="/submit-problem" passHref>
            <Button className="w-full hover:scale-105 transition-transform">
              Submit a New Problem
            </Button>
          </Link>
        </li>
        
        <li className="w-full md:w-auto">
          <Link href="/evaluate" passHref>
            <Button className="w-full hover:scale-105 transition-transform">
              Solve Problems
            </Button>
          </Link>
        </li>
      </ul>
    </div>
  );
}
