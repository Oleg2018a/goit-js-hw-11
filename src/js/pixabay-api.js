
import axios from 'axios';

const API_KEY = '38616901-e7b0e5046f7c06c2a4d7939a7';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(searchQuery, currentPage, perPage) {
 
    const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
      searchQuery
    )}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${currentPage}`;

    const response = await axios.get(url);
    return response.data;
  } 

