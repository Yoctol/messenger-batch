# messenger-batch

[![npm](https://img.shields.io/npm/v/messenger-batch.svg?style=flat-square)](https://www.npmjs.com/package/messenger-batch)
[![Build Status](https://travis-ci.org/Yoctol/messenger-batch.svg?branch=master)](https://travis-ci.org/Yoctol/messenger-batch)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Installation

```sh
npm install messenger-batch
```

## Usage

```js
const { MessengerBatchQueue } = require('messenger-batch');

const queue = new MessengerBatchQueue(client);

queue.push();
```

## Options

### delay

Default: `1000`.

## License

MIT © [Yoctol](https://github.com/Yoctol/messenger-batch)
