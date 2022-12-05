import type { Service as PrismaService } from "@prisma/client";

export type Service = PrismaService & { params: Record<string, string>, updatedAt: Date };
export type NewService = Pick<PrismaService, 'name' | 'projectId' | 'daemonId' | 'params' | 'cpu' | 'mem' | 'disk'>;
export type ServiceOpCode = 'start' | 'stop' | 'restart' | 'kill';
