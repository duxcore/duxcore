import { ServiceType } from "@prisma/client";
import { prismaInstance } from "../../prisma/instance";

export const services = {
  async fetch(id: string, includedServiceType?: ServiceType) {
    let fetchedData = await prismaInstance.service.findFirst({
      where: { id },
      include: { NodeJsAppService: true },
    });
  },
};
