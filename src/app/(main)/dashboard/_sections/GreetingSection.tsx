import GreetingMessage from '../_components/GreetingMessage';

interface GreetingSectionProps {
  userName: string;
}

const GreetingSection = ({ userName }: GreetingSectionProps) => {
  return <GreetingMessage userName={userName} />;
};

export default GreetingSection;
