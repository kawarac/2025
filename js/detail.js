let url = new URL(window.location.href);
let params = url.searchParams;
const code = params.get('code');
console.log(code);

const baseHtml2 = document.querySelector('.bl_imgSwitcher_btn.js-base');
const apiURL1 = 'https://script.google.com/macros/s/AKfycbxJj7bbzOGYNK_j62-cjtWhEWAn84-uaVQwVeCZIUn_WgmwohJRXvtu0NpQc1JnH99Ekg/exec'; //kawarac_works_list1
const apiURL2 = 'https://script.google.com/macros/s/AKfycbzw_mjqa8a3saq4PQyJDq0KA0eGWi8JScYeAZ-Hs7k4YBNgERgJP1o57kEx3FilnWuOOw/exec'; //img_database

function loadingDissapear() {
    const spinner = document.querySelector('.loading');
    spinner.classList.add('loaded');
  }

async function loadData1() {
    const response1 = await fetch(apiURL1);
    const data1 = await response1.json();
    // console.log(data);
  
    data1.forEach(entry => {
      if (entry.code == code) {
        console.log(entry);
        document.querySelector('title').textContent = entry.name_jp + ' | Kohei Hayashi';
        document.querySelector('.name_jp').textContent = entry.name_jp;
        document.querySelector('.mainimg').src = entry.mainimg;
        if (entry.name_en) {document.querySelector('.name_en').textContent = entry.name_en;};
        if (entry.date) {document.querySelector('.date').textContent = 'Date: ' + entry.date ;};
        if (entry.place) {document.querySelector('.place').textContent = 'Place: ' + entry.place ;};
        if (entry.material) {document.querySelector('.material').textContent = 'Material: ' + entry.material;};
        if (entry.tool) {document.querySelector('.tool').textContent = 'Tool: ' + entry.tool;};
        if (entry.comment_jp) {document.querySelector('.comment').innerHTML = entry.comment_jp;};

          // リンクあれば表示
        if (entry.link1) {
          document.querySelector('.link1').textContent = entry.link1_title;
          document.querySelector('.link1').setAttribute('href', entry.link1);
        };
        if (entry.link2) {
          document.querySelector('.link2').textContent = entry.link2_title;
          document.querySelector('.link2').setAttribute('href', entry.link2);
        };
      }
    });
    
    await loadingDissapear();
  }

  // 画像セクションに関連画像表示
async function loadData2() {
  const response2 = await fetch(apiURL2);
  const data2 = await response2.json();
  // console.log("ドライブデータ", data2);
  
    data2.forEach(entry => {
      if (entry.folderName == code) {
        // const copy = baseHtml2.cloneNode(true);
        // copy.classList.remove('js-base');
        // copy.querySelector('.spreadsheets--img').src = entry.url;
        // spreadsheets2.appendChild(copy);

          const copy = baseHtml2.cloneNode(true);
          copy.classList.remove('js-base');
          copy.querySelector('.thumbimg').src = entry.url;
          document.querySelector('.bl_imgSwitcher_thumb').appendChild(copy);
          // copy.querySelector('.spreadsheets--description').innerHTML = entry.description;
        
      }
    });

    const imgSwitcher = await document.getElementById('js_imgSwitcher');
    if (imgSwitcher) {
      const mainImg = document.querySelector('.bl_imgSwitcher_main img');
      const thumbBtns = document.querySelectorAll('.bl_imgSwitcher_btn');
      // サムネイル画像がフォーカスされたときの処理
      thumbBtns.forEach(thumbBtn => {
        thumbBtn.addEventListener('focus', switchImage);
      });
      function switchImage() {
        const img = this.querySelector('img');
        mainImg.style.transition = 'opacity .3s ease-out';
        mainImg.style.opacity = 0;
        setTimeout(() => {
          mainImg.src = img.src;
          mainImg.alt = img.alt;
          mainImg.style.opacity = 1;
        }, 300);
        thumbBtns.forEach(thumbBtn => thumbBtn.classList.remove('is_active'));
        this.classList.add('is_active');
      }
    }
}
  
  loadData1();
  loadData2();

  
    

  