import { PrismaService } from './prisma.service';

export const prismaServiceToken = Symbol('prismaServiceToken');
export interface IPrismaService extends PrismaService {}
