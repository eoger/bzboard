import Reflux from 'reflux'
import Uuid from 'uuid'
import Filter from '../models/Filter'
import FilterActions from '../actions/FilterActions'
import BzBoardClient from '../lib/BzBoardClient'

export default Reflux.createStore({
  listenables: [FilterActions],

  init: function () {
    this.filters = {};
  },

  getInitialState: function () {
    return [];
  },

  onLoad: function () {
    BzBoardClient.getAll().then(rawFilters => {
      for (let rawFilter of Object.values(rawFilters)) {
        let filter = new Filter(rawFilter.uid, rawFilter.name, rawFilter.value);
        this.filters[filter.uid] = filter;
      }
      this._notifyListeners();
    });
  },

  onCreate: function (filter) {
    this.filters[filter.uid] = filter;
    this._notifyListeners();
  },

  onRemove: function (uid) {
    delete this.filters[filter.uid];
    this._notifyListeners();
  },

  onUpdate: function (filter) {
    this.filters[filter.uid] = filter;
    this._notifyListeners();
  },

  _notifyListeners: function () {
    let filtersArray = [];
    for (let filter of Object.values(this.filters)) {
      filtersArray.push(filter);
    }
    this.trigger(filtersArray);
  }
});
