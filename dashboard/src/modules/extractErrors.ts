export interface ApiError {
  code: string;
  value?: string;
  message: string;
}

export const extractErrors = (stack: ApiError[] = []) => {
  const errors = new Map();

  stack.map(val => {
    return errors.set(val.code, val);
  });

  return errors;
};
