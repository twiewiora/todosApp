import React, {Component}  from 'react';
import './Styles/App.css';
import MaterialAll from './MaterialUIs';
import MenuBase from './Menu'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Calendar from "./Calendar";
import ModeButton from "./UI/ModeButton";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            zoomedIn: "zoomOut"
        };

        this.toggleZoom = this.toggleZoom.bind(this);
    }

    toggleZoom() {
        if(this.state.zoomedIn === "zoomOut"){
            this.setState({
                zoomedIn: "zoomIn"
            });
        } else {
            this.setState({
                zoomedIn: "zoomOut"
            });
        }

    }

    render() {
        return (
            <div className="App">
                <MuiThemeProvider>
                    <MenuBase pageZoomedIn={this.toggleZoom.bind(this)}/>
                    <div id="App1" className={this.state.zoomedIn}>
                        <ModeButton label="Calendar Mode" onClick={() => this.props.pager.push(Calendar)} />
                        <MaterialAll/>
                    </div>
                </MuiThemeProvider>
            </div>);
    }


}


export default App;
