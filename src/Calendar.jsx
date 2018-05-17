import React from "react";
import './Styles/App.css';
import {MuiThemeProvider} from "material-ui";
import App from "./App";
import CalendarUI from "./CalendarUI";
import ModeButton from "./UI/ModeButton";
import MenuBase from "./Menu";
import {getAllTasks} from "./Requests/Requests";
import {muiTheme} from "./UI/Theme";


class Calendar extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            zoomedIn: "zoomOut",
            loading: true,
            categoriesToDisplay: []
        };

        this.toggleZoom = this.toggleZoom.bind(this);
    }

    componentWillMount() {
        this.reloadPage();

    }

    reloadPage() {
        this.setState({loading: true});
        let tasks = getAllTasks();

        this.setState({
            loading: true
        }, function(){
            setTimeout(function() {
                this.setState({
                    data: tasks,
                    loading: false
                });
            }.bind(this), 3000)
        }.bind(this));

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

    setCurrentCategories = function(categories) {
        console.log(categories);

        this.setState({
            categoriesToDisplay: categories,
        });

    };

    render() {
        return (
            <div className="Calendar">
                <MuiThemeProvider muiTheme={muiTheme}>
                    <MenuBase pageZoomedIn={this.toggleZoom.bind(this)}
                              setCurrentCategories={this.setCurrentCategories.bind(this)}/>
                    <div id="App1" className={this.state.zoomedIn}>
                        <ModeButton
                            label="Home"
                            onClick={() => this.props.pager.push(App)}
                            side="right"
                        />
                        <CalendarUI categoriesToDisplay={this.state.categoriesToDisplay}/>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}
export default Calendar