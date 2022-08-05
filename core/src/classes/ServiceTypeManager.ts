import { FeatureServiceType, Service, ServiceType } from "@prisma/client";

export default class ServiceTypeManager {
  
  private _raw: ServiceType & {services?: Service[], featureServiceType: FeatureServiceType[]};

  private id: number;
  private name: string;

  private services: Service[] | null;
  private featureServiceType: FeatureServiceType[];

  constructor(data: (ServiceType & {services?: Service[], featureServiceType: FeatureServiceType[]})) {
    this._raw = data;

    this.id = data.id;
    this.name = data.name;

    this.services = data.services ?? null;
    this.featureServiceType = data.featureServiceType;
  }


  toJson() {
    return {
      id: this.id,
      name: this.name,
      services: this.services ?? undefined,
      featureServiceTypes: this.featureServiceType
    }
  }
}