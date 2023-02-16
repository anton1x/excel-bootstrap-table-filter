/** Plugin Options */
interface Options {
    columnSelector: string,
    sort: boolean,
    search: boolean,
    captions: {
        a_to_z: string,
        z_to_a: string,
        search: string,
        select_all: string,
    },

    listsDelimiter?: string,

    sortDateFormat: string|null,

    onUpdateVisibility: (rows: Array<HTMLElement>) => {},
    onChangeSort: (column: number, direction: number) => {},

    mapTextToCaption: (text:string) => string,

    moment: any
}
