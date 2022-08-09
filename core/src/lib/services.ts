import { ServiceType } from "@prisma/client";
import { prismaInstance } from "../../prisma/instance";
import ServiceFeatureManager from "../classes/ServiceFeatureManager";
import ServiceManager from "../classes/ServiceManager";
import ServiceTypeManager from "../classes/ServiceTypeManager";


export interface CreateServiceData {
  name: string;
  type: string;
  project: string;
}

export interface CreateFeatureData {
  name: string;
  description: string;

  requiresValue: boolean;
  defaultValue?: string;
  valueType?: string;
}

export const services = {
  types: {
    async fetch(id: string, includeServices = false) {
      let fetchedData = await prismaInstance.serviceType.findFirst({
        where: { id },
        include: {features: true, services: includeServices}
      });

      if (!fetchedData) return null;

      return new ServiceTypeManager(fetchedData);
    },

    async fetchAll(features = false, services = false) {
      let data = await prismaInstance.serviceType.findMany({
        include: {features, services}
      });
      return data.map(st => new ServiceTypeManager(st));
    },

    async create(name: string) {
      const newServiceType = await prismaInstance.serviceType.create({
        data: {
          name
        },
        include: {features: true}
      });

      return new ServiceTypeManager(newServiceType);
    },

    async exists(id: string) {
      return !!(await prismaInstance.serviceType.findUnique({ where: { id } }))
    }
  },

  features: {
    async create(data: CreateFeatureData) {
      const newFeature = await prismaInstance.serviceFeature.create({
        data: {...data}
      });

      return new ServiceFeatureManager(newFeature);
    },

    async fetch(id: string, includeServiceTypes = false) {
      let data = await prismaInstance.serviceFeature.findFirst({
        where: { id },
        include: { serviceTypes: includeServiceTypes }
      });

      if (!data) return null;

      return new ServiceFeatureManager(data);
    },

    async fetchAll(includeServiceTypes = false) {
      let data = await prismaInstance.serviceFeature.findMany({
        include: { serviceTypes: includeServiceTypes }
      });

      return data.map(sf => new ServiceFeatureManager(sf));
    },
  },

  async fetch(id: string) {
    let data = await prismaInstance.service.findFirst({
      where: { id },
      include: {project: true, owner: true, type: {
        include: {
          features: true,
          services: true
        }
      }}
    });

    if (!data) return null;

    return new ServiceManager(data);
  },

  async fetchAll() {
    let data = await prismaInstance.service.findMany({
      include: { project: true, owner: true, type: {
        include: {
          features: true,
          services: true
        }
      } }
    });
    
    return data.map(s => new ServiceManager(s));
  },

  async fetchAllByUser(id: string) {
    let data = await prismaInstance.service.findMany({
      where: { ownerId: id },
      include: { project: true, owner: true, type: {
        include: {
          features: true,
          services: true
        }
      } }
    });
    
    return data.map(s => new ServiceManager(s));
  },

  async checkUserPermission(userId: string, serviceId: string) {
    let service = await prismaInstance.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) return false; //redundant

    return service.ownerId === userId;
  },

  async create(
    data: CreateServiceData,
    ownerId: string,
  ): Promise<ServiceManager<any>> {
    const service = await prismaInstance.service.create({
      include: {
        owner: true,
        project: true,
        type: {
          include: {
            features: true,
          }
        }
      },
      data: {
        name: data.name,
        serviceTypeId: data.type,
        ownerId: ownerId,
        projectId: data.project,
      },
    });

    return new ServiceManager(service);
  },

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
