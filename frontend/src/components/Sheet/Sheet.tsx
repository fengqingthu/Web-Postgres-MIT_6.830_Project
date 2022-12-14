import React, {ComponentType, FunctionComponent,useEffect, useState} from 'react';
import { useRecoilValue } from 'recoil';
import Cell, { CELL_HEIGHT, CELL_WIDTH } from '../Cell/Cell';
import Column from '../Column/Column';
import Row from '../Row/Row';
import classes from './Sheet.module.css';
import {SheetSizeState} from "../../store/SheetSizeState";
import AxisCell from '../AxisCell/AxisCell';
import { numberToString } from '../../utils/horizontalAxisCov';
import {useRecoilState,atom} from "recoil";
import { PageIdxState } from '../../store/PageIdxState';
import AxisCellWithDropdown from '../AxisCellWithDropdown/AxisCellWithDropdown';
import {CellValueState, fetchData,CalAggregates} from "../../store/CellValueState";
import {checkHasPage} from "../../utils/memoize";
import {QueryState} from "../../store/QueryState";
import CalAggre from "../CalAggre/CalAggre";
import { ColumnNameState } from '../../store/ColumnNameState';

export type SheetProps={
  query: string;
};

const createAtom=(newCellIdx:string)=>{
    return atom({
      key:`cell_${newCellIdx}`,
      default:"",
    })
}


const Sheet: FunctionComponent<SheetProps>=(props)=>{
    const columnNames=useRecoilValue(ColumnNameState);
    const sheetSize=useRecoilValue(SheetSizeState);
    const [query,setQuery] =useRecoilState<string>(QueryState);
    const [multiSelect, setMultiSelect]=useState(false);
    let startCell="";
    let [scell, setScell]=useState("");
    let [ecell, setEcell]=useState("");
    const [pageIndex,setPageIndex] = useRecoilState<number>(PageIdxState);
    const numberOfColumns=sheetSize.width/CELL_WIDTH;
    const numberOfRows=sheetSize.height/CELL_HEIGHT;
    const dropdwonOptions: string[]=["filter","sort:desc","sort:asc","max","min","avg","count"];
    // console.log(numberOfColumns,numberOfRows);
    useEffect(()=>{
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mouseup", onMouseUp);
    },[])
    const onMouseDown=(event: MouseEvent)=>{
      const id=(event.target as HTMLInputElement)?.dataset?.inputId;
      if(id){
        startCell=id;
        setScell(id);
        
        // console.log("mousedown",scell);
      }
    }
    const onMouseUp=(event: MouseEvent)=>{
      const id=(event.target as HTMLInputElement)?.dataset?.inputId;
      if(id){
        setEcell(id);

        const srow=parseInt(scell.split(", ")[0]);
        const scol=parseInt(scell.split(", ")[1]);
        const erow=parseInt(id.split(", ")[0]);
        const ecol=parseInt(id.split(", ")[1]);
        CalAggregates(srow,erow,scol,ecol,pageIndex);
        // console.log("mouseup",ecell);
      }
    }

    const nextPage=(event: React.MouseEvent<HTMLButtonElement>)=>{
      setPageIndex(pageIndex+1);
      // if (!checkHasPage(pageIndex)){
      for (let i=Math.max(0,pageIndex-2);i<pageIndex+4;i++){
        fetchData(i,query);
      }
      // }
    }

    const previousPage=(event: React.MouseEvent<HTMLButtonElement>)=>{
      setPageIndex(pageIndex-1);
    }

    return (
      <div className={classes.excelContainer}>
        <div className={classes.sheetBar}>
           <h3>Page: {pageIndex},scell:{scell},ecell{ecell}</h3>
           
           {/* <h6>page: {pageIndex}</h6> */}
           <div>
            <button onClick={previousPage} >previous</button>
            <button onClick={nextPage} >next</button>
           </div>
        </div>
        <CalAggre scell={scell} ecell={ecell}></CalAggre>
        <table className={classes.Grid}>
            <tbody>
              <Row>
                {/* {[...Array(numberOfColumns+1)].map((column,columnIndex)=>
                  columnIndex!==0?<AxisCellWithDropdown key={`axisCell_${columnIndex}`} options={dropdwonOptions} columnIdx={columnIndex}>{columnNames.columnIndex}</AxisCellWithDropdown>:<AxisCell/>
                )} */}
                
                  <AxisCell/>
                  <AxisCellWithDropdown  options={dropdwonOptions} columnIdx={1}>A: {columnNames.A}</AxisCellWithDropdown>
                  <AxisCellWithDropdown  options={dropdwonOptions} columnIdx={2}>B: {columnNames.B}</AxisCellWithDropdown>
                  <AxisCellWithDropdown  options={dropdwonOptions} columnIdx={3}>C: {columnNames.C}</AxisCellWithDropdown>
                  <AxisCellWithDropdown  options={dropdwonOptions} columnIdx={4}>D: {columnNames.D}</AxisCellWithDropdown>
                  <AxisCellWithDropdown  options={dropdwonOptions} columnIdx={5}>E: {columnNames.E}</AxisCellWithDropdown>
                  <AxisCellWithDropdown  options={dropdwonOptions} columnIdx={6}>F</AxisCellWithDropdown>
                  <AxisCellWithDropdown  options={dropdwonOptions} columnIdx={7}>G</AxisCellWithDropdown>
                  <AxisCellWithDropdown  options={dropdwonOptions} columnIdx={8}>H</AxisCellWithDropdown>
                  <AxisCellWithDropdown  options={dropdwonOptions} columnIdx={9}>I</AxisCellWithDropdown>
                  <AxisCellWithDropdown  options={dropdwonOptions} columnIdx={10}>J</AxisCellWithDropdown>
                  <AxisCellWithDropdown  options={dropdwonOptions} columnIdx={11}>K</AxisCellWithDropdown>
                  

                
              </Row>
               {[...Array(numberOfRows)].map((row, rowIndex)=>(
                 <Row key={rowIndex}>
                    <AxisCell key={rowIndex}>{pageIndex*100+rowIndex}</AxisCell>
                    {[...Array(numberOfColumns)].map((column,columnIndex)=>(
                      <Column cellId={`${pageIndex}, ${rowIndex}, ${columnIndex}`} scell={scell} ecell={ecell} key={`col_${pageIndex}, ${rowIndex}, ${columnIndex}`}>
                        <Cell key={`cell_${pageIndex}, ${rowIndex}, ${columnIndex}`} scell={scell} ecell={ecell} inputId={`${rowIndex}, ${columnIndex}`}  cellId={`${pageIndex}, ${rowIndex}, ${columnIndex}`}/>
                      </Column>

                    ))}
                 </Row>
               ))}
            </tbody>
            
        </table>

        </div>

    );
}
    

export default Sheet