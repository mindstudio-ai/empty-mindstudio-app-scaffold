import { useRef, useState, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import api from './api';
import styles from './App.module.css';

interface Greeting {
  id: string;
  name: string;
  greeting: string;
}

// ---------------------------------------------------------------------------
// Data fetching with SWR
// ---------------------------------------------------------------------------

const GREETINGS_KEY = 'greetings';

function useGreetings() {
  return useSWR<Greeting[]>(GREETINGS_KEY, null, {
    fallbackData: [],
    revalidateOnFocus: false,
  });
}

function useCreateGreeting() {
  const [streamText, setStreamText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const trigger = useCallback(async (name: string) => {
    setIsLoading(true);
    setStreamText('');
    try {
      const result = (await api.helloWorld(
        { name },
        {
          stream: true,
          onToken: (text: string) => setStreamText(text),
        },
      )) as Greeting;

      await mutate<Greeting[]>(
        GREETINGS_KEY,
        (prev) => [result, ...(prev ?? [])],
        { revalidate: false },
      );

      setStreamText('');
      return result;
    } finally {
      setIsLoading(false);
      setStreamText('');
    }
  }, []);

  return { trigger, streamText, isLoading };
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export default function App() {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: greetings = [] } = useGreetings();
  const { trigger, streamText, isLoading } = useCreateGreeting();

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed || isLoading) return;

    await trigger(trimmed);
    setName('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const allItems = [
    ...(isLoading && streamText
      ? [
          {
            id: '_stream',
            name: name.trim(),
            greeting: streamText,
            isStreaming: true,
          },
        ]
      : []),
    ...greetings.map((g) => ({ ...g, isStreaming: false })),
  ];

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Hello World</h1>
          <p className={styles.subtitle}>AI-powered greetings</p>
        </div>

        <div className={styles.inputArea}>
          <input
            ref={inputRef}
            className={styles.nameInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your name"
            disabled={isLoading}
            autoFocus
          />
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!name.trim() || isLoading}
            data-loading={isLoading || undefined}
          >
            {isLoading ? 'Thinking...' : 'Say Hello'}
          </button>
        </div>

        {allItems.length > 0 ? (
          <div className={styles.listSection}>
            {allItems.map((item, i) => (
              <div key={item.id}>
                {i > 0 && <div className={styles.divider} />}
                <div className={styles.card}>
                  <p className={styles.cardGreeting}>
                    {item.greeting}
                    {item.isStreaming && (
                      <span className={styles.streamingDot} />
                    )}
                  </p>
                  <p className={styles.cardName}>{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>No greetings yet</div>
        )}
      </div>
    </div>
  );
}
