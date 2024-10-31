import { Model, models, model, Document, Schema } from "mongoose";

interface LogActionDocument extends Document {
  userEmail: string;
  action: string;
  timestamp: Date;
  metadata: JSON;
}

//DB schema
const logActionSchema = new Schema<LogActionDocument>({
  userEmail: { type: String, required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: JSON, required: false },
});

const LogActionModel = models.Log || model("Log", logActionSchema);

export default LogActionModel as Model<LogActionDocument>;
