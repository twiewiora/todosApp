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
            categoriesToDisplay: [],
            currentCategoryId: 1,
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

    render() {
        return (
            <div className="Calendar">
                <MuiThemeProvider muiTheme={muiTheme}>
                    <div>
                    <MenuBase pageZoomedIn={this.toggleZoom.bind(this)}
                              setSelectedCategory={this.setSelectedCategory.bind(this)}
                              setCurrentCategories={this.setCurrentCategories.bind(this)}
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