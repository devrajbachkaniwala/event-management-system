'use client';

import { ReactNode, useEffect, useState } from 'react';

import { SessionContext } from '@/contexts/sessionContext';
import { UserDto } from '@/dto/user.dto';
import { getUserSession } from '@/utils/getUserSession';

type TSessionProviderProps = {
  children: ReactNode;
};

const SessionProvider = ({ children }: TSessionProviderProps) => {
  const [userSession, setUserSession] = useState<UserDto>();

  useEffect(() => {
    getUserSession().then((user) => setUserSession(user));
  }, []);

  return (
    <SessionContext.Provider value={userSession}>
      {children}
    </SessionContext.Provider>
  );
};

export { SessionProvider };
