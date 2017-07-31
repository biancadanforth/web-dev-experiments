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
    websites: 'hostname, dateVisited, isVisible, firstPartyHostnames, thirdPartyHostnames'
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
  const numInSet = 10;
  const randomSet = [];
  // generate random numbers
  for (let i = 0; i < numInSet; i++) {
    const randNum = Math.round(Math.random() * numElements);
    // @todo: get website to return the right object from storage...
    const website = await db.websites.where('hostname').equals(`www.${randNum}.com`).each((website) => {
      randomSet.push(website);
    });
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
  await db.websites.update(
    `www.${index}.com`,
    { dateVisited: Date.now()}
  );
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

// Get most recent site
async function getMostRecentSite() {
  console.time('getMostRecentSite');
  const lastSite = await db.websites.orderBy('dateVisited').last();
  const mostRecentSite = lastSite.hostname;
  const mostRecentDate = lastSite.dateVisited;
  console.log('The most recent site is:', mostRecentSite, 'It was visited on:', mostRecentDate);
  console.timeEnd('getMostRecentSite');
}

// Get last 3 sites
async function getLastThreeSites() {
  console.time('getLastThreeSites');
  const lastThreeSites = [];
  await db.websites.orderBy('dateVisited').reverse().limit(3).each((website) => {
    lastThreeSites.push(website.hostname);
  });
  console.log('The last 3 sites to be visited were:', lastThreeSites);    
  console.timeEnd('getLastThreeSites');
}

async function perfCheck() {
  await clearAllDatabaseFromBefore();
  db = await makeNewDatabase();
  await setAll();
  await getAll();
  await setManySingles();
  await getRandomSet();
  await getMostRecentSite();
  await getLastThreeSites();
}

perfCheck();