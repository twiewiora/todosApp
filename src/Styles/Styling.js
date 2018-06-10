
export function setTextColorDoneTasks(index, done) {
    let color = 'black';
    color = done ? "#aaa" : color;
    return color;
}

export function setTrashIconColor(index, done) {
    let color = '000';
    color = done ? "#aaa" : color;
    return color;
}

export function getRowStatusStyle(index, array){
    let task = array[index];
    if (task.getState()){
        return "#f8f8f8";
    }
    else {
        return "white";
    }
}