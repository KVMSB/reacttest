import { GRAPHSERVICE_PHOTO, GRAPHSERVICE_URL } from '../constants';


export async function getUserPhoto(userId, accessToken) {
  let url = GRAPHSERVICE_URL + userId + GRAPHSERVICE_PHOTO;
  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
  });
}
