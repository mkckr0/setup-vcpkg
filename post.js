import * as core from '@actions/core';
import * as cache from '@actions/cache';
import * as glob from '@actions/glob';

try {
    const cachePaths = JSON.parse(core.getState('cachePaths'));
    core.debug(JSON.stringify(cachePaths));
    const hash = await glob.hashFiles(cachePaths.join('\n'));
    const keyPrefix = core.getState('keyPrefix');
    const key = `${keyPrefix}${hash}`;
    await cache.saveCache(cachePaths, key);
    core.info(`Cache saved with the key: ${key}`);
} catch (error) {
    core.setFailed(error.message);
}