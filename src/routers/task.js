const express = require("express")
const Task = require("../models/task")
const auth = require("../middleware/auth")
const router = new express.Router()

//POST /tasks
router.post("/tasks", async (req, res) => {
  const task = new Task({
    ...req.body,
  })

  try {
    const taskSaved = await task.save()
    res.status(201).send({ task, message: "Task successfully added!" })
  } catch (e) {
    res.status(400).send({ message: "Task is invalid!" })
  }
})

//GET /tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({})

    //Xét lỗi ở đây xem coi có lấy được tasks, không
    console.log(tasks, 123)

    res.send(tasks)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

//GET /tasks/:id
router.get("/tasks/:id", async (req, res) => {
  const id = req.params.id

  try {
    const task = await Task.findOne({ idTask: id })

    if (!task) {
      res.status(404).send({ message: "wrong id task!" })
    }

    res.status(200).send({ task })
  } catch (e) {
    res.status(500).send()
  }
})

//PATCH /tasks/:id
router.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ["description", "completed"]
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) {
    return res.status(400).send({ message: "Invalid updates!" })
  }

  try {
    const task = await Task.findOne({ idTask: req.params.id })

    if (!task) {
      res.status(404).send({ message: "wrong id task!" })
    }

    updates.forEach((update) => (task[update] = req.body[update]))
    await task.save()

    res.status(201).send({ task, message: "Task successfully updated!" })
  } catch (e) {
    res.status(400).send(e)
  }
})

//DELETE /tasks/:id
router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      idTask: req.params.id,
    })

    if (!task) {
      res.status(404).send({ message: "wrong id task!" })
    }

    res.status(200).send({ task, message: "task successfully deleted!" })
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
