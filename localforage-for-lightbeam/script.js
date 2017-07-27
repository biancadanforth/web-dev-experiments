const numElements = 1000;
localforage.clear();

// Generate fake data
function generateData(numElements) {
  const data = {};
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
    data[website.hostname] = website;
  }
  return data;
}

let websites = generateData(numElements);

// Add all websites to storage
function setAll() {
  console.time('setAll')
  localforage.setItem('websites', websites).then(() => {
    console.timeEnd('setAll');
    performOtherOps();
  });
}
setAll();

async function performOtherOps() {
  // Get all websites from storage
  async function getAll() {
    console.time('getAll');
    return await localforage.getItem('websites');
  }
  websites = await getAll();
  console.timeEnd('getAll');

  // filter for recent site
  function getMostRecentSite() {
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
  getMostRecentSite();
  
  // filter for last 3 sites
  function getLastThreeSites() {
    console.time('getLastThreeSites');
    // sort keys in websites from newest to oldest
    const keysSorted = Object.keys(websites).sort(function(a, b) {
      return websites[b]['dateVisited'] - websites[a]['dateVisited'];
    });
    const lastThreeSites = [keysSorted[0], keysSorted[1], keysSorted[2]];
    console.log('The last 3 sites to be visited were:', lastThreeSites);
    console.timeEnd('getLastThreeSites');
  }
  getLastThreeSites();
}