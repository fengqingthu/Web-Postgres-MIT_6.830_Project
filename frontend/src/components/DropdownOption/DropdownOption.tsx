import React, {FunctionComponent, ReactNode, useState, ChangeEvent, useRef, useEffect} from "react";
import {  fetchData, fetchFirstPage, sendQuery } from "../../store/CellValueState";
import { clearAllPages } from "../../utils/memoize";
import Dropdown from "../DropDown/Dropdown";
import classes from "./DropdownOption.module.css";
import { atom,useRecoilState } from 'recoil';
import { PageIdxState } from '../../store/PageIdxState';
import {QueryState} from '../../store/QueryState';

export type DropdownOptionProps={
    children?: ReactNode | undefined;
    option: string;
    columnIdx:number;
};
 
const DropdownOption: FunctionComponent<DropdownOptionProps>=(props)=>{
    const [currQuery,setCurrQuery] = useRecoilState<string>(QueryState);
    const [pageIndex,setPageIndex] = useRecoilState<number>(PageIdxState);

    // hooks and functions for filter
    const [filterFunc, setFilterFunc] = useState("filter");
    const [isInput, setIsInput]=useState(false);
    const inputRef=useRef(null);
    const changeLabeltoInput=()=>{
        setIsInput(true);
    }
    const changeInputtoLabel=()=>setIsInput(false);
    const updateFilterFunc=(event: ChangeEvent<HTMLInputElement>)=>{
        setFilterFunc(event.target.value);
        console.log("new filter",event.target.value);
    }

    const onClickOutsideInputHandler=(event: MouseEvent)=>{
        if((event.target as HTMLInputElement)?.dataset?.inputId!=="filter"){
            // console.log("onclickoutside",event.target)
            changeInputtoLabel();
            sendFilter();
        }
        
    };

    useEffect(()=>{
        return document.addEventListener("click", onClickOutsideInputHandler);
    },[])

    // hooks and functions for sorting

    // TO DO: modify these 2 functions 
    const sendSortAsc=()=>{
        console.log("before sorting, current query is"+currQuery);
        console.log("columnIdx is",props.columnIdx);
        // const newQuery=currQuery;
        // sendSqlQuery(newQuery);
    }

    const sendSortDesc=()=>{
        console.log("before sorting, current query is"+currQuery);
        console.log("columnIdx is",props.columnIdx);
        // const newQuery=currQuery;
        // sendSqlQuery(newQuery);
    }

    const sendFilter=()=>{
        console.log("before sorting, current query is"+currQuery);
        console.log("curr filter is"+filterFunc);
        console.log("columnIdx is",props.columnIdx);
        // const newQuery=currQuery;
        // sendSqlQuery(newQuery);
    }

    // function for fetch pages / get data 

    const sendSqlQuery=(sqlQuery:string)=>{
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

    if (props.option==="filter"){
        return (
            isInput? <input data-input-id={props.option} className={classes.FilterInput} ref={inputRef} onChange={updateFilterFunc}></input>: <div data-input-id={props.option} className={classes.DropdownOption} onClick={changeLabeltoInput}>{props.option}</div>
        );   
    }
    if (props.option==="sort:asc"){
        return (
            <div className={classes.DropdownOption} onClick={sendSortAsc}>{props.option}</div>
        );
    }
    return (
        <div className={classes.DropdownOption} onClick={sendSortDesc}>{props.option}</div>
    );
}
export default DropdownOption;