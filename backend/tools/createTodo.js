const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../todos.json");

module.exports = async ({ task }) => {

  // Create file if missing
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }

  const todos = JSON.parse(fs.readFileSync(filePath));

  const newTodo = {
    id: Date.now(),
    task,
    createdAt: new Date().toISOString()
  };

  todos.push(newTodo);

  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));

  return {
    message: "Task added successfully",
    task: newTodo
  };
};