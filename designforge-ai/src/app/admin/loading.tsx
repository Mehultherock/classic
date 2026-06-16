export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <div className="w-64 h-screen bg-white/[0.02] border-r border-white/5 hidden lg:block" />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="h-8 w-36 bg-white/5 rounded-lg animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-white/5 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="h-72 rounded-xl bg-white/5 animate-pulse" />
              <div className="h-72 rounded-xl bg-white/5 animate-pulse" />
            </div>
            <div className="h-80 rounded-xl bg-white/5 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
