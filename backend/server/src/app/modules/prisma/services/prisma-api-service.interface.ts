import { PrismaApiService } from './prisma-api.service';

export const prismaApiServiceToken = Symbol('prismaApiServiceToken');

export interface IPrismaApiService extends PrismaApiService {}
