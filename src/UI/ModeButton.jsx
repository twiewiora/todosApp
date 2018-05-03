import React from 'react';
import {RaisedButton} from "material-ui";

const ModeButton = ({side = 'right', ...props}) => {
    console.assert(side === 'left' || side === 'right', `expected "left" or "right", got ${side}`);

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