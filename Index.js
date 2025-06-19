// ==UserScript==
// @name         Grammatip Mod Menu (Full) + Enable/Disable Træn Selv + Text Editor + Logo Patch
// @namespace    Violentmonkey Scripts
// @match        https://www.grammatip.com/*
// @grant        none
// @version      1.8.5
// @author       emr09
// @description  Adds full mod menu with Træn Selv toggle, editable UI, user info popup, remove mode, and base64 logo.
// ==/UserScript==

(function () {
  'use strict';

  let frieEnabled = localStorage.getItem('frieEnabled') === 'true';

  const base64Logo = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjM0IiBoZWlnaHQ9IjM0Ij4KPHBhdGggZD0iTTAgMCBDMy42ODc1IDEuMzEyNSAzLjY4NzUgMS4zMTI1IDYgMyBDNi4zMyAzLjk5IDYuNjYgNC45OCA3IDYgQzUuMDk0MTc0NjMgNy44NDU4OTM3NiAzLjE3NjgxNjM5IDkuNjc2MjQ1ODggMS4yNSAxMS41IEMwLjcxMTE3MTg4IDEyLjAyNDY0ODQ0IDAuMTcyMzQzNzUgMTIuNTQ5Mjk2ODcgLTAuMzgyODEyNSAxMy4wODk4NDM3NSBDLTQuNTQ2ODc1IDE3IC00LjU0Njg3NSAxNyAtOSAxNyBDLTExLjc1IDE1LjUgLTExLjc1IDE1LjUgLTE0IDE0IEMtMTQgMTguMjcwNTM5MjcgLTExLjY5ODc0MDI4IDE5LjgyODk4MDE4IC05IDIzIEMtOSAyMy42NiAtOSAyNC4zMiAtOSAyNSBDLTYuNjQ5NjA1MDUgMjQuOTg5NTQxNDUgLTYuNjQ5NjA1MDUgMjQuOTg5NTQxNDUgLTQgMjQgQy0yLjI3MTM3ODMyIDIxLjg4MzY3NzMzIC0wLjg1OTcyNjcgMTkuOTI4MzYxOTEgMC41NjI1IDE3LjYyNSBDMi45ODAxMzEyOCAxMy44MDAyMTU0NSA1LjA5MjQ4MjA4IDEwLjQ2MzI0MjU5IDkgOCBDMTIuMTE4NDE2NzggMTIuNjc3NjI1MTcgMTEuNTg3NTE4MjcgMTcuNTIzNzQ5NDggMTEgMjMgQzguNTgwNjQ3MjQgMjguMDE3OTE2ODQgNS4wMDA4MjY5IDMxLjQ5OTU4NjU1IDAgMzQgQy01LjU1NTMxMjQ4IDM0LjUwNzI5NjUgLTEwLjQxODMwMjM2IDM0Ljc2MjYwNDIyIC0xNS41IDMyLjMxMjUgQy0yMi43NjMxMTE2NCAyNS41OTQxMjE3MyAtMjIuNzYzMTExNjQgMjUuNTk0MTIxNzMgLTIzLjIzODI4MTI1IDIwLjM5MDYyNSBDLTIzLjQ4NzM0NzU4IDkuODUxMTg2NTcgLTIzLjQ4NzM0NzU4IDkuODUxMTg2NTcgLTE5IDUgQy0xMi43ODgzOTAyNCAtMC40NzIxMzI0MSAtOC4xMzEyNTMwNiAtMC42MDQyNzgyNiAwIDAgWiAiIGZpbGw9IiM1OEEwNEEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIzLDApIi8+Cjwvc3ZnPgo=";

  function patchAssets() {
    const picture = document.querySelector('picture');
    if (picture) {
      const source = picture.querySelector('source[srcset="/images/logo.svg"]');
      if (source) source.srcset = base64Logo;
      const img = picture.querySelector('img[src="/images/logo.png"]');
      if (img) img.src = base64Logo;
    }

    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = base64Logo;
  }

  function toggleFrieExercisesVisibility() {
    const link = Array.from(document.querySelectorAll('a[href="/student/free-exercises"]'))
      .find(a => a.textContent.includes("Træn selv"));
    if (link) {
      link.style.setProperty('display', frieEnabled ? 'inline-block' : 'none', 'important');
    }
  }

  function removeUnwantedElements() {
    patchAssets();
    toggleFrieExercisesVisibility();

    const footerBar = document.querySelector('.footer-bar.footer-bar-inner.footer-bar-right.bottom');
    if (footerBar) footerBar.remove();

    const abcPanel = document.querySelector('#vue-abc-sidepanel');
    if (abcPanel) abcPanel.remove();

    const functionsBlock = document.querySelector('.functions');
    if (functionsBlock) functionsBlock.remove();

    const headerSetting = document.querySelector('#header-setting-content');
    if (headerSetting && !document.getElementById('mod-menu-link')) {
      const modMenu = document.createElement('a');
      modMenu.id = 'mod-menu-link';
      modMenu.href = '#';
      modMenu.innerHTML = `<i class="ico ico-settings"></i> <span>Mod Menu</span>`;
      modMenu.onclick = (e) => {
        e.preventDefault();
        openModMenuGUI();
      };
      headerSetting.appendChild(modMenu);
    }
  }

  function startRemoveStuffMode() {
    alert("🧹 Remove Stuff Mode Enabled!\nClick anything to remove it.\nPress ESC to exit.");
    const removeHandler = (e) => {
      if (e.target.closest('#mod-menu-gui')) return;
      e.preventDefault();
      e.stopPropagation();
      e.target.remove();
    };
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        document.removeEventListener('click', removeHandler, true);
        document.removeEventListener('keydown', escHandler);
        alert("✅ Remove Stuff Mode Disabled");
      }
    };
    document.addEventListener('click', removeHandler, true);
    document.addEventListener('keydown', escHandler);
  }

  function openModMenuGUI() {
    if (document.getElementById('mod-menu-gui')) return;

    const gui = document.createElement('div');
    gui.id = 'mod-menu-gui';
    gui.style = `
      position: fixed;
      top: 100px;
      left: 100px;
      background: white;
      border: 2px solid black;
      padding: 10px;
      z-index: 9999;
      width: 250px;
      font-family: sans-serif;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      border-radius: 8px;
    `;
    gui.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong>Mod Menu</strong>
        <button id="close-mod-menu" style="border:none;background:transparent;font-size:18px;cursor:pointer;">✕</button>
      </div>
      <hr>
      <button id="show-user-info-mod" style="margin-bottom:10px;width:100%;">Show Username Full Screen</button>
      <button id="edit-text-mod" style="margin-bottom:10px;width:100%;">Edit Text</button>
      <button id="toggle-frie-opgaver" style="margin-bottom:10px;width:100%;">
        ${frieEnabled ? 'Disable' : 'Enable'} Træn Selv
      </button>
      <button id="remove-stuff-mod" style="width:100%;">🧹 Remove Stuff</button>
    `;
    document.body.appendChild(gui);

    let isDragging = false, offsetX = 0, offsetY = 0;
    gui.onmousedown = function (e) {
      if (e.target.id === 'close-mod-menu') return;
      isDragging = true;
      offsetX = e.clientX - gui.offsetLeft;
      offsetY = e.clientY - gui.offsetTop;
    };
    document.onmousemove = function (e) {
      if (isDragging) {
        gui.style.left = (e.clientX - offsetX) + 'px';
        gui.style.top = (e.clientY - offsetY) + 'px';
      }
    };
    document.onmouseup = function () {
      isDragging = false;
    };

    document.getElementById('close-mod-menu').onclick = () => gui.remove();

    document.getElementById('toggle-frie-opgaver').onclick = function () {
      frieEnabled = !frieEnabled;
      localStorage.setItem('frieEnabled', frieEnabled.toString());
      this.innerText = `${frieEnabled ? 'Disable' : 'Enable'} Træn Selv`;
      toggleFrieExercisesVisibility();
    };

    document.getElementById('remove-stuff-mod').onclick = () => {
      gui.remove();
      startRemoveStuffMode();
    };

    document.getElementById('show-user-info-mod').onclick = function () {
      const userInfo = document.querySelector('.user-info');
      const name = userInfo?.querySelector('b')?.innerText || 'Unknown User';
      const school = userInfo?.querySelector('span')?.innerText || 'Unknown School';

      const overlay = document.createElement('div');
      overlay.id = 'user-fullscreen-overlay';
      overlay.style = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: black;
        color: white;
        font-size: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        text-align: center;
        padding: 40px;
      `;
      overlay.innerHTML = `
        This user is logged in as <strong>${name}</strong> from <strong>${school}</strong>
      `;
      document.body.appendChild(overlay);

      const removeOverlay = () => {
        overlay.remove();
        window.removeEventListener('mousemove', removeOverlay);
        window.removeEventListener('keydown', removeOverlay);
      };
      window.addEventListener('mousemove', removeOverlay);
      window.addEventListener('keydown', removeOverlay);
    };

    document.getElementById('edit-text-mod').onclick = () => {
      gui.style.display = 'none';

      const highlight = (el) => {
        el.style.outline = '2px solid rgba(0, 123, 255, 0.7)';
        el.style.cursor = 'pointer';
      };

      const unhighlight = (el) => {
        el.style.outline = '';
        el.style.cursor = '';
      };

      const mouseover = (e) => {
        const el = e.target;
        if (el.closest('#mod-menu-gui') || el.tagName === 'HTML' || el.tagName === 'BODY') return;
        highlight(el);
      };

      const mouseout = (e) => {
        const el = e.target;
        unhighlight(el);
      };

      const clickEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const target = e.target;
        if (!target || target.closest('#mod-menu-gui')) return;

        document.removeEventListener('mouseover', mouseover);
        document.removeEventListener('mouseout', mouseout);
        document.removeEventListener('click', clickEdit, true);

        const originalText = target.innerText;

        const editor = document.createElement('div');
        editor.style = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border: 2px solid black;
          padding: 20px;
          z-index: 10001;
          font-family: sans-serif;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          border-radius: 10px;
        `;
        editor.innerHTML = `
          <div><strong>Edit Text:</strong></div>
          <textarea style="width: 300px; height: 100px; margin-top:10px;">${originalText}</textarea><br><br>
          <button id="save-edit">Save</button>
          <button id="cancel-edit">Cancel</button>
        `;
        document.body.appendChild(editor);

        document.getElementById('save-edit').onclick = () => {
          const newText = editor.querySelector('textarea').value;
          target.innerText = newText;
          target.style.outline = '';
          editor.remove();
          gui.style.display = 'block';
        };

        document.getElementById('cancel-edit').onclick = () => {
          target.style.outline = '';
          editor.remove();
          gui.style.display = 'block';
        };
      };

      document.addEventListener('mouseover', mouseover);
      document.addEventListener('mouseout', mouseout);
      document.addEventListener('click', clickEdit, true);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeUnwantedElements);
  } else {
    removeUnwantedElements();
  }

  const observer = new MutationObserver(removeUnwantedElements);
  observer.observe(document.body, { childList: true, subtree: true });
})();
