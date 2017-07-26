const data = {
  "www.youtube.com": {
    hostname: "www.youtube.com",
    dateVisited: 1501099765384,
    thirdPartyHostnames: [
      "s.ytimg.com",
      "i.ytimg.com"
    ]
  },
  "s.ytimg.com": {
    hostname: "s.ytimg.com",
    dateVisited: 1501099969620,
    isVisible: true,
    firstPartyHostnames: [
      "youtube.com"
    ]
  },
  "i.ytimg.com": {
    hostname: "i.ytimg.com",
    dateVisited: 1501100018160,
    isVisible: true,
    firstPartyHostnames: [
      "youtube.com"
    ]
  },
  "en.gravatar.com": {
    hostname: "en.gravatar.com",
    dateVisited: 1500409398000,
    firstPartyHostnames: [
      "s0.wp.com",
      "p.typekit.net",
      "fonts.googleapis.com"
    ]
  },
  "s.gravatar.com": {
    hostname: "s.gravatar.com",
    dateVisited: 1501099765384,
    isVisible: false,
    firstPartyHostnames: [
      "en.gravatar.com",
    ]
  },
  "biancadanforth.com": {
    hostname: "biancadanforth.com",
    dateVisited: 1501100879432,
    thirdPartyHostnames: []
  },
  "www.google.com": {
    hostname: "www.google.com",
    dateVisited: 1501100742088,
    thirdPartyHostnames: []
  }
};

// add website to storage
for (const website in data) {
  localforage.setItem(website, data[website]);
}

// filter for recent site
let mostRecentSite = '';
let mostRecentDate = 0;
localforage.iterate((value, key) => {
  if (value.dateVisited > mostRecentDate) {
    mostRecentDate = value.dateVisited;
    mostRecentSite = key;
  }
}).then(() => {
  console.log('The most recent site is:', mostRecentSite, 'It was visited on:', mostRecentDate);
});

// filter for last 3 sites
// sort keys in data from newest to oldest
keysSorted = Object.keys(data).sort(function(a, b) {
  return data[b]['dateVisited'] - data[a]['dateVisited'];
});
const lastThreeSites = [keysSorted[0], keysSorted[1], keysSorted[2]];
console.log('The last 3 sites to be visited were:', lastThreeSites);

