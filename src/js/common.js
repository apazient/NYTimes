import { refs } from './refs';

export function toggleNotFound(docs) {
  if (docs.length === 0) {
    if (refs.notFoundEl.classList.contains('hidden')) {
      refs.notFoundEl.classList.remove('hidden');
    }
    clear(refs.gallery);
    clearPgContainer();
    return;
  } else {
    if (!refs.notFoundEl.classList.contains('hidden')) {
      refs.notFoundEl.classList.add('hidden');
    }
  }
}
