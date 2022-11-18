import { FunctionComponent,useEffect,useState,useRef, ChangeEvent, ReactNode} from 'react';
import classes from './Cell.module.css';
import {useRecoilState} from "recoil";
import {CellValueState} from "../../store/CellValueState"

export const CELL_WIDTH=100;
export const CELL_HEIGHT=25;

export type CellProps={
    children?: ReactNode | undefined;
    cellId: string;
    inputId:string;

};

const Cell: FunctionComponent<CellProps>=(props)=>{
    const [cellValue,setCellValue] = useRecoilState<string>(CellValueState(props.cellId));
    const [isEditMode, setISEditMode]=useState(false);
    const inputRef=useRef(null);

    const changeLabeltoInput=()=>{
        console.log("cell id is",props.cellId);
        setISEditMode(true);
    }

    const changeInputtoLabel=()=>setISEditMode(false);

    const onClickOutsideInputHandler=(event: MouseEvent)=>{
        if((event.target as HTMLInputElement)?.dataset?.inputId!==props.inputId){
            changeInputtoLabel();
        }
        
    };

    const updateCellValueState=(event: ChangeEvent<HTMLInputElement>)=>{
        setCellValue(event.target.value);
        console.log("new cell value",event.target.value);
    }
    useEffect(()=>{
        return document.addEventListener("click", onClickOutsideInputHandler);
    },[])

    return isEditMode? <input className={classes.CellInput} ref={inputRef} data-input-id={props.inputId} onChange={updateCellValueState}/> : <div className={classes.CellLabel} data-input-id={props.inputId} onClick={changeLabeltoInput}>{cellValue}</div>;
}
export default Cell;