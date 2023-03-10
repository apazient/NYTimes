import * as key from './const';
import * as storage from './storageLogic';

const inputSwitches = document.querySelectorAll('#theme-switch');

inputSwitches.forEach(inputSwitch => {
  inputSwitch.addEventListener('change', onInputChange);
  getCurrentTheme(inputSwitch);
});

function onInputChange(evt) {
  if (evt.currentTarget.checked) {
    document.body.classList.add('darkMode');
    document.body.classList.remove('light');
    storage.saveToLocal(key.KEY_THEME, 'darkMode');
  } else {
    document.body.classList.add('light');
    document.body.classList.remove('darkMode');
    storage.saveToLocal(key.KEY_THEME, 'light');
  }
}

function getCurrentTheme(input) {
  const currentTheme = storage.loadFromLocal('theme') || 'light';
  document.body.className = currentTheme;
  if (currentTheme === 'darkMode') {
    input.checked = true;
  }
}

// Work with switch text/svg styles//

if (document.body.classList.contains('light')) {
}
