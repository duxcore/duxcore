import Collection from "@discordjs/collection";
import { prismaInstance } from "../../prisma/instance";
import ProjectManager from "../classes/projectManager";

export const projects = {
  async create(name: string, creatorId: string): Promise<ProjectManager> {
    const newProject = await prismaInstance.project.create({
      data: {
        name,
        creatorId,
      },
    });

    return new ProjectManager(newProject);
  },

  async fetch(id: string): Promise<ProjectManager | null> {
    const rawData = await prismaInstance.project.findFirst({
      where: { id },
    });

    if (!rawData) return null;
    return new ProjectManager(rawData);
  },

  async fetchAllByUser(
    userId: string
  ): Promise<Collection<string, ProjectManager>> {
    let project = new Collection<string, ProjectManager>();
    const allServices = await prismaInstance.project.findMany({
      where: {
        creatorId: userId,
      },
    });

    allServices.map((rawData) =>
      project.set(rawData.id, new ProjectManager(rawData))
    );

    return project;
  },

  async delete(id: string): Promise<void> {
    await prismaInstance.project.delete({
      where: {
        id,
      },
    });

    return;
  },

  async checkUserPermission(
    userId: string,
    projectId: string
  ): Promise<boolean> {
    const userProjects = await this.fetchAllByUser(userId);

    if (userProjects.has(projectId)) return true;
    return false;
  },

  async count(): Promise<number> {
    let count = await prismaInstance.project.count();
    return count;
  },
};
