import * as core from '@actions/core';
import * as cache from '@actions/cache';
import * as glob from '@actions/glob';

try {
    const cachePaths = JSON.parse(core.getState('cachePaths'));
    core.info(JSON.stringify(cachePaths));
    const hash = await glob.hashFiles(cachePaths.join('\n'));
    const keyPrefix = core.getState('keyPrefix');
    const primaryKey = `${keyPrefix}${hash}`;
    if (primaryKey === core.getState('primaryKey')) {
        core.info(`Cache is unchanged with primary key ${primaryKey}`);
    } else {
        await cache.saveCache(cachePaths, key);
        core.info(`Cache saved with the key: ${key}`);
    }
} catch (error) {
    core.setFailed(error.message);
}