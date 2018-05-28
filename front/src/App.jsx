import React, {Component} from 'react';
import './Styles/App.css';
import MaterialAll from './MaterialUIs';
import MenuBase from './Menu'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Calendar from "./Calendar";
import ModeButton from "./UI/ModeButton";
import {arrayMove} from "react-sortable-hoc";
import {
    addRequest,
    addWithCategoryRequest,
    deleteRequest,
    getAllTasks, getRootCategory,
    markAndDropRequest,
    markRequest
} from "./Requests/Requests";
import {muiTheme} from "./UI/Theme";
import Category from "./Category/Category";
import {RaisedButton} from "material-ui";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            zoomedIn: "zoomOut",
            data: [],
            categoriesToDisplay: [],
            loading: true,
            ifSetDragnDrop: true,
            editVisibility: false,
            currentCategoryId: 1
        };

        this.toggleZoom = this.toggleZoom.bind(this);
        this.reloadPage = this.reloadPage.bind(this);

        this.addTask = this.addTask.bind(this);
        this.addTaskWithCategory = this.addTaskWithCategory.bind(this);
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
        //invoke before render method
        this.reloadPage();
    }

    reloadPage() {
        this.setState({loading: true});
        getAllTasks()
            .then(data => {
                this.setState({
                    data,
                    loading: false,
                })
            })
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
            addRequest(name)
                .then((newTask)=>{
                    let temp = this.state.data;
                    temp.unshift(newTask);
                    return temp
                }
                ).then(temp=> {
                    this.setState({data: temp});
                    document.getElementById("taskName").value = "";
                    document.getElementById('taskName').hintText = "name";
                }
            )
        }
    };

    addTaskWithCategory = function (e, categoryId) {
        let name = document.getElementById("taskName").value;
        if (name !== ""){
            let newTask = addWithCategoryRequest(name, categoryId);
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

    getFilteredData = () => {
        return this.state.data.filter(task => this.
                                      
                                      sCategoryToDisplay(task.getCategoryName()));
    };

    setData = (newData) => {
        this.setState({
            data: newData,
        });
    };

    getEditVisibility = () => {
        return this.state.editVisibility;
    };

    toggleEditTask = () => {
        this.setState({
            editVisibility: !this.state.editVisibility
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

    setCurrentCategories = (categoriesToDisplay) => {
        console.log('setCurrentCategories', categoriesToDisplay);
        const ifSetDragnDrop = categoriesToDisplay[0].getName() === "None";
        this.setState({categoriesToDisplay, ifSetDragnDrop});
    };

    setSelectedCategory = function(categoryId){
        console.log(categoryId);

        this.setState({
            currentCategoryId: categoryId
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

    getFilteredIndex = (id) => {
        let data = this.getFilteredData();
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if(data[i].getID() === id){
                return i;
            }
        }
    };

    containsCategoryToDisplay(categoryName) {
        for(let i = 0; i < this.state.categoriesToDisplay.length; i++){
            if(this.state.categoriesToDisplay[i].getName() === categoryName){
                return true;
            }
        }
        return false;
    }

    render() {
        return (
            <div className="App">
                <MuiThemeProvider muiTheme={muiTheme}>
                    <div>
                        <MenuBase pageZoomedIn={this.toggleZoom.bind(this)}
                                  setSelectedCategory={this.setSelectedCategory.bind(this)}
                                  setCurrentCategories={this.setCurrentCategories}/>
                        <div id="App1" className={this.state.zoomedIn}>
                            <ModeButton label="Calendar Mode" onClick={() => this.props.pager.push(Calendar)}
                                        side="right"/>
                            <MaterialAll removeTask={this.removeTask.bind(this)}
                                         addTask={this.addTask.bind(this)}
                                         addTaskWithCategory={this.addTaskWithCategory.bind(this)}
                                         handleCheck={this.handleCheck.bind(this)}
                                         getData={this.getData.bind(this)}
                                         setData={this.setData.bind(this)}
                                         getIndex={this.getIndex.bind(this)}
                                         editVisibility={this.state.editVisibility}
                                         getEditVisibility={this.getEditVisibility.bind(this)}
                                         toggleEditTask={this.toggleEditTask.bind(this)}
                                         appLoading={this.state.loading}
                                         ifSetDragnDrop={this.state.ifSetDragnDrop}
                                         categoriesToDisplay={this.state.categoriesToDisplay}
                                         currentCategoryId={this.state.currentCategoryId}/>
                        </div>
                    </div>
                </MuiThemeProvider>
            </div>);
    }

}

export default App;
