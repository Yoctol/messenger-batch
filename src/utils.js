function getErrorMessage(err) {
  try {
    const { message } = JSON.parse(err.response.body).error;
    return message;
  } catch (_) {
    return '';
  }
}

exports.getErrorMessage = getErrorMessage;

exports.isError613 = function isError613(err) {
  const message = getErrorMessage(err);
  return /#613/.test(message);
};
