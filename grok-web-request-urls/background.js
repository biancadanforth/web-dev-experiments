'use strict';

runApp();

async function runApp() {
  browser.tabs.create({url: 'index.html'});
}