const mainImage = document.getElementById('mainImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dragContainer = document.getElementById('drag-container');
const dropAreas = document.querySelectorAll('.drop-area');
const startBtn = document.getElementById('startBtn'); // 取得按鈕元素

let currentImage = 1;
const totalImages = 6;
let dragData = {};

// 設定正確答案的物件
const correctAnswers = {
    "like-0": "米飯",
    "nation-0": "thailand",
    "like-1": "海邊",
    "nation-1": "indonesia",
    "like-2": "歷史",
    "nation-2": "vietnam"
};

// 圖片預載入陣列
const imagePaths = [
  'img/stage1-1.png',
  'img/stage1-2.png',
  'img/stage1-3.png',
  'img/stage1-4.png',
  'img/stage1-5.png',
  'img/stage1-6.png'
];
let preloadedImages = []; // 儲存預載入的圖片
let imagesInitialized = false; // 判斷是否初始化圖片陣列


function updateImage() {
    let imagePath;
    let dragMode = false;

    //在 `updateImage` 開始時，判斷是否需要初始化圖片陣列
    if (!imagesInitialized) {
        preloadedImages = imagePaths.map(path => {
            const img = new Image();
            img.src = path;
            return img;
        });
         imagesInitialized = true;
    }

    switch (currentImage) {
        case 1:
            imagePath = 'img/stage1-1.png';
            startBtn.style.display = 'block'; // 顯示 start 按鈕
            document.getElementById('prevBtn').style.visibility='hidden';
            document.getElementById('nextBtn').style.visibility='hidden';

            break;
        case 2:
            imagePath = 'img/stage1-2.png';
             startBtn.style.display = 'none';// 隱藏 start 按鈕
            document.getElementById('prevBtn').style.visibility='hidden';
            document.getElementById('nextBtn').style.visibility='visible';
            break;
        case 3:
            imagePath = 'img/stage1-3.png';
             document.getElementById('prevBtn').style.visibility='visible';
             break;
        case 4:
            imagePath = 'img/stage1-4.png';
             dragMode = true;
             break;
        case 5:
            imagePath = 'img/stage1-5.png';
            break;
        case 6:
             imagePath = 'img/stage1-6.png';
             break;
        case 7:
            imagePath = 'img/stage1-7.png';
            break;
        case 8:
            imagePath = 'img/stage1-8.png';
             break;
        case 9:
            imagePath = 'img/stage1-9.png';
             dragMode = true;
             break;
        case 10:
            imagePath = 'img/stage1-10.png';
            break;
        case 11:
             imagePath = 'img/stage1-11.png';
            document.getElementById('nextBtn').style.visibility='hidden';
             break;
         default:
             imagePath = 'img/stage1-1.png';
               startBtn.style.display = 'block'; // 顯示 start 按鈕
             currentImage =1;
    }
    mainImage.src = imagePath;
    dragContainer.style.display = dragMode? 'block':'none';

     //重置拖曳狀態
     dragData = {};
    //重置所有下拉選單
    dropAreas.forEach(select=>{
          select.value="";
      })
}

prevBtn.addEventListener('click', () => {
    currentImage--;

    updateImage();
});

nextBtn.addEventListener('click', () => {
    if (currentImage === 4) {
        // 檢查是否所有下拉選單都已選擇答案
        const allAnswered = Array.from(dropAreas).every(select => select.value !== "");

        if (allAnswered) {
            // 檢查答案是否正確
            const allCorrect = Object.keys(dragData).every(target => {
                return dragData[target] === correctAnswers[target];
            });

            if (allCorrect) {
                currentImage++;
                alert("完全正確喔!看來你己經認識我的朋友了。");
                  updateImage();
            } else {
                alert('答案不完全正確喔!請重新選擇答案。');
            }
        } else {
             alert('答案不完全正確喔!請重新選擇答案。');
         }
    } else {
        currentImage++;

        updateImage();
    }
});

updateImage();

 //監聽下拉選單
dropAreas.forEach(select => {
  select.addEventListener('change', (e) => {
    dragData[e.target.dataset.target] = e.target.value; //儲存答案
  });
});

// start 按鈕的點擊事件
startBtn.addEventListener('click', () => {
    currentImage++;
      if (currentImage > totalImages) {
            currentImage = 1;
        }
    updateImage();
});