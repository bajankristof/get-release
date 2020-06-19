# GitHub Action - Get GitHub release

This action outputs information about a release such as the release ID, release name, upload URL and others.

## Inputs

- **tag** (required) - The tag (name) of the release. Default `"@latest"`.

There are a couple of "magic" tags are available:
- `"@latest"` - The latest release will be retrieved (see the examples).
- `"@context"` - The release will be matched against the current context, so that if the action originates from a tag push, that tag will be used (see the examples below).

Any other tag will be used as provided (eg.: `v1.0.0`).

## Outputs

- **release_id** - The ID of the release
- **release_name** - The name of the release
- **html_url** - The HTML URL of the release that users can visit using a web browser
- **upload_url** - The URL that can be used to upload assets to the release, for example using the @actions/upload-release-asset GitHub action
- **assets_url** - The URL to retrieve the assets that were uploaded to the release
- **tarball_url** - The URL from where one can download the tar archive of the source
- **zipball_url** - The URL from where one can download the zip archive of the source

## Examples

@context
```yml
on:
  push:
    tags: 
      - "*"

env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: bajankristof/get-release@master
      id: release
      with:
        tag: "@context"
    - run: echo "${{ steps.release.outputs.upload_url }}"
```

@latest
```yml
on:
  push:
    branches: [ master ]

env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - run: echo "::set-env name=RELEASE_TAG::$(sh your-release-tag.sh)"
    - uses: actions/create-release@v1
      with:
        tag_name: ${{ env.RELEASE_TAG }}
        release_name: v${{ env.RELEASE_TAG }}
        draft: false
        prerelease: false
  
  next:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: bajankristof/get-release@master
      id: release
      # this can be omitted as the default tag is "@latest"
      with:
        tag: "@latest"
    - run: echo "${{ steps.release.outputs.upload_url }}"
```
