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

const search = document.querySelector('#search-icons');

const doSearch = (e) => {
  const term = e.target.value;
  const container = document.querySelector('.edit-icon');
  const allIcons = container.querySelectorAll('.edit-icon__item');
  const matched = container.querySelectorAll(`[data-name*="${term}"]`);
  const noResults = container.querySelector('.edit-icon__noResults');
  
  const controlItems = (items, display) => {
    items.forEach(item => item.style.display = display);
  }
  
  const hideItems = (items) => controlItems(items, 'none');
  const showItems = (items) => controlItems(items, 'block');
  
  const resetQuery = () => {
    search.value = '';
    showItems(Array.from(allIcons));
    noResults.style.display = "none";
  }
    
  if (term.length !== 0) {
    hideItems(Array.from(allIcons));
    showItems(Array.from(matched));
    
    if (matched.length > 0) {
      noResults.style.display = "none";
    } else {
      noResults.style.display = "block";
    }
    
  } else {
    resetQuery();
  }
  
  if (e.which === 27) {
    resetQuery();
  }
  
  if (e.which === 13) {
    search.blur();
  }
}

if (search) {
  search.addEventListener('keyup', doSearch, false);
}
  
