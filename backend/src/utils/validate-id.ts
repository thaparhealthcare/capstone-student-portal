import mongoose from "mongoose";

const validateId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export { validateId };
