import InvariantError from "../../exceptions/InvariantError.js";
import UserPayloadSchema from "./schema.js";

const UsersValidator = {
  validateUserPayload: (payload) => {
    const { error } = UserPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.details[0].message);
    }
  },
};

export default UsersValidator;

