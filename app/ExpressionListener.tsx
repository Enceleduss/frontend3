'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * This component connects to a Java Server-Sent Events (SSE) stream.
 * When Java detects a change in the expression state, it sends a 'refresh' event.
 */
export default function ExpressionListener() {
  const router = useRouter();

  useEffect(() => {
    // Point to the Spring Boot backend SSE endpoint
    const eventSource = new EventSource('http://localhost:9046/api/events');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // Expecting { id: "...", value: "..." }
        
        // Dispatch a targeted event specifically for this ID
        window.dispatchEvent(new CustomEvent(`java-update:${data.id}`, { detail: data })); 
      } catch (e) {
        console.error("Failed to parse Java update", e);
      }
    }; 
    eventSource.onerror = (error) => {
      console.error("SSE Connection lost. EventSource will automatically attempt to reconnect...");
      // Note: EventSource has built-in retry logic, so we just log it here.
    };

    return () => {
      eventSource.close();
    };
  }, [router]);

  return null; // This is a logic-only component, it renders nothing
}