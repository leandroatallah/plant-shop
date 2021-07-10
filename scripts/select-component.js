document.addEventListener('DOMContentLoaded', () => {
  const selectComponent = document.querySelectorAll('.select-component');

  for (let i = 0; i < selectComponent.length; i++) {
    const listItem = selectComponent[i].querySelectorAll('ul li');

    for (let j = 0; j < listItem.length; j++) {
      listItem[j].addEventListener('click', () => {
        const target = selectComponent[i].id;
        const hidden = document.querySelector(`input[name=${target}]`);
        hidden.value = listItem[j].id;

        for (let k = 0; k < listItem.length; k++) {
          listItem[k].classList.remove('active');
        }

        listItem[j].classList.add('active');
      });
    }
  }
});
