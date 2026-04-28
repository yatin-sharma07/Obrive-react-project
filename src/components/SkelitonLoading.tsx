'use client'

export default function SkeletonLoading() {
  return (
    <div className="flex h-screen animate-pulse">

      {/* Sidebar Skeleton */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-4">
        <div className="h-10 bg-gray-200 rounded-lg w-32" />
        
        <div className="space-y-3 mt-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-lg" />
          ))}
        </div>

        <div className="mt-auto h-32 bg-gray-200 rounded-xl" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 gap-4">

        {/* Header */}
        <div className="h-16 bg-gray-200 rounded-xl w-full" />

        <div className="flex flex-1 gap-4">

          {/* Middle Section */}
          <div className="flex-1 space-y-4">

            {/* Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl" />
              ))}
            </div>

            {/* Large Content Block */}
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>

          {/* Right Panel */}
          <div className="w-80 space-y-4">
            <div className="h-32 bg-gray-200 rounded-xl" />
            <div className="h-48 bg-gray-200 rounded-xl" />
            <div className="h-48 bg-gray-200 rounded-xl" />
          </div>

        </div>
      </div>
    </div>
  )
}