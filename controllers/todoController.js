const pool = require("../db");
// @desc get Todo
// @route GET /api/todo
// access private
const getTodo = async (req, res) => {
  try {
    const listTodos = await pool.query("SELECT * FROM todo");
    return res.status(200).json(listTodos.rows);
  } catch (error) {
    console.error(error);
  }
};

// @desc Create Todo
// @route GET /api/todo/:id
// access private
const getTodoById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (id) {
      const listTodos = await pool.query("SELECT * FROM todo WHERE id =$1", [
        id,
      ]);
      return res.status(200).json(listTodos.rows);
    } else {
      return res.status(400).json({ message: "Wrong id" });
    }
  } catch (error) {
    console.error(error);
  }
};

// @desc Create Todo
// @route POST /api/todo
// access private
const setTodo = async (req, res) => {
  try {
    const { descriptions } = req.body;
    if (descriptions) {
      const newTodo = await pool.query(
        // [dependencies] equal to $1 values
        "INSERT INTO todo (descriptions) VALUES ($1) RETURNING *",
        [descriptions]
      );
      return res.status(201).json(newTodo.rows);
    } else {
      return res.status(400).json({ message: "No description" });
    }
  } catch (error) {
    console.error(error);
  }
};

// @desc Create Todo
// @route PUT /api/todo:id
// access private
const updateTodo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (id) {
      const { descriptions } = req.body;
      if (descriptions) {
        await pool.query("UPDATE todo SET descriptions = $1 WHERE id=$2", [
          descriptions,
          id,
        ]);
        return res.status(200).json(id);
      } else {
        return res.status(400).json({ message: "No description" });
      }
    } else {
      return res.status(400).json({ message: "Wrong id" });
    }
  } catch (error) {
    console.error(error);
  }
};

// @desc Create Todo
// @route DELETE /api/todo/:id
// access private
const deleteTodo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (id) {
      const listTodos = await pool.query("SELECT * FROM todo WHERE id =$1", [
        id,
      ]);
      console.log(listTodos);
      if (listTodos.rowCount > 0) {
        await pool.query("DELETE FROM todo WHERE id=$1", [id]);
        return res.status(200).json({ id: id });
      } else {
        return res.status(400).json({ message: "Id not exist" });
      }
    } else {
      return res.status(400).json({ message: "Wrong id" });
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getTodo, getTodoById, setTodo, updateTodo, deleteTodo };
