export default function EditorLoading() {
  return (
    <div className="h-screen bg-background flex flex-col">
      <div className="h-14 bg-white/[0.02] border-b border-white/5 flex items-center px-4 gap-4">
        <div className="h-6 w-32 bg-white/5 rounded animate-pulse" />
        <div className="flex-1" />
        <div className="h-8 w-20 bg-white/5 rounded-lg animate-pulse" />
        <div className="h-8 w-24 bg-white/5 rounded-lg animate-pulse" />
      </div>
      <div className="flex-1 flex">
        <div className="w-14 bg-white/[0.02] border-r border-white/5" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-2 border-white/10 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Loading editor...</p>
          </div>
        </div>
        <div className="w-72 bg-white/[0.02] border-l border-white/5" />
      </div>
    </div>
  );
}
