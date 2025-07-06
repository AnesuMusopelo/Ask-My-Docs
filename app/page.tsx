import UploadForm from './components/UploadForm';
import Chat from './components/Chat';

export default function Home() {
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Ask My Docs</h1>
      <UploadForm />
      <Chat />
    </main>
  );
}
