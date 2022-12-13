import React, {ComponentType, FunctionComponent} from 'react';
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
import {CellValueState, fetchData} from "../../store/CellValueState";
import {checkHasPage} from "../../utils/memoize";

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
    const sheetSize=useRecoilValue(SheetSizeState);
    const [pageIndex,setPageIndex] = useRecoilState<number>(PageIdxState);
    const numberOfColumns=sheetSize.width/CELL_WIDTH;
    const numberOfRows=sheetSize.height/CELL_HEIGHT;
    const dropdwonOptions: string[]=["filter","sort:desc","sort:asc"];
    // console.log(numberOfColumns,numberOfRows);
    
    const nextPage=(event: React.MouseEvent<HTMLButtonElement>)=>{
      setPageIndex(pageIndex+1);
      // if (!checkHasPage(pageIndex)){
      for (let i=Math.max(0,pageIndex-2);i<pageIndex+4;i++){
        fetchData(i,props.query);
      }
      // }
    }

    const previousPage=(event: React.MouseEvent<HTMLButtonElement>)=>{
      setPageIndex(pageIndex-1);
    }

    return (
      <div className={classes.excelContainer}>
        <div className={classes.sheetBar}>
           <h3>Page: {pageIndex}</h3>
           {/* <h6>page: {pageIndex}</h6> */}
           <div>
            <button onClick={previousPage} >previous</button>
            <button onClick={nextPage} >next</button>
           </div>
        </div>
        <table className={classes.Grid}>
            <tbody>
              
              <Row>
                {[...Array(numberOfColumns+1)].map((column,columnIndex)=>
                  columnIndex!==0?<AxisCellWithDropdown options={dropdwonOptions} columnIdx={columnIndex}>{numberToString(columnIndex)}</AxisCellWithDropdown>:<AxisCell/>
                )}
              </Row>
               {[...Array(numberOfRows)].map((row, rowIndex)=>(
                 <Row key={rowIndex}>
                    <AxisCell key={rowIndex}>{pageIndex*1000+rowIndex}</AxisCell>
                    {[...Array(numberOfColumns)].map((column,columnIndex)=>(
                      <Column key={columnIndex}>
                        <Cell inputId={`${rowIndex}, ${columnIndex}`}  cellId={`${pageIndex}, ${rowIndex}, ${columnIndex}`}/>
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