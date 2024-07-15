document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggle-plugin');
  const moveButton = document.getElementById('move-arc-toolbar');

  // 获取插件状态
  chrome.storage.sync.get('pluginEnabled', (data) => {
    toggleButton.textContent = data.pluginEnabled ? '关闭插件' : '开启插件';
  });

  // 点击按钮切换插件状态
  toggleButton.addEventListener('click', () => {
    chrome.storage.sync.get('pluginEnabled', (data) => {
      const newStatus = !data.pluginEnabled;
      chrome.storage.sync.set({ pluginEnabled: newStatus }, () => {
        toggleButton.textContent = newStatus ? '关闭插件' : '开启插件';

        // 确保内容脚本已注入并通知 content.js 更新状态
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              files: ['content.js']
            }, () => {
              chrome.tabs.sendMessage(tabs[0].id, { pluginEnabled: newStatus }, (response) => {
                if (chrome.runtime.lastError) {
                  console.error("Error sending message to content script:", chrome.runtime.lastError);
                } else {
                  console.log("Response from content script:", response);
                }
              });
            });
          } else {
            console.error("No active tab found");
          }
        });
      });
    });
  });

  // 移动工具栏按钮点击事件
  moveButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['content.js']
        }, () => {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'moveToolbar' }, (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error sending message to content script:", chrome.runtime.lastError);
            } else {
              console.log("Response from content script:", response);
            }
          });
        });
      } else {
        console.error("No active tab found");
      }
    });
  });
});
