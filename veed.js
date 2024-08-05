import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORAGE_FILE = path.join(__dirname, 'storage.json');

class VeedAutomation {
    constructor(isHeadless, words) {
        this.isHeadless = isHeadless;
        this.initialWords = words;
        this.downloadPath = path.join(__dirname, 'downloads');
        this.videosPath = path.join(__dirname, 'videos');
        this.chromeOptions = this.setChromeOptions();
        this.pendingWords = [];
        this.completedWords = new Set();
        this.failedWords = new Set();
        this.initStorage();
    }

    async initStorage() {
        try {
            const data = await fs.readFile(STORAGE_FILE, 'utf8');
            const storedData = JSON.parse(data);
            this.pendingWords = storedData.pendingWords || [];
            this.completedWords = new Set(storedData.completedWords || []);
            this.failedWords = new Set(storedData.failedWords || []);
            this.addNewWords(this.initialWords);
        } catch (error) {
            console.log('No existing storage found, initializing new.');
            this.addNewWords(this.initialWords);
            await this.saveProgress();
        }
    }

    addNewWords(words) {
        for (const word of words) {
            if (!this.completedWords.has(word) && !this.pendingWords.includes(word)) {
                this.pendingWords.push(word);
            }
        }
    }

    async saveProgress() {
        const data = {
            pendingWords: this.pendingWords,
            completedWords: Array.from(this.completedWords),
            failedWords: Array.from(this.failedWords)
        };
        await fs.writeFile(STORAGE_FILE, JSON.stringify(data, null, 2));
        console.log('Progress saved.');
    }

    setChromeOptions() {
        const options = new chrome.Options();
        if (this.isHeadless) {
            options.addArguments('--headless', '--disable-gpu');
        }
        const chromeUserDataDir = 'C:/Users/vykanand/Library/Application Support/Google/Chrome/Default';
        options.addArguments(`user-data-dir=${chromeUserDataDir}`);

        options.setUserPreferences({
            'download.default_directory': this.downloadPath,
            'download.prompt_for_download': false,
            'download.directory_upgrade': true,
            'safebrowsing.enabled': true
        });

        return options;
    }

    async waitForElement(locator, timeout, description) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            try {
                const element = await this.driver.wait(until.elementLocated(locator), timeout);
                await this.driver.wait(until.elementIsVisible(element), timeout);
                await this.driver.wait(until.elementIsEnabled(element), timeout);
                console.log(`Element found and clickable: ${description}`);
                return element;
            } catch (error) {
                console.log(`Element not found or not clickable: ${description}`);
                await this.driver.sleep(5000);
            }
        }
        throw new Error(`Timeout: ${description} not found or not clickable within ${timeout}ms`);
    }

    async waitForDownloadAndMove(timeout = 120000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const files = await fs.readdir(this.downloadPath);
            const downloadedFile = files.find(file => file.endsWith('.mp4'));
            if (downloadedFile) {
                const sourcePath = path.join(this.downloadPath, downloadedFile);
                const destPath = path.join(this.videosPath, downloadedFile);
                await fs.rename(sourcePath, destPath);
                console.log(`Video moved to: ${destPath}`);
                return downloadedFile;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        throw new Error('Download timeout');
    }

    async handleVideoCreation(word) {
        const sentence = `5 amazing facts about ${word}`;
        console.log(`Generating video for: ${sentence}`);
        try {
            await this.driver.get('https://www.veed.io/tools/ai-video/text-to-video');
            await this.generateVideoForSentence(sentence);
            this.completedWords.add(word);
            await this.saveProgress();
            console.log(`Video creation successful for: ${sentence}`);
            console.log(`Pending words: ${this.pendingWords.length}, Completed words: ${this.completedWords.size}`);
        } catch (error) {
            console.error(`Error generating video for ${sentence}: ${error}`);
            this.failedWords.add(word);
            await this.saveProgress();
            throw error;
        }
    }

    async generateVideoForSentence(sentence) {
        await this.waitForElement(By.name('prompt'), 60000, 'Prompt input');
        const promptInput = await this.driver.findElement(By.name('prompt'));
        await promptInput.sendKeys(sentence);

        const submitButton = await this.driver.findElement(By.css('button[type="submit"]'));
        await submitButton.click();

        console.log('Waiting for video generation...');

        const generationAnchor = await this.waitForElement(
            By.css('[data-testid="@text-to-video/generation-anchor"]'),
            60000,
            'Video generation anchor'
        );

        await this.driver.executeScript("arguments[0].scrollIntoView(true);", generationAnchor);
        await this.driver.sleep(1000);

        await generationAnchor.click();

        const currentWindowHandle = await this.driver.getWindowHandle();
        await this.driver.wait(async () => (await this.driver.getAllWindowHandles()).length > 1, 60000);
        const handles = await this.driver.getAllWindowHandles();
        const newWindowHandle = handles.find(handle => handle !== currentWindowHandle);
        await this.driver.switchTo().window(newWindowHandle);

        await this.driver.wait(until.urlContains('edit'), 60000);

        await this.driver.switchTo().window(currentWindowHandle);
        await this.driver.close();
        await this.driver.switchTo().window(newWindowHandle);

        const publishButton = await this.waitForElement(
            By.css('[data-testid="@header-controls/publish-button"]'), 60000, 'Publish button');
        await publishButton.click();

        const exportButton = await this.waitForElement(
            By.css('[data-testid="@export/export-button"]'),
            60000,
            'Export button'
        );
        await exportButton.click();

        await this.driver.sleep(5000);
        await exportButton.click();

        let downloadButton;
        const downloadButtonLocator = By.css('[data-testid="Download-button-bubble"]');
        while (!downloadButton) {
            try {
                downloadButton = await this.driver.wait(until.elementIsEnabled(await this.driver.findElement(downloadButtonLocator)), 60000);
            } catch (error) {
                console.log('Download button not clickable yet, retrying...');
                await this.driver.sleep(2000);
            }
        }

        await downloadButton.click();
        const downloadmp4 = By.css('[data-testid="MP4 download button"]');
        await this.driver.findElement(downloadmp4).click();
        console.log('Clicked download button, download process started');

        await fs.mkdir(this.videosPath, { recursive: true });

        console.log('Waiting for download to complete...');
        try {
            const downloadedFile = await this.waitForDownloadAndMove();
            console.log(`Video downloaded and moved successfully: ${downloadedFile}`);
        } catch (error) {
            console.error('Download failed:', error);
            this.failedWords.add(sentence);
            await this.saveProgress();
        }
    }

    async createTextToVideo() {
        this.driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(this.chromeOptions)
            .build();
        await this.driver.manage().window().maximize();

        try {
            await this.driver.get('https://www.veed.io/login');
            await this.driver.wait(until.urlContains('https://www.veed.io/workspaces/6ada1d74-455c-4d8c-9944-14497600cad0/home'));

            console.log('Login successful. Proceeding with text-to-video creation.');

            while (this.pendingWords.length > 0) {
                const word = this.pendingWords.shift();
                try {
                    await this.handleVideoCreation(word);
                } catch (error) {
                    console.error(`Failed to create video for: ${word}. Retrying...`);
                    this.pendingWords.push(word); // Re-add to pending words
                }
                await this.saveProgress();
            }
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            await this.driver.quit();
        }
    }
}

const isHeadless = process.argv.some(arg => arg === '--headless');
const words = ["Sunset over Santorini", "Lupine Fields", "African Savannah", "Gorges du Verdon", "Neon Lights of Tokyo"];
const veedAutomation = new VeedAutomation(isHeadless, words);
veedAutomation.createTextToVideo();
