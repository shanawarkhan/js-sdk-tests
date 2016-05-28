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

#### Download the SDK

Running the SDK requires that a version of the SDK be downloaded locally.

```bash
CDN_URL=http://affdex-sdk-dist.s3-website-us-east-1.amazonaws.com/js
BRANCH=nightly
SRC_URL=${CDN_URL}/${BRANCH}
mkdir src
wget ${SRC_URL}/affdex.js -O src/affdex.js
wget ${SRC_URL}/affdex-worker.js -O src/affdex-worker.js
wget ${SRC_URL}/affdex-native-bindings.js -O src/affdex-native-bindings.js
wget ${SRC_URL}/affdex-native-bindings.data -O src/affdex-native-bindings.data
wget ${SRC_URL}/affdex-native-bindings.asm.js -O src/affdex-native-bindings.asm.js
```

#### Run the tests

```bash
npm test
```
