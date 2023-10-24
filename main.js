import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as cache from '@actions/cache';
import * as process from 'node:process';

try {
    // VCPKG_ROOT
    const vcpkgRoot = process.env.VCPKG_INSTALLATION_ROOT;
    core.exportVariable('VCPKG_ROOT', vcpkgRoot);

    // VCPKG_DEFAULT_TRIPLET
    const vcpkgDefaultTriplet = core.getInput('VCPKG_DEFAULT_TRIPLET');
    core.exportVariable('VCPKG_DEFAULT_TRIPLET', vcpkgDefaultTriplet);

    // VCPKG_DEFAULT_BINARY_CACHE
    const vcpkgDefaultBinaryCache = `${process.env.RUNNER_TEMP}/vcpkg_binary_cache`;
    core.exportVariable('VCPKG_DEFAULT_BINARY_CACHE', vcpkgDefaultBinaryCache);
    await exec.exec(`mkdir ${vcpkgDefaultBinaryCache}`)

    // Restore Cache
    const cachePaths = [
        vcpkgRoot,
        vcpkgDefaultBinaryCache,
    ];
    const keyPrefix = `setup-vcpkg-${process.env.RUNNER_OS}-`;
    await cache.restoreCache(cachePaths, keyPrefix);
    core.saveState('cachePaths', cachePaths);
    core.saveState('keyPrefix', keyPrefix);

} catch (error) {
    core.setFailed(error.stack);
}
