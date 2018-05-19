import React, {Component}  from 'react';
import './Styles/App.css';
import MaterialAll from './MaterialUIs';
import MenuBase from './Menu'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Calendar from "./Calendar";
import ModeButton from "./UI/ModeButton";
import {arrayMove} from "react-sortable-hoc";
import {markRequest, markAndDropRequest, addRequest, getAllTasks, deleteRequest, getAllTasksFromCategory} from "./Requests/Requests";
import {muiTheme} from "./UI/Theme";
import Category from "./Category/Category";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            zoomedIn: "zoomOut",
            data: [],
            categoriesToDisplay: [],
            loading: true,
            ifSetDragnDrop: true
        };

        this.toggleZoom = this.toggleZoom.bind(this);
        this.reloadPage = this.reloadPage.bind(this);

        this.getData = this.getData.bind(this);
        this.setData = this.setData.bind(this);
        this.addTask = this.addTask.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
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
            }.bind(this), 1000)
        }.bind(this));

    }

    handleCheck(taskID){
        let i = -1;
        if(this.state.ifSetDragnDrop){
            i = taskID;
        } else {
            for (let id = 0; id < this.state.data.length; id++) {
                if(this.state.data[id].getID() === taskID){
                    i = id;
                    break;
                }
            }
        }

        let state = this.state.data[i].getState();
        let firstDoneIndex = this.getFirstDoneTaskIndex();

        let selectedTask = this.state.data[i];
        this.state.data[i].setState(!state);

        console.log(selectedTask);

        this.setState((oldState) => {
            return {
                checked: !oldState.checked,
                color: !oldState.checked === true ? 'grey' : 'white'
            };
        });

        console.log(firstDoneIndex);

        if(firstDoneIndex !== 1 || firstDoneIndex !== 0){
            if(!(this.state.data[i].getState() && i === firstDoneIndex-1)
                && !(!this.state.data[i].getState() && i <= firstDoneIndex)) {
                if(i > firstDoneIndex){
                    this.setState({
                        data: arrayMove(this.state.data, i, firstDoneIndex),
                    });
                } else {
                    this.setState({
                        data: arrayMove(this.state.data, i, firstDoneIndex - 1),
                    });
                }
                if(firstDoneIndex === 0)
                    markAndDropRequest(selectedTask, null);
                else
                    markAndDropRequest(selectedTask, this.state.data[firstDoneIndex-1]);
            } else {
                markRequest(selectedTask);
            }
        }
    }

    addTask = function () {
        let name = document.getElementById("taskName").value;
        if (name !== ""){
            let newTask = addRequest(name);
            console.log(newTask);
            let temp = this.state.data;
            temp.unshift(newTask);
            this.setState({data : temp});
            document.getElementById('taskName').value = "";
            document.getElementById('taskName').hintText = "name";
        }
    };

    removeTask = function (e, taskID) {
        let i = -1;
        if(this.state.ifSetDragnDrop){
            i = taskID;
        } else {
            for (let id = 0; id < this.state.data.length; id++) {
                if(this.state.data[id].getID() === taskID){
                    i = id;
                    break;
                }
            }
        }

        let selectedTask = this.state.data[i];
        this.setState(state => ({
            data: state.data.filter((x, j) => j !== i),
        }));
        deleteRequest(selectedTask);
    };

    getData = () => {
        return this.state.data;
    };

    setData = (newData) => {
        this.setState({
            data: newData,
        });
    };

    getFirstDoneTaskIndex = function () {
        let length = this.state.data.length;
        let firstDoneTaskIndexAtTheBottom = length;
        for (let i = length-1; i >= 0; i--){
            if(this.state.data[i].getState() === false) {
                break;
            } else {
                firstDoneTaskIndexAtTheBottom = i;
            }
        }
        return firstDoneTaskIndexAtTheBottom;
    };

    setCurrentCategories = function(categories) {
        console.log(categories);
        let ifSetDnD = categories[0].getName() === "None";


        this.setState({
            categoriesToDisplay: categories,
            ifSetDragnDrop: ifSetDnD
        });

    };

    getIndex = (id) => {
        let data = this.state.data;
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if(data[i].getID() === id){
                return i;
            }
        }
    };

    render() {
        return (
            <div className="App">
                <MuiThemeProvider muiTheme={muiTheme}>
                    <MenuBase pageZoomedIn={this.toggleZoom.bind(this)}
                              setCurrentCategories={this.setCurrentCategories.bind(this)}/>
                    <div id="App1" className={this.state.zoomedIn}>
                        <ModeButton label="Calendar Mode" onClick={() => this.props.pager.push(Calendar)}  side="right" />
                        <MaterialAll removeTask={this.removeTask.bind(this)}
                                     addTask={this.addTask.bind(this)}
                                     handleCheck={this.handleCheck.bind(this)}
                                     getData={this.getData.bind(this)}
                                     setData={this.setData.bind(this)}
                                     getIndex={this.getIndex.bind(this)}
                                     appLoading={this.state.loading}
                                     ifSetDragnDrop={this.state.ifSetDragnDrop}
                                     categoriesToDisplay={this.state.categoriesToDisplay}/>
                    </div>
                </MuiThemeProvider>
            </div>);
    }

}

export default App;
