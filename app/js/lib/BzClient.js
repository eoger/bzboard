/**
 * Client class that talks to bugzilla
 */

const BZ_DOMAIN = "https://bugzilla.mozilla.org";
const REST_BUG  = "/rest/bug";

export default {
  getBugs: function(bugIds) {
    if (!Array.isArray(bugIds)) {
      bugIds = [bugIds];
    }
    let url = BZ_DOMAIN + REST_BUG + "?id=" + bugIds.join(",");
    return this._fetchFromUrl(url);
  },

  searchBugs: function(filter) {
    if(!filter) {
      return Promise.resolve([]);
    }
    return this._fetchFromUrl(this._filterToUrl(filter));
  },

  _filterToUrl: function (filter) {
    return BZ_DOMAIN + REST_BUG + "?quicksearch=" + encodeURIComponent(filter);
  },

  _fetchFromUrl: function(url) {
    return new Promise(function(resolve, reject) {
      let req = new XMLHttpRequest();
      req.open('GET', url);
      req.setRequestHeader("Content-type", "application/json");
      req.setRequestHeader("Accept", "application/json");

      req.onload = function() {
        if (req.status == 200) {
          try {
            resolve(JSON.parse(req.response).bugs);
          } catch (e) {
            console.log("Failed to parse the request bugs");
            reject(Error(e));
          }
        }
        else {
          reject(Error(req.statusText));
        }
      };
      req.onerror = function() {
        reject(Error("Network Error"));
      };
      req.send();
    });
  }
}
