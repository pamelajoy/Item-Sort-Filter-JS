
// Variables
var container = document.querySelector('[data-role=item-sort]');

// All of the items to be sorted are placed into an array.
// Each of the itmes has a category and a date.
// These are both placed into their respective arrays.
// var items [item1, item2, item3, item4];
// var itemCategories [Category, Category, Category, Category];
// var itemDates [Date, Date, Date, Date]; 
// This could be more efficiently as an array of objects.

// All of the available categories are placed into variables.
// Could/should also be an array.
// var category1, category2, category3, category4 = false; 


// Functions

// Cycle through each item in the array.
// Compare the item's category with the clicked category.
// If the categories match show the item, otherwise hide the item.
// function categorySort (var clickedCategory) { 

//   for (var i=0; i < itemCategories.length; i++) {
//     if (clickedCategory === itemCategories[i] ) {
//       items[i].show;
//     } else {
//       items[i].hide;
//     }
//   }
// }

// Capture the user input for start and end dates.
// Cycle through each item.
// Compare the item's date with the given dates.
// If the item's date falls between the two dates show the item, otherwise hide the item.
// function dateSort {
//   var startDate = (taken from user input)
//   var endDate  = (taken from user input)

// // must have startDate and endDate or none at all
// // and
// // startDate must be less than or equal to endDate

//   for (var i=0; i < itemDates.length; i++) {
//     if ( startDate <= itemDate[i] ) & ( endDate >= itemDate[i] ) {
//       items[i].show;
//     }
//     else{
//       items[i].hide;
//     }
//   }
// }

var activeFilters = [];
var filteredItems = DATA.items;
var sortByValue = null;

function clearList() {
  var itemSortList = document.querySelector('.item-sort-list');
  if(itemSortList) {
    itemSortList.remove();
  }
};

function removeFilter(filter) {
  var filterIndex = activeFilters.indexOf(filter);

  if(filterIndex >= 0) {
    activeFilters.splice(filterIndex, 1);
  }
};

function addFilter(filter) {
  if(activeFilters.indexOf(filter) === -1) {
    activeFilters.push(filter);
  }
};

function getFilteredItems() {
  return DATA.items.filter(function(item) {
    return activeFilters.indexOf(item.category) >= 0;
  });
}

function removeFilters(filter) {
  removeFilter(filter);


  if(activeFilters.length > 0) {
    filteredItems = getFilteredItems();
    buildItems();
  } else {
    filteredItems = DATA.items;
    buildItems();
  }
};

function addFilters(filter) {
  addFilter(filter);
  
  filteredItems = getFilteredItems();
  buildItems();
};

function bindNavClickEvent(element, filter) {
  function select(event) {
    var activeClass = 'active';

    if(event.target.classList.contains(activeClass)) {
      event.target.classList.remove(activeClass);
      removeFilters(filter);
    } else {
      event.target.classList.add(activeClass); 
      addFilters(filter);
    }
  };

  element.addEventListener('click', select, false);
};

function buildNav() {
  var nav = document.createElement('nav');
  nav.className = 'row item-sort-nav';

  container.appendChild(nav);

  return nav;
};

function buildNavButtons() {
  var nav = buildNav();

  DATA.meta.categories.forEach(function(category) {
    var button = document.createElement('button');
    var text = document.createTextNode(category.title);

    button.className = 'btn btn-primary center-block col-xs-3';

    button.appendChild(text);
    bindNavClickEvent(button, category.type);

    nav.appendChild(button);
  });
};

var SORT_OPTIONS = [
  { sortBy: 'bandName', asc: true },
  { sortBy: 'bandName', asc: false },
  { sortBy: 'date', asc: true },
  { sortBy: 'date', asc: false }
];

function buildSortSelector() {
  var select = document.createElement('select');
  var placeholder = document.createElement('option');
  var placeholderText = document.createTextNode('Sort by...');

  placeholder.selected = true;
  placeholder.disabled = true;
  placeholder.appendChild(placeholderText);

  select.appendChild(placeholder);

  SORT_OPTIONS.forEach(function(option) {
    var opt = buildSortOption(option);

    select.appendChild(opt);
  });

  function sort(event) {
    sortByValue = event.target.value;
    buildItems();
  };

  select.addEventListener('change', sort, false);

  container.appendChild(select);

  return select;
};

function buildSortOption(option) {
  var opt = document.createElement('option');
  var text = option.sortBy + ':' + (option.asc ? 'asc' : 'desc');
  var textNode = document.createTextNode(text);
  
  opt.appendChild(textNode);
  opt.value = text;
  
  return opt;
};

function sortItems() {
  if(sortByValue) {
    var sortBy = sortByValue.split(':')[0];
    var dir = sortByValue.split(':')[1];

    if(sortBy === 'bandName') {
      if(dir === 'asc') {
        filteredItems.sort(sortAscendingName);
      } else {
        filteredItems.sort(sortDescendingName);
      }
    } else if(sortBy === 'date') {
      if(dir === 'asc') {
        filteredItems.sort(sortAscendingDate);
      } else {
        filteredItems.sort(sortDescendingDate);
      }
    }    
  }

  return filteredItems;
};

function buildItemsList() {
  var itemsList = document.createElement('div');
  itemsList.className = 'row item-sort-list';

  container.appendChild(itemsList);

  return itemsList;
};

function buildItems() {
  clearList();
  sortItems();

  var itemsList = buildItemsList();

  filteredItems.forEach(function(item) {
    var div = document.createElement('div');
    var img = document.createElement('img');
    var pName = document.createElement('p');
    var date = new Date(item.date);
    var pDate = document.createElement('p');
    var pNameText = document.createTextNode(item.bandName);
    var pDateText = document.createTextNode(date.getFullYear())

    div.className = 'item-sort-item col-xs-3';

    img.src = 'images/'+item.img;
    img.className = 'item-sort-thumbnail img-responsive';

    pName.className = 'item-sort-title'; 

    pName.appendChild(pNameText);
    pDate.appendChild(pDateText);
    div.appendChild(img);
    div.appendChild(pName);
    div.appendChild(pDate);

    itemsList.appendChild(div);
  });
};

function sortAscendingName(a,b){
  var nameA = a.bandName.toUpperCase(); // ignore upper and lowercase
  var nameB = b.bandName.toUpperCase(); // ignore upper and lowercase
  
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

function sortDescendingName(a,b){
  var nameA = a.bandName.toUpperCase(); // ignore upper and lowercase
  var nameB = b.bandName.toUpperCase(); // ignore upper and lowercase
  
  if (nameA > nameB) {
    return -1;
  }
  if (nameA < nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

function sortAscendingDate(a,b){
  var dateA = new Date(a.date); // ignore upper and lowercase
  var dateB = new Date(b.date); // ignore upper and lowercase
  
  if (dateA < dateB) {
    return -1;
  }
  if (dateA > dateB) {
    return 1;
  }

  // names must be equal
  return 0;
}

function sortDescendingDate(a,b){
  var dateA = new Date(a.date); // ignore upper and lowercase
  var dateB = new Date(b.date); // ignore upper and lowercase
  
  if (dateA > dateB) {
    return -1;
  }
  if (dateA < dateB) {
    return 1;
  }

  // names must be equal
  return 0;
}

buildNavButtons();
buildSortSelector();
buildItems();

// User Event

// Call the categorySort function when any of the category buttons are clicked
// click a category option
    
// run categorySort;


// Call the dateSort function when the submit button is clicked
// click submit button

// run dateSort