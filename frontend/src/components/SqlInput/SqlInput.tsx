import React,{FunctionComponent,useState,useRef, ChangeEvent, ReactNode} from 'react';

import classes from './SqlInput.module.css';
import {memoize} from "../../utils/memoize";
import { atom } from 'recoil';

export type SqlProps={
    children?: ReactNode | undefined;
};

const createAtom=(newCellIdx:string)=>{
    return atom({
      key:`cell_${newCellIdx}`,
      default:newCellIdx+"read data form backend",
    })
}

export const SqlInput: FunctionComponent<SqlProps>=(props)=>{
    const [sqlQuery,setQuery]=useState("");
    const inputRef=useRef(null);
    const updateSqlQuery=(event: ChangeEvent<HTMLInputElement>)=>{
        setQuery(event.target.value);
    }
    const sendSqlQuery=(event: React.MouseEvent<HTMLButtonElement>)=>{
        //sending query and get page
        console.log("sending query: ",sqlQuery);


        // reading in data
        // clearMemory();
        // for(let i=0;i<10;i++){
        //     for(let j=0;j<2;j++){
        //       const newCellId=`${0}, ${i}, ${j}`
        //       updateMemoize(newCellId,createAtom);
        //     }
        // }

    }
    return <div className={classes.sqlInput}><input  className={classes.queryBox} ref={inputRef}  onChange={updateSqlQuery}/> <button className={classes.queryButton} onClick={sendSqlQuery}> Query </button></div>;
    
}
// export default SqlInput;