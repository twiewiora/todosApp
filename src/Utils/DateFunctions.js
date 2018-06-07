export function dateFormat(day) {
    let dateDescription = toFullLocaleDateString(day);
    return singleDate(dateDescription);
}

export function singleDate(date){
    return date.substr(0, 10).replace(/\.| /g, '-');
}

export function reverseDate(dateString){
    let tab = dateString.split("-").reverse();
    return tab.join("-");
}

/*
converts JS standard string representation of date into custom one, used in db, e.g.
 in: "Fri Jun 08 2018 00:00:00 GMT+0200 (CEST)"
 out: "2018 06 08 00:00:00"
 */
export function jsDateToCustom(date) {
    let localeDate = toFullLocaleDateString(date);
    let [dateStr, timeStr] = localeDate.split(",");
    dateStr = dateStr.split(".").reverse().join(" ");
    return dateStr + " " + timeStr;
}

function toFullLocaleDateString(date) {
    let localeDate = date.toLocaleString();
    console.log(localeDate);
    if(localeDate[1] === ".")
        localeDate = "0" + localeDate;
    return localeDate;
}