'use client';

import { useState } from 'react';
import { Editor} from '@monaco-editor/react';

interface CodeEditorProps {
  initialValue?: string;
  language?: string;
  onChange: (value: string) => void; // Accepts a string
}

const CodeEditor = ({ initialValue = '', language = 'javascript', onChange }: CodeEditorProps) => {
  const [code, setCode] = useState<string>(initialValue);

  const handleEditorChange = (value: string | undefined) => {
    const safeValue = value || ''; // Ensure the value is always a string
    setCode(safeValue);
    onChange(safeValue); // Pass a string back to the parent
  };

  return (
    <div style={{ height: '500px', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true, // Ensure the editor resizes correctly
        }}
      />
    </div>
  );
};

export default CodeEditor;
