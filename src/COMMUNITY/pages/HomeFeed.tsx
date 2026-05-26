export default function HomeFeed() {
  return (
    <div className="flex flex-col w-screen h-screen bg-slate-50 text-slate-800">
      {/* Navbar */}
      <div className="text-[14px] border-b border-slate-200 py-3 px-4 bg-white font-medium">
        Navbar
      </div>

      {/* Main Layout Container */}
      <div className="flex flex-1 flex-row w-full overflow-hidden text-[14px]">
        
        {/* 1. SIDEBAR: Hidden on mobile, visible on tablet (md) and up */}
        <div className="hidden md:block w-[250px] border-r border-slate-200 bg-white p-4">
          sidebar
        </div>
        
        {/* 2. POSTS: ALWAYS visible, scales fluidly across all devices */}
        <div className="flex-1 min-w-0 flex-1 min-w-0 overflow-x-hidden overflow-y-scroll custom-scrollbar bg-slate-50 p-4 bg-slate-50 p-4">
          <div className="max-w-[600px] mx-auto border border-slate-200 bg-white p-4 rounded-xl min-h-[500px]">
            posts (Never hidden)
          </div>
        </div>
        
        {/* 3. SUGGESTIONS: Hidden on mobile/tablet, visible only on desktop (lg) */}
        {/* Adjusted max-w to [550px] so you can scale it wider now! */}
        <div className="flex-col gap-4 hidden lg:block w-[35%] min-w-[300px] max-w-[550px] border-l border-slate-200 bg-white p-4">
          <div className="flex-1 max-w-[600px] min-h-[300px]  mx-auto border border-slate-200 bg-white p-4 rounded-xl">
            suggestions (Never hidden)
          </div>

          <div className="flex-1 max-w-[600px]  min-h-[300px] mx-auto border border-slate-200 bg-white p-4 rounded-xl">
            suggestions (Never hidden)
          </div>

        </div>

      </div>
    </div>
  );
}