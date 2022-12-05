import Collection from "@discordjs/collection";
import { prismaInstance } from "../../prisma/instance";
import ServiceManager from "../classes/ServiceManager";
import { daemons } from "./daemons";
import { projects } from "./projects";

export const services = {
  async create(options: {
    name: string,
    projectId: string,
    daemonId: string,
    params: Record<string, any>,
    cpu: number,
    mem: number,
    disk: number
  }): Promise<ServiceManager | undefined> {
    let { name, projectId, daemonId, params, cpu, mem, disk } = options;

    let daemon = await daemons.fetch(daemonId);

    if (!daemon) return

    let service = await prismaInstance.service.create({
      data: {
        name,
        project: {  
          connect: {
            id: projectId,
          },
        },
        daemon: {
          connect: {
            id: daemonId,
          },
        },
        params,
        cpu,
        mem,
        disk,
        status: 'SETTING_UP',
      }
    });

    return new ServiceManager(service);
  },

  async fetch(id: string): Promise<ServiceManager | null> {
    const rawData = await prismaInstance.service.findFirst({
      where: { id },
    });

    if (!rawData) return null;
    return new ServiceManager(rawData);
  },

  async fetchAllByProject(
    projectId: string
  ): Promise<Collection<string, ServiceManager>> {
    let services = new Collection<string, ServiceManager>();
    const allServices = await prismaInstance.service.findMany({
      where: {
        projectId,
      },
    });

    allServices.map((rawData) =>
      services.set(rawData.id, new ServiceManager(rawData))
    );

    return services;
  },

  async checkUserPermission(
    userId: string,
    serviceId: string
  ): Promise<boolean> {
    const userProjects = await projects.fetchAllByUser(userId);
    const service = await this.fetch(serviceId);

    if (!service) return false;

    if (userProjects.has(service.project)) return true;
    return false;
  },

  async count(): Promise<number> {
    let count = await prismaInstance.service.count();
    return count;
  },
};
