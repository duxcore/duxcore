export type StackConfiguration = ((keyof typeof errorManifest) | ApiError);
export interface ApiError {
  code: string;
  value?: string;
  message: string;
}

export const apiError = {
  new(err: ApiError): ApiError {
    return err;
  },
  createErrorStack(...errors: StackConfiguration[]) {
    let stack: ApiError[] = [];

    let keys = Object.keys(errorManifest);

    errors.map(err => {
      if (typeof err !== "string") return stack.push(err);

      if (!keys.includes(err)) return;
      stack.push(errorManifest[err]);
    });

    return {
      stack,
      append(...appendments: StackConfiguration[]) {
        appendments.map(err => {
          if (typeof err !== "string") return this.stack.push(err);

          if (!keys.includes(err)) return;
          this.stack.push(errorManifest[err]);
        });
        return this;
      },
      prepend(...prependments: StackConfiguration[]) {
        let prepStack: ApiError[] = [];

        prependments.map(err => {
          if (typeof err !== "string") return prepStack.push(err);

          if (!keys.includes(err)) return;
          prepStack.push(errorManifest[err]);
        });

        this.stack = [...prepStack, ...this.stack];

        return this;
      }
    };
  }
}

export const errorConstructor = {
  missingValue: (value: string): ApiError => {
    return {
      code: "MISSING_VALUE",
      value: value,
      message: `Value '${value}' is required for this query.`
    }
  },
  invalidEmail: (email: string): ApiError => {
    return {
      code: "INVALID_EMAIL_ADDRESS",
      value: email,
      message: `Invalid Email Address...`
    }
  },
}

export const errorManifest = {
  unknownUser: {
    code: "UNKNOWN_USER",
    message: "This user doesn't exist."
  },
  userEmailExists: {
    code: "USER_EMAIL_EXISTS",
    message: "A user with this email address already exists..."
  },
  teapot: {
    code: "THE_TEAPOT",
    message: "This is just a funny teapot error!"
  },
  missingAuthToken: {
    code: "MISSING_AUTH_TOKEN",
    message: "The authorization token is required for this query."
  },
  missingRefreshToken: {
    code: "MISSING_REFRESH_TOKEN",
    message: "The refresh token is missing from the authorization header."
  },
  authFailure: {
    code: "AUTH_FAILURE",
    message: "Failed to authorize using auth token..."
  },
  invalidPassword: {
    code: "INVALID_PASSWORD",
    message: "Invalid Password."
  }

}