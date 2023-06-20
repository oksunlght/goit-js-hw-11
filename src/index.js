import ImagesApiService from './fetch-api';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const imagesApiService = new ImagesApiService();

const refs = {
  onSearchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  onLoadMoreBtn: document.querySelector('.load-more'),
};

hideLoadMoreBtn();

refs.onSearchForm.addEventListener('submit', onSearch);
refs.onLoadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  clearGalleryContainer();
  hideLoadMoreBtn();

  imagesApiService.query = e.currentTarget.elements.searchQuery.value;
  imagesApiService.resetPage();
  onFetch();
  e.currentTarget.reset();
}

function onLoadMore() {
  imagesApiService
    .fetchImages()
    .then(({ hits }) => {
      if (hits.length < 40) {
        Notiflix.Notify.info(
          'We are sorry, but you have reached the end of search results.'
        );
        hideLoadMoreBtn();
        return;
      }

      renderMarkup(hits);
    })
    .catch(error => console.log(error.message));
}

function onFetch() {
  imagesApiService
    .fetchImages()
    .then(({ totalHits, hits }) => {
      if (totalHits === 0) {
        throw new Error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else if (totalHits <= 40) {
        imagesApiService.showSuccess(totalHits);
        renderMarkup(hits);
        return;
      }

      imagesApiService.showSuccess(totalHits);
      renderMarkup(hits);
      showLoadMoreBtn();
    })
    .catch(error => {
      Notiflix.Notify.failure(error.message);
    });
}

function renderMarkup(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
                <div class="photo-card">
        <a href="${largeImageURL}" class="image-link"><img src="${webformatURL}" alt="${tags}" loading="lazy" class="gallery-image" /></a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${likes}
          </p>
          <p class="info-item">
            <b>Views</b> ${views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${downloads}
          </p>
        </div>
      </div>`;
      }
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);

  let gallery = new SimpleLightbox('.gallery a');
  gallery.show.simplelightbox;
}

function clearGalleryContainer() {
  refs.gallery.innerHTML = '';
}

function hideLoadMoreBtn() {
  refs.onLoadMoreBtn.classList.add('visually-hidden');
}

function showLoadMoreBtn() {
  refs.onLoadMoreBtn.classList.remove('visually-hidden');
}
