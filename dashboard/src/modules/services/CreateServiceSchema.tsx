import * as yup from "yup";

export default function createServiceSchema() {
  return {
    CreateServiceSchema: yup.object().shape({
      name: yup.string().required(),
      projectId: yup.string().required(),
      daemonId: yup.string().required(),
      params: yup.object().required(),
      cpu: yup.number().required(),
      mem: yup.number().required(),
      disk: yup.number().required(),
    }),
  };
}
