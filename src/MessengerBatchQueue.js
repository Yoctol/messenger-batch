const MAX_BATCH_SIZE = 50;

module.exports = class MessengerBatchQueue {
  constructor(client, options = {}) {
    this._client = client;
    this._queue = [];
    this._delay = options._delay || 1000;

    setInterval(() => this.flush(), this._delay);
  }

  get queue() {
    return this._queue;
  }

  push(request) {
    const promise = new Promise((resolve, reject) => {
      this._queue.push({ request, resolve, reject });
    });

    if (this._queue.length >= MAX_BATCH_SIZE) {
      this.flush();
    }

    return promise;
  }

  async flush() {
    const items = this._queue.splice(0, MAX_BATCH_SIZE);

    const responses = await this._client.sendBatch(items);

    items.forEach(({ resolve, reject }, i) => {
      const res = responses[i];
      if (res.code === 200) {
        resolve(res.body.data);
      } else {
        reject(res);
      }
    });
  }
};
