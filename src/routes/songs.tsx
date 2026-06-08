import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/songs")({
  component: SongsPage,
});

function SongsPage() {
  return (
    <div className="min-h-screen bg-[#ffed4a] p-8 font-sans" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
      <div className="max-w-2xl mx-auto bg-white border-4 border-black rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
          <h1 className="text-4xl font-black text-[#ff3366] uppercase tracking-wider" style={{ textShadow: "2px 2px 0px #000" }}>Our Soundtrack 🎵</h1>
          <Link to="/" className="px-4 py-2 bg-[#33ccff] border-2 border-black rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
            Back
          </Link>
        </div>
        
        <div className="space-y-6">
          <div className="bg-[#ff99cc] p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-1 transition-transform">
            <h2 className="text-xl font-black mb-1">1. Perfect - Ed Sheeran</h2>
            <p className="text-black/80 font-bold">Always reminds me of our first dance!</p>
          </div>
          <div className="bg-[#99ff99] p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:-rotate-1 transition-transform">
            <h2 className="text-xl font-black mb-1">2. Just The Way You Are - Bruno Mars</h2>
            <p className="text-black/80 font-bold">Because you're amazing, just the way you are.</p>
          </div>
          <div className="bg-[#cc99ff] p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 hover:rotate-2 transition-transform">
            <h2 className="text-xl font-black mb-1">3. A Thousand Years - Christina Perri</h2>
            <p className="text-black/80 font-bold">I have loved you for a thousand years.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
