import InvariantError from "../../exceptions/InvariantError.js";
import {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} from "./schema.js";

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const { error } = PostAuthenticationPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.details[0].message);
    }
  },

  validatePutAuthenticationPayload: (payload) => {
    const { error } = PutAuthenticationPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.details[0].message);
    }
  },

  validateDeleteAuthenticationPayload: (payload) => {
    const { error } = DeleteAuthenticationPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.details[0].message);
    }
  },
};

export default AuthenticationsValidator;

