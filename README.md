# Setup vcpkg

Setup vcpkg with VCPKG_ROOT, VCPKG_DEFAULT_TRIPLET, asset caching and binary caching.

## Inputs

### `VCPKG_ROOT`

[VCPKG_ROOT](https://learn.microsoft.com/en-us/vcpkg/users/config-environment#vcpkg_root). Default value is `"$VCPKG_INSTALLATION_ROOT"`.

### `VCPKG_DEFAULT_TRIPLET`
[VCPKG_DEFAULT_TRIPLET](https://learn.microsoft.com/en-us/vcpkg/users/config-environment#vcpkg_default_triplet). Default value is `""`.

## Side effects

- export `VCPKG_ROOT`. That's to say you can access it by bash's `$VCPKG_ROOT` or action's `${{ env.VCPKG_ROOT }}`.
- export `VCPKG_DOWNLOADS`, which value is `$GITHUB_WORKSPACE/vcpkg_downloads`.
- export `VCPKG_DEFAULT_TRIPLET`.
- export `VCPKG_DEFAULT_BINARY_CACHE`, which value is `$GITHUB_WORKSPACE/vcpkg_binary_cache`.
- restore vcpkg cache with key `setup-vcpkg-$RUNNER_OS-`.
- ...
- exec post script. cache `VCPKG_DOWNLOADS` and `VCPKG_DEFAULT_BINARY_CACHE` to a single archive with the key `setup-vcpkg-$RUNNER_OS-$sha256sum`. `sha256sum` is caculated according to `VCPKG_DOWNLOADS` and `VCPKG_DEFAULT_BINARY_CACHE`.

## Outputs

Nothing.

## Example usage

```yaml
- uses: mkckr0/setup-vcpkg@v1.0.0
  with:
    VCPKG_DEFAULT_TRIPLET: 'x64-windows-static-md'
    
- name: Install deps via vcpkg
  run: vcpkg install asio spdlog
```

## Known issues

### CMake can't find installed packages via vcpkg on Windows.
The Visual Studio of Github Hosted Runner has a preinstalled vcpkg at `C:\Program Files\Microsoft Visual Studio\2022\Enterprise\VC\vcpkg`. If you run `vcvarsall.bat` or `VsDevCmd.bat`, it will change `VCPKG_ROOT` to that version. If your `CMakeLists.txt` or `CMakePresets.json` use `VCPKG_ROOT` to locate the `vcpkg.cmake`, the issue will happen.  
The simple solution is to reset `VCPKG_ROOT` manually.
```yml
- name: CMake Configure & Build
    run: |
      ${{ runner.os == 'Windows' && '&"$(vswhere -property installationPath)\Common7\Tools\Launch-VsDevShell.ps1" -Arch amd64 -HostArch amd64 -SkipAutomaticLocation' || ''}}
      ${{ runner.os == 'Windows' && '$env:VCPKG_ROOT=$env:VCPKG_INSTALLATION_ROOT' || '' }}
      cmake --preset windows-Release
      cmake --build --preset windows-Release
```