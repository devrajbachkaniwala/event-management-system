'use client';

import { store } from '@/redux/store';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';

type TStoreProviderProps = {
  children: ReactNode;
};

function StoreProvider({ children }: TStoreProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}

export { StoreProvider };
