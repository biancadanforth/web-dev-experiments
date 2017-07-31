// Generate fake data
function generateData(numElements) {
  const data = [];
  let j = numElements;
  
  for (let i = 0; i < numElements; i++) {
    let website = {};
    const hostname = `www.${i}.com`;
    const dateVisited = i;
    let firstPartyHostnames = [];
    let thirdPartyHostnames = [];
    if (i % 2 === 0) {
      // even numbers are first parties
      thirdPartyHostnames.push(`www.${j}.com`);
      firstPartyHostnames = false;
    } else {
      // odd numbers are third parties
      firstPartyHostnames.push(`www.${j}.com`);
      thirdPartyHostnames = false;
    }
    j--;
    website = {
      hostname: hostname,
      dateVisited: dateVisited,
      firstPartyHostnames: firstPartyHostnames,
      thirdPartyHostnames: thirdPartyHostnames
    };
    data.push(website);
  }
  return data;
}

const numElements = 10000;
let websites = generateData(numElements);

// clear previous storage
async function clearAllDatabaseFromBefore() {
  console.time('clearAllDatabaseFromBefore');
  await localforage.clear();
  console.timeEnd('clearAllDatabaseFromBefore');
}

async function setAll() {
  console.time('setAll');
  for (let i = 0; i < numElements; i++) {
    await localforage.setItem(websites[i].hostname, websites[i]);
  }
  console.timeEnd('setAll');
}

async function getAll() {
  console.time('getAll');
  websites = [];
  for (let i = 0; i < numElements; i++) {
    websites.push(await localforage.getItem(`www.${i}.com`));
  }
  console.timeEnd('getAll');
}

async function getRandomSet() {
  console.time('getRandomSet');
  const numInSet = 10;
  const randomSet = [];
  // generate random numbers
  for (let i = 0; i < numInSet; i++) {
    const randNum = Math.round(Math.random() * numElements);
    // @todo: get website to return the right object from storage...
    const website = await localforage.getItem(`www.${randNum}.com`);
    randomSet.push(website);
  }
  console.timeEnd('getRandomSet');
  console.log("Here's a random subset of data from storage:", randomSet);
  return randomSet;
}

// Update a value for a single website in storage
async function setSingle(index) {
  if (index === 1) {
    console.time('setSingle');
  }
  const website = await localforage.getItem(websites[index].hostname);
  website.dateVisited = Date.now();
  await localforage.setItem(website.hostname, website);
  if (index === 1) {
    console.timeEnd('setSingle');
  }
}

// Update a value for all websites in storage
async function setManySingles() {
  console.time('setManySingles');
  for (let i = 0; i < numElements; i++) {
    await setSingle(i);
  }
  console.timeEnd('setManySingles');
}

// filter for recent site
async function getMostRecentSite() {
  console.time('getMostRecentSite');
  let mostRecentSite = '';
  let mostRecentDate = 0;
  for (const website in websites) {
    if (websites[website]['dateVisited'] > mostRecentDate) {
      mostRecentDate = websites[website]['dateVisited'];
      mostRecentSite = websites[website]['hostname'];
    }
  }
  console.timeEnd('getMostRecentSite');
  console.log('The most recent site is:', mostRecentSite, 'It was visited on:', mostRecentDate);
}

// filter for last 3 sites
async function getLastThreeSites() {
  console.time('getLastThreeSites');
  // sort keys in websites from newest to oldest
  const keysSorted = Object.keys(websites).sort(function(a, b) {
    return websites[b]['dateVisited'] - websites[a]['dateVisited'];
  });
  const lastThreeSites = [keysSorted[0], keysSorted[1], keysSorted[2]];
  console.log('The last 3 sites to be visited were:', lastThreeSites);
  console.timeEnd('getLastThreeSites');
}

async function perfCheck() {
  await clearAllDatabaseFromBefore();
  await setAll();
  await getAll();
  await setManySingles();
  await getRandomSet();
  await getMostRecentSite();
  await getLastThreeSites();
}

perfCheck();