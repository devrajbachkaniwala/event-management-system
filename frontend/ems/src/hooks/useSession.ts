import { SessionContext } from '@/contexts/sessionContext';
import { useContext } from 'react';

const useSession = () => {
  const sessionValue = useContext(SessionContext);

  return sessionValue;
};

export { useSession };
