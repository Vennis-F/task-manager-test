const server = require("../src/index")
let chai = require("chai")
let chaiHttp = require("chai-http")
const Task = require("../src/models/task")
const taskUtil = require("../utils/task-test")
let should = chai.should()

chai.use(chaiHttp)

//Data sucess
let taskPostSucess = {
  idTask: "16",
  description: "eat",
  completed: false,
}
let idDeleteSucess = "1"
let objPatchSucess = {
  id: "2",
  update: { completed: true },
}

//Data fail
let taskPostFail = {
  idTask: "111",
  completed: false,
}
let idDeleteFail = "2000"
let objPatchFailPermission = {
  id: "3",
  update: { completed: false, idTask: "11" },
}
let objPatchFailById = {
  id: "aaaaaaa",
  update: { completed: true },
}

//Test case
describe("/GET /tasks", () => {
  it("it should GET all tasks", (done) => {
    chai
      .request(server)
      .get("/tasks")
      .end((err, res) => {
        //Xem ở đây nữa (eos hieeur luon vc :) t push code lên nhé lên github á
        console.log(res.body, 456)

        res.should.have.status(200)
        res.body.should.be.a("array")
        res.body.length.should.be.eql(9) // fix length
        done()
      })
  })
})

describe("/POST /tasks", () => {
  it("it should POST a task", (done) => {
    let task = {
      ...taskPostSucess,
    }
    chai
      .request(server)
      .post("/tasks")
      .send(task)
      .end((err, res) => {
        res.should.have.status(201)
        res.body.should.be.a("object")
        res.body.should.have.property("message").eql("Task successfully added!")
        res.body.task.should.have.property("idTask")
        res.body.task.should.have.property("description").eql(task.description)
        res.body.task.should.have.property("completed").eql(task.completed)
        done()
      })
  })

  it("it should not POST a task without description field", (done) => {
    let task = {
      ...taskPostFail,
    }
    chai
      .request(server)
      .post("/tasks")
      .send(task)
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.be.a("object")
        res.body.should.have.property("message").eql("Task is invalid!")
        done()
      })
  })
})

describe("/DELETE /tasks/:id", () => {
  it("it should DELETE a task given the id", (done) => {
    let id = idDeleteSucess
    chai
      .request(server)
      .delete(`/tasks/${id}`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a("object")
        res.body.should.have
          .property("message")
          .eql("task successfully deleted!")
        done()
      })
  })
  it("it should NOT DELETE a task with wrong id task", (done) => {
    let id = idDeleteFail
    chai
      .request(server)
      .delete(`/tasks/${id}`)
      .end((err, res) => {
        res.should.have.status(404)
        res.body.should.be.a("object")
        res.body.should.have.property("message").eql("wrong id task!")
        done()
      })
  })
})

describe("/PATCH /tasks/:id", () => {
  it("it should PATCH a task by the given id", (done) => {
    let { id, update } = objPatchSucess

    chai
      .request(server)
      .patch(`/tasks/${id}`)
      .send(update)
      .end((err, res) => {
        res.should.have.status(201)
        res.body.should.be.a("object")
        res.body.should.have.property("task")

        res.body.task.should.have.property("idTask").eql(id)
        res.body.task.should.have.property("description")
        res.body.task.should.have.property("completed")
        res.body.should.have
          .property("message")
          .eql("Task successfully updated!")
        done()
      })
  })

  it("it should NOT UPDATE a task with not permission field", (done) => {
    let { id, update } = objPatchFailPermission

    chai
      .request(server)
      .patch(`/tasks/${id}`)
      .send(update)
      .end((err, res) => {
        res.should.have.status(400)
        res.body.should.be.a("object")
        res.body.should.have.property("message").eql("Invalid updates!")
        done()
      })
  })

  it("it should NOT UPDATE a task with wrong id task", (done) => {
    let { id, update } = objPatchFailById
    chai
      .request(server)
      .patch(`/tasks/${id}`)
      .send(update)
      .end((err, res) => {
        res.should.have.status(404)

        res.body.should.be.a("object")
        res.body.should.have.property("message").eql("wrong id task!")
        done()
      })
  })
})
