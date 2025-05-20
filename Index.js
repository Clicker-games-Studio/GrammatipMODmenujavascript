// ==UserScript==
// @name         Grammatip Mod Menu + Enable/Disable Frie Opgaver (Persistent)
// @namespace    Violentmonkey Scripts
// @match        https://www.grammatip.com/*
// @grant        none
// @version      1.8
// @author       -
// @description  Adds draggable mod menu, text editing, fullscreen username, and a toggle for Frie Opgaver that persists and works across devices.
// ==/UserScript==

(function () {
  'use strict';

  let frieEnabled = localStorage.getItem('frieEnabled') === 'true';

  function removeUnwantedElements() {
    const freeExercises = document.querySelector('a[href="/student/free-exercises"][title="Frie opgaver"]');
    if (freeExercises) {
      freeExercises.style.display = frieEnabled ? 'inline-block' : 'none';
    }

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
      <button id="toggle-frie-opgaver" style="width:100%;">
        ${frieEnabled ? 'Disable' : 'Enable'} Frie Opgaver
      </button>
    `;
    document.body.appendChild(gui);

    // Make draggable
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
          editor.remove();
          gui.style.display = 'block';
        };

        document.getElementById('cancel-edit').onclick = () => {
          editor.remove();
          gui.style.display = 'block';
        };
      };

      document.addEventListener('mouseover', mouseover);
      document.addEventListener('mouseout', mouseout);
      document.addEventListener('click', clickEdit, true);
    };

    document.getElementById('toggle-frie-opgaver').onclick = function () {
      frieEnabled = !frieEnabled;
      localStorage.setItem('frieEnabled', frieEnabled.toString());
      this.innerText = `${frieEnabled ? 'Disable' : 'Enable'} Frie Opgaver`;

      const existingLink = document.querySelector('a[href="/student/free-exercises"][title="Frie opgaver"]');

      if (frieEnabled) {
        if (existingLink) {
          existingLink.style.display = 'inline-block';
        } else {
          const sidebar = document.querySelector('.sidebar .nav') || document.querySelector('.nav');
          if (sidebar) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = "/student/free-exercises";
            a.title = "Frie opgaver";
            a.innerText = "Frie opgaver";
            a.style.display = 'inline-block';
            li.appendChild(a);
            sidebar.appendChild(li);
          }
        }
      } else {
        if (existingLink) existingLink.style.display = 'none';
      }
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
