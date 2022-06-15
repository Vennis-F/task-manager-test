const Task = require("../src/models/task")

const emptyTasks = async () => {
  const tasks = await Task.find({})

  await Promise.all(
    tasks.map(async (task) => {
      await task.remove()
    })
  )
}

const initTasks = async (lstData) => {
  await emptyTasks()

  const lstTask = lstData.map((data) => new Task(data))

  await Promise.all(
    lstTask.map(async (task) => {
      await task.save()
    })
  )
}

//Data
let ListData = [
  { idTask: "1", description: "eat", completed: false },
  { idTask: "2", description: "learn", completed: false },
  { idTask: "3", description: "sleep", completed: true },
  { idTask: "4", description: "fishing", completed: false },
  { idTask: "5", description: "cooking", completed: false },
  { idTask: "6", description: "dancing", completed: true },
  { idTask: "7", description: "smile", completed: false },
  { idTask: "8", description: "run", completed: false },
  { idTask: "9", description: "work", completed: true },
]

const test = async () => {
  //Init
  await initTasks(ListData)
}

test()
module.exports = { emptyTasks, initTasks }
