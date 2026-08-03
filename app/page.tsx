import expr from '../macros/expr.macro';

const cpuLoadId = expr("T(java.lang.management.ManagementFactory).getOperatingSystemMXBean().getSystemLoadAverage()");
const memUsageId = expr("T(java.lang.management.ManagementFactory).getMemoryMXBean().getHeapMemoryUsage().getUsed()");

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight">System Monitor</h1>
        <p className="text-zinc-500">Expression IDs are generated at build time.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-500 uppercase mb-2">CPU Load ID</h2>
          <div className="text-2xl font-bold">{cpuLoadId}</div>
        </div>

        <div className="p-6 border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-500 uppercase mb-2">Memory Usage ID</h2>
          <div className="text-2xl font-bold">{memUsageId}</div>
        </div>
      </div>
    </div>
  );
}
