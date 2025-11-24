const buildResponse = ({ success, data = null, tokensUsed = null, provider }) => ({
  success,
  data,
  tokensUsed,
  provider,
});

const buildSuccessResponse = (provider, data, tokensUsed = null) =>
  buildResponse({ success: true, data, tokensUsed, provider });

const buildErrorResponse = (provider, error) => {
  const message =
    typeof error === 'string'
      ? error
      : error && error.message
      ? error.message
      : 'Unknown provider error';
  return buildResponse({
    success: false,
    data: { error: message },
    tokensUsed: null,
    provider,
  });
};

module.exports = {
  buildResponse,
  buildSuccessResponse,
  buildErrorResponse,
};

