import React,{FunctionComponent,useState,useRef, ChangeEvent, ReactNode} from 'react';

import classes from './SqlInput.module.css';
import {clearAllPages} from "../../utils/memoize";
import { fetchData, fetchFirstPage, sendQuery } from '../../store/CellValueState';
import { atom,useRecoilState } from 'recoil';
import { PageIdxState } from '../../store/PageIdxState';
import {QueryState} from '../../store/QueryState';

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
    const [currQuery,setCurrQuery] = useRecoilState<string>(QueryState);
    const inputRef=useRef(null);
    const updateSqlQuery=(event: ChangeEvent<HTMLTextAreaElement>)=>{
      setQuery(event.target.value);
    }
    const sendSqlQuery=(event: React.MouseEvent<HTMLButtonElement>)=>{
      //sending query and go to the first page
      console.log("sending query: ",sqlQuery);
      sendQuery(sqlQuery);
      setCurrQuery(sqlQuery);

      clearAllPages();
      fetchFirstPage(sqlQuery);
      
      setPageIndex(0);
      for (let i=1;i<=2;i++){
        fetchData(i,sqlQuery);
      }
    }
    return <div className={classes.sqlInput}>
      <textarea rows={10} className={classes.queryBox} ref={inputRef}  onChange={updateSqlQuery} >{currQuery}</textarea>
      <button className={classes.queryButton} onClick={sendSqlQuery}> Query </button>
      </div>;
    
}
// export default SqlInput;