export type StackConfiguration = keyof typeof errorManifest | ApiError;
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

    errors.map((err) => {
      if (typeof err !== "string") return stack.push(err);

      if (!keys.includes(err)) return;
      stack.push(errorManifest[err]);
    });

    return {
      stack,
      append(...appendments: StackConfiguration[]) {
        appendments.map((err) => {
          if (typeof err !== "string") return this.stack.push(err);

          if (!keys.includes(err)) return;
          this.stack.push(errorManifest[err]);
        });
        return this;
      },
      prepend(...prependments: StackConfiguration[]) {
        let prepStack: ApiError[] = [];

        prependments.map((err) => {
          if (typeof err !== "string") return prepStack.push(err);

          if (!keys.includes(err)) return;
          prepStack.push(errorManifest[err]);
        });

        this.stack = [...prepStack, ...this.stack];

        return this;
      },
    };
  },
};

export const errorConstructor = {
  missingValue: (value: string): ApiError => {
    return {
      code: "MISSING_VALUE",
      value: value,
      message: `Value '${value}' is required for this query.`,
    };
  },
  invalidValueType: (
    value: string,
    wrongType: string,
    correctType: string
  ): ApiError => {
    return {
      code: "INVALID_VALUE_TYPE",
      value: value,
      message: `Value ${value} was expecting '${correctType}', but got '${wrongType}' `,
    };
  },
  invalidEmail: (email: string): ApiError => {
    return {
      code: "INVALID_EMAIL_ADDRESS",
      value: email,
      message: `Invalid Email Address...`,
    };
  },
  invalidUserModifier: (modifier: string): ApiError => {
    return {
      code: "INVALID_USER_MODIFIER",
      value: modifier,
      message: "This is anot a valid user modifier...",
    };
  },
  unexpectedValue: (value: string): ApiError => {
    return {
      code: "UNEXPECTED_VALUE",
      value,
      message: `The value '${value}' was not expected and is not a valid value for this object.`,
    };
  },
  internalServerError: (er: Error | string): ApiError => ({
    code: "INTERNAL_SERVER_ERROR",
    message: er.toString(),
  }),
  invalidFeatureID: (featureId: string): ApiError => ({
    code: "INVALID_FEATURE_ID",
    message: `Invalid Feature ID '${featureId}'`,
    value: featureId,
  }),
};

export const errorManifest = {
  unknownUser: {
    code: "UNKNOWN_USER",
    message: "This user doesn't exist.",
  },
  userEmailExists: {
    code: "USER_EMAIL_EXISTS",
    message: "A user with this email address already exists...",
  },
  teapot: {
    code: "THE_TEAPOT",
    message: "This is just a funny teapot error!",
  },
  missingAuthToken: {
    code: "MISSING_AUTH_TOKEN",
    message: "The authorization token is required for this query.",
  },
  missingRefreshToken: {
    code: "MISSING_REFRESH_TOKEN",
    message: "The refresh token is missing from the authorization header.",
  },
  authFailure: {
    code: "AUTH_FAILURE",
    message: "Failed to authorize using auth token...",
  },
  invalidPassword: {
    code: "INVALID_PASSWORD",
    message: "Invalid Password.",
  },
  missingUserModifiers: {
    code: "MISSING_USER_MODIFIERS",
    message: "The body provided has no user modifiers in it...",
  },
  invalidEmailResetToken: {
    code: "INVALID_EMAIL_RESET_TOKEN",
    message: "The email reset token provided is either invalid or expired...",
  },
  invalidEmailTokenMatch: {
    code: "INVALID_EMAIL_TOKEN_MATCH",
    message:
      "The email provided does not match the email we have stored in our database with this email token.",
  },
  invalidProjectId: {
    code: "INVALID_SERVICE_PROJECT_ID",
    message: "The project id provided is not a valid project id",
  },
  projectNoAccess: {
    code: "PROJECT_ACCESS_DENIED",
    message: "You do not have permission to view or modify this project...",
  },
  invalidDaemonId: {
    code: "UNKNOWN_DAEMON",
    message: "The daemon you are searching for does not exist.",
  },
  unknownDaemonRegion: {
    code: "UNKNOWN_DAEMON_REGION",
    message: "The daemon region id provided cannot be found.",
  },
  regionCodeUnavailable: {
    code: "REGION_CODE_UNAVAILABLE",
    message: "The region provided already exists as a region.",
  },
  regionDiscriminatorInUse: {
    code: "REGION_DISCRIMINATOR_IN_USE",
    message: "This region discriminator is alredy in use.",
  },
  emptyRequestObject: {
    code: "EMPTY_REQUEST_OBJECT",
    message: "The request object is either missing or empty.",
  },
  unknownService: {
    code: "UNKNOWN_SERVICE_ID",
    message: "The service you are trying to fetch doesn't exist.",
  },
  serviceNoAccess: {
    code: "SERVICE_NO_ACCESS",
    message: "The do not have permission to view this service.",
  },
  unknownServiceType: {
    code: "UNKNOWN_SERVICE_TYPE_ID",
    message: "The service type you are trying to use doesn't exist.",
  },
  unknownServiceFeature: {
    code: "UNKNOWN_SERVICE_FEATURE_ID",
    message: "The service feature you are trying to use doesn't exist.",
  },
};
