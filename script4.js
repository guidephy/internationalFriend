const mainImage = document.getElementById('mainImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dragContainer = document.getElementById('drag-container');
const startBtn = document.getElementById('startBtn'); // 保留，但不會被顯示
const answerInput = document.createElement('input');
answerInput.id = "answerInput";
const mitaimeDragArea = document.getElementById('mitaime-drag-area');
const stepCards = document.querySelectorAll('.step-card');
const targetArea = document.getElementById('target-area');
const farewellContainer = document.getElementById('farewell-container'); // 新增
let draggedItem = null;

let currentImageIndex = 1;
let preloadedImages = [];
let imagesInitialized = false;
const correctOrder = ["1", "2", "3", "4", "5", "6", "7"];//正確順序

// 1. 初始化設定 (使用物件儲存圖片路徑)
const gameConfig = {
    imagePaths: {
        1: 'img/stage4-1.png',
        2: 'img/stage4-2.png',
        3: 'img/stage4-3.png',
        4: 'img/stage4-4.png',
        5: 'img/stage4-5.png',
        6: 'img/stage4-6.png',
        7: 'img/stage4-7.png',
        8: 'img/stage4-8.png',
        9: 'img/stage4-9.png',
        10: 'img/stage4-10.png',
        11: 'img/stage4-11.png',
        12: 'img/stage4-12.png',
        13: 'img/stage4-13.png',
        14: 'img/stage4-14.png',
        15: 'img/stage4-15.png',
        16: 'img/stage4-16.png',
        17: 'img/stage4-17.png'
    },
    totalImages: 17,
    startImage: 1, //起始圖片
    dragModeImages: [5], //設定要進入拖曳模式的圖片
    answerInputImage: 10, //設定要出現輸入框的圖片
    mitaimeDragImage:5, //米苔目拖曳模式的圖片
    nextPageURL:"https://guidephy.github.io/internationalFriend/gancyuanTemple",//下一頁網址
    answerKeyWord:"friend", //輸入框關鍵字
    farewellPages: {  //新增
      14: { text: "ขอบคุณ, ลาก่อน!", audio: "img/thai_farewell.mp3" ,},
      15: { text: "Cảm ơn, Tạm biệt!", audio: "img/vietnamese_farewell.mp3" },
      16: { text: "Terima kasih, Sampai jumpa!", audio: "img/indonesian_farewell.mp3" },
    },
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
        showStartButton: false,  //Start按鈕永遠不顯示
        showPrevButton: imageIndex !== gameConfig.startImage,
        showNextButton: true, // 總是顯示 Next 按鈕
        showAnswerInput: imageIndex === gameConfig.answerInputImage,
        showMitaimeDrag:imageIndex === gameConfig.mitaimeDragImage,
        farewell: gameConfig.farewellPages[imageIndex] || null,
    };

   if (imageIndex === gameConfig.totalImages){
        state.showNextButton=false //最後一頁不顯示next按鈕
    }
    return state;
}

// 2. 圖片切換函式
function updateImage() {
    const state = getImageState(currentImageIndex);

    mainImage.src = state.imagePath;
    prevBtn.style.visibility = state.showPrevButton ? 'visible' : 'hidden';
    nextBtn.style.visibility = state.showNextButton ? 'visible' : 'hidden';
    // 根據狀態顯示/隱藏元素
    dragContainer.style.display = state.dragMode ? 'block' : 'none';
    
    // 米苔目拖曳
    handleMitaimeDrag(state.showMitaimeDrag);
    // 處理輸入框的顯示與隱藏
    handleAnswerInput(state.showAnswerInput);
     // 處理道別語和音訊播放
    handleFarewell(state.farewell);
}
//處理米苔目拖曳
function handleMitaimeDrag(showMitaimeDrag){
      if (showMitaimeDrag) { // 根據你的圖片編號
        mitaimeDragArea.style.display = 'block';
        mitaimeDragArea.style.height = 'auto';// 顯示時將高度設為 auto
        targetArea.innerHTML = ""; //清空目標區
        stepCards.forEach(card => {
            card.style.display = 'block'; //顯示拖曳卡片
        });
    } else {
        mitaimeDragArea.style.display = 'none';
        mitaimeDragArea.style.height = '0';// 隱藏時高度設為 0

    }
}
//處理輸入框
function handleAnswerInput(showAnswerInput){
    if (showAnswerInput) {
         answerInput.style.display = 'block'; //確保顯示
        // 建議：增加 placeholder 屬性，讓使用者知道要輸入什麼
         answerInput.placeholder = '請輸入答案'; // 加入 placeholder
        if (!answerInput.parentNode || answerInput.parentNode !== mainImage.parentElement) {
            mainImage.parentElement.insertBefore(answerInput, mainImage.nextSibling)
        }
    } else {
        answerInput.style.display = 'none';
        if (answerInput.parentNode) {
            answerInput.parentNode.removeChild(answerInput);
        }
    }
}
//處理道別語
function handleFarewell(farewellData) {
    farewellContainer.innerHTML = "";
    if (farewellData) {
        farewellContainer.style.display = 'flex';//顯示容器
        const farewellText = document.createElement('span');
        farewellText.textContent = farewellData.text;

        const audioIcon = document.createElement('img');
        audioIcon.src = "img/speaker.png";
        audioIcon.alt = "播放音訊";
        audioIcon.classList.add("audio-icon");//增加class
        audioIcon.style.cursor = "pointer";

        audioIcon.addEventListener('click', () => {
            const audio = new Audio(farewellData.audio);

            audio.addEventListener('loadeddata', () => { // 加入 loadeddata 事件監聽器
                audio.play()
                    .catch(error => { // 加入錯誤處理
                        console.error('音訊播放失敗:', error);
                    });

            });
            audio.addEventListener('error', (error) => { // 添加 error 事件監聽器
                console.error('音訊載入錯誤:', error);
            });

        });

        farewellContainer.appendChild(farewellText);
        farewellContainer.appendChild(audioIcon);
    } else {
        farewellContainer.style.display = 'none'; //隱藏容器
    }
}
// 3. 檢查輸入框的函式
function checkInputAnswer() {
    const inputValue = answerInput.value.trim().toLowerCase(); // 取得輸入值並轉為小寫
    if (inputValue.includes(gameConfig.answerKeyWord)) {
        alert('完全正確，你己經對東南亞的農業和飲食有初步的了解了。');
        return true;
    } else {
        alert('答案不正確喔!請重新輸入答案。');
        return false;
    }
}


// 點擊卡片事件
stepCards.forEach(card => {
    card.addEventListener('click', () => {
        if (card.parentElement.id === 'step-cards') {
            targetArea.appendChild(card);
             card.classList.add('selected');
        } else {
            document.getElementById('step-cards').appendChild(card);
              card.classList.remove('selected');
        }
    });
});

// 5. 事件處理
prevBtn.addEventListener('click', () => {
    currentImageIndex--;
    updateImage();
});

nextBtn.addEventListener('click', () => {
     if (currentImageIndex === gameConfig.totalImages) {
          window.location.href = gameConfig.nextPageURL;
          return;
     }

    if (currentImageIndex === gameConfig.answerInputImage) { //檢查輸入框答案
        if (checkInputAnswer()) {
            currentImageIndex++;
            updateImage();
        }

    } else if (currentImageIndex === gameConfig.mitaimeDragImage) {
        // 檢查米苔目順序
        const droppedCards = Array.from(targetArea.querySelectorAll('.step-card'));
        const userOrder = droppedCards.map(card => card.dataset.step);
        const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);

        if (isCorrect) {
            alert('太棒了！你成功做出美味米苔目囉！');
            // 答對後，將 currentImageIndex 增加，並更新畫面。
             stepCards.forEach(card => {
                card.style.display = 'none'; //隱藏拖曳卡片
            });
            currentImageIndex++;
            updateImage();

        } else {
            alert('再試一次，順序好像有點不對喔！');
        }

    } else {
        currentImageIndex++;
        updateImage();
    }
});


// 初始化遊戲
function initGame() {
    preloadImages();
    updateImage(); // 初始顯示圖片
}

initGame();