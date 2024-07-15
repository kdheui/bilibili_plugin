(function() {
  console.log("Danmaku Classification script loaded");

  function addInterfaceBox() {
    const playerSendingArea = document.querySelector('#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-sending-area > div');
    if (playerSendingArea) {
      Array.from(playerSendingArea.children).forEach(child => {
        child.style.display = 'none';
      });

      const existingBox = document.querySelector('#custom-interface-box');
      if (!existingBox) {
        const box = document.createElement('div');
        box.id = 'custom-interface-box';
        box.style.width = '100%';
        box.style.height = '400px';
        box.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        box.style.border = '3px solid #FB7299';
        box.style.borderRadius = '10px';
        box.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        box.style.position = 'relative';
        box.style.overflow = 'hidden';

        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('images/2333.png');
        img.style.position = 'absolute';
        img.style.top = '-70px';
        img.style.left = '5%';
        img.style.transform = 'translateX(-50%)';
        img.style.width = '100px';
        img.style.height = 'auto';

        box.appendChild(img);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.top = '25px';
        buttonContainer.style.left = '55%';
        buttonContainer.style.transform = 'translateX(-50%)';
        buttonContainer.style.width = '90%';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-around';

        const categories = [
          { name: '感叹', img: 'images/感叹.png' },
          { name: '吐槽', img: 'images/吐槽.png' },
          { name: '应援', img: 'images/应援.png' },
          { name: '剧情讨论', img: 'images/剧情讨论.png' },
          { name: '搞笑', img: 'images/搞笑.png' },
          { name: '知识补充', img: 'images/知识补充.png' },
          { name: '其他', img: 'images/其他.png' }
        ];

        categories.forEach((category, index) => {
          const button = document.createElement('button');
          button.style.padding = '5px 10px';
          button.style.border = '1px solid #FB7299';
          button.style.borderRadius = '5px';
          button.style.backgroundColor = '#fff';
          button.style.cursor = 'pointer';
          button.style.margin = '0 2px';
          button.style.display = 'flex';
          button.style.alignItems = 'center';
          button.style.justifyContent = 'center';
          button.onclick = () => {
            displayDanmakuByCategory(category.name);
            console.log(`按钮 ${category.name} 点击`);
          };

          const img = document.createElement('img');
          img.src = chrome.runtime.getURL(category.img);
          img.alt = category.name;
          img.style.width = '24px';
          img.style.height = '24px';
          img.style.marginRight = '5px';

          const span = document.createElement('span');
          span.innerText = category.name;

          button.appendChild(img);
          button.appendChild(span);
          buttonContainer.appendChild(button);
        });

        box.appendChild(buttonContainer);

        const sketchContainer = document.createElement('div');
        sketchContainer.id = 'sketch-container';
        sketchContainer.style.position = 'absolute';
        sketchContainer.style.top = '100px';
        sketchContainer.style.left = '0';
        sketchContainer.style.width = '100%';
        sketchContainer.style.height = '300px';

        box.appendChild(sketchContainer);
        playerSendingArea.appendChild(box);
      }
    }
  }

  function displayDanmakuByCategory(category) {
    fetch(chrome.runtime.getURL('data/danmaku_data.json'))
      .then(response => response.json())
      .then(data => {
        const filteredDanmaku = data.filter(danmaku => danmaku.Category_New === category);
        filteredDanmaku.sort((a, b) => new Date(a.Time) - new Date(b.Time));

        console.log(`显示 ${category} 类别的弹幕`);
        filteredDanmaku.forEach(danmaku => {
          console.log(`${danmaku.Time}: ${danmaku.Text}`);
        });

        // 在 p5.js 中绘制弹幕路径（此处为示例）
        // 此处可加入绘制逻辑，例如调用特定函数绘制不同类别的路径
      })
      .catch(error => console.error('Error loading danmaku data:', error));
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message:", request);
    if (request.pluginEnabled !== undefined) {
      if (request.pluginEnabled) {
        enableDanmakuClassification();
      } else {
        disableDanmakuClassification();
      }
      sendResponse({ status: "success" });
    } else if (request.action === 'moveToolbar') {
      moveArcToolbar();
      sendResponse({ status: "toolbar moved" });
    } else {
      sendResponse({ status: "unknown request" });
    }
  });

  chrome.storage.sync.get('pluginEnabled', (data) => {
    if (data.pluginEnabled) {
      enableDanmakuClassification();
    }
  });

  function enableDanmakuClassification() {
    console.log("Danmaku Classification Enabled");
    addInterfaceBox();
    hideArcToolbarContents();
    hidePlaceholders();
    
    const rightContainer = document.querySelector('#mirror-vdcon > div.right-container.is-in-large-ab');
    if (rightContainer) {
      rightContainer.style.display = 'none';
    }

    const playerPrimaryArea = document.querySelector('#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-sending-area > div');
    if (playerPrimaryArea) {
      playerPrimaryArea.style.height = '200%';
    }
  }

  function disableDanmakuClassification() {
    console.log("Danmaku Classification Disabled");

    const rightContainer = document.querySelector('#mirror-vdcon > div.right-container.is-in-large-ab');
    if (rightContainer) {
      rightContainer.style.display = '';
    }

    const playerPrimaryArea = document.querySelector('#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-sending-area > div');
    if (playerPrimaryArea) {
      playerPrimaryArea.style.height = '';
      Array.from(playerPrimaryArea.children).forEach(child => {
        child.style.display = '';
      });
    }

    const interfaceBox = document.querySelector('#custom-interface-box');
    if (interfaceBox) {
      interfaceBox.remove();
    }

    showArcToolbarContents();
    showPlaceholders();
  }

  function moveArcToolbar() {
    console.log("Moving #arc_toolbar_report");

    const arcToolbarReport = document.querySelector('#arc_toolbar_report');
    const playerPrimaryArea = document.querySelector('#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-sending-area > div');
    if (arcToolbarReport && playerPrimaryArea) {
      playerPrimaryArea.appendChild(arcToolbarReport);
    }
  }

  function hideArcToolbarContents() {
    const arcToolbarReport = document.querySelector('#arc_toolbar_report');
    if (arcToolbarReport) {
      Array.from(arcToolbarReport.children).forEach(child => {
        child.style.display = 'none';
      });
    }
  }

  function showArcToolbarContents() {
    const arcToolbarReport = document.querySelector('#arc_toolbar_report');
    if (arcToolbarReport) {
      Array.from(arcToolbarReport.children).forEach(child => {
        child.style.display = '';
      });
    }
  }

  function hidePlaceholders() {
    const placeholderBottomLeft = document.querySelector('#bilibili-player-placeholder-bottom-left');
    const placeholderBottomRight = document.querySelector('#bilibili-player-placeholder-bottom-right');
    if (placeholderBottomLeft) placeholderBottomLeft.style.display = 'none';
    if (placeholderBottomRight) placeholderBottomRight.style.display = 'none';
  }

  function showPlaceholders() {
    const placeholderBottomLeft = document.querySelector('#bilibili-player-placeholder-bottom-left');
    const placeholderBottomRight = document.querySelector('#bilibili-player-placeholder-bottom-right');
    if (placeholderBottomLeft) placeholderBottomLeft.style.display = '';
    if (placeholderBottomRight) placeholderBottomRight.style.display = '';
  }

  // 确保页面刷新后界面框仍然存在
  window.addEventListener('load', () => {
    chrome.storage.sync.get('pluginEnabled', (data) => {
      if (data.pluginEnabled) {
        enableDanmakuClassification();
      }
    });
  });
})();
