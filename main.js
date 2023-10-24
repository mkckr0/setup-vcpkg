import core from '@actions/core';
import exec from '@actions/exec';
import cache from '@actions/cache';
import process from 'node:process';

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
    const restoryKeys = [
        keyPrefix,
    ];
    await cache.restoreCache(cachePaths, undefined, restoryKeys);
    core.saveState('cachePaths', cachePaths);
    core.saveState('keyPrefix', keyPrefix);

} catch (error) {
    core.setFailed(error.message);
}
