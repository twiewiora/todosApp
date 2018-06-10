export function removeIndex(array, index) {
    let newArray = [];
    for (let i = 0; i < array.length; i++){
        if (i !== index){
            newArray.push(array[i]);
        }
    }
    return newArray;
}
export function removeTaskFromArray(array, task) {
    let newArray = [];
    for (let i = 0; i < array.length; i++){
        if (array[i].id !== task.id){
            newArray.push(array[i]);
        }
    }
    return newArray;
}
export function findTaskIndexInArray(array, task) {
    for (let i = 0; i < array.length; i++){
        if (array[i].id === task.id){
            return i;
        }
    }
    return -1;
}