const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../todos.json");

module.exports = async () => {

  if (!fs.existsSync(filePath)) {
    return { todos: [] };
  }

  const todos = JSON.parse(fs.readFileSync(filePath));

  return { todos };
};