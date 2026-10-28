// Capture beforeinstallprompt early, before React hydrates
(function () {
  window.__pwaInstallPrompt = null;
  window.__pwaInstalled = false;

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    window.__pwaInstallPrompt = e;
    // Notify any listener
    window.dispatchEvent(new Event('pwa-install-available'));
  });

  window.addEventListener('appinstalled', function () {
    window.__pwaInstalled = true;
    window.dispatchEvent(new Event('pwa-installed'));
  });

  // Detect standalone mode (already installed)
  if (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  ) {
    window.__pwaInstalled = true;
  }
})();