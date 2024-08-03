import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs-extra';
import readline from 'readline';
import path from 'path';

const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
const outputFolder = './outputgpt';

async function generateCustomPrompt(components, chat) {
    let prompt = `
Please provide the code implementation for the following requirement. Include the complete code along with the appropriate folder and file names for each code segment. Use '// Foldername:' to indicate folder names and '// Filename:' to indicate file names. Ensure that all files and folders are named correctly according to the conventions of the programming language used. Also include a README file with instructions on how to run the project.

Requirement: Write a ${components.type} application in ${components.language} for ${components.layer} with the following structure:
`;

    let remainingComponents = true;
    while (remainingComponents) {
        const componentPrompt = `
        Given the type of application "${components.type}" in the language "${components.language}" with a focus on "${components.layer}", what are the essential components or modules that should be included in the project?
        `;
        const componentResult = await askGeminiForComponents(componentPrompt, chat);

        if (componentResult) {
            for (let component of componentResult) {
                const includeComponent = await askQuestion(`Do you want to include ${component}? (yes/no): `);
                if (includeComponent) {
                    components.modules.push(component);
                    prompt += `- **${component}**: Include the ${component} module in the project.\n`;
                }
            }
        }

        remainingComponents = await askQuestion('Do you want to add more components? (yes/no): ');
    }

    return prompt;
}

async function askGeminiForComponents(prompt, chat) {
    const result = await chat.sendMessage(prompt);
    const text = await result.response.text();
    return text.split('\n').map(line => line.trim()).filter(line => line);
}

async function processText(text, outputFolder) {
    const lines = text.split('\n');
    let currentPath = outputFolder;
    let currentContent = [];

    for (const line of lines) {
        if (line.startsWith('// Foldername:')) {
            const folderName = line.split(':')[1].trim();
            currentPath = path.join(currentPath, folderName);
            await fs.ensureDir(currentPath);
            console.log(`Folder created/ensured: ${currentPath}`);
        } else if (line.startsWith('// Filename:')) {
            if (currentContent.length > 0) {
                const fileName = currentContent[0].split(':')[1].trim();
                const filePath = path.join(currentPath, fileName);
                await fs.outputFile(filePath, currentContent.slice(1).join('\n'));
                console.log(`File written/overwritten: ${filePath}`);
                currentContent = [];
            }
            currentContent.push(line);
        } else {
            currentContent.push(line);
        }
    }

    if (currentContent.length > 0) {
        const fileName = currentContent[0].split(':')[1].trim();
        const filePath = path.join(currentPath, fileName);
        await fs.outputFile(filePath, currentContent.slice(1).join('\n'));
        console.log(`File written/overwritten: ${filePath}`);
    }
}

async function askQuestion(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(answer.trim().toLowerCase() === 'y' || answer.trim().toLowerCase() === 'yes');
        });
    });
}


async function run() {
    try {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const components = {
            type: '',
            language: '',
            layer: '',
            modules: []
        };

        components.type = await new Promise(resolve => rl.question('What type of project do you want to create? (e.g., web, mobile, desktop): ', resolve));
        components.language = await new Promise(resolve => rl.question('Which programming language do you want to use? (e.g., JavaScript, Python, Java): ', resolve));
        components.layer = await new Promise(resolve => rl.question('What layer of the architecture do you want to work on? (frontend/backend): ', resolve));

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const chat = model.startChat();
        const customPrompt = await generateCustomPrompt(components, chat);

        const result = await chat.sendMessage(customPrompt);
        const text = await result.response.text();

        console.log(text);

        await fs.ensureDir(outputFolder);
        await fs.appendFile(path.join(outputFolder, 'chatoutput.txt'), `${text}\n`);
        await processText(text, outputFolder);

        rl.close();
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

run().catch(console.error);
