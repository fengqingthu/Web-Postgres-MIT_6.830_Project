import { FunctionComponent,useEffect,useState,useRef, ChangeEvent, ReactNode} from 'react';
import classes from './Cell.module.css';
import {useRecoilState, useRecoilValue} from "recoil";
import {CellValueState} from "../../store/CellValueState"
import { EvaluatedCellValueState } from '../../store/EvaluateCellValueState';
import {QueryState} from "../../store/QueryState";

export const CELL_WIDTH=100;
export const CELL_HEIGHT=25;

export type CellProps={
    children?: ReactNode | undefined;
    cellId: string;
    inputId:string;
    scell:string;
    ecell:string;

};

const Cell: FunctionComponent<CellProps>=(props)=>{
    const [state,setState] = useState(false);
    const row=props.cellId.split(", ")[1];
    const col=props.cellId.split(", ")[2];
    const srow=props.scell.split(", ")[0];
    const scol=props.scell.split(", ")[1];
    const erow=props.ecell.split(", ")[0];
    const ecol=props.ecell.split(", ")[1];
    useEffect(() => {
        if(srow<=row && erow>=row && scol<=col && ecol>=col){
            setState(true);
        }
      },[props.scell,props.ecell]);
    
    const [cellValue,setCellValue] = useRecoilState<string>(CellValueState(props.cellId));
    
    const [query,setQuery] =useRecoilState<string>(QueryState);
    // const evaluatedCellValue=useRecoilValue<string>(EvaluatedCellValueState(props.cellId));
    let [isEditMode, setISEditMode]=useState(false);
    const inputRef=useRef(null);

    const changeLabeltoInput=()=>{
        setISEditMode(true);
    }

    const changeInputtoLabel=()=>{
        setISEditMode(false);
    }

    const onClickOutsideInputHandler=(event: MouseEvent)=>{
        if((event.target as HTMLInputElement)?.dataset?.inputId!==props.inputId){
            changeInputtoLabel();
        }
        
    };

    const updateCellValueState=(event: ChangeEvent<HTMLInputElement>)=>{
        setCellValue(event.target.value);
        console.log("current query is"+query);
        console.log("cellid is"+props.cellId);
        // const newQuery=query;
        // sendSqlQuery(newQuery);
    }
    
    useEffect(()=>{
        return document.addEventListener("click", onClickOutsideInputHandler);
    },[])

    return isEditMode? <input className={classes.CellInput} ref={inputRef} data-input-id={props.inputId} onChange={updateCellValueState}/> : <div className={classes.CellLabel} data-input-id={props.inputId} onClick={changeLabeltoInput}>{cellValue}</div>;
}
export default Cell;