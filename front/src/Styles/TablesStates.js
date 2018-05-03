const mainStateTable = {
    fixedHeader: true,
    fixedFooter: true,
    stripedRows: false,
    showRowHover: false,
    selectable: true,
    multiSelectable: true,
    enableSelectAll: true,
    deselectOnClickaway: false,
    showCheckboxes: false,
    height: '300px',
};
export function getMainStateTable(){ return mainStateTable; }

const calendarDayStateTable = {
    fixedHeader: true,
    fixedFooter: true,
    stripedRows: false,
    showRowHover: false,
    selectable: false,
    multiSelectable: false,
    enableSelectAll: true,
    deselectOnClickaway: false,
    showCheckboxes: false,
    displaySelectAll: false,
};
export function getCalendarDayStateTable(){ return calendarDayStateTable; }

const unassignedStateTable = {
    fixedHeader: true,
    fixedFooter: true,
    stripedRows: false,
    showRowHover: false,
    selectable: false,
    multiSelectable: false,
    enableSelectAll: false,
    deselectOnClickaway: false,
    showCheckboxes: false,
    displaySelectAll: false,
};
export function getUnassignedStateTable(){ return unassignedStateTable }