'use client';
import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    setStatus('Uploading...');
    await fetch('/api/upload', {
      method: 'POST',
      body: form
    });
    setStatus('Uploaded');
  };

  return (
    <form onSubmit={onSubmit} className="space-x-2">
      <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button type="submit" disabled={!file} className="border px-4 py-1">Upload</button>
      {status && <span>{status}</span>}
    </form>
  );
}
