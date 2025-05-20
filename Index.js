// ==UserScript==
// @name         Grammatip Mod Menu + Enable/Disable Frie Opgaver (Persistent) + Logo Patch
// @namespace    Violentmonkey Scripts
// @match        https://www.grammatip.com/*
// @grant        none
// @version      1.8.2
// @author       -
// @description  Adds mod menu, editable UI, Frie opgaver toggle, and logo image patch to base64.
// ==/UserScript==

(function () {
  'use strict';

  let frieEnabled = localStorage.getItem('frieEnabled') === 'true';

  const base64Logo = "PHN2ZyB2ZXJzaW9uPSIxLjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDM0IDM0IiB3aWR0aD0iMzQiIGhlaWdodD0iMzQiPgoJPHRpdGxlPmxvZ28gKDE8L3RpdGxlPgoJPGRlZnM+CgkJPGltYWdlICB3aWR0aD0iMzQiIGhlaWdodD0iMzQiIGlkPSJpbWcxIiBocmVmPSJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNJQUFBQWlDQU1BQUFBTm1mdndBQUFBQVhOU1IwSUIyY2tzZndBQUF0TlFURlJGQUFBQVNwRGlTcERpU3BEaUxycU5PcWl5QVA0QkFQOEFBdndIU3BEaVNwRGlTcERpU3BEaVNwRGlTcERpL0FJRThRc1M1QllpQWYwRUFmNENBdndGQS9zSlNwRGlTcERpU3BEaVNwRGk2aEFhK3dNRS9RRUMrd01GQVA4QkFmMERBUDRDQWY0REJ2WVRTcERpU3BEaVNwRGloR0taOUFrTzlnY00vZ0VCL3dBQS9nQUJTcERpU3BEaVNwRGl1amRXL3dBQjhnb1FBdjBFQXYwRkF2d0dSWmpTU3BEaStnUUcvZ0VDOHdvUCtnUUhTcERpU3BEaTlRZ005d1lLQWYwRkFmNEJTcERpU3BEaTJ4MHRLNzZFU3BEaVNwRGk0eFlqOXdjSy9BSURLY0o5U3BEaVNwRGlkRzZ1K1FVSS9RSUMvUUlEU3BEaVNwRGlTcERpU3BEaTZ4QVord1FGU3BEaVNwRGlTcERpU3BEaTVCVWk4QXdUU3BEaVNwRGlTcERpWklpemY0Q0JiNFdlU3BEaTV4TWUrQVlKU3BEaVNwRGl4eTFHU3BEaVNwRGllb0tLZjRDQ2NJV2NTcERpU3BEaTlnY0w1aFFmU3BEaVNwRGl1VGhZU3BEaWE0YWxmWUdHWllpeVU0blc2UkljN1E0V2kxeVJTcERpWTN6Q2lGNlVTcERpU3BEaVlvbTJlb0tMZ0lDQWdJQ0JlSUtQU3BEaWFYZTc3d3dUU3BEaVNwRGlTcERpQS9vS0Evc0lTcERpVkkzUVpZaXhmSUdJZG9PVFdJeko5L29LLy84QS8vOEIvdjhCL1AwRStmd0hTcERpU3BEaUtjRjlTcERpVkkzUWZvR0Rmb0dFZFlPVC92NEMrdndIKy93RlNwRGlTcERpU3BEaWVJS085ZmtNK2ZzSVNwRGlTcERpZDRPUTdQTVkvdjRCK2ZzSWRZT1Rib1doajd1TDlma011TlJZU3BEaVZZM09mSUdIU3BEaS9mNEQ5L29LZ3JLZDF1WXpscitEYllXaWZvQ0RmWUdGWW9tMzcvVVUrdndHK1BzSlNwRGlTcERpVzR2RXplQSsvZjRDOXZvTGFhTzhTcERpU3BEaVNwRGkrL3dHKy8wRVNwRGk5dmtMU3BEaVNwRGkrLzBGU3BEaVNwRGkrUHNJU3BEaVNwRGl4dHhIN3ZVVjlQZ05TcERpU3BEaStQc0hkNnVxU3BEaVNwRGlaS0RDOC9nTzl2a01WWmZVU3BEaVNwRGlTcERpU3BEaVNwRGlTcERpU3BEaUU3S0RKUUFBQVBGMFVrNVRBQk5iajlMaS8vLy81Ymx6SEN1Yi8vLy8vLy8vLzZBcU5Mai8vLy8vLy8vLy8vK3VMRlg4Ly8vLy8vK0ZBMjMvLy8vLy8vK29hdi8vLy84bVZ2Ly8vLy9TSVAzTURMci8vLysxRURuLy8vLy9kQ0hhc2YvLzN2L0JDLy8vU3hUWS8vLy9ULy8vMVpqL1A4My8vLzlrbWYvOEgzRC9PLy8vLzhULy8vbzExdjlsYi8vLy8vLy96K0gveWhYSC8vOXBUZi8vLy9IKy8vLy8vLytHaWIwTjYvLy8vLy8vLzE1UXRmMzkvek55K2ZmLy92M3B0di9yQ3RqL1V2Ly9wakZ2L1AvLyt2Yi8vZzYrdEh2Ly83QkdMN0wvLzZYLzhrci8rajcvKzFHTi92L21PUC8vcEJHOS8vLy93RGV2ME9UM1g1WHRqVjhBQUFNUlNVUkJWSGljWFpSWlRCTlJGSWJQMzdvRVo2WlVzSmxwMFVDMGhRZWlDZUlDc2NhNFJrVVROU1FtUFBoaWZITUpHalhHSlJoZmlBc2FFK09MVy9UQkpSb2Z4RDJvcUtoUmFEQ0NVUXNJQWR0cHdTanRqQUdYWHU4ZG9DM2NsM3Z1T1YvK09mZWNjd2VVV2toYlJwbzdhU2xXeU9TV0RHWURJbU1SVGNRdG5iQXFnaDV1dFkxQ2ZDSVlkMENYNHliVExBSFZMdUZEQ3BrRmZKMCtRR0JSYVVxckNsM0ZsRTdKbUk1M1NXUWVZcFNKbjVOYlBWRkROanhaWDhrazJaU1Z4TlNHWWNUZng3T1lvUFM1Qm1OUmc2RUVIWVpNRWRXZWh5ZkRLa3NRNGp0ejlTYnNUS2lvRVZuaUVXTTJIbytrdXdMOXpsYUZjcnNZeURRY0lYNGpsUk1sOTBTODdDNUgxcUM1cU0rbHgvTS9UeHlrZ1pDSFMzSWl1dXEySURaZ3NCWlVqdGRUdXgxa2xMYmsvdWlQR3FVZEVaSkFQeEtDa011QXE2akEwM2xmV01pZFVSaGdNVWZVUWYvSWxHalJGVUZzRXRYcXhHYTAvZ1FqUHovY2NTcC9QaWc4VmZ2S3M0Sll6Z3RxeXNDT1FNYzBvaEtnWmhldXg4WVJrOGxlZnN5NnlxU3RpSko2QWZ1QU9tTExjWVRJVzRHTENHdm10aXFMT0R6U3RlcFlyL2RWNzdvOXdubU1uMDlSWmFWRm5FSlFJejJmdTg3QWFqMjJXUDV6ZXpJUGJMYXNDOXpYemV1V1k4T1ZPTjk1VHFpd0lsZDNob2Q2ZnkzWU1VT1VOcndRTjc0emJ0a1NMcFNuRFNEZGlqZHFmTk5KbW8vYmY4ZUhMY2k5anFVSWI4MGprNHZvYnNySlJtMFBFYStrVGNvQ1ZpV1JCN1ZDbzEweXBiV3I4U2lpNlJRbmhkeHR2cVhKenp6VlJQTjVTVUgzOGVUN0FKRTVwRE5wOFJBaDE5NTArL0dDaVd3M1ZvTmU5c2taNzIwSjVkYy9uNFJTQzNuek9hK1RLTytTbDZzc213OTYyK1YwL243dkMvb21OOUxjWWtFRWpxWmRiVzhSSDZubWx0aUNocm52eVArS3RHczBadTJmS2FaT3JYdnUwMGtMY29iVmp5RU9ucSt4eHZ0anlDam9hZGYwNHFiaUU2T0pLaFFNUDVLVFpmMmZUTW9laVB2T2owYWFnalR5MUtyV04vajBPZlVKMjdOMDRBaThsRVNvSFhpbzVEZDYwMVdxa1V0cENLa0xEemtEVW52WjdpUnhIRGswQ3VIL2hzREhRajZudzZmVGNJMEVVZ2pSdC9vVlloWVpZK08yWDA2NS93T3BZQTFKN214T1RRQUFBQUJKUlU1RXJrSmdnZz09Ii8+Cgk8L2RlZnM+Cgk8c3R5bGU+Cgk8L3N0eWxlPgoJPHVzZSBpZD0iQmFja2dyb3VuZCIgaHJlZj0iI2ltZzEiIHg9IjAiIHk9IjAiLz4KPC9zdmc+"; // Replace this with your actual base64 content

  function patchAssets() {
  const base64Data = `data:image/svg+xml;base64,${base64Logo}`;

  // Replace <picture> logo
  const picture = document.querySelector('picture');
  if (picture) {
    const source = picture.querySelector('source[srcset="/images/logo.svg"]');
    if (source) {
      source.srcset = base64Data;
    }
    const img = picture.querySelector('img[src="/images/logo.png"]');
    if (img) {
      img.src = base64Data;
    }
  }

  // Replace favicon
  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }
  favicon.href = base64Data;
}
  function replaceFaviconWithBase64(base64Data) {
    const existingIcons = document.querySelectorAll('link[rel*="icon"]');
    existingIcons.forEach(el => el.remove()); // Remove existing favicons

    const newIcon = document.createElement('link');
    newIcon.type = 'image/x-icon';
    newIcon.rel = 'shortcut icon';
    newIcon.href = `data:image/x-icon;base64,${base64Data}`;
    document.head.appendChild(newIcon);
}

// Example call (replace with your actual base64 icon data)
const myFaviconBase64 = 'AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAMAAAAAAAAAAAAAAAEA...';
replaceFaviconWithBase64(myFaviconBase64);



  function removeUnwantedElements() {
    patchAssets(); // ✅ Correct

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
      <button id="toggle-frie-opgaver" style="width:100%;">${frieEnabled ? 'Disable' : 'Enable'} Frie Opgaver</button>
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
          target.style.outline = ''; // Remove blue box
          editor.remove();
          gui.style.display = 'block';
        };

        document.getElementById('cancel-edit').onclick = () => {
          target.style.outline = ''; // Remove blue box
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
