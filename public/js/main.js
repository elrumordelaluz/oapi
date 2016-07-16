// Form Validation
const uploadSingle = document.querySelectorAll('#upload-single');
if (uploadSingle) {
   $('form').each(function() {  // attach to all form elements on page
    $(this).validate({});
  });
}

// Delete Button
const deleteButtons = document.querySelectorAll('.deleteIconButton');
if (deleteButtons) {
  Array.from(deleteButtons).forEach(function (btn) {
    btn.addEventListener('click', e => {
      if (!confirm(`Sure you want to delete ${e.target.dataset.icon}?`)) {
        e.preventDefault();
      }
    }, false)
  });
}

// Search in Icons
const search = document.querySelector('#search-icons');
const showIconsContainer = document.querySelector('.edit-icon');
const onlyPremium = document.querySelector('#edit-premium');
const controlItems = (items, display) => {
  items.forEach(item => item.style.display = display);
}
const hideItems = (items) => controlItems(items, 'none');
const showItems = (items) => controlItems(items, 'block');

const doSearch = (value) => {
  const term = value;
  const allIcons = showIconsContainer.querySelectorAll('.edit-icon__item');
  
  const matchedAll = showIconsContainer.querySelectorAll(`[data-name*="${term}" i], [data-slug*="${term}" i]`);
  const matchedWithPremium = showIconsContainer.querySelectorAll(`[data-name*="${term}" i][data-premium="true" i], [data-slug*="${term}" i][data-premium="true" i]`);
  const matchedOnlyPremium = showIconsContainer.querySelectorAll(`[data-premium="true" i]`);
  let matched;
  
  if (onlyPremium.checked) {
    if (term.length === 0) {
      matched = matchedOnlyPremium;
    } else {
      matched = matchedWithPremium;
    }
  } else {
    matched = matchedAll;
  }
  
  const noResults = showIconsContainer.querySelector('.edit-icon__noResults');
  
  if (term !== '' || onlyPremium.checked) {
    hideItems(Array.from(allIcons));
    if (matched.length !== 0) {
      showItems(Array.from(matched));
      noResults.style.display = "none";
    } else {
      noResults.style.display = "block";
    }
  } else {
    showItems(Array.from(allIcons));
  }
}

if (search) {
  const onlyPremium = document.querySelector('#edit-premium');
  onlyPremium.addEventListener('change', () => doSearch(search.value) , false)
  search.addEventListener('keyup', e => {
    doSearch(e.target.value);
    if (e.which === 27) {
      search.value = '';
      doSearch('');
    }
    if (e.which === 13) {
      search.blur();
    }
  }, false);
}
  
  

// Edit icon
const editIcon = document.querySelector('#edit-single-icon');
if (editIcon) {
  const iconName = editIcon.querySelector('#iconName');
  const iconStyle = editIcon.querySelector('#iconStyle');
  const iconTags = editIcon.querySelector('#iconTags');
  const iconPremiumTrue = editIcon.querySelector('#iconPremiumTrue');
  
  const getValues = () => ({
    name: iconName.value,
    style: iconStyle.value,
    premium: iconPremiumTrue.checked,
    tags: iconTags.value,
  });
  
  const initValues = getValues();
  
  editIcon.addEventListener('submit', e => {
    if (JSON.stringify(initValues) === JSON.stringify(getValues())) {
      e.preventDefault();
    }
    return true;
  });
  
}


// Login

const login = document.querySelector('#login');

if (login) {
  const username = login.querySelector('#username');
  username.focus();
}
