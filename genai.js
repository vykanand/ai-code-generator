
import { genAI } from "./utils/common.js";
export const outputFolder = './output6';
import { writeFile } from "fs/promises";
// import fs from 'fs/promises';

// import { processTextFile } from './fileop.js';

async function run() {
  // For text-only inputs, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // const prompt = "Give me code of simple nodejs crud project with express server on port 2344 and give me all files in this project.This project will have crud functionalities along with two mongodb tables users and orders tables.Generate this code with filenames and test cases files.This project should also include cors npm package with best prodcution ready code along with helmet security and catch errors properly with all try catch.";
  const prompt = "Generate code without any explaination or folder structure diagram. Genrate code with folder and file names with their locations. Genrate filename Inside **var** and code inside ```var``` and dont generate filenames inside codes and generate production ready code following best practices" +
    "Generate production grade nodejs app. please generate best folder structure and include all files needed in production with mvc architecture.I need seperate folders and their respective codes as mentioned below." +
    "Folders arranged properly" +
    "It will contain following models - Users, Orders,cart,messages,review,favourites" +
    "all models and their services and controllers should be created with all crud operations on each modules." +
    "node port should be 1515." +
    "code should be very modular and all responsibilities should be seperated into seperate folders." +
    "" +
    "1. controllers models and db handlers for both sql and mysql should be used.Use connection pooling and dao objects" +
    "2. error and exception handling libraries should be used all over the project." +
    "3. follow solid kiss dry principles." +
    "4. Use proper and easy variable names and comments." +
    "5. 100% Code coverage is mandatory." +
    "6. services and controllers should be seperate." +
    "7. Use async error caching and next() so that no request stop and system is fault taularent." +
    "8. use eslint file and best eslint rules." +
    "9. prettify all the code." +
    "10. create env file to store are the system variables and use mysql username as - vyk and password as youtub23";
  const { totalTokens } = await model.countTokens(prompt);
  console.log("Tokens count:", totalTokens);

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  try {
    await writeFile('logs.txt', text, (err) => { console.log(err); });
    // processTextFile('logs.txt', outputFolder);
  } catch (err) {
    console.error('Error writing to file:', err);
  }
  console.log(text);


}

run();
