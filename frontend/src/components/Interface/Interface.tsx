
import React, {FunctionComponent, useState,useRef,ChangeEvent} from 'react';
import Sheet from '..//Sheet/Sheet';
import classes from "./Interface.module.css";
import {SqlInput} from "../SqlInput/SqlInput";
import { atom } from 'recoil';
import { getRecoil, setRecoil } from "recoil-nexus";
import {clearAllPages, memoize} from "../../utils/memoize";
import { CellValueState,fetchData,fetchFirstPage,setCellValueState } from '../../store/CellValueState';

export type InterfaceProps={};

const createAtom=(newCellIdx:string)=>{
  return atom({
    key:`cell_${newCellIdx}`,
    default:newCellIdx+"read data form backend",
  })
}

export const Interface:FunctionComponent<InterfaceProps>=(props)=> {
    const [sqlQuery,setQuery]=useState("");
    const inputRef=useRef(null);
    const updateSqlQuery=(event: ChangeEvent<HTMLInputElement>)=>{
      setQuery(event.target.value);
    }
    // const sendSqlQuery=(event: React.MouseEvent<HTMLButtonElement>)=>{
    //   //sending query and get page
    //   console.log("sending query: ",sqlQuery);


    //   // reading in data example
    //   // clearAllPages();
    //   fetchFirstPage();
    //   for(let i=1;i<2;i++){
    //       fetchData(i,sqlQuery);
    //   }
    // }


    return (

          <div className={classes.contentContainer}>
            <h3>Type SQL</h3>
            <SqlInput query={sqlQuery}></SqlInput>
            {/* <div className={classes.sqlInput}>
              <input  className={classes.queryBox} ref={inputRef}  onChange={updateSqlQuery}/> 
              <button className={classes.queryButton} onClick={sendSqlQuery}> Query </button>
            </div> */}
            <Sheet query={sqlQuery}></Sheet>

          </div>
    );
  }

  export default Interface;