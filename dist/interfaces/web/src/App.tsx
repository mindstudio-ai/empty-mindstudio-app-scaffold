import { useRef, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR, { mutate } from 'swr';
import api from './api';

interface Greeting {
  id: string;
  name: string;
  greeting: string;
}

// ---------------------------------------------------------------------------
// Data fetching with SWR
// ---------------------------------------------------------------------------

/** Local greeting cache key. SWR manages the state; the fetcher seeds it. */
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

      // Optimistic update: prepend new greeting to the cached list
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
// Animations
// ---------------------------------------------------------------------------

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

const Page = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #000000;
`;

const Content = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 120px 24px 48px;

  @media (max-width: 480px) {
    padding: 72px 20px 32px;
  }
`;

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: #f5f5f7;
  line-height: 1.1;

  @media (max-width: 480px) {
    font-size: 32px;
  }
`;

const Subtitle = styled.p`
  font-size: 17px;
  color: #86868b;
  margin-top: 12px;
  font-weight: 400;
`;

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

const InputArea = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 56px;
`;

const NameInput = styled.input`
  flex: 1;
  padding: 16px 20px;
  font-size: 17px;
  color: #f5f5f7;
  background: #1c1c1e;
  border-radius: 14px;
  border: 1px solid transparent;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3a3a3c;
  }

  &::placeholder {
    color: #48484a;
  }

  &:disabled {
    opacity: 0.4;
  }
`;

const SubmitButton = styled.button<{ $loading?: boolean }>`
  padding: 16px 28px;
  font-size: 15px;
  font-weight: 600;
  color: ${(p) => (p.$loading ? 'rgba(0, 0, 0, 0.6)' : '#000000')};
  background: ${(p) => (p.$loading ? '#86868b' : '#f5f5f7')};
  border-radius: 14px;
  white-space: nowrap;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: #ffffff;
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    cursor: default;
    opacity: ${(p) => (p.$loading ? 0.8 : 0.2)};
  }
`;

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

const ListSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #1c1c1e;
  border-radius: 16px;
  overflow: hidden;
`;

const Card = styled(motion.div)`
  padding: 20px 24px;
  background: #1c1c1e;
`;

const CardGreeting = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #f5f5f7;
`;

const CardName = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: #48484a;
  margin-top: 8px;
`;

const Divider = styled.div`
  height: 1px;
  background: #2c2c2e;
  margin: 0 24px;
`;

const StreamingDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #86868b;
  border-radius: 50%;
  margin-left: 4px;
  vertical-align: middle;
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 0;
  color: #48484a;
  font-size: 15px;
`;

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const cardVariants = {
  initial: { opacity: 0, height: 0 },
  animate: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2 },
  },
};

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
    <Page>
      <Content>
        <Header>
          <Title>Hello World</Title>
          <Subtitle>AI-powered greetings</Subtitle>
        </Header>

        <InputArea>
          <NameInput
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your name"
            disabled={isLoading}
            autoFocus
          />
          <SubmitButton
            onClick={handleSubmit}
            disabled={!name.trim() || isLoading}
            $loading={isLoading}
          >
            {isLoading ? 'Thinking...' : 'Say Hello'}
          </SubmitButton>
        </InputArea>

        {allItems.length > 0 ? (
          <ListSection>
            <AnimatePresence mode="popLayout">
              {allItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                >
                  {i > 0 && <Divider />}
                  <Card>
                    <CardGreeting>
                      {item.greeting}
                      {item.isStreaming && <StreamingDot />}
                    </CardGreeting>
                    <CardName>{item.name}</CardName>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </ListSection>
        ) : (
          <EmptyState>No greetings yet</EmptyState>
        )}
      </Content>
    </Page>
  );
}
