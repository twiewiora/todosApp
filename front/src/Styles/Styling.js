//TODO I think it is better without this
export function getStripedStyle(index, done) {
    let color = 'white';
    //let color = index % 2 ? '#dee5f4': 'white';
    color = done ? "#f8f8f8" : color;
    return color;
}

export function setTextColorDoneTasks(index, done) {
    let color = 'fff';
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