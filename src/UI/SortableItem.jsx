import React from 'react';
import {
    TableRow,
    TableRowColumn,
}
    from 'material-ui/Table';
import {Checkbox} from "material-ui";
import TrashIcon from "material-ui/svg-icons/action/delete";
import EditIcon from "material-ui/svg-icons/image/edit"
import {SortableElement} from 'react-sortable-hoc';
import '../Styles/App.css';
import {getStripedStyle, setTextColorDoneTasks, setTrashIconColor} from "../Styles/Styling"
import {singleDate} from "../Utils/DateFunctions";


const SortableItem = SortableElement(({index, row, getIndex, removeTask, handleCheck, getEditVisibility}) =>
    <TableRow key={getIndex(row.getID())}
              style={{ padding: '5px 20px', height: 25, background : getStripedStyle(getIndex(row.getID()), row.getState()),
                  color: setTextColorDoneTasks(getIndex(row.getID()), row.getState())}}>
        {
            getEditVisibility()
                ? (<TableRowColumn style={{ width: "10%" }}>
                    <EditIcon id="editTaskIcon"/>
                </TableRowColumn>)
                : null
        }
        <TableRowColumn style={{ width: "10%" }}>
            <Checkbox id="taskStatus"
                      checked={row.getState()}
                      onCheck={() => handleCheck(getIndex(row.getID()))}
            />
        </TableRowColumn>
        <TableRowColumn id="taskName">
            {row.getName()}
        </TableRowColumn>
        <TableRowColumn style={{ width: "10%" }}>
            { row.getCategoryName()}
        </TableRowColumn>
        <TableRowColumn style={{ width: "10%" }}>
            { row.getDate() === "" || row.getDate() == null ? "Unassigned" : singleDate(row.getDate())}
        </TableRowColumn>
        <TableRowColumn style={{ width: "10%" }}>
            <TrashIcon id="trashIcon" onClick={(e) => { removeTask(e, getIndex(row.getID())) }}
                       style={{color: setTrashIconColor(getIndex(row.getID()),row.getState() )}}/>
        </TableRowColumn>
    </TableRow>);

export default SortableItem;