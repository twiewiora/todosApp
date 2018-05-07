export function getStripedStyle(index, done) {
    let color = index % 2 ? '#e6e6ff' : 'white';
    color = done ? "#c2d6d6" : color;
    return color;
}

export function getRowStatusStyle(index, array){
    let task = array[index];
    if (task.getState()){
        return "#c2d6d6";
    }
    else {
        return "white";
    }
}