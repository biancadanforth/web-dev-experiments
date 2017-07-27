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

const numElements = 1000;
const data = generateData(numElements);

// Define your database
var db = new Dexie("website_database");
db.version(1).stores({
    websites: 'hostname, dateVisited, isVisible, firstPartyHostnames, thirdPartyHostnames'
});

// Add all websites to storage
function setAll() {
  console.time('setAll');
  db.websites.bulkPut(data).then((lastKey) => {
    console.timeEnd('setAll');
  });  
}
setAll();

// Get all websites from storage
function getAll() {
  console.time('getAll');
  db.websites.toArray((data) => {
    console.timeEnd('getAll');
  });
}
getAll();

// Get most recent site
function getMostRecentSite() {
  console.time('getMostRecentSite');
  db.websites.orderBy('dateVisited').last((lastSite) => {
    const mostRecentSite = lastSite.hostname;
    const mostRecentDate = lastSite.dateVisited;
    console.log('The most recent site is:', mostRecentSite, 'It was visited on:', mostRecentDate);
    console.timeEnd('getMostRecentSite');
  });
}
getMostRecentSite();

// Get last 3 sites
function getLastThreeSites() {
  console.time('getLastThreeSites');
  const lastThreeSites = [];
  db.websites.orderBy('dateVisited').reverse().limit(3).each((website) => {
    lastThreeSites.push(website.hostname);
  }).then(() => {
    console.log('The last 3 sites to be visited were:', lastThreeSites);    
    console.timeEnd('getLastThreeSites');
  });
}
getLastThreeSites();