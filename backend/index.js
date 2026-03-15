/**
 * -------------------------------------------------------------
 * Agentic AI Backend Server
 * -------------------------------------------------------------
 * This server exposes an API endpoint `/agent` which acts as an
 * AI Agent powered by OpenAI.
 *
 * The agent can:
 *  - Tell the current time
 *  - Fetch weather information
 *  - Create todo tasks
 *  - List all saved todo tasks
 *
 * The AI model decides when to call these tools automatically
 * using OpenAI's function/tool calling capability.
 *
 * Flow:
 * User Request → OpenAI Model → Tool Decision → Tool Execution
 * → Send Tool Output → Model Generates Final Response → UI
 *
 * Technologies Used:
 * - Node.js
 * - Express
 * - OpenAI Responses API
 * - Tool Calling (Agentic AI pattern)
 * -------------------------------------------------------------
 */

require("dotenv").config(); // Loads environment variables from .env file

const express = require("express"); // Web server framework
const OpenAI = require("openai"); // OpenAI SDK
const cors = require("cors"); // Enables cross-origin requests

/**
 * Import custom tools that the AI agent can use
 */
const getTime = require("./tools/getTime");
const getWeather = require("./tools/getWeather");
const createTodo = require("./tools/createTodo");
const listTodos = require("./tools/listTodos");

/**
 * Initialize OpenAI client using API key stored in environment variables
 */
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Create Express application
 */
const app = express();

/**
 * Middleware
 */
app.use(cors()); // Allows frontend (React app) to call this backend
app.use(express.json()); // Parse JSON request body

/**
 * -------------------------------------------------------------
 * POST /agent
 * -------------------------------------------------------------
 * Main endpoint that interacts with the AI agent.
 *
 * Request Body:
 * {
 *   "message": "User message"
 * }
 *
 * Response:
 * {
 *   "reply": "Agent response"
 * }
 *
 * Steps:
 * 1. Receive user message
 * 2. Send message to OpenAI model
 * 3. Model decides if any tool should be used
 * 4. Backend executes requested tools
 * 5. Tool output is sent back to the model
 * 6. Model generates the final answer
 * -------------------------------------------------------------
 */
app.post("/agent", async (req, res) => {

  // Extract user message from request
  const userMessage = req.body.message;

  /**
   * Send user input to OpenAI model along with available tools.
   * The model will decide if it needs to call any tool.
   */
  const response = await client.responses.create({
    model: "gpt-4o-mini",

    // User message
    input: userMessage,

    /**
     * Tools available for the AI agent
     * These tools allow the model to perform real actions
     */
    tools: [

      /**
       * Tool: Get Current Time
       */
      {
        type: "function",
        name: "getTime",
        parameters: {
          type: "object",
          properties: {}
        }
      },

      /**
       * Tool: Get Weather for a specific city
       */
      {
        type: "function",
        name: "getWeather",
        parameters: {
          type: "object",
          properties: {
            city: { type: "string" }
          },
          required: ["city"]
        }
      },

      /**
       * Tool: Create a new Todo task
       */
      {
        type: "function",
        name: "createTodo",
        parameters: {
          type: "object",
          properties: {
            task: { type: "string" }
          },
          required: ["task"]
        }
      },

      /**
       * Tool: List all existing todo tasks
       */
      {
        type: "function",
        name: "listTodos",
        description: "Get all todo tasks",
        parameters: {
          type: "object",
          properties: {}
        }
      }

    ]
  });

  /**
   * Debug: Print raw model output in server console
   */
  console.log(JSON.stringify(response.output, null, 2));

  /**
   * Detect if the model requested any tool calls
   */
  const toolCalls = response.output.filter(item => item.type === "function_call");

  /**
   * If tool calls exist, execute them
   */
  if (toolCalls.length > 0) {

    const toolOutputs = [];

    /**
     * Execute each tool requested by the model
     */
    for (const toolCall of toolCalls) {

      const name = toolCall.name;

      // Parse arguments sent by the model
      const args = JSON.parse(toolCall.arguments || "{}");

      let result;

      /**
       * Route tool execution based on tool name
       */
      if (name === "getTime") result = await getTime();
      if (name === "getWeather") result = await getWeather(args);
      if (name === "createTodo") result = await createTodo(args);
      if (name === "listTodos") result = await listTodos();

      /**
       * Push tool result so it can be returned to the model
       */
      toolOutputs.push({
        type: "function_call_output",
        call_id: toolCall.call_id,
        output: JSON.stringify(result)
      });
    }

    /**
     * Send tool results back to OpenAI model so it can
     * generate the final natural language response
     */
    const final = await client.responses.create({
      model: "gpt-4o-mini",

      // Continue conversation from previous response
      previous_response_id: response.id,

      // Provide tool outputs
      input: toolOutputs
    });

    /**
     * Return final agent response to frontend
     */
    return res.json({ reply: final.output_text });
  }

  /**
   * If no tool was needed, return model response directly
   */
  return res.json({ reply: response.output_text });
});

/**
 * Start the Express server
 */
app.listen(5000, () => console.log("Agent running on port 5000"));