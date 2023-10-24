import * as core from '@actions/core';
import * as cache from '@actions/cache';
import * as glob from '@actions/glob';

async function run() {
    try {
        const cachePaths = JSON.parse(core.getState('cachePaths'));
        const hash = await glob.hashFiles(cachePaths.join('\n'));
        const keyPrefix = core.getState('keyPrefix');
        const primaryKey = `${keyPrefix}${hash}`;
        const matchedKey = core.getState('matchedKey');
        if (primaryKey === matchedKey) {
            core.info(`Cache is unchanged with the key: ${primaryKey}`);
        } else {
            await cache.saveCache(cachePaths, primaryKey);
            core.info(`Cache saved with the key: ${primaryKey}`);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();