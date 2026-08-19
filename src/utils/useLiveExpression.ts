import { useState, useEffect, useContext } from "react";
import { UserDetailsContext } from "../auth/UserDetailsContext";
import { EventSource } from "extended-eventsource";

export const useLiveExpression = (
  expressionId: string,
  dependencies: any[],
) => {
  const [value, setValue] = useState(null);
  const token = useContext(UserDetailsContext)?.userDetails?.jwt;
  alert(`Token in useLiveExpression: ${token}`);
  useEffect(() => {
    let cancelled = false;

    const getInitialValue = async () => {
      try {
        const response = await fetch("/api/evaluate-expressions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify([expressionId]),
        });
        if (!response.ok) {
          throw new Error(`Failed to evaluate expressions: ${response.status}`);
        }

        const expressions = await response.json();
        const expression = expressions.find(
          (item: { id: string }) => item.id === expressionId,
        );

        if (!cancelled && expression) {
          setValue(expression.value);
        }
      } catch (error) {
        console.error("Failed to get initial expression value:", error);
      }
    };

    getInitialValue();

    console.log(
      `[useLiveExpression] Expression ID: ${expressionId}, Dependencies:`,
      dependencies,
    );

    //const eventSource = new EventSource("/api/expressions/sse");
    const eventSource = new EventSource("/api/reactive-updates", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === expressionId) {
        setValue(data.value);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    return () => {
      cancelled = true;
      eventSource.close();
    };
  }, [expressionId, ...dependencies]);

  return value;
};
