import axios from 'axios';

/**
 * Calls the endpoint with authorization bearer token.
 * @param {string} endpoint
 * @param {string} accessToken
 */
export async function callApi(endpoint: string, accessToken: string) {
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };

  console.log(
    'request made to web API at: ' +
      new Date().toString() +
      '\n' +
      ' to endpoint: ' +
      endpoint
  );

  try {
    const response = await axios.get(endpoint, options);
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}
