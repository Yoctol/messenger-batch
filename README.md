# messenger-batch

[![npm](https://img.shields.io/npm/v/messenger-batch.svg?style=flat-square)](https://www.npmjs.com/package/messenger-batch)
[![Build Status](https://travis-ci.org/Yoctol/messenger-batch.svg?branch=master)](https://travis-ci.org/Yoctol/messenger-batch)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> Gracefully batching messenger requests.

## Installation

```sh
npm install messenger-batch
```

## Usage

```js
const { MessengerClient, MessengerBatch } = require('messaging-api-messenger');
const { MessengerBatchQueue } = require('messenger-batch');

const client = MessengerClient.connect({
  accessToken: ACCESS_TOKEN,
});

const queue = new MessengerBatchQueue(client);

(async () => {
  await queue.push(
    MessengerBatch.createText('psid', 'hello!');
  );

  await queue.push(
    MessengerBatch.createMessage('psid', {
      attachment: {
        type: 'image',
        payload: {
          url:
            'https://cdn.free.com.tw/blog/wp-content/uploads/2014/08/Placekitten480-g.jpg',
        },
      },
    })
  );

  const profile = await queue.push({
    method: 'GET',
    relative_url: 'psid',
  });

  console.log(profile);
})();
```

## Options

### delay

Default: `1000`.

### retryTimes

Default: `0`.

### shouldRetry

Default: `() => true`.

## License

MIT © [Yoctol](https://github.com/Yoctol/messenger-batch)
