import { ApiService } from './API/fetchAPI';
import { refs } from './refs';
import { renderMarkup, clear, renderWeather } from './renderMarkup';
import { corectDate } from './newsCard';
import * as key from './const';
import * as storage from './storageLogic';
import { addToFavorite, onloadFavorite } from './addToFavorites/addToFavorites';
import { onloadToRead } from './addToRead/addToRead';
import { clearNavCurrent } from './navLogic/navLogic';
import { rerenderPaginator, clearPgContainer } from './pagination';
import * as common from './common';

const newsFetch = ApiService;

refs.filter.addEventListener(`submit`, args => {
  //newsFetch.cleanPagination();
  ApiService.isCategories = true;

  filterQuery(args);
  //rerenderPaginator();
  newsFetch.lastAction.action = filterQuery;
});

let imgUrl;
// refs.filter.addEventListener(`submit`, filterQuery);

async function filterQuery(e) {
  let argument = null;
  if (!!e?.currentTarget?.elements?.searchArt?.value) {
    e.preventDefault();
    //newsFetch.resetPage();
    //повертає значення з імпуту
    argument = e.currentTarget.elements.searchArt.value;
    if (!argument) return;
    newsFetch.query = argument;
  }
  newsFetch.lastAction.arg = argument;

  const { docs, meta } = await newsFetch.getNewsByQuery();

  //якщо не знайдено даних по запиту, вертає NOT A FOUND
  common.toggleNotFound(docs);
  //зберігаємо у локальне сховище дані
  let collectionByQuery = [];

  collectionByQuery = docs.map(result => {
    const {
      abstract,
      pub_date,
      uri,
      web_url,
      multimedia,
      section_name,
      headline,
    } = result;

    if (multimedia.length !== 0) {
      imgUrl = 'https://www.nytimes.com/' + multimedia[0]['url'];
    } else {
      imgUrl = key.BASE_IMG;
    }

    const newDateFormat = corectDate(pub_date);
    let obj = {
      imgUrl,
      title: headline.main,
      text: abstract,
      date: newDateFormat,
      url: web_url,
      categorie: section_name,
      id: uri,
    };
    return obj;
  });

  clear(refs.gallery);
  // clear(refs.pg);
  clear(refs.accordion);
  clearNavCurrent(refs.nav.children);
  refs.HomeBtn.parentNode.classList.add('current-list__item');
  storage.saveToLocal(key.KEY_COLLECTION, collectionByQuery.slice(0, 9));

  categoriesOnPageLoadGallery();
}

function categoriesOnPageLoadGallery() {
  let collection = storage.loadFromLocal(key.KEY_COLLECTION);
  let collectionByPopular;
  if (window.matchMedia('(max-width: 768px)').matches) {
    collection = collection.slice(0, 3);
    //   collectionByPopular = collection.map(renderMarkup).join(``);
    //   renderGallery(collectionByPopular);
  } else if (window.matchMedia('(max-width: 1280px)').matches) {
    collection = collection.slice(0, 8);
  } else {
    collection = collection.slice(0, 9);
  }
  collectionByPopular = collection.map(renderMarkup).join(``);
  renderGallery(collectionByPopular);
  onloadToRead();
  onloadFavorite();
  //   weather.renderDefaultWeather();
}
function renderGallery(markup) {
  refs.gallery.insertAdjacentHTML(`beforeend`, markup);
  refs.gallery.addEventListener('click', addToFavorite);
}
//*******renderedWether******************* */
function weatherRender() {
  let replacedItem;
  if (window.matchMedia('(min-width: 1279.98px)').matches) {
    replacedItem = refs.gallery.childNodes[1];
    console.log(replacedItem);
    const markup = renderWeather();
    replacedItem.insertAdjacentHTML(`afterend`, markup);
  } else if (window.matchMedia('(min-width: 767.98px)').matches) {
    replacedItem = refs.gallery.firstElementChild;
    const markup = renderWeather();
    replacedItem.insertAdjacentHTML(`afterend`, markup);
  } else {
    replacedItem = refs.gallery.firstElementChild;
    const markup = renderWeather();
    replacedItem.insertAdjacentHTML(`beforebegin`, markup);
  }
}
function corectDate(date) {
  let newDateFormat = date.split('-');
  let maxElement = { index: length };

  newDateFormat.forEach((el, index) => {
    maxElement.index = index;
    maxElement.length = length;
  });
  newDateFormat[maxElement.index] = newDateFormat[maxElement.index].slice(0, 2);
  newDateFormat = newDateFormat.slice(0, 3);
  newDateFormat = newDateFormat.join('/');

  return newDateFormat;
}
