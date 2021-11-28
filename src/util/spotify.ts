export const getAccessToken = (clientId: string, secretId: string) => {
  const authEncoded = btoa(`${clientId}:${secretId}`);

  return fetch('https://accounts.spotify.com/api/token', {
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${authEncoded}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
  })
  .then(response => response.json())
  .then(json => json.access_token);
}