# Agentic AI Beginner Project

A simple **Agentic AI application** built with **Node.js, Express, React, and OpenAI API**.
This project demonstrates how an AI model can **autonomously decide when to use tools (functions)** to perform tasks such as:

* Getting the current time
* Fetching weather information
* Creating todo tasks
* Listing existing todo tasks

The system follows an **Agentic AI pattern** where the AI model can **reason and call tools when needed**.

---

# Project Structure

```
ExploreAgenticAI
│
├── backend
│   ├── index.js
│   ├── tools
│   │   ├── getTime.js
│   │   ├── getWeather.js
│   │   ├── createTodo.js
│   │   └── listTodos.js
│   ├── todos.json
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── src
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── public
│
└── README.md
```

---

# System Architecture

```
User (React UI)
      │
      ▼
Backend API (Node.js + Express)
      │
      ▼
OpenAI Model
      │
      ▼
Tool Decision (Function Calling)
      │
      ▼
Tool Execution (Node.js functions)
      │
      ▼
Tool Result → Model → Final Response
      │
      ▼
Frontend UI
```

The AI model decides whether to:

* Answer directly
* Call a tool (function)

---

# Backend (Node.js + Express)

Location:

```
backend/
```

The backend acts as the **AI Agent controller**.

Responsibilities:

* Accept user messages
* Send messages to OpenAI
* Provide tools for the AI model
* Execute tool calls
* Return final responses

---

## Backend Tools

The agent can use the following tools.

### 1. Get Current Time

```
tools/getTime.js
```

Returns the system's current time.

Example query:

```
What time is it?
```

---

### 2. Get Weather

```
tools/getWeather.js
```

Returns weather information for a city.

Example query:

```
What is the weather in Kolkata?
```

---

### 3. Create Todo Task

```
tools/createTodo.js
```

Adds a new task to the todo list.

Example query:

```
Add task: Buy groceries
```

---

### 4. List Todo Tasks

```
tools/listTodos.js
```

Returns all stored todo tasks.

Example query:

```
Show my tasks
```

---

# Backend Setup

Navigate to the backend folder:

```
cd backend
```

Install dependencies:

```
npm install
```

Create a `.env` file:

```
OPENAI_API_KEY=your_api_key_here
```

Start the backend server:

```
node index.js
```

Server will run on:

```
http://localhost:5000
```

---

# Frontend (React)

Location:

```
frontend/
```

The frontend provides a **simple chat interface** to communicate with the AI agent.

Users can:

* Send messages
* View AI responses
* Interact with the todo system

---

## Frontend Workflow

1. User types a message
2. React sends the message to:

```
POST http://localhost:5000/agent
```

3. Backend processes the request
4. AI generates a response
5. React displays the result

---

# Frontend Setup

Navigate to the frontend folder:

```
cd frontend
```

Install dependencies:

```
npm install
```

Start the React app:

```
npm start
```

Frontend will run on:

```
http://localhost:3000
```

---

# Example Test Prompts

Try the following prompts in the chat UI.

### Time

```
What time is it?
```

### Weather

```
What is the weather in Delhi?
```

### Create Task

```
Add a task to finish my project
```

### View Tasks

```
Show my tasks
```

---

# Agentic AI Concepts Demonstrated

This project demonstrates several **Agentic AI principles**.

### Tool Calling

The model can decide when to call functions.

Example:

```
User: What time is it?
Model → getTime()
```

---

### Reason → Act Pattern

The system follows a simplified **ReAct architecture**.

```
Reason → Choose Tool → Execute Tool → Observe → Respond
```

---

### Autonomous Tool Selection

The AI model automatically selects which tool to use based on the user request.

---

# Future Improvements

Possible enhancements for this project:

### Memory

Store conversation history to allow contextual responses.

### Task Completion

Add support for:

```
Mark task as done
Delete task
```

### External APIs

Integrate real APIs:

* Weather APIs
* Calendar APIs
* Maps APIs

### Multi-step Agents

Allow the agent to perform **multiple reasoning steps** before answering.

---

# Technologies Used

Backend:

* Node.js
* Express
* OpenAI API
* JSON file storage

Frontend:

* React
* Fetch API
* Simple state-based chat UI

---

# Learning Goals

This project helps understand:

* Agentic AI fundamentals
* OpenAI tool calling
* AI + backend integration
* React + AI API interaction
* Building simple AI agents

