"use client";

import { useState, useEffect } from "react";
import ReactiveValue from "./ReactiveValue";
import { generateExpressionId } from "./expression-scanner-utils";

// Define the expressions in the component where they are used
const CPU_LOAD_EXPRESSION = "T(java.lang.management.ManagementFactory).getOperatingSystemMXBean().getSystemLoadAverage()";
const MEM_USAGE_EXPRESSION = "T(java.lang.management.ManagementFactory).getMemoryMXBean().getHeapMemoryUsage().getUsed() / T(java.lang.management.ManagementFactory).getMemoryMXBean().getHeapMemoryUsage().getMax()";


async function getInitialData(id: string) {
  // The '/api/evaluate' endpoint is now served by the Spring Boot backend
  const res = await fetch(`http://localhost:9046/api/evaluate?id=${id}`);
  if (!res.ok) return "N/A";
  const data = await res.json();
  return data.value;
}

export default function DashboardPage() {
  const [initialCpuLoad, setInitialCpuLoad] = useState("Loading...");
  const [initialMemUsage, setInitialMemUsage] = useState("Loading...");

  const [cpuLoadId, setCpuLoadId] = useState<string | null>(null);
  const [memUsageId, setMemUsageId] = useState<string | null>(null);

  // 1. Generate the stable IDs for the expressions on component mount
  useEffect(() => {
    generateExpressionId(CPU_LOAD_EXPRESSION).then(setCpuLoadId);
    generateExpressionId(MEM_USAGE_EXPRESSION).then(setMemUsageId);
  }, []);

  // 2. Fetch initial data once the IDs are available
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
  }, [cpuLoadId, memUsageId]);

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