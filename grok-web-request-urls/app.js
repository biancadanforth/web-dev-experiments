// NOTE: commented out for now, since I couldn't get the service worker
// to run in the Web Extension context. I have duplicated this code (app.js and service-worker.js)
// and hosted it over HTTPS at biancadanforth.github.io/web-request-test.

// // Register the ServiceWorker
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('service-worker.js', {
//   scope: '.'
//   }).then(function(registration) {
//   console.log('The service worker has been registered ', registration);
//   });
// }

// navigator.serviceWorker.ready.then(addIFrame);
// const swContainer = document.getElementById('sw-container');
// let iframe = document.createElement('iframe');

// function addIFrame() {
//   swContainer.appendChild(iframe);
//   loadIFrame();
// }

// function loadIFrame() {
//   iframe.src = 'third-party-doc.html';
// }