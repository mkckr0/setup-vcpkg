import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as cache from '@actions/cache';
import * as process from 'node:process';
import { isUndefined } from 'node:util';

try {
    // VCPKG_ROOT
    const vcpkgRoot = process.env.VCPKG_INSTALLATION_ROOT;
    core.exportVariable('VCPKG_ROOT', vcpkgRoot);
    core.info(`VCPKG_ROOT=${vcpkgRoot}`);

    // VCPKG_DOWNLOADS
    const vcpkgDownloads = core.toPlatformPath(`${process.env.GITHUB_WORKSPACE}/downloads`);
    core.exportVariable('VCPKG_DOWNLOADS', vcpkgDownloads);
    await exec.exec(`mkdir ${vcpkgDownloads}`);
    core.info(`VCPKG_DOWNLOADS=${vcpkgDownloads}`);

    // VCPKG_DEFAULT_TRIPLET
    const vcpkgDefaultTriplet = core.getInput('VCPKG_DEFAULT_TRIPLET');
    core.exportVariable('VCPKG_DEFAULT_TRIPLET', vcpkgDefaultTriplet);
    core.info(`VCPKG_DEFAULT_TRIPLET=${vcpkgDefaultTriplet}`);

    // VCPKG_DEFAULT_BINARY_CACHE
    const vcpkgDefaultBinaryCache = core.toPlatformPath(`${process.env.GITHUB_WORKSPACE}/vcpkg_binary_cache`);
    core.exportVariable('VCPKG_DEFAULT_BINARY_CACHE', vcpkgDefaultBinaryCache);
    await exec.exec(`mkdir ${vcpkgDefaultBinaryCache}`);
    core.info(`VCPKG_DEFAULT_BINARY_CACHE=${vcpkgDefaultBinaryCache}`);

    // Restore Cache
    const cachePaths = [
        vcpkgDownloads,
        vcpkgDefaultBinaryCache,
    ];
    core.saveState('cachePaths', cachePaths);
    const keyPrefix = `setup-vcpkg-${process.env.RUNNER_OS}-`;
    core.saveState('keyPrefix', keyPrefix);
    const key = await cache.restoreCache(cachePaths, keyPrefix, [keyPrefix]);
    if (key === undefined) {
        core.info(`Cache not found for input keys: ${keyPrefix}`);
    } else {
        core.info('Cache restored successfully');
        core.info(`Cache restored from key: ${key}`);
    }
} catch (error) {
    core.setFailed(error.stack);
}
