// components/CodeEditor.tsx
'use client';

import { useState } from 'react';
import { Editor, Monaco } from '@monaco-editor/react';

interface CodeEditorProps {
  initialValue?: string;
  language?: string;
  onChange: (value: string) => void; // Note that this only accepts a string now
}

const CodeEditor = ({ initialValue = '', language = 'javascript', onChange }: CodeEditorProps) => {
  const [code, setCode] = useState(initialValue);

  const handleEditorChange = (value: string | undefined) => {
    const safeValue = value || ''; // Ensure the value is always a string
    setCode(safeValue);
    onChange(safeValue); // Pass a string back to the parent
  };

  return (
    <div style={{ height: '500px', border: '1px solid #ddd' }}>
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
    </div>
  );
};

export default CodeEditor;
