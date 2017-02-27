# js-sdk-tests
Affdex Javascript SDK tests

[![Build Status](https://travis-ci.org/Affectiva/js-sdk-tests.svg?branch=master)](https://travis-ci.org/Affectiva/js-sdk-tests)

This repository contains the unit tests that are used to verify the builds for the Affdex javascript SDK
Built using Jasmine run on TravisCI on both Chrome and Firefox.

#### Requirements
- Jasmine
- Karma
- NodeJS
- Chrome
- Firefox

#### Install the requirements

Install node and required browsers:

**OSX**

```bash
brew install node wget
```

Install [Firefox](https://www.mozilla.org/en-US/firefox/new/) and [Chrome](https://www.google.com/chrome/browser/desktop/)

**Ubuntu Trusty**

```bash
sudo apt-get update
sudo apt-get --yes --force-yes install node chromium-chromedriver firefox

```

After installing node, and required browsers, install the required node modules

```bash
npm install
```

#### Setup the SDK

Running the tests requires that a version of the SDK to be hosted.

```bash
CDN_URL=http://s3.amazonaws.com/affdex-sdk-dist
BRANCH=nightly
export AFFDEX_JS_SDK_URL=${CDN_URL}/js/${BRANCH}
```

The tests also require access to test files
```bash
export TEST_DATA_SRV_URL=${CDN_URL}/testdata
```

#### Run the tests

```bash
npm test
```
