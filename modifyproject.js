import { genAI } from "./utils/common.js";
import { promises as fs } from 'fs';
import readline from 'readline';

import { writeFile } from "fs/promises";

const context = VM.createContext();

const outputFolder = './output';
const files = await fs.readdir(outputFolder);

async function run() {

  // Load the project files

  let msg = '';

  // Generate answers 
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  while (true) {

    // Prompt user for question
    const question = await promptForQuestion();

    // Add question to msg
    msg += `- ${question}\n`;
    // Generate response
    const prompt = `analyse this project ${files} generate fixed code with filename \n ${msg}`;
    const result = await generateResponse(prompt);

    // Output response
    const response = result.response;
    const text = response.text();

    // Write output to file
    await writeFile('modifyproject.txt', text);

    console.log(text);

  }

}

// Add this function

async function promptForQuestion() {

  const question = await askUser("Enter a question about this project: ");

  return question;

}

// Helper function
function askUser(questionText) {

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => rl.question(questionText, ans => {
    rl.close();
    resolve(ans);
  }))

}

async function generateResponse(prompt) {

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);

  return result;

}

run();
