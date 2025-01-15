const mainImage = document.getElementById('mainImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dragContainer = document.getElementById('drag-container');
const dropAreas = document.querySelectorAll('.drop-area');
const answerInput = document.createElement('input'); // 新增輸入框元素
answerInput.id = "answerInput"; // 給予一個初始的ID

let currentImageIndex = 1;
let dragData = {};
let preloadedImages = [];
let imagesInitialized = false;

// 1. 初始化設定 (使用物件儲存圖片路徑)
const gameConfig = {
    imagePaths: {
        1: 'img/stage3-1.png',
        2: 'img/stage3-2.png',
        3: 'img/stage3-3.png',
        4: 'img/stage3-4.png',
        5: 'img/stage3-5.png',
        6: 'img/stage3-6.png',
        7: 'img/stage3-7.png',
        8: 'img/stage3-8.png',
        9: 'img/stage3-9.png',
        10: 'img/stage3-10.png',
        11: 'img/stage3-11.png',
        12: 'img/stage3-12.png',
        13: 'img/stage3-13.png',
        14: 'img/stage3-14.png',
        15: 'img/stage3-15.png',
        16: 'img/stage3-16.png',
        17: 'img/stage3-17.png',
        18: 'img/stage3-18.png',
    },
    correctAnswers: {
        "location-1": "草漯沙丘",
        "location-2": "白沙岬燈塔",
        "location-3": "觀新藻礁"
    },
    totalImages: 18,
    startImage: 1, //起始圖片
    dragModeImages: [2], //設定要進入拖曳模式的圖片
    answerInputImage: 16, //設定要出現輸入框的圖片
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
        showStartButton: false,
        showPrevButton: imageIndex !== gameConfig.startImage,
        showNextButton: true,
        showAnswerInput: imageIndex === gameConfig.answerInputImage,
    };

    if (imageIndex === gameConfig.startImage) {
        state.showPrevButton = false;
    }
    if (imageIndex === gameConfig.totalImages) {
        state.showNextButton = true; //最後一頁還是顯示next按鈕
    }

    return state;
}


// 2. 圖片切換函式
function updateImage() {
    const state = getImageState(currentImageIndex);

    mainImage.src = state.imagePath;
    dragContainer.style.display = state.dragMode ? 'block' : 'none';
    prevBtn.style.visibility = state.showPrevButton ? 'visible' : 'hidden';
    nextBtn.style.visibility = state.showNextButton ? 'visible' : 'hidden';

     // 處理輸入框的顯示與隱藏
    if (state.showAnswerInput) {
        answerInput.type = 'text';
        answerInput.placeholder = '請輸入答案';
        answerInput.style.display = 'block';
        mainImage.parentElement.insertBefore(answerInput, mainImage.nextSibling) //將輸入框插入到圖片後面

    } else {
        answerInput.style.display = 'none';
        if (answerInput.parentNode) {
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

    alert("這樣的行程安排很完美耶，只是可惜今天海水浴場無法過去!");
    return true;
}
// 4.檢查輸入框的函式
function checkInputAnswer() {
    const inputValue = answerInput.value.trim().toLowerCase(); // 取得輸入值並轉為小寫
    if (inputValue.includes("agriculture")) { // 修改為判斷是否包含 agriculture
        alert('完全正確，這些風景名勝是不是讓人很嚮往呢？');
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
        window.location.href = 'https://guidephy.github.io/internationalFriend/agriculture.html';
        return;
    }

    if (gameConfig.dragModeImages.includes(currentImageIndex)) {
        if (checkAnswers()) {
            currentImageIndex++;
            updateImage();
        }
    } else if (currentImageIndex === gameConfig.answerInputImage) { //檢查輸入框答案
        if (checkInputAnswer()) {
            currentImageIndex++;
            updateImage();
        }
    } else {
        currentImageIndex++;
        updateImage();
    }
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