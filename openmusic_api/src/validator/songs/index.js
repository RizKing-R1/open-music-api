import InvariantError from "../../exceptions/InvariantError.js";
import SongPayloadSchema from "./schema.js";

const SongsValidator = {
  validateSongPayload: (payload) => {
    const { error } = SongPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.details[0].message);
    }
  },
};

export default SongsValidator;
