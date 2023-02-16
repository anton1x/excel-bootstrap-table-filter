import $ from 'jquery';
import { FilterCollection } from './FilterCollection'

// Define the plugin function on the jQuery extension point.
($.fn as any).excelTableFilter = function (this: JQuery, options: Options) {
  let target = this;
  // Merge the global options with the per-call options.
  options = $.extend({}, ($.fn as any).excelTableFilter.options, options);

  if (typeof options.columnSelector === 'undefined') options.columnSelector = '';
  if (typeof options.sort === 'undefined') options.sort = true;
  if (typeof options.search === 'undefined') options.search = true;

  if (typeof options.captions === 'undefined') options.captions = {
    a_to_z: 'A to Z',
    z_to_a: 'Z to A',
    search: 'Search',
    select_all: 'Select All',
  }

  if (typeof options.listsDelimiter === 'undefined') options.listsDelimiter = null;

  if (typeof options.mapTextToCaption === 'undefined') options.mapTextToCaption = (s) => s

  if (typeof options.onUpdateVisibility === 'undefined') options.onUpdateVisibility = () => null

  if (typeof options.onChangeSort === 'undefined') options.onChangeSort = () => null


  if (typeof options.sortDateFormat === 'undefined') options.sortDateFormat = null

  let filterCollection = new FilterCollection(target, options);
  filterCollection.initialize();

  // Return the jQuery object for chaining.
  return target;
};

// Define the plugin's global default options.
($.fn as any).excelTableFilter.options = {};
