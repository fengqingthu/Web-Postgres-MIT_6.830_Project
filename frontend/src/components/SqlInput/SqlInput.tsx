import React,{FunctionComponent,useState,useRef, ChangeEvent, ReactNode} from 'react';

import classes from './SqlInput.module.css';
import {clearAllPages} from "../../utils/memoize";
import { fetchData, fetchFirstPage, sendQuery } from '../../store/CellValueState';
import { atom,useRecoilState } from 'recoil';
import { PageIdxState } from '../../store/PageIdxState';

export type SqlProps={
    children?: ReactNode | undefined;
    query:string;
};

const createAtom=(newCellIdx:string)=>{
    return atom({
      key:`cell_${newCellIdx}`,
      default:newCellIdx+"read data form backend",
    })
}

export const SqlInput: FunctionComponent<SqlProps>=(props)=>{
    const [sqlQuery,setQuery]=useState("");
    const [pageIndex,setPageIndex] = useRecoilState<number>(PageIdxState);
    const inputRef=useRef(null);
    const updateSqlQuery=(event: ChangeEvent<HTMLInputElement>)=>{
      setQuery(event.target.value);
    }
    const sendSqlQuery=(event: React.MouseEvent<HTMLButtonElement>)=>{
      //sending query and go to the first page
      console.log("sending query: ",sqlQuery);
      sendQuery(sqlQuery);


      
      clearAllPages();
      fetchFirstPage();
      
      setPageIndex(0);
      for (let i=1;i<=2;i++){
        fetchData(i,props.query);
      }
    }
    return <div className={classes.sqlInput}><input  className={classes.queryBox} ref={inputRef}  onChange={updateSqlQuery}/> <button className={classes.queryButton} onClick={sendSqlQuery}> Query </button></div>;
    
}
// export default SqlInput;