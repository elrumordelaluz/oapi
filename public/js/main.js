const match = _.curry((what, str) => {
  return str.match(what)
})

const filter = _.curry((f, arr) => {
  return arr.filter(f)
})

const map = _.curry((f, arr) => {
  return arr.map(f)
})

// Form Validation
const uploadSingle = document.querySelector('#upload-single');
const suffixUpdateButton = document.querySelector('#suffixUpdateButton');
const suffixNumber = document.querySelector('#suffixNumber');
const updateSuffixForm = document.querySelector('#update-suffix');
if (uploadSingle) {
   $('form').each(function() {
    $(this).validate({});
  });
  
  const initSuffixValue = suffixNumber.value;
  const handleUpdateButton = (e) => {
    if (e.target.value !== initSuffixValue) {
      suffixUpdateButton.disabled = false
    } else {
      suffixUpdateButton.disabled = true
    }
  }
  
  // suffixNumber.addEventListener('change', handleUpdateButton, false);
  suffixNumber.addEventListener('keyup', handleUpdateButton, false);
  
  updateSuffixForm.addEventListener('submit', e => {
    if (confirm(`Sure to modify the actual SUFFIX?`)) {
      return true;
    } else {
      e.preventDefault();
    }
  })
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


// Search in Icon Results
const inputFilter = document.querySelector('#search-icons')
const inputPremium = document.querySelector('#edit-premium')
const items = document.querySelectorAll('.edit-icon__item')
const empty = document.querySelector('.edit-icon__noResults')
const itemsArr = Array.from(items)
const showItem = (item) => item.classList.add('matched')
const hideItem = (item) => item.classList.remove('matched')

// set attribute to base filter (ie. item.textContent)
const getDataName = (item) => item.dataset.name
const getDataSlug = (item) => item.dataset.slug
const getTextContent = (item) => item.textContent
const getID = (item) => item.id

const getAttrs = (elem, arr) => arr.map(f => f(elem))
const allAttrsFuncs = [getDataName,getDataSlug, getID]
const getAllAttrs = (item) => getAttrs(item, allAttrsFuncs)

const handleEmpty = (length) => {
  if (length === 0) {
    showItem(empty)
  } else {
    hideItem(empty)
  }
}

const doSearch = (value) => {
  const term = new RegExp(value, 'i')
  const hasTerm = match(term)
  const onlySpecial = inputPremium.checked
  
  const termAndSpecial = (item) => {
    return hasTerm(getAllAttrs(item).join('')) && item.dataset.premium === 'true'
  }
  
  const matchTermInAttrs = (item) => {
    // could return only one attr like:
    // return hasTerm(getDataAttr(item))
    return onlySpecial 
      ? termAndSpecial(item) 
      : hasTerm(getAllAttrs(item).join(''))
  }
  
  const filterMatched = filter(matchTermInAttrs)
  const matched = filterMatched(itemsArr)
  
  handleEmpty(matched.length)
  map(hideItem)(itemsArr)
  map(showItem)(matched)
}

const searchHandler = (e) => {
  doSearch(e.target.value)
  if (e.which === 27) {
    e.target.value = ''
    doSearch('')
  }
}
const specialHandler = () => doSearch(inputFilter.value)

const bulkActions = document.querySelector('#bulkActions');
const selectAllButton = document.querySelector('#selectAll');
const unselectAllButton = document.querySelector('#unselectAll');
const selectAction = document.querySelector('#select-bulkAction');
const selectedInputs = document.querySelectorAll('.select-input');
const selectItem = (item) => item.querySelector('.select-input').checked = true;
const unselectItem = (item) => item.querySelector('.select-input').checked = false;
const isSelected = (item) => item.checked;
const getSelectID = (item) => getID(item).replace(/^select_/, '');

if (inputFilter) {
  // Show all Items
  inputFilter.focus()
  hideItem(empty)
  map(showItem)(itemsArr)
  inputFilter.addEventListener('keyup', searchHandler, false)
  inputPremium.addEventListener('change', specialHandler, false)
  
  // Bulk Actions
  selectAll.addEventListener('click', e => {
    e.preventDefault();
    map(selectItem)(itemsArr);
  }, false);
  unselectAll.addEventListener('click', e => {
    e.preventDefault();
    map(unselectItem)(itemsArr);
  }, false);
  
  bulkActions.addEventListener('submit', e => {
    const selectedItems = filter(isSelected)(Array.from(selectedInputs));
    const selectedIDs = map(getSelectID)(selectedItems);
    
    if (selectedItems.length === 0 || selectAction.value === '0') {
      e.preventDefault();
    } else {
      e.preventDefault();
      let action, msg;
      if (selectAction.value === '1') {
        action = 'premium';
        msg = `set ${selectedIDs.length} icons to Premium`;
      } else if (selectAction.value === '2') {
        action = 'delete';
        msg = `DELETE ${selectedIDs.length} icons`;
      } else if (selectAction.value === '3') {
        action = 'nopremium';
        msg = `unset ${selectedIDs.length} icons from Premium`;
      }
      
      if (confirm(`Are you sure you want to ${msg}?`)) {
        const posting = $.post('/bulk', { 
          selected: selectedIDs,
          action: action,
        });
        posting.done(data => {
          if(data.ok){
            setTimeout(() => {
              window.location.reload();
            }, 500); 
          }
        })
      }
    }
  }, false);
}
  
  

// Edit icon
const editIcon = document.querySelector('#edit-single-icon');
if (editIcon) {
  const iconName = editIcon.querySelector('#iconName');
  
  const iconSlug = editIcon.querySelector('#iconSlug');
  const iconSlugNoSuffix = editIcon.querySelector('#iconSlugNoSuffix');
  $('#iconSlugNoSuffix').autoGrowInput({ comfortZone: 0 });
  const iconOnlySuffix = editIcon.querySelector('#iconOnlySuffix');
  const initialSlugNoSuffixValue = iconSlugNoSuffix.value;
  iconSlug.value = initialSlugNoSuffixValue + iconOnlySuffix.value;
  
  const iconStyle = editIcon.querySelector('#iconStyle');
  const iconTags = editIcon.querySelector('#iconTags');
  const iconPremiumTrue = editIcon.querySelector('#iconPremiumTrue');
  
  const getValues = () => ({
    slug: iconSlug.value,
    name: iconName.value,
    style: iconStyle.value,
    premium: iconPremiumTrue.checked,
    tags: iconTags.value,
  });
  
  const initValues = getValues();
  
  iconSlugNoSuffix.addEventListener('keyup', e => {
    iconSlug.value = e.target.value + iconOnlySuffix.value;
    if (e.target.value === '') {
      iconSlugNoSuffix.value = initialSlugNoSuffixValue;
      iconSlug.value = initialSlugNoSuffixValue + iconOnlySuffix.value;
    }
    // iconSlugNoSuffix.style.width = e.target.value.length + 'em';
  }, false);
  
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
