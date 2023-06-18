const mongoose = require("mongoose")

const ExpenseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },

    amount: {
      type: Number,
      required: true,
      maxLength: 20,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },
    
    description: {
      type: String,
      required: true,
      trim: true,
    },

    userOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("expense", ExpenseSchema)