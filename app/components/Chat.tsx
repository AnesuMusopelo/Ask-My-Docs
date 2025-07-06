'use client';
import { useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState<{role: string; content: string;}[]>([]);
  const [input, setInput] = useState('');
  const sendMessage = async () => {
    const userMsg = { role: 'user', content: input };
    setMessages(m => [...m, userMsg]);
    setInput('');
    const resp = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });
    const reader = resp.body!.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let ai = '';
    while (!done) {
      const { value, done: d } = await reader.read();
      done = d;
      ai += decoder.decode(value);
      setMessages(m => {
        const last = m[m.length - 1];
        if (last.role === 'ai') {
          m[m.length - 1] = { role: 'ai', content: ai };
          return [...m];
        }
        return [...m, { role: 'ai', content: ai }];
      });
    }
  };

  return (
    <div>
      <div className="border p-2 h-64 overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
            <strong>{m.role}: </strong>{m.content}
          </div>
        ))}
      </div>
      <div className="flex space-x-2 mt-2">
        <input className="border flex-1 px-2" value={input} onChange={e => setInput(e.target.value)} />
        <button onClick={sendMessage} className="border px-4">Send</button>
      </div>
    </div>
  );
}
