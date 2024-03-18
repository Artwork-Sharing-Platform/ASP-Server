import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    type: {
      type: String,
      default: "image",
    },
    access: {
      type: String,
      default: "public",
    },
    url: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    createdAtArt: {
      type: Date,
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    reactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reaction",
    },
    status: {
      type: Boolean,
      default: true,
    },
    isCheckedAds: {
      type: Boolean,
      default: true,
    },
    isCheckedComment: {
      type: Boolean,
      default: true,
    },
    isCheckedSimilar: {
      type: Boolean,
      default: true,
    },
    countReport: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Art = mongoose.model("Art", schema);
