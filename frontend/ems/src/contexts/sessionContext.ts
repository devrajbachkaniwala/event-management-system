'use client';

import { UserDto } from '@/dto/user.dto';
import { createContext } from 'react';

export const SessionContext = createContext<UserDto | undefined>(undefined);
