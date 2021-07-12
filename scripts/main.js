import 'regenerator-runtime/runtime';

const selectComponent = document.querySelectorAll('.select-component');
const hiddenList = document.querySelectorAll('input[type=hidden]');
const plantList = document.getElementById('plant-list-container');
const gridContainer = document.getElementById('grid-container');
const noResult = document.getElementById('no-result');
const skeleton = document.getElementById('plant-list-skeleton');

function createElementWithClass(tag, className, append) {
  let elem = document.createElement(tag);

  if (className) elem.classList.add(className);

  if (append) {
    if (append instanceof Array) {
      for (let item of append) {
        elem.appendChild(item);
      }
    } else {
      elem.appendChild(append);
    }
  }

  return elem;
}

async function getSelectComponentValues() {
  const filterValues = [];

  for (const hiddenItem of hiddenList) {
    if (hiddenItem.value) filterValues.push(hiddenItem.value);
  }

  if (filterValues.length === 3) {
    plantList.classList.add('hide');
    noResult.classList.add('hide');
    skeleton.classList.remove('hide');

    await fetch(
      `https://front-br-challenges.web.app/api/v2/green-thumb/?sun=${filterValues[0]}&water=${filterValues[1]}&pets=${filterValues[2]}`
    )
      .then(async function (e) {
        gridContainer.innerHTML = '';

        const result = await e.json();

        function sortByFavorite(a, b) {
          if (a.staff_favorite) {
            return -1;
          } else {
            return 0;
          }
        }

        const resultSortedByFavorite = result.sort(sortByFavorite);

        for (const resultItem of resultSortedByFavorite) {
          const { name, price, url, staff_favorite, sun, water, toxicity } =
            resultItem;

          let elemThumb = createElementWithClass('div', 'plant-list__thumb');
          elemThumb.style.backgroundImage = `url(${url})`;

          let elemTitleNode = document.createTextNode(name);
          let elemTitle = createElementWithClass('h2', false, elemTitleNode);

          let elemPriceNode = document.createTextNode('$' + price);
          let elemPrice = createElementWithClass('div', false, elemPriceNode);

          let elemIconSun = createElementWithClass('div', sun);
          let elemIconWater = createElementWithClass('div', water);
          let elemIconToxicity = createElementWithClass(
            'div',
            toxicity ? 'toxic' : 'pet'
          );

          let elemIcons = createElementWithClass('div', 'plant-list__icons', [
            elemIconSun,
            elemIconWater,
            elemIconToxicity,
          ]);

          let elemMeta = createElementWithClass('div', 'plant-list__meta', [
            elemTitle,
            elemPrice,
            elemIcons,
          ]);

          let elemItem = createElementWithClass('div', 'plant-list__item', [
            elemThumb,
            elemMeta,
          ]);

          if (staff_favorite) {
            elemItem.classList.add('plant-list__item--featured');

            let elemTag = createElementWithClass(
              'div',
              'plant-list__featured-tag'
            );
            let elemPriceNode = document.createTextNode('✨ Staff favorite');
            elemTag.appendChild(elemPriceNode);

            elemItem.appendChild(elemTag);
          }

          gridContainer.appendChild(elemItem);
          gridContainer.scrollLeft = 0;
        }

        setTimeout(function () {
          skeleton.classList.add('hide');
          plantList.classList.remove('hide');
        }, 500);
      })
      .catch(function () {
        skeleton.classList.add('hide');
        plantList.classList.add('hide');
        noResult.classList.remove('hide');
      });
  }
}

for (const selectItem of selectComponent) {
  selectItem.addEventListener('click', function openSelectOnClick() {
    for (const selectItem of selectComponent) {
      selectItem.className = 'select-component';
    }

    if (selectItem.classList.contains('select-component--open')) {
      selectItem.className = 'select-component';
    } else {
      selectItem.className = 'select-component select-component--open';
    }
  });

  const listItem = selectItem.querySelectorAll('ul li');

  for (const listItemElem of listItem) {
    listItemElem.addEventListener('click', function fetchHiddenInputs() {
      const target = selectItem.id;
      const hidden = document.querySelector(`input[name=${target}]`);

      if (listItemElem.id) {
        hidden.value = listItemElem.id;
        listItem[0].textContent = listItemElem.textContent;

        getSelectComponentValues();
      }
    });
  }
}

window.addEventListener('click', function closeAllSelect(e) {
  if (!e.target.classList.contains('select-component')) {
    for (const selectItem of selectComponent) {
      selectItem.className = 'select-component';
    }
  }
});

const buttonScroll = document.querySelectorAll('.scroll-button');

for (const btn of buttonScroll) {
  btn.addEventListener('click', function scrollToSection(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    const offsetTop = document.querySelector(href).offsetTop;

    scroll({
      top: offsetTop,
      behavior: 'smooth',
    });
  });
}
