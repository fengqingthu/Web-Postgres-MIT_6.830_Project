import React,{FunctionComponent,useState,useRef, ChangeEvent, ReactNode} from 'react';

import classes from './SqlInput.module.css';

export type SqlProps={
    children?: ReactNode | undefined;
};

export const SqlInput: FunctionComponent<SqlProps>=(props)=>{
    const [sqlQuery,setQuery]=useState("");
    const inputRef=useRef(null);
    const updateSqlQuery=(event: ChangeEvent<HTMLInputElement>)=>{
        setQuery(event.target.value);
    }
    const sendSqlQuery=(event: React.MouseEvent<HTMLButtonElement>)=>{
        console.log("sending query: ",sqlQuery);
    }
    return <div className={classes.sqlInput}><input  className={classes.queryBox} ref={inputRef}  onChange={updateSqlQuery}/> <button className={classes.queryButton} onClick={sendSqlQuery}> Query </button></div>;
    
}
// export default SqlInput;