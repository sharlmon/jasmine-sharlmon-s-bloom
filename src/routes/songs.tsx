import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/songs")({
  component: SongsPage,
});

function SongsPage() {
  return (
    <div className="min-h-screen bg-[#ffed4a] p-8 font-sans" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
      <div className="max-w-2xl mx-auto bg-white border-4 border-black rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 border-b-4 border-black pb-4">
          <h1 className="text-4xl font-black text-[#ff3366] uppercase tracking-wider" style={{ textShadow: "2px 2px 0px #000" }}>Our Soundtrack 🎵</h1>
          <div className="flex flex-wrap gap-2">
            <Link to="/" className="flex items-center gap-1.5 px-4 py-2 bg-[#33ccff] border-4 border-black rounded-2xl font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#20bdf0] transition-all active:scale-95">
              🏠 Back to Menu
            </Link>
            <Link 
              to="/" 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('anniversary_unlocked');
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#ff3366] border-4 border-black rounded-2xl font-black text-sm text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#e62254] transition-all active:scale-95"
            >
              ❤️ Back to Jasmine & Sharlmon
            </Link>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-[#99ff99] p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:-rotate-1 transition-transform">
            <h2 className="text-xl font-black mb-1">1. Just The Way You Are - Bruno Mars</h2>
            <p className="text-black/80 font-bold">Because you're amazing, just the way you are.</p>
          </div>
          <div className="bg-[#cc99ff] p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 hover:rotate-2 transition-transform">
            <h2 className="text-xl font-black mb-1">2. A Thousand Years - Christina Perri</h2>
            <p className="text-black/80 font-bold">I have loved you for a thousand years.</p>
          </div>
          <div className="bg-[#ff9933] p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-2 hover:-rotate-2 transition-transform">
            <h2 className="text-xl font-black mb-1">3. 17 - Pink Sweat$</h2>
            <p className="text-black/80 font-bold">Such a sweet and lovely vibe.</p>
          </div>
          <div className="bg-[#33ccff] p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-1 transition-transform">
            <h2 className="text-xl font-black mb-1">4. PILLOWTALK - ZAYN</h2>
            <p className="text-black/80 font-bold">A classic vibe just for us.</p>
          </div>
          <div className="bg-[#ffed4a] p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:-rotate-1 transition-transform">
            <h2 className="text-xl font-black mb-1">5. love - Burna Boy</h2>
            <p className="text-black/80 font-bold">Nothing but pure love.</p>
          </div>
          <div className="bg-[#ff3366] p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 hover:rotate-2 transition-transform text-white">
            <h2 className="text-xl font-black mb-1">6. dopamine - Fireboy DML</h2>
            <p className="text-white/90 font-bold">You're my dopamine hit! 😍</p>
          </div>
          <div className="bg-[#ff99cc] p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:-rotate-1 transition-transform">
            <h2 className="text-xl font-black mb-1">7. ride - $wizzz</h2>
            <p className="text-black/80 font-bold">Ride with you forever.</p>
          </div>
          <div className="bg-[#99ff99] p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-1 transition-transform">
            <h2 className="text-xl font-black mb-1">8. Nobody Gets Me - SZA</h2>
            <p className="text-black/80 font-bold">You just get me.</p>
          </div>
          <div className="bg-[#cc99ff] p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-2 hover:-rotate-2 transition-transform">
            <h2 className="text-xl font-black mb-1">9. Rather Be - Giveon</h2>
            <p className="text-black/80 font-bold">Nowhere else I'd rather be.</p>
          </div>
          <div className="bg-[#ff9933] p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-1 transition-transform">
            <h2 className="text-xl font-black mb-1">10. Twenties - Giveon</h2>
            <p className="text-black/80 font-bold">Our best years together.</p>
          </div>
          <div className="bg-[#33ccff] p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:-rotate-1 transition-transform">
            <h2 className="text-xl font-black mb-1">11. For Tonight - Giveon</h2>
            <p className="text-black/80 font-bold">A beautiful melody for us.</p>
          </div>
          <div className="bg-[#ffed4a] p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 hover:rotate-2 transition-transform">
            <h2 className="text-xl font-black mb-1">12. Keeper - Giveon</h2>
            <p className="text-black/80 font-bold">You are definitely a keeper.</p>
          </div>
          <div className="bg-[#ff3366] p-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:-rotate-1 transition-transform text-white">
            <h2 className="text-xl font-black mb-1">13. Stuck On You - Giveon</h2>
            <p className="text-white/90 font-bold">I'm stuck on you! 💕</p>
          </div>
        </div>
      </div>
    </div>
  );
}
