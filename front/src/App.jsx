import React, {Component}  from 'react';
import './Styles/App.css';
import MaterialAll from './MaterialUIs';
import MenuBase from './Menu'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Calendar from "./Calendar";
import ModeButton from "./UI/ModeButton";
import {arrayMove} from "react-sortable-hoc";
import {markRequest, markAndDropRequest, addRequest, getAllTasks, deleteRequest, getAllTasksFromCategory} from "./Requests/Requests";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            zoomedIn: "zoomOut",
            data: [],
            loading: true,
            ifSetDragnDrop: true
        };

        this.toggleZoom = this.toggleZoom.bind(this);
        this.reloadPage = this.reloadPage.bind(this);

        this.getData = this.getData.bind(this);
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
            }.bind(this), 3000)
        }.bind(this));

    }

    handleCheck(i){
        let state = this.state.data[i].getState();
        let firstDoneIndex = this.getFirstDoneTaskIndex();

        let selectedTask = this.state.data[i];
        this.state.data[i].setState(!state);

        this.setState((oldState) => {
            return {
                checked: !oldState.checked,
                color: !oldState.checked === true ? 'grey' : 'white'
            };
        });

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
                markAndDropRequest(selectedTask, this.state.data[firstDoneIndex-1]);
            } else {
                markRequest(selectedTask);
            }
        }

    }

    handleCheckWithNoDrop(i){
        let state = this.state.data[i].getState();

        let selectedTask = this.state.data[i];
        this.state.data[i].setState(!state);

        this.setState((oldState) => {
            return {
                checked: !oldState.checked,
                color: !oldState.checked === true ? 'grey' : 'white'
            };
        });

        markRequest(selectedTask);

    }


    addTask = function () {
        let name = document.getElementById("taskName").value;
        if (name !== ""){
            let newTask = addRequest(name);
            let temp = this.state.data;
            temp.unshift(newTask);
            this.setState({data : temp});
            document.getElementById('taskName').value = "";
            document.getElementById('taskName').hintText = "name";
        }
    };



    removeTask = function (e, i) {
        let selectedTask = this.state.data[i];
        this.setState(state => ({
            data: state.data.filter((x, j) => j !== i),
        }));
        deleteRequest(selectedTask);
    };

    getData = () => {
        return this.state.data;
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

    setDataWithCategory = function(category) {
        this.setState({loading: true});
        let tasks = [];
        if(category === "root"){
            tasks = getAllTasks();
        }
        else
            tasks = getAllTasksFromCategory(category);

        this.setState({
            loading: true
        }, function(){
            setTimeout(function() {
                this.setState({
                    data: tasks,
                    loading: false,
                    ifSetDragnDrop: !this.state.ifSetDragnDrop
                });
            }.bind(this), 3000)
        }.bind(this));
    };

    render() {
        return (
            <div className="App">
                <MuiThemeProvider>
                    <MenuBase pageZoomedIn={this.toggleZoom.bind(this)}
                              setDataWithCategory={this.setDataWithCategory.bind(this)}/>
                    <div id="App1" className={this.state.zoomedIn}>
                        <ModeButton label="Calendar Mode" onClick={() => this.props.pager.push(Calendar)} />
                        <MaterialAll removeTask={this.removeTask.bind(this)}
                                     addTask={this.addTask.bind(this)}
                                     handleCheck={this.handleCheck.bind(this)}
                                     handleCheckWithNoDrop={this.handleCheckWithNoDrop.bind(this)}
                                     getData={this.getData.bind(this)}
                                     appLoading={this.state.loading}
                                     ifSetDragnDrop={this.state.ifSetDragnDrop}/>
                    </div>
                </MuiThemeProvider>
            </div>);
    }


}


export default App;
