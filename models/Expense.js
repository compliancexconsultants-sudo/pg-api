// models/Expense.js
const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  pg_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pg",
    required: true
  },

  title: String,
  amount: Number,
  category: String,
  expense_date: Date,
  note: String
}, { timestamps: true });

module.exports = mongoose.model("Expense", ExpenseSchema);