import 'regenerator-runtime/runtime';

const selectComponent = document.querySelectorAll('.select-component');

async function getHiddenValues() {
  const hiddenList = document.querySelectorAll('input[type=hidden]');
  const plantList = document.getElementById('plant-list-container');
  const gridContainer = document.getElementById('grid-container');
  const noResult = document.getElementById('no-result');
  const skeleton = document.getElementById('plant-list-skeleton');

  const filterValues = [];

  for (const hiddenItem of hiddenList) {
    if (hiddenItem.value) filterValues.push(hiddenItem.value);
  }

  if (filterValues.length === 3) {
    plantList.style.display = 'none';
    noResult.style.display = 'none';
    skeleton.classList.remove('hide');

    await fetch(
      `https://front-br-challenges.web.app/api/v2/green-thumb/?sun=${filterValues[0]}&water=${filterValues[1]}&pets=${filterValues[2]}`
    )
      .then(async function (e) {
        gridContainer.innerHTML = '';

        const result = await e.json();

        for (const resultItem of result) {
          const { name, price, url, staff_favorite, sun, water, toxicity } =
            resultItem;

          let renderItem = document.createElement('div');
          renderItem.classList.add('plant-list__item');

          let renderThumb = document.createElement('div');
          renderThumb.classList.add('plant-list__thumb');
          renderThumb.style.backgroundImage = `url(${url})`;

          let renderTitleNode = document.createTextNode(name);
          let renderTitle = document.createElement('h2');
          renderTitle.appendChild(renderTitleNode);

          let renderPriceNode = document.createTextNode('$' + price);
          let renderPrice = document.createElement('div');
          renderPrice.appendChild(renderPriceNode);

          let renderIcons = document.createElement('div');
          renderIcons.classList.add('plant-list__icons');

          let renderIconSun = document.createElement('div');
          renderIconSun.classList.add(sun);
          let renderIconWater = document.createElement('div');
          renderIconWater.classList.add(water);
          let renderIconToxicity = document.createElement('div');
          renderIconToxicity.classList.add(toxicity ? 'toxic' : 'pet');
          renderIcons.appendChild(renderIconSun);
          renderIcons.appendChild(renderIconWater);
          renderIcons.appendChild(renderIconToxicity);

          let renderMeta = document.createElement('div');
          renderMeta.classList.add('plant-list__meta');

          renderMeta.appendChild(renderTitle);
          renderMeta.appendChild(renderPrice);
          renderMeta.appendChild(renderIcons);

          renderItem.appendChild(renderThumb);
          renderItem.appendChild(renderMeta);

          if (staff_favorite) {
            renderItem.classList.add('plant-list__item--featured');

            let renderTag = document.createElement('div');
            renderTag.classList.add('plant-list__featured-tag');
            let renderPriceNode = document.createTextNode('✨ Staff favorite');
            renderTag.appendChild(renderPriceNode);

            renderItem.appendChild(renderTag);
          }

          gridContainer.appendChild(renderItem);
          gridContainer.scrollLeft = 0;
        }

        setTimeout(function () {
          skeleton.classList.add('hide');
          plantList.style.display = 'block';
        }, 500);
      })
      .catch(function () {
        skeleton.classList.add('hide');
        plantList.style.display = 'none';
        noResult.style.display = 'block';
      });
  }
}

window.addEventListener('click', function (e) {
  if (!e.target.classList.contains('select-component')) {
    for (const selectItem of selectComponent) {
      selectItem.className = 'select-component';
    }
  }
});

for (const selectItem of selectComponent) {
  selectItem.addEventListener('click', function () {
    if (selectItem.classList.contains('select-component--open')) {
      selectItem.className = 'select-component';
    } else {
      selectItem.className = 'select-component select-component--open';
    }
  });

  const listItem = selectItem.querySelectorAll('ul li');

  for (const listItemElem of listItem) {
    listItemElem.addEventListener('click', function () {
      const target = selectItem.id;
      const hidden = document.querySelector(`input[name=${target}]`);

      if (listItemElem.id) {
        hidden.value = listItemElem.id;
        listItem[0].textContent = listItemElem.textContent;

        getHiddenValues();
      }
    });
  }
}

const buttonScroll = document.querySelectorAll('.scroll-button');

for (const btn of buttonScroll) {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    const offsetTop = document.querySelector(href).offsetTop;

    scroll({
      top: offsetTop,
      behavior: 'smooth',
    });
  });
}
