import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/letter")({
  component: LetterPage,
});

function LetterPage() {
  return (
    <div className="min-h-screen bg-[#33ccff] p-8 font-sans" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
      <div className="max-w-2xl mx-auto bg-white border-4 border-black rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
          <h1 className="text-4xl font-black text-[#ff3366] uppercase tracking-wider" style={{ textShadow: "2px 2px 0px #000" }}>A Love Letter 💌</h1>
          <Link to="/" className="flex items-center gap-2 px-6 py-3 bg-[#ffed4a] border-4 border-black rounded-2xl font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ffe500] transition-all transform hover:scale-105 active:scale-95">
            🏠 Back to Menu
          </Link>
        </div>
        
        <div className="bg-[#fff9e6] p-6 border-4 border-black rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] relative">
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#ff3366] rounded-full border-4 border-black grid place-items-center font-black text-white transform rotate-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            ❤️
          </div>
          <p className="text-xl leading-relaxed font-bold text-gray-800">
            My dearest,<br/><br/>
            Every day with you is like a wonderful cartoon adventure filled with laughter, bright colors, and endless joy. You make the world a funnier, happier place just by being in it. <br/><br/>
            I cherish every moment we share, every silly joke we make, and every quiet moment we spend together. You're my favorite person to be goofy with.<br/><br/>
            Forever yours,<br/>
            <span className="text-2xl text-[#ff3366] font-black mt-2 inline-block transform -rotate-2">Your Love</span>
          </p>
        </div>
      </div>
    </div>
  );
}
