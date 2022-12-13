import React, {ComponentType, FunctionComponent, ReactNode} from 'react';
import classes from './Dropdown.module.css';
import DropdownOption from "../DropdownOption/DropdownOption";

export type DropdownProps={
    children?: ReactNode | undefined;
    options: string[];
    columnIdx: number;
};

const Dropdown: FunctionComponent<DropdownProps>=(props)=>{
    return (
        <div className={classes.dropdown}>
            {props.options.map((option)=>
                <DropdownOption columnIdx={props.columnIdx} option={option}></DropdownOption>
            ) 
            }
        </div>
    );
}
    

export default Dropdown