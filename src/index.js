
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/pixabay-api';

const PER_PAGE = 40;

const form = document.getElementById('search-form');
const imageGallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';
let currentPage = 1;
let totalHits = 0;

form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreClick);

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

async function onFormSubmit(evt) {
  evt.preventDefault();
  searchQuery = form.elements.searchQuery.value.trim();
  console.log(searchQuery)
  if (searchQuery === '') {
    imageGallery.innerHTML = ''

   return Notiflix.Notify.failure('Enter a value');
  }
  currentPage = 1;

  loadMoreBtn.style.display = 'none';
  try {
    const data = await fetchImages(searchQuery, currentPage, PER_PAGE);
    totalHits = data.totalHits;
   if (totalHits > 0) {
     Notiflix.Notify.info(`Hooray! We found ${totalHits} images`);
   }
   
    displayImages(data.hits);
  } catch (error) {
    console.error(error)
    Notiflix.Notify.failure(error.message);
  }
}

async function onLoadMoreClick() {
  currentPage++;
  try {
    const data = await fetchImages(searchQuery, currentPage, PER_PAGE);
    displayImages(data.hits);
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure(error.message);
  }
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

  imageGallery.insertAdjacentHTML('beforeend', imageCards.join('')); 

  lightbox.refresh();
  if (currentPage * PER_PAGE < totalHits) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info('Were sorry, but youve reached the end of search results')
    if (totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  }
}

