const baseHtml1 = document.querySelector('.item1.js-base');
const baseHtml2 = document.querySelector('.item2.js-base');
// const baseHtml3 = document.querySelector('.item3.js-base');
// const baseHtml4 = document.querySelector('.item4.js-base');
// const baseHtml5 = document.querySelector('.item5.js-base');
const container1 = document.querySelector('.container1');
const container2 = document.querySelector('.container2');
// const container3 = document.querySelector('.container3');
// const container4 = document.querySelector('.container4');
// const container5 = document.querySelector('.container5');
const apiURL = 'https://script.google.com/macros/s/AKfycbxJj7bbzOGYNK_j62-cjtWhEWAn84-uaVQwVeCZIUn_WgmwohJRXvtu0NpQc1JnH99Ekg/exec'; //kawarac_works_list1

function loadingDissapear() {
  const spinner = document.querySelector('.loading');
  spinner.classList.add('loaded');
}

async function loadData() {
  const response = await fetch(apiURL);
  const data = await response.json();
  console.log(data);

  await loadingDissapear();

  data.forEach(entry => {
    if (entry.grade == '') {}else{
      if (entry.category == 'real') {
        const copy = baseHtml1.cloneNode(true);
        copy.classList.remove('js-base');
        copy.querySelector('.item-name1').textContent = entry.name_jp;
        copy.querySelector('.item-img1').src = entry.mainimg;
        if (entry.link1) {copy.querySelector('.haslink').setAttribute('style', 'opacity:1;')};
        
        let link = copy.querySelector('.item-href1');
        link.setAttribute('href', 'detail.html?code=' + entry.code);
        container1.appendChild(copy);
      };

      if (entry.category == 'coding') {
        const copy = baseHtml2.cloneNode(true);
        copy.classList.remove('js-base');
        copy.querySelector('.item-name2').textContent = entry.name_jp;
        copy.querySelector('.item-img2').src = entry.mainimg;
        if (entry.link1) {copy.querySelector('.haslink').setAttribute('style', 'opacity:1;')};

        let link = copy.querySelector('.item-href2');
        link.setAttribute('href', 'detail.html?code=' + entry.code);
        container2.appendChild(copy);
      };
    }
  });
}
  
  loadData();
