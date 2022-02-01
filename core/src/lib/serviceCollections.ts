import Collection from "@discordjs/collection";
import { prismaInstance } from "../../prisma/instance"
import ServiceCollectionManager from "../classes/ServiceCollectionManager";

export const serviceCollection = {
  async create(name: string, creatorId: string): Promise<ServiceCollectionManager> {
    const newCollection = await prismaInstance.serviceCollection.create({
      data: {
        name,
        creatorId,
      }
    });

    return new ServiceCollectionManager(newCollection);
  },

  async fetch(id: string): Promise<ServiceCollectionManager | null> {
    const rawData = await prismaInstance.serviceCollection.findFirst({
      where: { id }
    });

    if (!rawData) return null;
    return new ServiceCollectionManager(rawData);
  },

  async fetchAllByUser(userId: string): Promise<Collection<string, ServiceCollectionManager>> {
    let collection = new Collection<string, ServiceCollectionManager>();
    const allServices = await prismaInstance.serviceCollection.findMany({
      where: {
        creatorId: userId,
      }
    });

    allServices.map(rawData => collection.set(rawData.id, new ServiceCollectionManager(rawData)))

    return collection;
  },

  async delete(id: string): Promise<void> {
    await prismaInstance.serviceCollection.delete({
      where: {
        id
      }
    });

    return;
  },

  async checkUserPermission(userId: string, collectionId: string): Promise<boolean> {
    const userCollections = await this.fetchAllByUser(userId);

    if (userCollections.has(collectionId)) return true;
    return false;
  },

  async count(): Promise<number> {
    let count = await prismaInstance.serviceCollection.count();
    return count;
  }
}