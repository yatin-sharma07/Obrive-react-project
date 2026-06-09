export default function RoomEndsPage() {
  return (
<div className="flex h-screen w-screen flex-col items-center justify-center bg bg-radial from-[#c3ead3] via-black to-black ">
{/* <div className="flex h-screen w-screen flex-col items-center justify-center bg bg-radial from-emerald-50 to-emerald-900 "> */}
    {/* The Centered Blur Card */}
    {/* <div className="flex flex-col items-center gap-4 p-8 max-w-sm w-full mx-4 rounded-2xl border border-white/40 bg-white/40 backdrop-blur-md shadow-xl shadow-emerald-200">
        
        <h1 className="text-2xl font-bold text-emerald-800 bg-clip-text ">
        The room has ended
        </h1>
        
        <p className="text-center text-sm font-medium text-slate-600 leading-relaxed">
        Thank you for being part of the conversation.
        </p>

    </div> */}


<div className="relative flex h-screen w-screen items-center justify-center bg-[#090a0f] overflow-hidden text-white">
  
  {/* The Core Subtle Radial Glow */}
  <div  className="absolute pointer-events-none inset-0 bg-[radial-gradient(circle_at_center,_rgba(7,65,57,1)_25%,_rgba(9,10,15,0)_90%)]"  />

  {/* Content Area (Sits safely on top) */}
  <div className="relative z-10 items-center gap-6 w-full max-w-[500px] px-4">
 
        <div className="w-full text-center justify-between bg-[#13141c] rounded-full py-3 px-2 shadow-2xl">
                <h1 className="text-2xl md:text-2xl font-medium tracking-tight text-gray-200">
                    The room has ended
                </h1>
                <p className="text-center text-[12px] font-medium text-slate-600 leading-relaxed">
                    Thank you for being part of the conversation.
                </p>
        </div>
  </div>

</div>

</div>
  );
}