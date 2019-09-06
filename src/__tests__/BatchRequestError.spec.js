const BatchRequestError = require('../BatchRequestError');

it('should work', async () => {
  const request = {
    method: 'POST',
    relative_url: 'me/feed',
    body: 'message=Test status update&amp;link=http://developers.facebook.com/',
  };
  const response = {
    code: 403,
    headers: [
      { name: 'WWW-Authenticate', value: 'OAuth…' },
      { name: 'Content-Type', value: 'text/javascript; charset=UTF-8' },
    ],
    body:
      '{"error":{"type":"OAuthException","message": "Invalid parameter","code": 100}}',
  };
  const error = new BatchRequestError({ request, response });

  expect(error.inspect()).toMatchSnapshot();
});

it('should have better error message', async () => {
  const request = {
    method: 'POST',
    relative_url: 'me/feed',
    body: 'message=Test status update&amp;link=http://developers.facebook.com/',
  };
  const response = {
    code: 403,
    headers: [
      { name: 'WWW-Authenticate', value: 'OAuth…' },
      { name: 'Content-Type', value: 'text/javascript; charset=UTF-8' },
    ],
    body:
      '{"error":{"type":"OAuthException","message": "Invalid parameter","code": 100}}',
  };
  const error = new BatchRequestError({ request, response });

  expect(error.message).toEqual('Batch Request Error - Invalid parameter');
});
