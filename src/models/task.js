const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const taskSchema = new mongoose.Schema(
  {
    idTask: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)
taskSchema.plugin(uniqueValidator)
const Task = mongoose.model("Task", taskSchema)

module.exports = Task
