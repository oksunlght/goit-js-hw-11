import Notiflix from 'notiflix';

const axios = require('axios').default;

const API_KEY = '37347285-29ebaeb1886979c1c94a64382';
// const BASE_URL = 'https://pixabay.com/api/';

// export const fetchImages = function (searchQuery) {
//   const params = new URLSearchParams({
//     key: API_KEY,
//     q: `${searchQuery}`,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//     page: `${page}`,
//     per_page: 40,
//   });

//   const url = `${BASE_URL}?${params}`;

//   return fetch(url).then(res => res.json());
// };

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.baseUrl = 'https://pixabay.com/api/';
  }

  async fetchImages() {
    // const params = new URLSearchParams({
    //   key: API_KEY,
    //   q: `${this.searchQuery}`,
    //   image_type: 'photo',
    //   orientation: 'horizontal',
    //   safesearch: true,
    //   page: `${this.page}`,
    //   per_page: 40,
    // });

    // const url = `${BASE_URL}?${params}`;

    // return fetch(url)
    //   .then(res => res.json())
    //   .then(({ totalHits, hits }) => {
    // this.incrementPage();
    // return { totalHits, hits };
    //   });

    try {
      return axios
        .get(this.baseUrl, {
          params: {
            key: API_KEY,
            q: `${this.searchQuery}`,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: `${this.page}`,
            per_page: 40,
          },
        })
        .then(response => {
          return response.data;
        })
        .then(({ totalHits, hits }) => {
          this.incrementPage();
          return { totalHits, hits };
        });
    } catch (error) {
      console.log(error);
      return;
    }
  }

  incrementPage() {
    this.page += 1;
  }

  showSuccess(number) {
    Notiflix.Notify.success(`Hooray! We found ${number} images`);
  }

  onError() {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
