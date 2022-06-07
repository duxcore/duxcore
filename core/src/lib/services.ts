import Collection from "@discordjs/collection";
import { ServiceType, Service } from "@prisma/client";
import { prismaInstance } from "../../prisma/instance";
import ProjectManager from "../classes/ProjectManager";
import ServiceManager from "../classes/ServiceManager";
import UserManager from "../classes/UserManager";
import { projects } from "./projects";
import { users } from "./users";

export const services = {
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
};
