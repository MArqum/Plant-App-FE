import { createApi } from 'unsplash-js';
import config from '../../config';

const unsplash = createApi({
  accessKey: config.UNSPLASH_Access_Key,
});

export default {
  listPhotos: async () => {
    const response = await unsplash.photos.list({ page: 1, perPage: 10 });
    return response;
  },
  searchPhotos: async (query) => {
    const response = await unsplash.search.getPhotos({ query, page: 1, perPage: 10 });
    return response;
  },
};
