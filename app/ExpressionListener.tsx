"use client";

import { createContext, useContext, useEffect, useState } from "react";

// This context will hold the latest values from the SSE stream
const ExpressionContext = createContext<Record<string, any>>({});

// Custom hook to access the expression values
export const useExpression = (id: string) => {
  const values = useContext(ExpressionContext);
  return values[id];
};

export default function ExpressionListener() {
  const [values, setValues] = useState<Record<string, any>>({});

  useEffect(() => {
    // Assuming the SSE endpoint is served by the Spring Boot backend
    const eventSource = new EventSource("http://localhost:9046/api/expressions/sse");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && data.value) {
        setValues((prevValues) => ({
          ...prevValues,
          [data.id]: data.value,
        }));
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <ExpressionContext.Provider value={values}>
      {/* This component does not render anything itself */}
    </ExpressionContext.Provider>
  );
}
