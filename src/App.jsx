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
    deleteRequest, editTaskRequest, getAllCategories,
    getAllTasks, getRootCategory,
    markAndDropRequest,
    markRequest
} from "./Requests/Requests";
import {muiTheme} from "./UI/Theme";
import Button from '@material-ui/core/Button';
import {DatePicker, MenuItem, RaisedButton, SelectField, TextField} from "material-ui";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Task from "./Task/Task";
import Category from "./Category/Category";
import {dateFormat, jsDateToCustom} from "./Utils/DateFunctions";

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
            deleteVisibility: false,
            currentCategoryId: 1,
            open: false,
            searchTerm: '',

            editingTask: new Task("title", -1),
            selectStatusValue: null,
            selectCategoryValue: null,
            selectDateValue: null,
            newTaskName: "",
            taskDescription: "",
            allCategories: []
        };

    }

    toggleZoom = () => {
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

    reloadPage = () => {
        this.setState({loading: true});
        getAllTasks()
            .then(data => {
                this.setState({
                    data,
                    loading: false,
                })
            })

        getAllCategories()
            .then(allCategories =>
            {
                allCategories.unshift(new Category("None", 0, null));
                this.setState({allCategories: allCategories});
            })
    }

    handleCheck = (taskID) => {
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

    addTask = (name) => {
        if (name !== ""){
            addRequest(name)
                .then((newTask)=>{
                    let temp = this.state.data;
                    temp.unshift(newTask);
                    return temp
                }
                ).then(temp=> {
                    this.setState({data: temp});
                }
            )
        }
    };

    addTaskWithCategory = (e, categoryId, taskName) => {
        if (taskName !== ""){
            addWithCategoryRequest(taskName, categoryId)
                .then((newTask)=> {
                    let temp = this.state.data;
                    temp.unshift(newTask);
                    return temp
                }
                ).then(temp => {
                    this.setState({data : temp});
                })
        }
    };

    editTask = (e, task) => {
        let categoryIndex = 0;
        let category = null;
        let date = null;

        for(let i = 0; i < this.state.allCategories.length; i++){
            if(this.state.allCategories[i].getID() === task.getCategoryID()){
                categoryIndex = i;
                category = this.state.allCategories[i];
                break;
            }
        }

        // category = this.state.allCategories.filter(category => category.getID() === task.getCategoryID());


        if(task.getDate() !== ""){
            date = new Date(task.getDate())
        }

        this.setState({
            open: true,
            editingTask: task,
            selectStatusValue: task.getState() ? 1 : 0,
            selectCategoryValue: category,
            selectDateValue: date});
    };

    handleCloseEditWindow = () => {
        this.setState({
            open: false,
            editingTask: new Task("title", -1)})
    };

    handleOkEditWindow = () => {
        let selectedTask = this.state.editingTask;

        console.log(this.state.newTaskName, this.state.selectCategoryValue, this.state.selectStatusValue);
        console.log(this.state.selectCategoryValue.getName(), this.state.selectCategoryValue.getID());

        console.log(this.state.selectDateValue);

        if (this.state.newTaskName !== "") {
            selectedTask.setName(this.state.newTaskName);
        }
        if (this.state.taskDescription !== "") {
            selectedTask.setDescription(this.state.taskDescription);
        }
        selectedTask.setState(this.state.selectStatusValue);
        selectedTask.setDate(this.state.selectDateValue);
        selectedTask.setCategoryName(this.state.selectCategoryValue.getName());
        selectedTask.setCategory(this.state.selectCategoryValue.getID());

        editTaskRequest(selectedTask);

        this.setState({
            open: false,
            editingTask: new Task("title", -1)})
    };

    removeTask = (e, taskID) => {
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
        return this.state.data.filter(task => this.containsCategoryToDisplay(task.getCategoryName()));
    };

    setData = (newData) => {
        this.setState({
            data: newData,
        });
    };

    getEditVisibility = () => {
        return this.state.editVisibility;
    };

    getDeleteVisibility = () => {
        return this.state.deleteVisibility;
    };

    toggleEditTask = () => {
        this.setState({
            editVisibility: !this.state.editVisibility
        });
    };

    toggleDeleteTask = () => {
        this.setState({
            deleteVisibility: !this.state.deleteVisibility
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

    containsCategoryToDisplay(categoryName) {
        for(let i = 0; i < this.state.categoriesToDisplay.length; i++){
            if(this.state.categoriesToDisplay[i].getName() === categoryName){
                return true;
            }
        }
        return false;
    }

    searchUpdated = function() {
        console.log("i'm in search update");
        let name = document.getElementById("searcher").value;
        this.setState({searchTerm: name});
    };

    handleSelectStatusChange = (event, index, selectStatusValue) =>
        this.setState({
            selectStatusValue: selectStatusValue,
        });
    handleSelectCategoryChange = (event, index, selectCategoryValue) =>
        this.setState({
            selectCategoryValue: selectCategoryValue,
        });
    handleSelectDateChange = (event, selectDateValue) => {
        this.setState({
            selectDateValue: jsDateToCustom(selectDateValue),
        });
    };
    handleChangeName = (event) => {
        let name = document.getElementById("name").value;
        console.log(name)
        this.setState({
            newTaskName: name,
        });
    };
    handleChangeDescription = (event) => {
        let new_decription = document.getElementById("description").value;
        console.log(new_decription)
        this.setState({
            taskDescription: new_decription,
        });
    };

    render() {
        return (
            <div className="App">
                <MuiThemeProvider muiTheme={muiTheme}>
                    <div>
                        <MenuBase pageZoomedIn={this.toggleZoom.bind(this)}
                                  setSelectedCategory={this.setSelectedCategory.bind(this)}
                                  setCurrentCategories={this.setCurrentCategories.bind(this)}/>
                        <div id="App1" className={this.state.zoomedIn}>
                            <ModeButton label="Calendar Mode" onClick={() => this.props.pager.push(Calendar)}
                                        side="right"/>
                            <MaterialAll removeTask={this.removeTask.bind(this)}
                                         addTask={this.addTask.bind(this)}
                                         addTaskWithCategory={this.addTaskWithCategory.bind(this)}
                                         searchUpdated={this.searchUpdated.bind(this)}
                                         handleCheck={this.handleCheck.bind(this)}
                                         getData={this.getData.bind(this)}
                                         setData={this.setData.bind(this)}
                                         getIndex={this.getIndex.bind(this)}
                                         editVisibility={this.state.editVisibility}
                                         getEditVisibility={this.getEditVisibility.bind(this)}
                                         deleteVisibility={this.state.deleteVisibility}
                                         getDeleteVisibility={this.getDeleteVisibility.bind(this)}
                                         toggleEditTask={this.toggleEditTask.bind(this)}
                                         toggleDeleteTask={this.toggleDeleteTask.bind(this)}
                                         appLoading={this.state.loading}
                                         ifSetDragnDrop={this.state.ifSetDragnDrop}
                                         categoriesToDisplay={this.state.categoriesToDisplay}
                                         currentCategoryId={this.state.currentCategoryId}
                                         searchTerm={this.state.searchTerm}
                                         openEditWindow={this.state.open}
                                         editTask={this.editTask.bind(this)}/>
                        </div>

                        <div>
                            <Dialog
                                open={this.state.open}
                                style={{
                                    width: "100%",
                                    maxWidth: 'none',
                                }}
                                onClose={ () => this.handleCloseEditWindow()}
                                aria-labelledby="form-dialog-title"
                            >
                                <DialogTitle id="form-dialog-title">Edit task</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Change chosen values and finish the edit by clicking 'Ok' button.
                                    </DialogContentText>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        floatingLabelText="Task Name"
                                        defaultValue={this.state.editingTask.getName()}
                                        type="taskName"
                                        onChange={this.handleChangeName}
                                        fullWidth
                                    />
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="description"
                                        floatingLabelText="Task description"
                                        defaultValue={this.state.editingTask.getDescription()}
                                        type="taskName"
                                        onChange={this.handleChangeDescription}
                                        fullWidth
                                    />
                                    <SelectField
                                        floatingLabelText="Status"
                                        value={this.state.selectStatusValue}
                                        onChange={this.handleSelectStatusChange}
                                        fullWidth
                                    >
                                        <MenuItem key={0} value={0} primaryText="Not Done"/>
                                        <MenuItem key={1} value={1} primaryText="Done"/>
                                    </SelectField>
                                    <SelectField
                                        floatingLabelText="Categories"
                                        value={this.state.selectCategoryValue}
                                        onChange={this.handleSelectCategoryChange}
                                        fullWidth
                                    >
                                        {this.state.allCategories.map((value, index) => (
                                            <MenuItem key={index} value={value} primaryText={value.getName()}/>
                                        ))}
                                    </SelectField>
                                    <DatePicker
                                                floatingLabelText="Assigned Date"
                                                value={this.state.selectDateValue}
                                                onChange={this.handleSelectDateChange}/>
                                </DialogContent>

                                <DialogActions>
                                    <Button onClick={()=> this.handleCloseEditWindow()} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={() => this.handleOkEditWindow()} color="primary">
                                        OK
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </div>
                </MuiThemeProvider>
            </div>);
    }

}

export default App;
