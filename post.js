import core from '@actions/core';
import exec from '@actions/exec';
import cache from '@actions/cache';
import process from 'node:process';
import glob from '@actions/glob';

try {
    const cachePaths = JSON.parse(core.getState('cachePaths'));
    const hash = await glob.hashFiles(cachePaths.join('\n'));
    const keyPrefix = core.getState('keyPrefix');
    await cache.saveCache(cachePaths, `${keyPrefix}${hash}`);

} catch (error) {
    core.setFailed(error.message);
}