import Collection from "@discordjs/collection";
import { ServiceType, Service } from "@prisma/client";
import { prismaInstance } from "../../prisma/instance";
import ProjectManager from "../classes/ProjectManager";
import ServiceManager from "../classes/ServiceManager";
import ServiceTypeManager from "../classes/ServiceTypeManager";
import UserManager from "../classes/UserManager";
import { projects } from "./projects";
import { users } from "./users";

export interface CreateServiceData {
  name: string;
  type: ServiceType;
}

export const services = {
  types: {
    async fetch(id: number, includeServices = false) {
      let fetchedData = await prismaInstance.serviceType.findFirst({
        where: { id },
        include: {featureServiceType: true, services: includeServices}
      });

      if (!fetchedData) return null;

      return new ServiceTypeManager(fetchedData);
    },

    async fetchAll(featureServiceType = false, services = false) {
      let data = await prismaInstance.serviceType.findMany({
        include: {featureServiceType, services}
      });
      return data.map(st => new ServiceTypeManager(st));
    },

    async create(name: string) {
      const newServiceType = await prismaInstance.serviceType.create({
        data: {
          name
        }
      });

      return new ServiceTypeManager(newServiceType);
    }
  }

  /*
  async fetch<ST extends ServiceType>(id: string, includedServiceType: ST) {
    let fetchedData = await prismaInstance.service.findFirst({
      where: { id },
      include: {
        owner: true,
        project: true,
      },
    });

    if (!fetchedData) return null;

    const owner = await users.fetch(fetchedData.ownerId);
    const project = await projects.fetch(fetchedData.projectId);

    if (!owner) throw new Error("Owner Cannot be null.");
    if (!project) throw new Error("Project cannot be null.");

    return new ServiceManager<ST>(fetchedData, includedServiceType, {
      owner,
      project,
    });
  },

  async fetchAllByUser(id: string) {
    let foundServices = new Collection<string, ServiceManager<any>>();
    let fetchedData = await prismaInstance.service.findMany({
      where: {
        ownerId: id,
      },
      include: {
        owner: true,
        project: true,
      },
    });

    await Promise.all(
      fetchedData.map(async (v) => {
        return foundServices.set(
          v.id,
          new ServiceManager(v, v.type, {
            owner: (await users.fetch(v.ownerId)) as UserManager,
            project: (await projects.fetch(v.projectId)) as ProjectManager,
          })
        );
      })
    );

    return foundServices;
  },

  async checkUserPermission(user: string, serviceId: string) {
    const userProjects = await this.fetchAllByUser(user);

    return userProjects.has(serviceId);
  },

  async create(
    data: CreateServiceData,
    ownerId: string,
    projectId: string
  ): Promise<ServiceManager<any>> {
    const service = await prismaInstance.service.create({
      include: {
        owner: true,
        project: true,
      },
      data: {
        name: data.name,
        type: data.type,
        ownerId: ownerId,
        projectId: projectId,
      },
    });

    return new ServiceManager(service, data.type, {
      owner: new UserManager(service.owner),
      project: new ProjectManager(service.project),
    });
  },
  */
};
