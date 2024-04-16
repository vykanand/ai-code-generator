import { genAI } from "./utils/common.js";
import { promises as fs } from 'fs';
const outputFolder = './output';

import { writeFile } from "fs/promises";

async function run() {

  // Load the project files
  const files = await fs.readdir(outputFolder);

  // Analyze the files
  // ... analyze files here

  // Create a prompt with questions about the project
  const prompt = `Here are some questions about the ${files} project:
  - What is the main purpose of this project?
  - How many routes are defined? 
  - What database is used and how is it connected?
  - What are the main dependencies used?
  - How are errors handled?
  - What best practices are followed?
  - How is the code structured and modularized?
  - What test files are included and how much coverage do they provide?
  - How is security handled?
  - What improvements could be made to the codebase?`;

  // Generate answers 
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Write output to file
  await writeFile('analysis.txt', text);

  console.log(text);
}

run();