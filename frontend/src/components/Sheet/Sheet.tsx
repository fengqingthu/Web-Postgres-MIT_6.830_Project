import React, {ComponentType, FunctionComponent} from 'react';
import { useRecoilValue } from 'recoil';
import Cell, { CELL_HEIGHT, CELL_WIDTH } from '../Cell/Cell';
import Column from '../Column/Column';
import Row from '../Row/Row';
import classes from './Sheet.module.css';
import {SheetSizeState} from "../../store/SheetSizeState";
import AxisCell from '../AxisCell/AxisCell';

export type SheetProps={};

const Sheet: FunctionComponent<SheetProps>=(props)=>{
    const sheetSize=useRecoilValue(SheetSizeState);

    const numberOfColumns=sheetSize.width/CELL_WIDTH;
    const numberOfRows=sheetSize.height/CELL_HEIGHT;
    console.log(numberOfColumns,numberOfRows);
    return (
        <table className={classes.Grid}>
            <tbody>
              <Row>
                {[...Array(numberOfColumns+1)].map((column,columnIndex)=>
                  columnIndex!==0?<AxisCell>{columnIndex}</AxisCell>:<AxisCell/>
                )}
              </Row>
               {[...Array(numberOfRows)].map((row, rowIndex)=>(
                 <Row key={rowIndex}>
                    <AxisCell>{rowIndex}</AxisCell>
                    {[...Array(numberOfColumns)].map((column,columnIndex)=>(
                      <Column key={columnIndex}>
                        <Cell cellId={`${rowIndex}, ${columnIndex}`}/>
                      </Column>

                    ))}
                 </Row>

               ))}
            </tbody>
        </table>
    );
}
    

export default Sheet