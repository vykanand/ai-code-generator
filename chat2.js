import { genAI } from "./utils/common.js";
import fs from 'fs';
import readline from 'readline';
import { processText } from "./generate2.js";

export const outputFolder = './output';

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    async function getNextInput() {
        return new Promise((resolve, reject) => {
            rl.question('Enter your next requirement: ', (message) => {
                resolve(message);
            });
        });
    }

    while (true) {
        const msg = await getNextInput();

        if (msg === 'exit') {
            rl.close();
            break;
        }
        let msgAppend = "generate code with path " + msg;
        const result = await chat.sendMessage(msgAppend);
        const response = result.response;
        const text = await response.text();

        console.log(text);

        // Append the output to a text file
        fs.appendFileSync('chatoutput.txt', `${text}\n`);
        await processText(text, outputFolder);

        // Continue the loop
    }
}

run();
