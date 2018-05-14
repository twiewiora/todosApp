import React from 'react';
import {RaisedButton} from "material-ui";

const ModeButton = ({side = 'right', ...props}) => {

    return (
        <RaisedButton
            primary={true}
            style={{
                position: 'fixed',
                top: '5px',
                [side]: '5px', //key with value either left or right
            }}
            {...props}
        />
    );
};


export default ModeButton;