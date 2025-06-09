const mainImage = document.getElementById('mainImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dragContainer = document.getElementById('drag-container');
const dropAreas = document.querySelectorAll('.drop-area');
const startBtn = document.getElementById('startBtn');
const answerInput = document.createElement('input'); // 新增輸入框元素
answerInput.id="answerInput" // 給予一個初始的ID

let currentImageIndex = 1;
let dragData = {};
let preloadedImages = [];
let imagesInitialized = false;


// 1. 初始化設定 (使用物件儲存圖片路徑)
const gameConfig = {
    imagePaths: {
        1: 'img/stage1-1.png',
        2: 'img/stage1-2.png',
        3: 'img/stage1-3.png',
        4: 'img/stage1-4.png',
        5: 'img/stage1-5.png',
        6: 'img/stage1-6.png',
        7: 'img/stage1-7.png',
        8: 'img/stage1-8.png',
        9: 'img/stage1-9.png',
        10: 'img/stage1-10.png',
        11: 'img/stage1-11.png',
    },
    correctAnswers: {
        "like-0": "米飯",
        "nation-0": "thailand",
        "like-1": "海邊",
        "nation-1": "indonesia",
        "like-2": "歷史",
        "nation-2": "vietnam"
    },
    totalImages: 11,
    startImage: 1, //起始圖片
    dragModeImages: [4], //設定要進入拖曳模式的圖片
    answerInputImage:9, //設定要出現輸入框的圖片
};
// 圖片預載入
function preloadImages() {
    if (!imagesInitialized) {
        preloadedImages = Object.values(gameConfig.imagePaths).map(path => {
            const img = new Image();
            img.src = path;
            return img;
        });
        imagesInitialized = true;
    }
}
//設定圖片狀態
function getImageState(imageIndex) {
    const state = {
        imagePath: gameConfig.imagePaths[imageIndex] || gameConfig.imagePaths[gameConfig.startImage],
        dragMode: gameConfig.dragModeImages.includes(imageIndex),
        showStartButton: imageIndex === gameConfig.startImage,
        showPrevButton: imageIndex !== gameConfig.startImage,
        showNextButton: imageIndex !== gameConfig.totalImages,
         showAnswerInput: imageIndex === gameConfig.answerInputImage,
    };
  if(imageIndex === gameConfig.startImage){
      state.showPrevButton=false;
      state.showNextButton=false;
  }
  if (imageIndex === gameConfig.totalImages){
     state.showNextButton=true //最後一頁還是顯示next按鈕
  }
     return state;
}


// 2. 圖片切換函式
function updateImage() {
  const state = getImageState(currentImageIndex);

    mainImage.src = state.imagePath;
    dragContainer.style.display = state.dragMode ? 'block' : 'none';
    startBtn.style.display = state.showStartButton ? 'block' : 'none';
    prevBtn.style.visibility = state.showPrevButton ? 'visible' : 'hidden';
    nextBtn.style.visibility = state.showNextButton ? 'visible' : 'hidden';



    // 處理輸入框的顯示與隱藏
    if (state.showAnswerInput) {
       answerInput.type = 'text';
       answerInput.placeholder = '請輸入答案';
         answerInput.style.display='block';
         mainImage.parentElement.insertBefore(answerInput, mainImage.nextSibling) //將輸入框插入到圖片後面

    }else{
           answerInput.style.display='none';
            if(answerInput.parentNode){
               answerInput.parentNode.removeChild(answerInput)
            } // 移除輸入框
    }

    //重置拖曳狀態
    dragData = {};
    //重置所有下拉選單
    dropAreas.forEach(select => {
        select.value = "";
    });
}

// 3. 答案檢查函式
function checkAnswers() {
      const allAnswered = Array.from(dropAreas).every(select => select.value !== "");

    if (!allAnswered) {
        alert('答案不完全正確喔!請重新選擇答案。');
        return false;
    }

      const allCorrect = Object.keys(dragData).every(target => {
          return dragData[target] === gameConfig.correctAnswers[target];
      });

    if (!allCorrect) {
        alert('答案不完全正確喔!請重新選擇答案。');
          return false;
    }

    alert("完全正確喔!看來你己經認識我的朋友了。");
      return true;
}
// 4.檢查輸入框的函式
function checkInputAnswer(){
    const inputValue = answerInput.value.trim().toLowerCase(); // 取得輸入值並轉為小寫
  if (inputValue.includes("erutluc")) {
    alert('完全正確，你的確了解我朋友們國家的重大節慶。');
    return true;
    } else {
      alert('答案不正確喔!請重新輸入答案。');
      return false;
  }

}

// 5. 事件處理
prevBtn.addEventListener('click', () => {
    currentImageIndex--;
     updateImage();
});

nextBtn.addEventListener('click', () => {
      if (currentImageIndex === gameConfig.totalImages) {
        window.location.href = 'https://guidephy.github.io/internationalFriend/culture';
        return;
      }

    if (gameConfig.dragModeImages.includes(currentImageIndex)) {
         if(checkAnswers()){
              currentImageIndex++;
             updateImage();
         }

    } else if (currentImageIndex === gameConfig.answerInputImage) { //檢查輸入框答案
         if(checkInputAnswer()){
            currentImageIndex++;
              updateImage();
         }

    }else{
        currentImageIndex++;
        updateImage();
    }
});

// start 按鈕事件
startBtn.addEventListener('click', () => {
    currentImageIndex++;
      if (currentImageIndex > gameConfig.totalImages) {
        currentImageIndex = gameConfig.startImage;
        }
    updateImage();
});
// 監聽下拉選單
dropAreas.forEach(select => {
    select.addEventListener('change', (e) => {
        dragData[e.target.dataset.target] = e.target.value;
    });
});


// 初始化遊戲
function initGame() {
  preloadImages();
  updateImage(); // 初始顯示圖片
}

initGame();
