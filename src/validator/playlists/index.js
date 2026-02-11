import InvariantError from "../../exceptions/InvariantError.js";
import {
  PlaylistPayloadSchema,
  PlaylistSongPayloadSchema,
} from "./schema.js";

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const { error } = PlaylistPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.details[0].message);
    }
  },

  validatePlaylistSongPayload: (payload) => {
    const { error } = PlaylistSongPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.details[0].message);
    }
  },
};

export default PlaylistsValidator;
