export function dateFormat(day) {
    let dateDescription = day.toLocaleString();
    if (dateDescription.charAt(1) === '.'){
        dateDescription = "0" + dateDescription;

    }
    return dateDescription.substr(0, 10).replace(/\./g, '-');
}