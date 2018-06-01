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
import {setTextColorDoneTasks, setTrashIconColor} from "../Styles/Styling"
import {singleDate} from "../Utils/DateFunctions";


const SortableItem = SortableElement((
    {index, row, getIndex, removeTask, handleCheck, getEditVisibility, openEditWindow, editTask}) =>

    <TableRow key={getIndex(row.getID())}
              style={{ padding: '5px 20px', height: 25,
                  color: setTextColorDoneTasks(getIndex(row.getID()), row.getState())}}>
        {
            getEditVisibility()
                ? (<TableRowColumn style={{ width: "10%" }}>
                    <EditIcon id="editTaskIcon" onClick={(e) => { editTask(e, getIndex(row.getID())) }}/>
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