
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const API_KEY = '38616901-e7b0e5046f7c06c2a4d7939a7';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 40;

const form = document.getElementById('search-form');
const imageGallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';
let currentPage = 1;
let totalHits = 0;

form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreClick);

function onFormSubmit(evt) {
  evt.preventDefault();
  searchQuery = form.elements.searchQuery.value;
  currentPage = 1;

  loadMoreBtn.style.display = 'none';
  fetchImages();
}

function onLoadMoreClick() {
  currentPage++;
  fetchImages();
}

function fetchImages() {
  const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
    searchQuery
  )}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}&page=${currentPage}`;

  axios
    .get(url)
    .then(response => {
      totalHits = response.data.totalHits;
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images`);

      const images = response.data.hits;
      displayImages(images);
    })
    .catch(error => {
      console.error(error);
      Notiflix.Notify.failure('Error fetching images');
    });
}

function displayImages(images) {
  if (images.length === 0) {
    if (currentPage === 1) {
      imageGallery.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    return;
  }

  const imageCards = images.map(image => {
    return `
      <div class="photo-card">
       <a href="${image.largeImageURL}"><img class="card-img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
       <div class="info">
          <p class="info-item"><b>Likes</b> ${image.likes}</p>
          <p class="info-item"><b>Views</b> ${image.views}</p>
          <p class="info-item"><b>Comments</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
        </div>
      </div>
    `;
  });

  if (currentPage === 1) {
    imageGallery.innerHTML = '';
  }

  imageGallery.innerHTML += imageCards.join('');
const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});
  lightbox.refresh();
  if (currentPage * PER_PAGE < totalHits) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
    if (totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  }
}
