"use client";

import { useExpression } from "./ExpressionListener";

interface ReactiveValueProps {
  id: string;
  initialValue: any;
}

export default function ReactiveValue({ id, initialValue }: ReactiveValueProps) {
  const liveValue = useExpression(id);
  const displayValue = liveValue ?? initialValue;

  // Format a number to 2 decimal places if it's a float, otherwise return the value as is
  const formatValue = (value: any) => {
    if (typeof value === 'number' && !Number.isInteger(value)) {
      return value.toFixed(2);
    }
    return value;
  };


  return <div className="text-2xl font-bold">{formatValue(displayValue)}</div>;
}
