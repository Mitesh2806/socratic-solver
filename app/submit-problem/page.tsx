'use client';

import { useEffect, useState, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { gsap } from 'gsap';

// Define the structure for test case objects
interface TestCase {
  input: string;
  expectedOutput: string;
}

export default function SubmitProblemPage() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [testCases, setTestCases] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const formRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async () => {
    try {
      
      const parsedTestCases: TestCase[] = JSON.parse(testCases);

      
      if (!Array.isArray(parsedTestCases) || !parsedTestCases.every((tc) => typeof tc.input === 'string' && typeof tc.expectedOutput === 'string')) {
        throw new Error('Invalid test cases format. Must be an array of objects with "input" and "expectedOutput" as strings.');
      }

      
      await addDoc(collection(db, 'problems'), {
        title,
        description,
        testCases: parsedTestCases,
      });

      
      setTitle('');
      setDescription('');
      setTestCases('');
      setError('');
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to submit problem: ${err.message}`);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  useEffect(() => {
    if (formRef.current) {
      gsap.to(formRef.current, { opacity: 1, y: 20, duration: 1 });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div ref={formRef} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Submit a New Problem</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Problem Title:</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter the problem title"
            className="mt-1 block w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Problem Description:</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Enter the problem description"
            className="mt-1 block w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Test Cases (as JSON array):</label>
          <Textarea
            value={testCases}
            onChange={(e) => setTestCases(e.target.value)} 
            placeholder={`[{"input": "input1", "expectedOutput": "output1"}, {"input": "input2", "expectedOutput": "output2"}]`}
            className="mt-1 block w-full"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <Button onClick={handleSubmit} className="w-full mt-4 bg-black text-white hover:scale-105 transition-transform">
          Submit Problem
        </Button>
      </div>
    </div>
  );
}
