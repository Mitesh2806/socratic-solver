'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import CodeEditor from '@/components/CodeEditor';
import ChatWindow from '@/components/ChatWindow';
import { Button } from '@/components/ui/button';

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface Problem {
  id: string;
  title: string;
  description: string;
  testCases: TestCase[];
}

export default function ProblemEvaluationPage({ params }: { params: { id: string } }) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [isHintEnabled, setIsHintEnabled] = useState<boolean>(false);
  const [hints, setHints] = useState<string | null>(null);
  
  const [editorWidth, setEditorWidth] = useState<number>(50); // percentage of the window
  const resizerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      const problemRef = doc(db, 'problems', params.id);
      const problemSnap = await getDoc(problemRef);
      if (problemSnap.exists()) {
        setProblem({ id: problemSnap.id, ...problemSnap.data() } as Problem);
      } else {
        console.error('No such document!');
      }
    };
    fetchProblem();
  }, [params.id]);

  const runTests = () => {
    if (!problem) return;

    const testResults = problem.testCases.map(tc => {
      try {
        const parsedInput = JSON.parse(tc.input);
        let functionName = null;
        let modifiedCode = code;

        const functionNameMatch = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
        if (functionNameMatch) {
          functionName = functionNameMatch[1];
        } else {
          functionName = '__userFunction__';
          modifiedCode = 'const ' + functionName + ' = ' + code;
        }

        const userFunction = new Function('parsedInput', modifiedCode + '; return ' + functionName + '(parsedInput);');
        const userOutput = userFunction(parsedInput);

        const normalizedUserOutput = JSON.stringify(userOutput);
        const normalizedExpectedOutput = JSON.stringify(JSON.parse(tc.expectedOutput));

        return normalizedUserOutput === normalizedExpectedOutput ? 'Passed' : 'Failed';
      } catch (err) {
        console.error(err);
        return 'Error';
      }
    });

    setResult(testResults.join(', '));
  };

  const handleToggleHints = () => {
    setIsHintEnabled(prev => !prev);
  };

  const fetchAIHint = async () => {
    if (isHintEnabled && problem) {
      try {
        const response = await fetch('/api/ai-hint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, problem }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setHints(data.hint);
      } catch (error) {
        console.error('Error fetching AI hint:', error);
        setHints('Failed to fetch hint');
      }
    }
  };

  // Resizer logic
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = editorWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX) / window.innerWidth * 100;
      setEditorWidth(Math.min(Math.max(newWidth, 20), 80)); 
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="p-4 flex flex-col md:flex-row">
      {problem ? (
        <>
          <div className="flex flex-col md:w-1/2">
            <h2 className="text-3xl font-bold mb-6">{problem.title}</h2>
            <p className="mb-4">{problem.description}</p>
            <Button onClick={runTests} className="mt-2 bg-black w-36 text-white">Run Tests</Button>
            {result && <p className="mt-2">Test Results: {result}</p>}
            <div className="hintToggle mt-4 mx-4">
              <label>
                <input type="checkbox" checked={isHintEnabled} onChange={handleToggleHints} className='mr-5' />
                Enable Hints
              </label>
            </div>
            <ChatWindow code={code} problem={problem} fetchAIHint={fetchAIHint} hints={hints} />
          </div>

          <div
            className="flex flex-col"
            style={{ width: `${editorWidth}%` }}
          >
            <div className="flex-1">
              <CodeEditor
                initialValue={code}
                language="javascript"
                onChange={setCode}
              />
            </div>
            <div
              ref={resizerRef}
              onMouseDown={handleMouseDown}
              className="resizer bg-gray-400 cursor-col-resize"
              style={{ width: '5px' }}
            />
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
