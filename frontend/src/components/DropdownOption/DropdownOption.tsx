import React, {
    ChangeEvent,
    FunctionComponent,
    ReactNode,
    useEffect,
    useRef,
    useState
} from "react";
import {
    fetchData,
    fetchFirstPage,
    sendQuery
} from "../../store/CellValueState";
import {clearAllPages} from "../../utils/memoize";
import classes from "./DropdownOption.module.css";
import {useRecoilState} from 'recoil';
import {PageIdxState} from '../../store/PageIdxState';
import {QueryState} from '../../store/QueryState';
import { fetchAggRes } from "../../store/CellValueState";

export type DropdownOptionProps={
    children?: ReactNode | undefined;
    option: string;
    columnIdx:number;
};

let idx2Name = new Map<number, string>([
    [1, "sid"],
    [2, "math"],
    [3, "phys"],
    [4, "chem"],
    [5, "bio"],
])

 
const DropdownOption: FunctionComponent<DropdownOptionProps>=(props)=>{
    const [currQuery,setCurrQuery] = useRecoilState<string>(QueryState);
    const [pageIndex,setPageIndex] = useRecoilState<number>(PageIdxState);

    // hooks and functions for filter
    const [filterFunc, setFilterFunc] = useState(" ");
    let newFilter="";
    const [isInput, setIsInput]=useState(false);
    const inputRef=useRef(null);
    const changeLabeltoInput=()=>{
        setIsInput(true);
    }
    const changeInputtoLabel=()=>setIsInput(false);
    const updateFilterFunc=(event: ChangeEvent<HTMLInputElement>)=>{
        if (event.target.value[event.target.value.length-1]===";"){
           sendFilter(event.target.value);
           return 
        }
        newFilter=(" "+event.target.value).slice(1);
        setFilterFunc((" "+event.target.value).slice(1));
    }

    const onClickOutsideInputHandler=(event: MouseEvent)=>{
        if((event.target as HTMLInputElement)?.dataset?.inputId!=="filter" && isInput){
            // sendFilter();
            console.log("onclickoutside",event.target)
            changeInputtoLabel();
            
        }
        
    };

    useEffect(()=>{
        return document.addEventListener("click", onClickOutsideInputHandler);
    },[])

    // hooks and functions for sorting

    const _sortHelper=(currQuery:string, props:DropdownOptionProps)=>{
        let find = currQuery.indexOf("ORDER");
        let newQuery;
        if (find == -1) {
            newQuery = currQuery;
        } else {
            newQuery = currQuery.slice(0, find).trim();
        }

        return newQuery + " ORDER BY " + idx2Name.get(props.columnIdx);
    }

    const sendSortAsc=()=>{
        console.log("before sorting, current query is"+currQuery);
        console.log("columnIdx is",props.columnIdx);
        // const newQuery=currQuery;
        // sendSqlQuery(newQuery);

        let newQuery = _sortHelper(currQuery, props);
        sendSqlQuery(newQuery);
    }

    const sendSortDesc=()=>{
        console.log("before sorting, current query is"+currQuery);
        console.log("columnIdx is",props.columnIdx);
        // const newQuery=currQuery;
        // sendSqlQuery(newQuery);

        let newQuery = _sortHelper(currQuery, props) + " DESC"
        sendSqlQuery(newQuery);
    }

    const sendFilter=(newFilter:string)=>{
        console.log("prop option is"+props.option);
        console.log("curr filter is",newFilter);
        console.log("columnIdx is",props.columnIdx);
        // const newQuery=currQuery;
        // sendSqlQuery(newQuery);

        // trim trailing ";"
        newFilter = newFilter.slice(0, newFilter.indexOf(";")).trim();

        let newQuery = currQuery;

        // find if there is ORDER BY clause
        let findOrder = currQuery.indexOf("ORDER");
        let orderClause = "";
        if (findOrder != -1) {
            // take the ORDER BY clause out
            orderClause = currQuery.slice(findOrder);
            newQuery = currQuery.slice(0, findOrder).trim();
        }

        // find if there is WHERE in currQuery
        let find = newQuery.indexOf("WHERE")
        if (find == -1) {
            // There is no WHERE
            newQuery = newQuery + " WHERE " + newFilter;
        } else {
            // There is WHERE
            newQuery = newQuery + " AND " + newFilter;
        }

        newQuery = newQuery + " " + orderClause;

        sendSqlQuery(newQuery);
    }

    const _aggHelper=(currQuery:string, type:string, props:DropdownOptionProps)=>{
        let find = currQuery.indexOf("*");

        let colName = idx2Name.get(props.columnIdx);

        let rightPart = currQuery.slice(find + 1).trim();
        let leftPart = currQuery.slice(0, find).trim();

        return leftPart + ` ${type}(${colName}) ` + rightPart;
    }

    const sendMax=()=>{
        sendSqlQuery(_aggHelper(currQuery, "MAX", props));
    }

    const sendMin=()=>{
        sendAggQuery(_aggHelper(currQuery, "MIN", props));
    }

    const sendAvg=()=>{
        sendAggQuery(_aggHelper(currQuery, "AVG", props));
    }

    const sendCount=()=>{
        sendAggQuery(_aggHelper(currQuery, "COUNT", props));
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

    const sendAggQuery=(sqlQuery:string)=>{
        //sending query and go to the first page
        console.log("sending aggregate by column query: ",sqlQuery);
        sendQuery(sqlQuery);
  
        fetchAggRes(sqlQuery);
        
    };

    if (props.option==="filter"){
        return (
            isInput? <input data-input-id={props.option} className={classes.FilterInput} ref={inputRef} onChange={updateFilterFunc}></input>: <div data-input-id={props.option} className={classes.DropdownOption} onClick={changeLabeltoInput}>{filterFunc!==" "?filterFunc:props.option}</div>
        );   
    }
    if (props.option==="sort:asc"){
        return (
            <div className={classes.DropdownOption} onClick={sendSortAsc}>{props.option}</div>
        );   
    }
    if (props.option==="max"){
        return (
            <div className={classes.DropdownOption} onClick={sendMax}>{props.option}</div>
        );   
    }
    if (props.option==="min"){
        return (
            <div className={classes.DropdownOption} onClick={sendMin}>{props.option}</div>
        );   
    }
    if (props.option==="avg"){
        return (
            <div className={classes.DropdownOption} onClick={sendAvg}>{props.option}</div>
        );   
    }
    if (props.option==="count"){
        return (
            <div className={classes.DropdownOption} onClick={sendCount}>{props.option}</div>
        );   
    }
    return (
        <div className={classes.DropdownOption} onClick={sendSortDesc}>{props.option}</div>
    );
}
export default DropdownOption;