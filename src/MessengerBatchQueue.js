const MAX_BATCH_SIZE = 50;

module.exports = class MessengerBatchQueue {
  constructor(client, options = {}) {
    this._client = client;
    this._queue = [];
    this._delay = options._delay || 1000;

    this._timeout = setTimeout(() => this.flush(), this._delay);
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

    clearTimeout(this._timeout);
    this._timeout = setTimeout(() => this.flush(), this._delay);

    if (items.length < 1) return;

    const responses = await this._client.sendBatch(items.map(i => i.request));

    items.forEach(({ resolve, reject }, i) => {
      const res = responses[i];
      if (res.code === 200) {
        resolve(JSON.parse(res.body));
      } else {
        reject(res);
      }
    });
  }

  stop() {
    clearTimeout(this._timeout);
  }
};
