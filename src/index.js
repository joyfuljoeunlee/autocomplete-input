import { AUTOCOMPLETE_INPUT_API } from './utils/api.js';
import get from './utils/get.js';

const $app = get('#app');
const $input = get('#input');
const $dropdown = get('#dropdown');
const $clearButton = get('#clear-button');

let state = {};
const getState = key => {
  return state[key];
};

const setState = (key, value) => {
  state = { ...state, [key]: value };
};

const handleInputValue = e => {
  const value = e.target.value;
  if (value) {
    $clearButton.classList.replace(
      'clear-button-invisible',
      'clear-button-visible'
    );

    handleSearch(value);
  } else {
    $clearButton.classList.replace(
      'clear-button-visible',
      'clear-button-invisible'
    );
    clearDropdown();
  }
};

const handleSearch = keyword => {
  try {
    fetch(`${AUTOCOMPLETE_INPUT_API}${keyword}`, { method: 'get' })
      .then(res => res.json())
      .then(res => {
        if (res) {
          setState('data', res);
          renderDropdown();
        }
      });
  } catch (e) {
    console.log(e);
  }
};

const renderDropdown = () => {
  $dropdown.classList.replace('dropdown-invisible', 'dropdown-visible');
  const dataList = getState('data');

  const listFragment = document.createDocumentFragment();

  dataList.map((data, index) => {
    const list = document.createElement('li');
    list.setAttribute('key', index);
    list.innerHTML = data.text;
    listFragment.appendChild(list);
  });

  $dropdown.replaceChildren();
  $dropdown.appendChild(listFragment);
};

const clearDropdown = () => {
  $dropdown.replaceChildren();
  $dropdown.classList.replace('dropdown-visible', 'dropdown-invisible');
};

const clearInputValue = () => {
  $input.value = null;
  setState('data', []);
  $dropdown.replaceChildren();
};

$input.addEventListener('input', handleInputValue);
$clearButton.addEventListener('click', clearInputValue);
