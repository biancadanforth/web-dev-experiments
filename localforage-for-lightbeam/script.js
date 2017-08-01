// Generate fake data
function generateData(numElements) {
  const data = [];
  let j = numElements;
  // the fibonacci sequence up to, not including N = 10000
  const isVisibleIndices = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765];

  for (let i = 0; i < numElements; i++) {
    let website = {};
    const hostname = `www.${i}.com`;
    const dateVisited = i;
    let isVisible;
    if (isVisibleIndices.includes(i)) {
      isVisible = 1;
    } else {
      isVisible = 0;
    }
    website = {
      hostname: hostname,
      dateVisited: dateVisited,
      isVisible: isVisible
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
    websites.push(localforage.getItem(`www.${i}.com`));
  }
  const resolvedWebsites = await Promise.all(websites);
  console.timeEnd('getAll');
  return resolvedWebsites;
}

async function getRandomSet() {
  console.time('getRandomSet');
  const randomIndices = [6380, 7159, 3240, 9911, 9775, 6283, 2200, 895, 2948, 5282];
  const randomSet = [];
  for (let i = 0; i < randomIndices.length; i++) {
    const website = await localforage.getItem(`www.${randomIndices[i]}.com`);
    randomSet.push(website);
  }
  console.timeEnd('getRandomSet');
  // console.log("Here's a random subset of data from storage:", randomSet);
  return randomSet;
}

// Update a value for a single website in storage
async function setSingle(index) {
  if (index === 1) {
    console.time('setSingle');
  }
  const website = await localforage.getItem(`www.${index}.com`);
  website.dateVisited = (index % 7 === 0) ? Date.now() : 1470047613000;
  await localforage.setItem(website.hostname, website);
  if (index === 1) {
    console.timeEnd('setSingle');
  }
}

// Update a value for all websites in storage
async function setManySinglesBlocking() {
  console.time('setManySinglesBlocking');
  for (let i = 0; i < numElements; i++) {
    await setSingle(i);
  }
  console.timeEnd('setManySinglesBlocking');
}

// Update a value for all websites in storage
async function setManySinglesUnblocking() {
  console.time('setManySinglesUnblocking');
  for (let i = 0; i < numElements; i++) {
    setSingle(i);
  }
  console.timeEnd('setManySinglesUnblocking');
}

// filter for recent site
async function getMostRecentSite() {
  console.time('getMostRecentSite');
  const websites = await getAll();
  let mostRecentSite = '';
  let mostRecentDate = 0;
  for (const website in websites) {
    if (websites[website]['dateVisited'] > mostRecentDate) {
      mostRecentDate = websites[website]['dateVisited'];
      mostRecentSite = websites[website]['hostname'];
    }
  }
  console.timeEnd('getMostRecentSite');
  // console.log('The most recent site is:', mostRecentSite, 'It was visited on:', mostRecentDate);
}

// filter for last 3 sites
async function getLastThreeSites() {
  console.time('getLastThreeSites');
  const websites = await getAll();
  // sort keys in websites from newest to oldest
  const keysSorted = Object.keys(websites).sort(function(a, b) {
    return websites[b]['dateVisited'] - websites[a]['dateVisited'];
  });
  const lastThreeSites = [keysSorted[0], keysSorted[1], keysSorted[2]];
  // console.log('The last 3 sites to be visited were:', lastThreeSites);
  console.timeEnd('getLastThreeSites');
}

// Get the last three days worth of isVisible sites
async function getLastThreeDaysVisibleSites() {
  console.time('getLastThreeDaysVisibleSites');
  const websites = await getAll();
  const currentTime = Date.now();
  const msInDay = 86400000;
  const minTime = currentTime - 3 * (msInDay);
  const results = websites.filter(function(website) {
    return (website.isVisible && website.dateVisited > minTime);
  });
  // printing large objects can slow down the timer
  // console.log('The visible sites visited in the last 3 days:', results);
  console.timeEnd('getLastThreeDaysVisibleSites');
}

async function perfCheck() {
  await clearAllDatabaseFromBefore();
  await setAll();
  await getAll();
  await setManySinglesBlocking();
  await setManySinglesUnblocking();
  await getRandomSet();
  await getMostRecentSite();
  await getLastThreeSites();
  await getLastThreeDaysVisibleSites();
}

perfCheck();