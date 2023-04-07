const express = require("express");
const router = express.Router();
const {
  getTodo,
  getTodoById,
  setTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");

router.get("/", getTodo);
router.get("/:id", getTodoById);
router.post("/", setTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

module.exports = router;
