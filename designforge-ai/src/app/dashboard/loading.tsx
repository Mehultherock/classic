export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <div className="w-64 h-screen bg-white/[0.02] border-r border-white/5 hidden lg:block" />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-white/5 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
            <div className="h-64 rounded-xl bg-white/5 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 rounded-xl bg-white/5 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
