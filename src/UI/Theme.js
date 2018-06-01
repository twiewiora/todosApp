import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
    cyan500,
    pinkA200,
    grey100, grey300, grey500,
    white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';


export const muiTheme = getMuiTheme({
    //TODO
    palette: {
        primary1Color: '#354778',
        primary2Color: '#354778',
        primary3Color: '#354778',
        accent1Color: pinkA200,
        accent2Color: grey100,
        accent3Color: grey500,
        textColor: darkBlack,
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        disabledColor: fade(darkBlack, 0.3),
        pickerHeaderColor: cyan500,
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack,
    },
    tableHeaderColumn: {
        textColor: '#fff',
        background: '#354778'
    }
});