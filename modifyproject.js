import { genAI } from "./utils/common.js";
import { promises as fs } from 'fs';
import readline from 'readline';
import path from 'path';

import { writeFile } from "fs/promises";

const outputFolder = './output';

async function run() {

  // Load the project files
  const files = await fs.readdir(outputFolder);
  let msg = '';

  // Generate answers 
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  while (true) {

    // Prompt user for question
    const question = await promptForQuestion();

    // Add question to msg
    msg += `- ${question}\n`;
    const files = await fs.readdir(outputFolder);

    // Generate response
    const prompt = `for the project ${files} generate a no explaination code with filename and subsequent paths for this prompt :\n ${msg}`;
    const result = await generateResponse(prompt);

    // Output response
    const response = result.response;
    const text = response.text();

    // Write output to file
    await writeFile('modifyproject.txt', text);

    console.log(text);

    // // Example usage
    // const textOutput = text;

    // // Change this to your output directory

    // const modifications = parseTextOutput(textOutput);
    // applyModifications(modifications, outputFolder);

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




// Parse the text output and extract relevant information
function parseTextOutput(output) {
  const modifications = [];
  const lines = output.split('\n');

  let currentFile = null;
  let currentContent = '';

  for (let line of lines) {
    if (line.startsWith('**') && line.includes('.')) {
      // New file detected
      if (currentFile) {
        modifications.push({ file: currentFile, content: currentContent });
      }
      currentFile = line.substring(2, line.indexOf(':')).trim();
      currentContent = '';
    } else {
      // Append content
      currentContent += line + '\n';
    }
  }

  if (currentFile) {
    modifications.push({ file: currentFile, content: currentContent });
  }

  return modifications;
}

// Apply modifications to files in the output directory
async function applyModifications(modifications, outputDirectory) {
  for (let mod of modifications) {
    const filePath = path.join(outputDirectory, mod.file);
    try {
      await fs.writeFile(filePath, mod.content);
      console.log(`Modified file: ${filePath}`);
    } catch (error) {
      console.error(`Error writing file ${filePath}: ${error.message}`);
    }
  }
}


