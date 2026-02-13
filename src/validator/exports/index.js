import InvariantError from "../../exceptions/InvariantError.js";
import ExportPlaylistPayloadSchema from "./schema.js";

const ExportsValidator = {
  validateExportPayload: (payload) => {
    const { error } = ExportPlaylistPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.details[0].message);
    }
  },
};

export default ExportsValidator;
