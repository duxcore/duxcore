import { ServiceFeature } from "@prisma/client";

export default class ServiceFeatureManager {
	private _raw: ServiceFeature

	public id: string;
	public name: string;
	public description: string;

	public requiresValue: boolean;
	public defaultValue?: string;
	public valueType?: string;

	constructor(raw: ServiceFeature) {
		this._raw = raw;

		this.id = raw.id,
		this.name = raw.name,
		this.description = raw.description,

		this.requiresValue = raw.requiresValue,
		this.defaultValue = raw.defaultValue ?? undefined;
		this.valueType = raw.valueType ?? undefined;
	}

	toJson() {
		return {
			id: this.id,
			name: this.name,
			description: this.description,

			requiresValue: this.requiresValue,
			defaultValue: this.defaultValue,
			valueType: this.valueType

		}
	}
}
