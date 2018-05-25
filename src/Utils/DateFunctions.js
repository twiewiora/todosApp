export function dateFormat(day) {
    let dateDescription = day.toLocaleString();
    if (dateDescription.charAt(1) === '.'){
        dateDescription = "0" + dateDescription;

    }
    return singleDate(dateDescription);
}

export function singleDate(date){
    return date.substr(0, 10).replace(/\.| /g, '-');
}