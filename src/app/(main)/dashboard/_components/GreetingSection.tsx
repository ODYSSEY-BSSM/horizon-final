import GreetingMessage from './GreetingMessage/GreetingMessage';

interface GreetingSectionProps {
  userName: string;
}

export default function GreetingSection({ userName }: GreetingSectionProps) {
  return <GreetingMessage userName={userName} />;
}
