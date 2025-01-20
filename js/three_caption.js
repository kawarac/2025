let url = new URL(window.location.href);
let params = url.searchParams;
const code = params.get('code');
console.log(code);

const apiURL1 = 'https://script.google.com/macros/s/AKfycbxJj7bbzOGYNK_j62-cjtWhEWAn84-uaVQwVeCZIUn_WgmwohJRXvtu0NpQc1JnH99Ekg/exec'; //kawarac_works_list1

async function loadData1() {
    const response1 = await fetch(apiURL1);
    const data1 = await response1.json();
    // console.log(data);
  
    data1.forEach(entry => {
      if (entry.code == code) {
        console.log(entry);
        document.querySelector('title').textContent = entry.name_jp + ' | Kohei Hayashi';
        document.querySelector('.name_jp').textContent = entry.name_jp;
        if (entry.name_en) {document.querySelector('.name_en').textContent = entry.name_en;};
        if (entry.date) {document.querySelector('.date').textContent = 'Date: ' + entry.date ;};
        if (entry.place) {document.querySelector('.place').textContent = 'Place: ' + entry.place ;};
        if (entry.material) {document.querySelector('.material').textContent = 'Material: ' + entry.material;};
        if (entry.tool) {document.querySelector('.tool').textContent = 'Tool: ' + entry.tool;};
        if (entry.info) {document.querySelector('.info').textContent = 'Info: ' + entry.info;};
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
}
function loadData2() {
  const script = document.createElement('script'); //変数名は適当なものにでも
  script.type = "module";
  script.src = "../js/three/" + code + ".js"; //ファイルパス
  document.head.appendChild(script); //<head>に生成
}
  

loadData1();
loadData2();

  
    

  