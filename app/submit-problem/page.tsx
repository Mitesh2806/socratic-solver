'use client';

import { useEffect, useState, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Input} from '@/components/ui/input';
import { gsap } from 'gsap';

export default function SubmitProblemPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [testCases, setTestCases] = useState('');
  const [error, setError] = useState('');
  
  const formRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async () => {
    try {
      // Attempt to parse the test cases input as JSON
      const parsedTestCases = JSON.parse(testCases);

      // Validate that parsedTestCases is an array of objects with "input" and "expectedOutput"
      if (!Array.isArray(parsedTestCases) || !parsedTestCases.every(tc => tc.input && tc.expectedOutput)) {
        throw new Error('Invalid test cases format.');
      }

      // Add the problem to Firestore
      await addDoc(collection(db, 'problems'), {
        title,
        description,
        testCases: parsedTestCases, 
      });

      // Reset form fields
      setTitle('');
      setDescription('');
      setTestCases('');
      setError('');
    } catch (err: Error | any) {
      setError(`Failed to submit problem: ${err.message}`);
    }
  };

  useEffect(() => {
    if (formRef.current) {
      // GSAP animation for form elements
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
            onChange={(e : Event | any) => setTitle(e.target.value)}
            placeholder="Enter the problem title"
            className="mt-1 block w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Problem Description:</label>
          <Textarea
            value={description}
            onChange={(e : Event|any) => setDescription(e.target.value)}
            placeholder="Enter the problem description"
            className="mt-1 block w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Test Cases (as JSON array):</label>
          <Textarea
            value={testCases}
            onChange={(e :Event | any) => setTestCases(e.target.value)}
            placeholder={`[
  {"input": "input1", "expectedOutput": "output1"},
  {"input": "input2", "expectedOutput": "output2"}
]`}
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
