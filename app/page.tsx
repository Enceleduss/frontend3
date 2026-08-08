"use client";

import { useState, useEffect } from "react";
import expr from '../macros/expr.macro';
import ReactiveValue from "./ReactiveValue";

const cpuLoadId = expr("T(java.lang.management.ManagementFactory).getOperatingSystemMXBean().getSystemLoadAverage()");
const memUsageId = expr("T(java.lang.management.ManagementFactory).getMemoryMXBean().getHeapMemoryUsage().getUsed()");

async function getInitialData(id: string) {
  // The '/api/evaluate' endpoint is now served by our Next.js API route
  const res = await fetch(`/api/evaluate?id=${id}`);
  if (!res.ok) return "N/A";
  const data = await res.json();
  return data.value;
}

export default function DashboardPage() {
  const [initialCpuLoad, setInitialCpuLoad] = useState("Loading...");
  const [initialMemUsage, setInitialMemUsage] = useState("Loading...");

  // Fetch initial data once the IDs are available
  useEffect(() => {
    const fetchInitialData = async () => {
      if (cpuLoadId) {
        const cpu = await getInitialData(cpuLoadId);
        setInitialCpuLoad(cpu);
      }
      if (memUsageId) {
        const mem = await getInitialData(memUsageId);
        setInitialMemUsage(mem);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight">System Monitor</h1>
        <p className="text-zinc-500">Initial data via Client Fetch, updates via SSE.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-500 uppercase mb-2">CPU Load</h2>
          {cpuLoadId ? (
            <ReactiveValue id={cpuLoadId} initialValue={initialCpuLoad} />
          ) : (
            <div className="text-2xl font-bold">Initializing...</div>
          )}
        </div>

        <div className="p-6 border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-500 uppercase mb-2">Memory Usage</h2>
          {memUsageId ? (
            <ReactiveValue id={memUsageId} initialValue={initialMemUsage} />
          ) : (
            <div className="text-2xl font-bold">Initializing...</div>
          )}
        </div>
      </div>
    </div>
  );
}
