const mongoose = require("mongoose");
const moment = require("moment-timezone")
const dateMalaysia = moment.tz(Date.now(), "Asia/Shanghai").toDate()

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

        type: {
            type: String,
            required: true,
            default: "expenses"
        },

        date: {
            type: String,
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
            default: "-",
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

module.exports = mongoose.model("expense", ExpenseSchema);
