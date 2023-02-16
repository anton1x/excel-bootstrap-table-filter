import { FilterMenu } from './FilterMenu';
export class FilterCollection {

  filterMenus:  Array<FilterMenu>;
  rows:         Array<HTMLElement>;
  ths:          Array<HTMLElement>;
  table:        HTMLElement;
  options:      Options;
  target:       JQuery;

  constructor (target: JQuery, options: Options) {
    this.target = target;
    this.options = options;
    this.ths = target.find('th' + options.columnSelector).toArray()
    this.filterMenus = this.ths.map(function(th: HTMLElement, index: number) {
      let column = $(th).index();
      return new FilterMenu(target, th, column, index, options);
    });
    this.rows = target.find('tbody').find('tr').toArray();
    this.table = target.get(0);
  }

  public initialize(): void {
    this.filterMenus.forEach(function(filterMenu) {
      filterMenu.initialize();
    });
    this.bindCheckboxes();
    this.bindSelectAllCheckboxes();
    this.bindSort();
    this.bindSearch();
  }

  private bindCheckboxes(): void {
    let filterMenus = this.filterMenus;
    let rows = this.rows;
    let ths = this.ths;
    let options = this.options;
    let updateRowVisibility = this.updateRowVisibility;
    this.target.find('.dropdown-filter-menu-item.item').change(function() {
      let index = $(this).data('index');
      let value = $(this).val();
      filterMenus[index].updateSelectAll();
      updateRowVisibility(filterMenus, rows, ths, options);
    });
  }

  private bindSelectAllCheckboxes(): void {
    let filterMenus = this.filterMenus;
    let rows = this.rows;
    let ths = this.ths;
    let options = this.options;
    let updateRowVisibility = this.updateRowVisibility;
    this.target.find('.dropdown-filter-menu-item.select-all').change(function() {
      let index = $(this).data('index');
      let value = this.checked;
      filterMenus[index].selectAllUpdate(value);
      updateRowVisibility(filterMenus, rows, ths, options);
    });
  }

  private bindSort(): void {
    let filterMenus = this.filterMenus;
    let rows = this.rows;
    let ths = this.ths;
    let sort = this.sort;
    let table = this.table;
    let options = this.options;
    let updateRowVisibility = this.updateRowVisibility;
    this.target.find('.dropdown-filter-sort').click(function() {
      let $sortElement = $(this).find('span');
      let column = $sortElement.data('column');
      let order = $sortElement.attr('class');
      sort(column, order, table, options);
      updateRowVisibility(filterMenus, rows, ths, options);
    });
  }

  private bindSearch(): void {
    let filterMenus = this.filterMenus;
    let rows = this.rows;
    let ths = this.ths;
    let options = this.options;
    let updateRowVisibility = this.updateRowVisibility;
    this.target.find('.dropdown-filter-search').keyup(function() {
      let $input = $(this).find('input');
      let index = $input.data('index');
      let value = $input.val();
      filterMenus[index].searchToggle(value);
      updateRowVisibility(filterMenus, rows, ths, options);
    });
  }

  private updateRowVisibility(filterMenus: Array<FilterMenu>, rows: Array<HTMLElement>, ths: Array<HTMLElement>, options: Options): void {
    let showRows = rows;
    let hideRows: Array<HTMLElement> = [];
    let selectedLists = filterMenus.map(function(filterMenu) {
      return {
        column: filterMenu.column,
        selected: filterMenu.inputs
          .filter(function(input: HTMLInputElement) {
            return input.checked
          }).map(function(input: HTMLInputElement) {
            return input.value.trim().replace(/ +(?= )/g,'');
          })
      };
    });

    console.log("sel list", selectedLists);

    for (let i=0; i < rows.length; i++) {
      let tds = rows[i].children;
      let match = [];
      for (let j=0; j < selectedLists.length; j++) {
        match[j] = 0;
        let contents = (tds[selectedLists[j].column] as HTMLElement).innerText.trim().replace(/ +(?= )/g,'').split(options.listsDelimiter).map((i) => i.trim())

        console.log(contents);
        for (let content of contents) {
          if (selectedLists[j].selected.indexOf(content) !== -1 ) {
            // $(rows[i]).hide();
            match[j]++;
          }
          //$(rows[i]).show();
        }

        console.log("match", match);

      }
      if (match.indexOf(0) !== -1) {
        $(rows[i]).hide();
      } else {
        $(rows[i]).show();
      }
    }

    options.onUpdateVisibility(rows);
  }

  private sort(column: number, order: string, table: HTMLElement, options: Options): void {
    let flip = 1;
    if (order === options.captions.z_to_a.toLowerCase().split(' ').join('-')) flip = -1;
    let tbody = $(table).find('tbody').get(0);
    let rows = $(tbody).find('tr').get();
    let moment = options.moment;

    let event = options.onChangeSort;
    let sortDateFormat = options.sortDateFormat;

    rows.sort(function(a, b) {
      var A = (a.children[column] as HTMLElement).innerText.toUpperCase();
      var B = (b.children[column] as HTMLElement).innerText.toUpperCase();

      let isDates = false;
      let parsedA;
      let parsedB;

      if (sortDateFormat !== null) {
        parsedA = moment(A, sortDateFormat, true)
        parsedB = moment(B, sortDateFormat, true)

        if (parsedA.isValid() && parsedB.isValid()) {
          isDates = true;
        }
      }

      if(isDates) {
        if(parsedA.unix() < parsedB.unix()) return -1*flip;
        if(parsedA.unix() > parsedB.unix()) return  1*flip;
      }
      else if (!isNaN(Number(A)) && !isNaN(Number(B))) {
        // handle numbers
        if(Number(A) < Number(B)) return -1*flip;
        if(Number(A) > Number(B)) return  1*flip;
      } else {
        // handle strings
        if(A < B) return -1*flip;
        if(A > B) return  1*flip;
      }
      return 0;
    });

    for (var i=0; i < rows.length; i++) {
      tbody.appendChild(rows[i]);
    }

    event(column, flip);

  }


}
