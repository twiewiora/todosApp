import React from "react";
import './Styles/App.css';
import {MuiThemeProvider} from "material-ui";
import App from "./App";
import CalendarUI from "./CalendarUI";
import ModeButton from "./UI/ModeButton";
import MenuBase from "./Menu";
import {getAllCategories, getAllTasks} from "./Requests/Requests";
import {muiTheme} from "./UI/Theme";
import Category from "./Category/Category";


class Calendar extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            zoomedIn: "zoomOut",
            loading: true,
            categoriesToDisplay: [],
            currentCategoryId: 1,
            allCategories: []

        };

        this.toggleZoom = this.toggleZoom.bind(this);
    }

    componentWillMount() {
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

        getAllCategories()
            .then(allCategories => {
                allCategories.unshift(new Category("None", 1, null));
                this.setState({allCategories: allCategories});
            })

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
        this.setState({
            categoriesToDisplay: categories,
        });

    };

    setSelectedCategory = function(categoryId){

        this.setState({
            currentCategoryId: categoryId
        });
    };

    addCategoryToAll(newCategory) {
        let newAll = this.state.allCategories;
        newAll.push(newCategory);

        this.setState({allCategories: newAll});
    }

    render() {
        return (
            <div className="Calendar">
                <MuiThemeProvider muiTheme={muiTheme}>
                    <div>
                    <MenuBase pageZoomedIn={this.toggleZoom.bind(this)}
                              setSelectedCategory={this.setSelectedCategory.bind(this)}
                              setCurrentCategories={this.setCurrentCategories.bind(this)}
                              addCategoryToAll={this.addCategoryToAll.bind(this)}
                        />
                    <div id="App1" className={this.state.zoomedIn}>
                        <ModeButton
                            label="Home"
                            onClick={() => this.props.pager.push(App)}
                            side="right"
                        />
                        <CalendarUI categoriesToDisplay={this.state.categoriesToDisplay}/>
                    </div>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }

    showWeeklyView() {
        return undefined;
    }
}
export default Calendar