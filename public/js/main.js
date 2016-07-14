// Form Validation
$("form").validate();

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
  
  const controlItems = (items, display) => {
    items.forEach(item => item.style.display = display);
  }
  
  const hideItems = (items) => controlItems(items, 'none');
  const showItems = (items) => controlItems(items, 'block');
  
  const resetQuery = () => {
    search.value = '';
    showItems(Array.from(allIcons))
  }
    
  if (term.length !== 0) {
    hideItems(Array.from(allIcons))
    showItems(Array.from(matched))
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

search.addEventListener('keyup', doSearch, false);
