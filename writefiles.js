// Run this file :- node writefiles.js chatoutput.txt output 

import fs from 'fs-extra';
import path from 'path';
import readline from 'readline';

async function parseStructure(inputFile) {
    const text = await fs.readFile(inputFile, 'utf8');
    const lines = text.split('\n');
    let structure = {};
    let currentPath = [];
    let currentDepth = 0;
    let currentFile = null;

    for (const line of lines) {
        const depth = line.search(/\S/);
        if (line.includes('Foldername:')) {
            currentFile = null;
            const folderName = line.split(':')[1].trim();
            if (depth === 0) {
                currentPath = [folderName];
            } else if (depth > currentDepth) {
                currentPath.push(folderName);
            } else {
                currentPath = [...currentPath.slice(0, depth), folderName];
            }
            currentDepth = depth;
            let current = structure;
            for (const folder of currentPath) {
                current[folder] = current[folder] || {};
                current = current[folder];
            }
        } else if (line.includes('Filename:')) {
            const fileNameMatch = line.match(/Filename:\s*([^(]+)/);
            if (fileNameMatch) {
                const fileName = fileNameMatch[1].trim();
                let current = structure;
                for (const folder of currentPath) {
                    current = current[folder];
                }
                current[fileName] = [];
                currentFile = fileName;
            }
        } else if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
            // This is a header or comment line, skip it
            continue;
        } else if (currentFile && !line.trim().startsWith('```')) {
            let current = structure;
            for (const folder of currentPath) {
                current = current[folder];
            }
            current[currentFile].push(line);
        }
    }

    return structure;
}

function displayStructure(structure, prefix = '') {
    const entries = Object.entries(structure);
    entries.forEach(([key, value], index) => {
        const isLast = index === entries.length - 1;
        const line = isLast ? '└── ' : '├── ';
        console.log(`${prefix}${line}${key}${Array.isArray(value) ? ` (${value.length} lines)` : ''}`);
        if (!Array.isArray(value)) {
            displayStructure(value, prefix + (isLast ? '    ' : '│   '));
        }
    });
}

async function promptUser(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => rl.question(question, ans => {
        rl.close();
        resolve(ans.toLowerCase() === 'y' || ans.toLowerCase() === 'yes');
    }));
}

async function writeStructure(structure, currentPath) {
    for (const [key, value] of Object.entries(structure)) {
        const fullPath = path.join(currentPath, key);
        if (Array.isArray(value)) {
            await fs.outputFile(fullPath, value.join('\n'));
            console.log(`File written: ${fullPath}`);
        } else {
            await fs.ensureDir(fullPath);
            console.log(`Directory created: ${fullPath}`);
            await writeStructure(value, fullPath);
        }
    }
}

async function writeFiles(inputFile, outputFolder) {
    const structure = await parseStructure(inputFile);
    console.log("Parsed file structure:");
    displayStructure(structure);

    const proceed = await promptUser("Is this structure correct? (y/n): ");

    if (proceed) {
        console.log("Writing files...");
        await writeStructure(structure, outputFolder);
        console.log("Files written successfully.");
    } else {
        console.log("Operation cancelled.");
    }
}

if (process.argv[2] && process.argv[3]) {
    writeFiles(process.argv[2], process.argv[3]).catch(console.error);
}

export default writeFiles;
