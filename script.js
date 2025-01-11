const mainImage = document.getElementById('mainImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dragContainer = document.getElementById('drag-container');
const dragItems = document.querySelectorAll('.drag-item');
const dropAreas = document.querySelectorAll('.drop-area');

let currentImage = 1; // 預設顯示第一張圖片
const totalImages = 6; // 總共有幾張圖片
let dragData = {}; //儲存所有被拖曳過的答案，key 是 droppable 的 data-target 值， value是其正確答案
let dragCount = 0;//紀錄被拖曳的物件數量

function updateImage() {
    let imagePath;
    let dragMode = false;
    switch (currentImage) {
        case 1:
            imagePath = 'img/stage1-1.png';
            break;
        case 2:
            imagePath = 'img/stage1-2.png';
            break;
        case 3:
            imagePath = 'img/stage1-3.png';
             break;
         case 4:
            imagePath = 'img/stage1-4.png';
            dragMode = true;
             break;
        case 5:
            imagePath = 'img/stage1-5.png'; // 你的拖曳圖片
            
            break;
       case 6:
             imagePath = 'img/stage1-6.png'; // 下一張圖片
             break;
         default:
             imagePath = 'img/stage1-1.png'; // 預設顯示第一張圖片
             currentImage =1;
    }
    mainImage.src = imagePath;
    dragContainer.style.display = dragMode? 'block':'none'; //只有在拖曳頁面才顯示拖曳區塊

    //重置拖曳狀態
      dragData = {};
      dragCount = 0;
    //重置所有拖曳物件的位置
    dragItems.forEach(item=>{
        item.removeAttribute('style'); //移除所有style
        //確保拖曳區塊沒有任何子元素
        dropAreas.forEach(area=>{
            if(area.dataset.target === item.dataset.belong){
                area.innerHTML="";
            }
        })
    })
}

prevBtn.addEventListener('click', () => {
    currentImage--;
    if (currentImage < 1) {
      currentImage = totalImages;
    }
    updateImage();
});

nextBtn.addEventListener('click', () => {
     if(currentImage === 4){
         //當前在拖曳頁面，檢查答案是否正確
        if(dragCount === 6 &&  Object.keys(dragData).every(target => {
             return dropAreas.find(area=> area.dataset.target === target).firstChild?.dataset.answer === dragData[target];
         })){
            //如果所有答案正確才切換到下一張圖片
              currentImage++;
                if (currentImage > totalImages) {
                    currentImage = 1;
                }
                updateImage();
            }else{
                alert('答案錯誤，請再試一次');
            }
     }else{
            currentImage++;
                if (currentImage > totalImages) {
                    currentImage = 1;
                }
            updateImage();
     }
});


updateImage(); // 初始載入第一張圖片

//拖曳事件
dragItems.forEach(item => {
  item.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.dataset.answer); //儲存答案
    e.dataTransfer.setData('belong', e.target.dataset.belong); //儲存屬於哪個 Droppable
        e.dataTransfer.setData('elementId', e.target.id); //儲存 id
     item.style.opacity = 0.5;
  });

    item.addEventListener('dragend', (e) => {
        item.style.opacity = 1;
  });
});

dropAreas.forEach(area => {
    area.addEventListener('dragover', (e) => {
        e.preventDefault();
     area.classList.add('drag-over');
    });
     area.addEventListener('dragleave', (e) => {
       area.classList.remove('drag-over');
    });

  area.addEventListener('drop', (e) => {
      e.preventDefault();
    area.classList.remove('drag-over');

       const answer = e.dataTransfer.getData('text/plain');
        const belong = e.dataTransfer.getData('belong');
       const elementId = e.dataTransfer.getData('elementId');
         const dropTarget = e.target.dataset.target;

      //確認拖曳目標是否正確
       if (belong === dropTarget){
         if(!area.firstChild){ //如果這個 drop-area 還沒有東西
          const dragElement = document.querySelector(`[data-answer="${answer}"][data-belong="${belong}"]`);
              area.appendChild(dragElement);
               dragData[dropTarget] = answer; //紀錄被拖曳的答案
               dragCount ++;
         }
      }else {
          alert('答案錯誤，請拖曳到正確的位置');
      }

  });

});