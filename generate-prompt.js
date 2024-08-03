import fs from 'fs-extra';
import readline from 'readline';

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
const outputFile = './chatoutput.txt';

async function askGeminiForFolderStructure(components, chat) {
    const structurePrompt = `
    What is the best production-ready folder structure for a ${components.type} application in ${components.language} focusing on ${components.layer}? 
    Please provide a detailed folder structure with explanations for each directory.
    `;
    const result = await chat.sendMessage(structurePrompt);
    return await result.response.text();
}

async function generateCustomPrompt(components, chat) {
    let prompt = `
Please provide the code implementation for the following requirement. Use the exact format specified below:

1. Start each folder with "// Folder: <folder_name>"
2. Start each file with "// File: <file_name>"
3. Provide the complete code for each file
4. End each file with "// End of file: <file_name>"
5. Include a README.md file with instructions on how to run the project

Requirement: Write a ${components.type} application in ${components.language} for ${components.layer} with the following structure:
`;

    const folderStructure = await askGeminiForFolderStructure(components, chat);

    prompt += `
Please use the following folder structure for the project:

${folderStructure}

Now, provide the implementation based on this structure and the following components:
${components.modules.map(module => `- ${module}`).join('\n')}
`;

    return prompt;
}

async function askGeminiForComponents(prompt, chat) {
    const result = await chat.sendMessage(prompt);
    const text = await result.response.text();
    return text.split('\n').map(line => line.trim()).filter(line => line);
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
                    }
                }
            }

            remainingComponents = await askQuestion('Do you want to add more components? (yes/no): ');
        }

        const customPrompt = await generateCustomPrompt(components, chat);

        const result = await chat.sendMessage(customPrompt);
        const text = await result.response.text();

        console.log("Generated content:");
        console.log(text);

        await fs.writeFile(outputFile, text);
        console.log(`Output written to ${outputFile}`);

        rl.close();
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

run().catch(console.error);
