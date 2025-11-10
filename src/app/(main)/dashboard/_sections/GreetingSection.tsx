import { GreetingMessage } from '@/feature/dashboard';

interface GreetingSectionProps {
  userName: string;
}

const GreetingSection = ({ userName }: GreetingSectionProps) => {
  return <GreetingMessage userName={userName} />;
};

export default GreetingSection;
