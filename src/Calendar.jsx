import React from "react";
import './Styles/App.css';
import {MuiThemeProvider} from "material-ui";
import App from "./App";
import CalendarUI from "./CalendarUI";
import ModeButton from "./UI/ModeButton";
import MenuBase from "./Menu";
import {getAllTasks, getAllTasksFromCategory} from "./Requests/Requests";

class Calendar extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            zoomedIn: "zoomOut",
            loading: true,
            ifSetDragnDrop: true
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

    setDataWithCategory = function(category) { //TODO: change how this behaves in Calendar
        this.setState({loading: true});
        let tasks = [];
        let ifFound = false;
        if(category === "root"){
            tasks = getAllTasks();
        }
        else
            tasks = getAllTasksFromCategory(category);

        this.setState({
            loading: true
        }, function(){
            setTimeout(function() {
                console.log(tasks);
                for(let i = 0; i < this.state.data.length; i++){
                    for(let j = 0; j < tasks.length; j++){
                        if(this.state.data[i].getID() === tasks[j].getID()){
                            this.state.data[i].setVisible(true);
                            console.log(this.state.data[i]);
                            ifFound = true;
                            break;
                        }
                    }

                    if(!ifFound)
                        this.state.data[i].setVisible(false);

                    ifFound = false;
                }

                let ifSetDnD = category === "root";
                this.setState({
                    loading: false,
                    ifSetDragnDrop: ifSetDnD
                });
            }.bind(this), 2000)
        }.bind(this));

    };

    render() {
        return (
            <div className="Calendar">
                <MuiThemeProvider>
                    <MenuBase pageZoomedIn={this.toggleZoom.bind(this)}
                              setDataWithCategory={this.setDataWithCategory.bind(this)}/>
                    <div className="App">
                        <ModeButton
                            label="Home"
                            onClick={() => this.props.pager.push(App)}
                            side="right"
                        />
                        <CalendarUI/>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}
export default Calendar