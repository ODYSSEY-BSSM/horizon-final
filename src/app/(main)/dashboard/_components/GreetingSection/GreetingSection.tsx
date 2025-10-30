import { GreetingMessage } from '..';

interface GreetingSectionProps {
  userName: string;
}

export default function GreetingSection({ userName }: GreetingSectionProps) {
  return <GreetingMessage userName={userName} />;
}
