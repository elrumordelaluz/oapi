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

if (inputFilter) {
  // Show all Items
  inputFilter.focus()
  hideItem(empty)
  map(showItem)(itemsArr)
  inputFilter.addEventListener('keyup', searchHandler, false)
  inputPremium.addEventListener('change', specialHandler, false)
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
