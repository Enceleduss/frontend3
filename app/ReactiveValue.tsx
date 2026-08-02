'use client';

import { useState, useEffect } from 'react';

interface Props {
  id: string;
  initialValue: string;
}

// Define the shape of the update coming from Java
interface JavaUpdatePayload {
  id: string;
  value: string;
}

export default function ReactiveValue({ id, initialValue }: Props) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<JavaUpdatePayload>;
      // No need for 'if' check anymore! Only the correct component hears this event.
      setValue(customEvent.detail.value);
    };

    window.addEventListener(`java-update:${id}`, handleUpdate);
    return () => window.removeEventListener(`java-update:${id}`, handleUpdate);
  }, [id]);

  return (
    <p className="text-2xl font-mono text-zinc-700 dark:text-zinc-300">
      {value}
    </p>
  );
}