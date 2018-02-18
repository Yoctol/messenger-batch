const { MessengerBatch } = require('messaging-api-messenger');

const MessengerBatchQueue = require('../MessengerBatchQueue');

const image = {
  attachment: {
    type: 'image',
    payload: {
      url:
        'https://cdn.free.com.tw/blog/wp-content/uploads/2014/08/Placekitten480-g.jpg',
    },
  },
};

let q;

function setup() {
  const timeoutId = 'timeoutId';
  setTimeout.mockReturnValue(timeoutId);
  const client = {
    sendBatch: jest.fn(),
  };
  q = new MessengerBatchQueue(client);
  return {
    client,
    timeoutId,
  };
}

afterEach(() => {
  q.stop();
});

it('should push psid and messages to queue', () => {
  setup();

  q.push(MessengerBatch.createMessage('1412611362105802', image));

  expect(q.queue).toHaveLength(1);
});

it('should flush when length >= 50', async () => {
  const { client } = setup();

  const responses = Array(50)
    .fill(0)
    .map(() => ({
      code: 200,
      body: '{"data": []}',
    }));

  client.sendBatch.mockReturnValue(Promise.resolve(responses));

  for (let i = 0; i < 49; i++) {
    // eslint-disable-next-line no-await-in-loop
    q.push(MessengerBatch.createText('1412611362105802', 'hello'));
  }

  q.push(MessengerBatch.createMessage('1412611362105802', image));

  expect(client.sendBatch.mock.calls).toHaveLength(1);
  expect(client.sendBatch.mock.calls[0][0]).toHaveLength(50);

  expect(client.sendBatch.mock.calls[0][0][49]).toEqual({
    body: {
      message: {
        attachment: {
          payload: {
            url:
              'https://cdn.free.com.tw/blog/wp-content/uploads/2014/08/Placekitten480-g.jpg',
          },
          type: 'image',
        },
      },
      messaging_type: 'UPDATE',
      recipient: { id: '1412611362105802' },
    },
    method: 'POST',
    relative_url: 'me/messages',
  });

  expect(q.queue).toHaveLength(0);
});

it('should flush with 1000 timeout', async () => {
  const { client } = setup();

  const responses = Array(1)
    .fill(0)
    .map(() => ({
      code: 200,
      body: '{"data": []}',
    }));

  client.sendBatch.mockReturnValue(Promise.resolve(responses));

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

  q.push(MessengerBatch.createMessage('1412611362105802', image));

  expect(q.queue).toHaveLength(1);

  const fn = setTimeout.mock.calls[0][0];

  await fn();

  expect(client.sendBatch.mock.calls).toHaveLength(1);
  expect(client.sendBatch.mock.calls[0][0]).toEqual([
    {
      body: {
        message: {
          attachment: {
            payload: {
              url:
                'https://cdn.free.com.tw/blog/wp-content/uploads/2014/08/Placekitten480-g.jpg',
            },
            type: 'image',
          },
        },
        messaging_type: 'UPDATE',
        recipient: { id: '1412611362105802' },
      },
      method: 'POST',
      relative_url: 'me/messages',
    },
  ]);
});

it('should not send batch when with empty array', async () => {
  const { client } = setup();

  const responses = Array(1)
    .fill(0)
    .map(() => ({
      code: 200,
      body: '{"data": []}',
    }));

  client.sendBatch.mockReturnValue(Promise.resolve(responses));

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

  const fn = setTimeout.mock.calls[0][0];

  await fn();

  expect(client.sendBatch).not.toBeCalled();
});

it('should reset timeout when flush', async () => {
  const { client, timeoutId } = setup();

  const responses = Array(50)
    .fill(0)
    .map(() => ({
      code: 200,
      body: '{"data": []}',
    }));

  client.sendBatch.mockReturnValue(Promise.resolve(responses));

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

  for (let i = 0; i < 49; i++) {
    // eslint-disable-next-line no-await-in-loop
    q.push(MessengerBatch.createText('1412611362105802', 'hello'));
  }

  q.push(MessengerBatch.createMessage('1412611362105802', image));

  expect(clearTimeout).toHaveBeenCalledTimes(1);
  expect(clearTimeout).toHaveBeenLastCalledWith(timeoutId);
  expect(setTimeout).toHaveBeenCalledTimes(2);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
});
