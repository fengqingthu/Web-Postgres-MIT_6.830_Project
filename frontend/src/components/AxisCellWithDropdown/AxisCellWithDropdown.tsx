import React, {FunctionComponent, ReactNode, useState, useEffect} from "react";
import Dropdown from "../DropDown/Dropdown";
import classes from "./AxisCellWithDropdown.module.css";

export type AxisCellWithDropdownProps={
    children?: ReactNode | undefined;
    options: string[];
    columnIdx: number;
};


const AxisCell: FunctionComponent<AxisCellWithDropdownProps>=(props)=>{
    const [dropdownOpened, setDropdownOpened] = useState(false);

    return (
        <th 
        className={classes.AxisCell}>
            <div onClick={()=>setDropdownOpened(!dropdownOpened)}>{props.children}</div>
            {dropdownOpened &&<div className={classes.Dropdown}> <Dropdown  columnIdx={props.columnIdx} options={props.options}></Dropdown></div>}
        </th>
    );
}
export default AxisCell;