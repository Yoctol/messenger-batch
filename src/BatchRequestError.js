const { getErrorMessage } = require('./utils');

module.exports = class BatchRequestError extends Error {
  constructor({ request, response }) {
    const message = getErrorMessage({ request, response });

    super(`Batch Request Error - ${message}`);

    this.request = request;
    this.response = response;
  }

  inspect() {
    return `
Error Message - Batch Request Error

Request -

${this.request.method.toUpperCase()} ${this.request.relative_url}
${this.request.body || ''}

Response -
${this.response.code}
${this.response.body || ''}
    `;
  }
};
