import Collection from "@discordjs/collection";
import {Service, ServiceFeature, ServiceType } from "@prisma/client";
import ServiceFeatureManager from "./ServiceFeatureManager";

export type ModifiedServiceTypeInstance = ServiceType & {services?: Service[], features: ServiceFeature[]};

export default class ServiceTypeManager {
  
  private _raw: ServiceType & {services?: Service[], features: ServiceFeature[]};

  private id: string;
  private name: string;

  private services: Service[] | null;
  private features: Collection<string, ServiceFeatureManager>;

  constructor(data: (ServiceType & {services?: Service[], features: ServiceFeature[]})) {
    this._raw = data;

    this.id = data.id;
    this.name = data.name;

    this.services = data.services ?? null;
    this.features = new Collection<string, ServiceFeatureManager>();
    
    if (this._raw.features) this._raw.features.map(v => this.features.set(v.id, new ServiceFeatureManager(v)))
  }


  toJson() {
    return {
      id: this.id,
      name: this.name,
      services: this.services ?? undefined,
      features: this.features.map(v => v.toJson())
    }
  }
}