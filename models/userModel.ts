// Creating Schema to save user data in mongoDB
// Compare passwords, hash and store
import { Model, models, model, Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { NameTagContent } from "@/components/NameTagForm";

interface UserDocument extends Document {
  email: string;
  password: string;
  role: "admin" | "user";
  nameTag: NameTagContent;
}

interface Methods {
  comparePassword: (password: string) => Promise<boolean>;
}

//DB Schema
const userSchema = new Schema<UserDocument, {}, Methods>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  nameTag: {
    preferredName: { type: String },
    pronouns: { type: String },
    disclosure: { type: String },
    visible: { type: Boolean },
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
  return await bcrypt.compare(password, this.password);
};

//Create User model if it doesn't exist
const UserModel = models.User || model("User", userSchema);

export default UserModel as Model<UserDocument, {}, Methods>;
