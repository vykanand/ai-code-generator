import { writeFile } from "fs/promises";
import fs from 'fs';
import path from 'path';

import { argv } from 'process';

// ...other imports 

// Get textFilePath from args
const textFilePath = argv[2];

if (!textFilePath) {
    console.error('Please provide textFilePath as argument');
    process.exit(1);
}

// const textFilePath = 'chatoutput.txt'; // Change this to your text file path
const outputFolder = './output'; // Change this to your desired output folder
processTextFile(textFilePath, outputFolder)
// Function to read the text file, extract files, and create folders and files
export function processTextFile(responseText, outputFolder) {
    console.log(responseText, outputFolder);
    // Read the text file
    let fileData = responseText;
    // Define a regular expression to match the folder structure block
    const regex = /^.*?(?=├──|└──)/ms;
    // Remove the folder structure block using the regular expression
    fileData = fileData.replace(regex, '');
    console.log(fileData.trim());
    try {
        // fileData = fs.readFileSync(textFilePath, 'utf8');
        console.log(fileData);
    } catch (err) {
        console.error('Error reading text file:', err);
        return;
    }
    extractFilenames(fileData)

    // Call the recursive function to extract filenames and code blocks from current directory and subdirectories
    const results = extractFilenamesAndCodeRecursively('./');

    // Output the extracted filenames and code blocks
    console.log('Extracted filenames and code blocks:');
    results.forEach(({ filename, code }) => {

        let resultCode = code.split('\n').slice(1).join('\n')
        console.log(`Filename: ${filename}`);
        // console.log(resultCode);
        createFolderAndFile(filename, resultCode, outputFolder);
    });

}


// Function to create folder and file
function createFolderAndFile(filePath, contents, outputFolder) {

    // Use output folder path instead of file's dir path  
    const folderPath = path.join(outputFolder, path.dirname(filePath));
    filePath = path.join(outputFolder, filePath);

    try {
        fs.mkdirSync(folderPath, { recursive: true });
        // fs.writeFileSync(filePath, contents);
        writeFile(filePath, contents, (err) => { console.log(err); });
        console.log('Created file:', filePath);
    } catch (err) {
        console.error('Error creating file:', err);
    }
}


// Function to extract filenames recursively
function extractFilenames(text) {
    const regex = /\*\*(.*?)\*\*/g;
    const filenames = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
        filenames.push(match[1].trim());
    }

    return filenames;
}

// Recursive function to extract filenames and code blocks from directory and subdirectories
function extractFilenamesAndCodeRecursively(directoryPath, baseDirectory = '') {
    const files = fs.readdirSync(directoryPath);

    const results = [];

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);
        const relativePath = path.join(baseDirectory, file);

        if (stats.isDirectory()) {
            results.push(...extractFilenamesAndCodeRecursively(filePath, relativePath));
        } else if (stats.isFile() && path.extname(file) === '.txt') {
            const content = fs.readFileSync(filePath, 'utf8');
            const matches = content.matchAll(/\*\*(.*?)\*\*([\s\S]*?)```([\s\S]*?)```/g);

            for (const match of matches) {
                const filename = path.join(baseDirectory, match[1].trim());
                const code = match[3].trim();
                results.push({ filename, code });
            }
        }
    });

    return results;
}


