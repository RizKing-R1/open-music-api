import InvariantError from "../../exceptions/InvariantError.js";
import AlbumPayloadSchema from "./schema.js";

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const { error } = AlbumPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.details[0].message);
    }
  },
};

export default AlbumsValidator;
