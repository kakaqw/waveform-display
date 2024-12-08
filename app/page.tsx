import Audio from "./components/Audio";

export default function Home() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">音频波形显示</h1>
      <Audio />
    </main>
  );
}
