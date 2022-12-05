import type { Project as PrismaProject } from '@prisma/client'

export type Project = Pick<PrismaProject, 'name' | 'created' | 'id' | 'index'> & { creator: string }
export type NewProject = Pick<PrismaProject, 'name'>;
