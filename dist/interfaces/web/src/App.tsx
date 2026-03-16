import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import api from './api';

interface Greeting {
  id: string;
  name: string;
  greeting: string;
}

const Page = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 24px 48px;

  @media (max-width: 480px) {
    padding: 32px 16px 32px;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 480px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 32px;
  color: #1a1a1a;
`;

const InputRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 48px;
`;

const NameInput = styled.input`
  flex: 1;
  padding: 14px 16px;
  font-size: 16px;
  background: #ffffff;
  border: 1px solid rgba(26, 26, 26, 0.12);
  border-radius: 12px;
  transition: border-color 0.15s;

  &:focus {
    border-color: rgba(26, 26, 26, 0.3);
  }

  &::placeholder {
    color: rgba(26, 26, 26, 0.3);
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const SubmitButton = styled.button<{ $loading?: boolean }>`
  padding: 14px 24px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background: ${(p) => (p.$loading ? '#4a7a5a' : '#2d5a3d')};
  border-radius: 12px;
  white-space: nowrap;
  transition:
    background 0.15s,
    transform 0.1s;

  &:hover:not(:disabled) {
    background: #234a31;
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    cursor: default;
  }
`;

const ListSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled(motion.div)`
  padding: 20px;
  background: #ffffff;
  border: 1px solid rgba(26, 26, 26, 0.06);
  border-radius: 12px;
  transition: box-shadow 0.15s;

  &:hover {
    box-shadow: 0 2px 8px rgba(26, 26, 26, 0.06);
  }
`;

const CardGreeting = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

const CardName = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: rgba(26, 26, 26, 0.4);
`;

const EmptyState = styled.p`
  text-align: center;
  color: rgba(26, 26, 26, 0.3);
  font-size: 15px;
  padding: 48px 0;
`;

const cardVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function App() {
  const [name, setName] = useState('');
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed || loading) {
      return;
    }

    setLoading(true);
    setStreamText('');
    try {
      const result = await api.helloWorld({ name: trimmed }, {
        stream: true,
        onToken: (text: string) => setStreamText(text),
      });
      setStreamText('');
      setGreetings((prev) => [result as Greeting, ...prev]);
      setName('');
    } catch {
      setStreamText('');
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Page>
      <Container>
        <Title>Hello World</Title>

        <InputRow>
          <NameInput
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's your name?"
            disabled={loading}
          />
          <SubmitButton
            onClick={handleSubmit}
            disabled={!name.trim() || loading}
            $loading={loading}
          >
            {loading ? 'Thinking...' : 'Say Hello'}
          </SubmitButton>
        </InputRow>

        <ListSection>
          <AnimatePresence mode="popLayout">
            {loading && streamText && (
              <Card
                key="streaming"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 0.5, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                layout
              >
                <CardGreeting>{streamText}</CardGreeting>
                <CardName>{name.trim()}</CardName>
              </Card>
            )}
            {greetings.map((g) => (
              <Card
                key={g.id}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
              >
                <CardGreeting>{g.greeting}</CardGreeting>
                <CardName>{g.name}</CardName>
              </Card>
            ))}
          </AnimatePresence>

          {!loading && greetings.length === 0 && (
            <EmptyState>No greetings yet. Say hello to someone!</EmptyState>
          )}
        </ListSection>
      </Container>
    </Page>
  );
}
