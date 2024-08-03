// genratefiles.js

import { writeFile } from "fs/promises";
import fs from 'fs';
import path from 'path';

// Function to process text and generate files
export async function processText(responseText, outputFolder) {
    console.log(outputFolder);
    // Extract filenames
    const filenames = extractFilenames(responseText);

    // Extract code blocks  
    const codeBlocks = extractCodeBlocks(responseText);

    // Loop through filenames and code blocks
    for (let i = 0; i < filenames.length; i++) {

        const filename = filenames[i];
        const code = codeBlocks[i];

        // Create file
        await createFile(filename, code, outputFolder);

    }

}

// Helper functions

function extractFilenames(text) {

    // Match filename lines
    const filenameRegex = /^# filename: (.*)$/gm;

    const filenames = [];

    let match;
    while ((match = filenameRegex.exec(text)) !== null) {
        filenames.push(match[1]);
    }

    return filenames;

}

function extractCodeBlocks(text) {

    // Match code blocks between ```
    const codeRegex = /^```([\s\S]*?)```$/gm;

    const codeBlocks = [];

    let match;
    while ((match = codeRegex.exec(text)) !== null) {
        codeBlocks.push(match[1]);
    }

    return codeBlocks;

}

async function createFile(filename, code, outputFolder) {

    const filePath = path.join(outputFolder, filename);

    // Get directory path
    const dirPath = path.dirname(filePath);

    // Create parent folders recursively
    fs.mkdirSync(dirPath, { recursive: true });

    await writeFile(filePath, code);

    console.log(`Created file: ${filePath}`);

}


// Usage
// const responseText = fs.readFileSync('chatoutput.txt', 'utf8');
// const outputFolder = './output';

// await processText(responseText, outputFolder);
