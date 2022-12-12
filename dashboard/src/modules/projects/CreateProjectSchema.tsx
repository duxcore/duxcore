import * as yup from "yup";

export default function createProjectSchema() {
  return {
    CreateProjectSchema: yup.object().shape({
      name: yup.string().required(),
    }),
  };
}
