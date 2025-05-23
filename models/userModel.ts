// Creating Schema to save user data in mongoDB
// Compare passwords, hash and store
import { Document, Schema, models, model } from "mongoose";
import bcrypt from "bcrypt";

interface NameTagContent {
  visible: boolean;
  preferredName: string;
  pronouns: string;
  disclosure: string;
}
interface UserDocument extends Document {
  email: string;
  password: string;
  role: "admin" | "user";
  nameTag: NameTagContent;
  waveHands: string[];
  affirmations: string[];
}

interface Methods {
  comparePassword: (password: string) => Promise<boolean>;
}

//DB Schema
const userSchema = new Schema<UserDocument, {}, Methods>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  nameTag: {
    preferredName: { type: String },
    pronouns: { type: String },
    disclosure: { type: String },
    visible: { type: Boolean },
  },
  waveHands: {
    type: [String],
    default: [
      "👋",
      "👋 I'm not done",
      "👋 Question",
      "👋 Agree",
      "👋 Different Opinion",
      "👋 Support",
    ],
  },
  affirmations: {
    type: [String],
    default: [
      "Say what I want to say, whatever happens will help me grow",
      "I can take up space",
      "I have an important voice",
      "Feel the tension and proceed",
      "I have the right to stutter",
    ],
  },
});

//Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Compare password method
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

//Create User model if it doesn't exist
const UserModel = models.User || model("User", userSchema);

export default UserModel;
