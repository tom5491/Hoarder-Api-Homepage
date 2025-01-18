require('dotenv').config();
const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3091;

// Utility function to execute a CLI command
const runCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(stderr || error.message);
            } else {
                resolve(stdout.trim());
            }
        });
    });
};

app.get('/api/summary', async (req, res) => {
    try {
        const apiKey = process.env.HOARDER_API_KEY;
        const serverAddr = process.env.HOARDER_SERVER_ADDR;

        const listsOutput = await runCommand(`hoarder lists list --api-key ${apiKey} --server-addr ${serverAddr} --json`);
        const lists = JSON.parse(listsOutput);
        let listArray = lists.lists;
        console.log({ listArray });

        let totalLists = listArray.length;
        let totalItems = 0;

        const bookmarksOutput = await runCommand(
            `hoarder bookmarks list --api-key ${apiKey} --server-addr ${serverAddr} --json`
        );
        const bookmarks = JSON.parse(bookmarksOutput);
        totalItems += bookmarks.length;

        res.json({
            totalLists,
            totalItems,
        });
    } catch (error) {
        res.status(500).send(`Error accessing Hoarder CLI: ${error}`);
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});