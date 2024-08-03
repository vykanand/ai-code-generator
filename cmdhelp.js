import { genAI } from "./utils/common.js";
import readline from 'readline';
import chalk from 'chalk';

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    async function getNextInput() {
        return new Promise((resolve) => {
            rl.question(chalk.blue('Enter your question: '), (question) => {
                resolve(question.trim()); // Trim to remove any extra whitespace
            });
        });
    }

    while (true) {
        let question = await getNextInput();

        if (question.toLowerCase() === 'exit') {
            rl.close();
            break;
        }

        // Check if the question is empty
        if (!question) {
            console.log(chalk.red("Question cannot be empty. Please enter a valid question."));
            continue; // Skip this iteration and prompt again
        }

        try {
            // Send the question to the AI model and get the response
            const result = await chat.sendMessage(question);
            const response = await result.response.text();

            console.log(chalk.green(`Answer:\n${response}`));
        } catch (error) {
            console.log(chalk.red(`Error: ${error.message}`));
        }
    }
}

run();
