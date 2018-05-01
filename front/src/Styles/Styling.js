export function getStripedStyle(index, ifDone) {
    let color = index % 2 ? '#e6e6ff' : 'white';
    color = ifDone ? 'grey' : color;
    return color;
}
