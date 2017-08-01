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
const data = generateData(numElements);
var db;

// clear previous storage
async function clearAllDatabaseFromBefore() {
  console.time('clearAllDatabaseFromBefore');
  try {
    // @todo: figure out how to get the Dexie equivalent to work
    await indexedDB.deleteDatabase('websites');
  } catch(error) {
    console.log(error.message);
  }
  console.timeEnd('clearAllDatabaseFromBefore');
}

// Define your database
async function makeNewDatabase() {
  db = new Dexie("website_database");
  db.version(1).stores({
    // store: 'primaryKey, index1, index2, ...'
    websites: 'hostname, dateVisited, isVisible'
    // websites is a table
  });
  db.open();
  return db;
}

async function setAll() {
  console.time('setAll');
  await db.websites.bulkPut(data);
  console.timeEnd('setAll');   
}

// Get all websites from storage
async function getAll() {
  console.time('getAll');
  await db.websites.toArray();
  console.timeEnd('getAll');
}

async function getRandomSet() {
  console.time('getRandomSet');
  const randomIndices = [6380, 7159, 3240, 9911, 9775, 6283, 2200, 895, 2948, 5282];
  const randomSet = [];
  for (let i = 0; i < randomIndices.length; i++) {
    const website = await db.websites.where('hostname').equals(`www.${randomIndices[i]}.com`).each((website) => {
      randomSet.push(website);
    });
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
  await db.websites.update(
    `www.${index}.com`,
    { dateVisited: (index % 7 === 0) ? Date.now() : 1470047613000 }
  );
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

// Get most recent site
async function getMostRecentSite() {
  console.time('getMostRecentSite');
  const lastSite = await db.websites.orderBy('dateVisited').last();
  const mostRecentSite = lastSite.hostname;
  const mostRecentDate = lastSite.dateVisited;
  // console.log('The most recent site is:', mostRecentSite, 'It was visited on:', mostRecentDate);
  console.timeEnd('getMostRecentSite');
}

// Get last 3 sites
async function getLastThreeSites() {
  console.time('getLastThreeSites');
  const lastThreeSites = [];
  await db.websites.orderBy('dateVisited').reverse().limit(3).each((website) => {
    lastThreeSites.push(website.hostname);
  });
  // console.log('The last 3 sites to be visited were:', lastThreeSites);    
  console.timeEnd('getLastThreeSites');
}

// Get the last three days worth of isVisible sites
async function getLastThreeDaysVisibleSites() {
  console.time('getLastThreeDaysVisibleSites');
  const currentTime = Date.now();
  const msInDay = 86400000;
  const minTime = currentTime - 3 * (msInDay);
  const results = [];
  await db.websites.where('dateVisited').above(minTime).and((website) => {
    return website.isVisible;
  }).each((website) => {
    results.push(website.hostname);
  });
  // console.log('The visible sites visited in the last 3 days:', results);
  console.timeEnd('getLastThreeDaysVisibleSites');
}

async function perfCheck() {
  await clearAllDatabaseFromBefore();
  db = await makeNewDatabase();
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