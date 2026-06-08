import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/reasons")({
  component: ReasonsPage,
});

function ReasonsPage() {
  const reasons = [
    "Your absolutely adorable smile 😊",
    "The way you laugh at my terrible jokes 🤭",
    "How you make every normal day feel like an adventure 🚀",
    "Your warm hugs that make everything better 🤗",
    "The way you look at me 🥺",
    "Because you are my best friend ❤️"
  ];

  return (
    <div className="min-h-screen bg-[#ffcc00] p-8 font-sans overflow-hidden relative" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
      {/* Background polka dots */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 3px, transparent 4px)", backgroundSize: "30px 30px" }}></div>
      
      <div className="max-w-2xl mx-auto relative z-10 bg-white border-4 border-black rounded-[2rem] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mt-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 border-b-4 border-black pb-4">
          <h1 className="text-4xl sm:text-5xl font-black text-[#ff3366] uppercase tracking-wider" style={{ textShadow: "3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000" }}>
            Reasons I Love You 🥰
          </h1>
          <div className="flex flex-wrap gap-2">
            <Link to="/" className="flex items-center gap-1.5 px-4 py-2 bg-[#99ff99] border-4 border-black rounded-2xl font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#7ceb7c] transition-all active:scale-95">
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
          {reasons.map((reason, index) => {
            const colors = ["#ff99cc", "#33ccff", "#99ff99", "#ffed4a", "#cc99ff", "#ff9933"];
            const rotate = index % 2 === 0 ? "rotate-1" : "-rotate-1";
            return (
              <div 
                key={index} 
                className={`p-4 border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform ${rotate} hover:scale-105 hover:rotate-0 transition-transform`}
                style={{ backgroundColor: colors[index % colors.length] }}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white border-4 border-black rounded-full w-12 h-12 flex items-center justify-center font-black text-2xl shadow-[inset_2px_2px_0px_rgba(0,0,0,0.2)]">
                    {index + 1}
                  </div>
                  <p className="text-xl font-bold text-black flex-1 leading-snug">
                    {reason}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
