import React, {ComponentType, FunctionComponent, ReactNode,useEffect,useState} from 'react';
import classes from './Column.module.css';

export type ColumnProps={
    children?: ReactNode | undefined;
    cellId: string;
    scell:string;
    ecell:string;
};

const Column: FunctionComponent<ColumnProps>=(props)=>{
    const [state,setState] = useState(false);
    const row=parseInt(props.cellId.split(", ")[1]);
    const col=parseInt(props.cellId.split(", ")[2]);
    const srow=parseInt(props.scell.split(", ")[0]);
    const scol=parseInt(props.scell.split(", ")[1]);
    const erow=parseInt(props.ecell.split(", ")[0]);
    const ecol=parseInt(props.ecell.split(", ")[1]);

    useEffect(() => {
        if(srow<=row && erow>=row && scol<=col && ecol>=col){
            // console.log("selecting cell: erow",erow,"srow",srow,"cellrow",row);
            setState(true);
        }else{
            setState(false);
        }
      },[props.ecell]);
    return <td className={state?classes.Selected:classes.Column}>{props.children}</td>;
}

export default Column;