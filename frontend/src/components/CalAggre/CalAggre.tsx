import React, {ComponentType, FunctionComponent, ReactNode,useEffect,useState} from 'react';
import classes from './CalAggre.module.css';
import { CalAggregates } from '../../store/CellValueState';
import { PageIdxState } from '../../store/PageIdxState';
import { useRecoilValue } from 'recoil';
import { AggResState } from '../../store/AggResState';

export type CalAggreProps={
    scell:string;
    ecell:string;
};

const CalAggre: FunctionComponent<CalAggreProps>=(props)=>{
    const [sum,setSum] = useState(" ");
    const [min,setMin] = useState(" ");
    const [max,setMax] = useState(" ");
    const [avg,setAvg] = useState(" ");
    const [count,setCount] = useState(" ");
    const srow=parseInt(props.scell.split(", ")[0]);
    const scol=parseInt(props.scell.split(", ")[1]);
    const erow=parseInt(props.ecell.split(", ")[0]);
    const ecol=parseInt(props.ecell.split(", ")[1]);
    const pid =useRecoilValue<number>(PageIdxState);
    const aggRes =useRecoilValue<string>(AggResState);
    let info:{[op:string]:number}={};

    useEffect(() => {
        info=CalAggregates(srow,erow,scol,ecol,pid);
        setSum(info["sum"].toString());
        setMin(info["min"].toString());
        setAvg(info["avg"].toString());
        setMax(info["max"].toString());
        setCount(info["count"].toString());
      },[props.ecell]);
      return <div className={classes.analytics}>
        <h4 className={classes.aggresTitle}>Analytics</h4>
        <p className={classes.aggres}>Cell Selected: {count}, Sum:{sum}, Min Value: {min}, Max Value: {max}, Average: {avg}</p>
        <p className={classes.aggres}>Aggregation by column: {aggRes}</p>
        </div>;
    
}

export default CalAggre;