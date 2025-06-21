// server/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { promisify } from "node:util";
import { randomBytes, createHash } from "node:crypto";
import Note from "./Note.js";
import Chat from "./Chat.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    verificationHistory: [
      {
        date: Date,
        method: String,
      },
    ],
    passwordResetHistory: [
      {
        date: Date,
        method: String,
      },
    ],
  },
  {
    timestamps: true,
    autoIndex: process.env.NODE_ENV !== "production",
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const userId = this._id;

    await Promise.all([
      Note.deleteMany({ user: userId }),
      Chat.updateMany(
        {
          $or: [{ deliveredTo: userId }, { readBy: userId }],
        },
        {
          $pull: {
            deliveredTo: userId,
            readBy: userId,
          },
        }
      ),
      Chat.deleteMany({ sender: userId }),
    ]);

    next();
  }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const randomBytesAsync = promisify(randomBytes);

userSchema.methods.createVerificationToken = async function () {
  try {
    const buf = await randomBytesAsync(32);

    const verificationToken = buf.toString("hex");

    this.emailVerificationToken = createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    return verificationToken;
  } catch (err) {
    throw new Error("Failed to generate verification token");
  }
};

userSchema.methods.createPasswordResetToken = async function () {
  try {
    const buf = await randomBytesAsync(32);
    const resetToken = buf.toString("hex");

    this.passwordResetToken = createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
  } catch (err) {
    throw new Error("Failed to generate reset token");
  }
};

userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ emailVerificationExpires: 1 });
userSchema.index(
  {
    emailVerificationToken: 1,
    emailVerificationExpires: 1,
    isVerified: 1,
  },
  {
    name: "verification_query_index",
    background: true,
  }
);

userSchema.index(
  {
    passwordResetToken: 1,
    passwordResetExpires: 1,
  },
  {
    name: "password_reset_index",
    background: true,
  }
);

userSchema.index(
  { email: 1, isVerified: 1 },
  {
    name: "auth_status_index",
    background: true,
  }
);

userSchema.index(
  {
    username: "text",
    email: "text",
  },
  {
    name: "user_search_index",
    weights: {
      username: 10,
      email: 5,
    },
  }
);

export default mongoose.model("User", userSchema);
