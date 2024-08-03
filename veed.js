import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function waitForElementToBeClickable(driver, locator, timeout) {
    const element = await driver.wait(until.elementLocated(locator), timeout);
    await driver.wait(until.elementIsVisible(element), timeout);
    await driver.wait(until.elementIsEnabled(element), timeout);
    return element;
}

async function findElementWithLogging(driver, locator, description) {
    try {
        const element = await waitForElementToBeClickable(driver, locator, 20000);
        console.log(`Element found and clickable: ${description}`);
        return element;
    } catch (error) {
        console.log(`Element not found or not clickable: ${description}`);
        return null;
    }
}

async function waitForElementWithTimeout(driver, locator, timeout, description) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const element = await findElementWithLogging(driver, locator, description);
        if (element) return element;
        await driver.sleep(5000);
    }
    throw new Error(`Timeout: ${description} not found or not clickable within ${timeout}ms`);
}

async function waitForDownloadAndMove(downloadPath, videosPath, timeout = 120000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const files = await fs.readdir(downloadPath);
        const downloadedFile = files.find(file => file.endsWith('.mp4'));
        if (downloadedFile) {
            const sourcePath = path.join(downloadPath, downloadedFile);
            const destPath = path.join(videosPath, downloadedFile);
            await fs.rename(sourcePath, destPath);
            console.log(`Video moved to: ${destPath}`);
            return downloadedFile;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    throw new Error('Download timeout');
}

async function createTextToVideo(isHeadless) {
    const downloadPath = path.join(__dirname, 'downloads');
    const videosPath = path.join(__dirname, 'videos');
    const options = new chrome.Options();
    options.setUserPreferences({
        'download.default_directory': downloadPath,
        'download.prompt_for_download': false,
        'download.directory_upgrade': true,
        'safebrowsing.enabled': true
    });

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        await driver.get('https://www.veed.io/tools/ai-video/text-to-video');

        const acceptCookies = await findElementWithLogging(driver, By.css('[id="onetrust-accept-btn-handler"]'), 10000, 'Submit button');
        await acceptCookies.click();

        const promptInput = await waitForElementWithTimeout(driver, By.name('prompt'), 20000, 'Prompt input');
        await promptInput.sendKeys('Amazing 5 facts about Amazon River');

        const submitButton = await findElementWithLogging(driver, By.css('button[type="submit"]'), 'Submit button');
        await submitButton.click();

        console.log('Waiting for video generation...');



        const generationAnchor = await waitForElementWithTimeout(
            driver,
            By.css('[data-testid="@text-to-video/generation-anchor"]'),
            300000,
            'Video generation anchor'
        );

        // New code to handle the click issue
        await driver.wait(until.elementIsVisible(generationAnchor));
        await driver.wait(until.elementIsEnabled(generationAnchor));
        await driver.executeScript("arguments[0].scrollIntoView(true);", generationAnchor);
        await driver.sleep(1000);

        let retries = 3;
        while (retries > 0) {
            try {
                await driver.executeScript("arguments[0].click();", generationAnchor);
                break;
            } catch (error) {
                if (retries === 1) throw error;
                await driver.sleep(1000);
                retries--;
            }
        }

        await driver.sleep(2000);

        const handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[handles.length - 1]);

        await driver.wait(until.urlContains('edit'), 10000);

        const newUrl = await driver.getCurrentUrl();
        console.log('Next page URL:', newUrl);

        await driver.switchTo().window(handles[0]);
        await driver.close();

        await driver.switchTo().window(handles[handles.length - 1]);

        const consentButton = await waitForElementWithTimeout(
            driver,
            By.css('[data-testid="@component/terms-consent-modal/btn"]'),
            10000,
            'Consent button'
        );

        await consentButton.click();
        console.log('Clicked consent button');

        const publishButton = await waitForElementWithTimeout(
            driver,
            By.css('[data-testid="@header-controls/publish-button"]'),
            10000,
            'Publish button'
        );

        await publishButton.click();
        console.log('Clicked publish button');

        const exportButton = await waitForElementWithTimeout(
            driver,
            By.css('[data-testid="@export/export-button"]'),
            10000,
            'Export button'
        );

        await exportButton.click();
        console.log('Clicked export button');

        await driver.sleep(5000);

        let downloadButton;
        const downloadButtonLocator = By.css('[data-testid="Download-button-bubble"]');
        while (!downloadButton) {
            try {
                downloadButton = await driver.wait(until.elementIsEnabled(await driver.findElement(downloadButtonLocator)), 5000);
            } catch (error) {
                console.log('Download button not clickable yet, retrying...');
                await driver.sleep(2000);
            }
        }

        // await downloadButton.click();
        // console.log('Clicked download button, download process started');

        // Wait for 5 seconds
        await driver.sleep(5000);

        // Scan for the signup link and click it
        const signupLink = await waitForElementWithTimeout(
            driver,
            By.css('[data-testid="@mainstep/footer-link/signup"]'),
            10000,
            'login link'
        );
        await signupLink.click();
        console.log('Clicked login link');

        // Enter email
        const emailInput = await waitForElementWithTimeout(
            driver,
            By.css('input[type="email"]'),
            10000,
            'Email input'
        );
        await emailInput.sendKeys('vykanand@gmail.com');
        console.log('Entered email');

        // Click the magic link button
        const magicLinkButton = await waitForElementWithTimeout(
            driver,
            By.css('[data-testid="@login/get-magic-link-btn"]'),
            10000,
            'Magic link button'
        );
        await magicLinkButton.click();
        console.log('Clicked magic link button');



        await fs.mkdir(videosPath, { recursive: true });

        console.log('Waiting for download to complete...');
        try {
            const downloadedFile = await waitForDownloadAndMove(downloadPath, videosPath);
            console.log(`Video downloaded and moved successfully: ${downloadedFile}`);
        } catch (error) {
            console.error('Download failed:', error);
        }

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        // await driver.quit();
    }
}

const isHeadless = process.argv.includes('--headless');
createTextToVideo(isHeadless);
