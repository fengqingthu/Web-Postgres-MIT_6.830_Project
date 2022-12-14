import {atom} from "recoil";
import {memoize, checkHasPage} from "../utils/memoize"
import {setRecoil, getRecoil } from "recoil-nexus";
import { ColumnNameState } from "./ColumnNameState";
import {AggResState} from "./AggResState";

import {wrap} from "comlink";
import type {CellWorker} from "../workers/worker";
import internal from "stream";


export const setCellValueState=(pageIdx:number, rowIdx:number, colIdx:number,value: string)=>{
    const newCellId=`${pageIdx}, ${rowIdx}, ${colIdx}`
    const newAtom=CellValueState(newCellId);
    setRecoil(newAtom,value);

}

export const CellValueState=(cellId:string,)=>memoize(cellId,(value:"")=>atom({
    key:`cell_${cellId}`,
    default:"",
})
);
export const CalAggregates=(srow:number, erow:number, scol:number, ecol:number, pid:number):{[op:string]:number}=>{
    let min=Number.POSITIVE_INFINITY;
    let max=Number.NEGATIVE_INFINITY;
    let sum=0;
    let count=0;
    // console.log("started cal aggregates",srow,erow,scol,ecol,pid);
    for (let r=srow; r<=erow; r++){
        for (let c=scol; c<=ecol; c++){
            const cid=`${pid}, ${r}, ${c}`
            const cellValueAtom=CellValueState(cid);
            
            const cellValue=parseInt(getRecoil(cellValueAtom));
            sum+=cellValue;
            count+=1;
            min=Math.min(min,cellValue);
            max=Math.max(max,cellValue);      
        }
    }
    let dict:{[op:string]:number}={};
    dict["sum"]=sum;
    dict["avg"]=sum/count;
    dict["max"]=max;
    dict["min"]=min;
    dict["count"]=count;
    console.log(dict);
    return dict;
}

export const fetchFirstPage=(query:string)=>{
    const cNames={
        "A":"sid",
        "B":"math",
        "C":"phys",
        "D": "chem",
        "E":"bio",
    }
    setRecoil(ColumnNameState,cNames);
    const timer=new Date();
    console.log("Fetching page 0")
        fetch('http://localhost:8000/api/get-page', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "page_index": 0, "query": query })
        })
    .then(response => response.json())
    .then(response =>{
        console.log("started parsing page 0", timer.getTime());
        setData(JSON.parse(JSON.stringify( response))["page_data"],0);
        console.log("finished parsing page 0", timer.getTime());
    } )     

}
export const fetchAggRes=(query:string)=>{
    const timer=new Date();
    console.log("Fetching aggregate result")
        fetch('http://localhost:8000/api/get-page', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "page_index": 0, "query": query })
        })
    .then(response => response.json())
    .then(response =>{
        console.log("started parsing page 0", timer.getTime());
        setAgg(JSON.parse(JSON.stringify( response))["page_data"]);
        console.log("finished parsing page 0", timer.getTime());
    } )     

}

export const sendQuery=(query:string)=>{
    fetch('http://localhost:8000/api/read', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "query": query })
    })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))
}

export const fetchData=(pageIdx:number, query:string)=>{
    const timer = new Date();
    if (!checkHasPage(pageIdx)){
        //TODO:get jsondata here
        console.log("Fetching page", pageIdx)
        fetch('http://localhost:8000/api/get-page', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "page_index": pageIdx, "query": query })
        })
        .then(response => response.json())
        .then(response => {
            console.log("started parsing page",pageIdx, " ",timer.getTime());
            setData(JSON.parse(JSON.stringify( response))["page_data"],pageIdx);
            console.log("finished parsing page ", pageIdx," ", timer.getTime());
        })       
        
        // for(let i=0;i<10;i++){
        //     for(let j=0;j<2;j++){
        //     setCellValueState(pageIdx,i,j,"pageid: "+pageIdx.toString());
        //     }
        // }
        
    }
    
    
}

export const setData=(ObjArr:any,pageIdx:number)=>{
    const timer=new Date();
    console.log("setData::started setting data",timer.getTime());
    // const worker = new Worker(new URL('../workers/worker.ts', import.meta.url));
    // const service=wrap<CellWorker>(worker);
    // service.work(ObjArr,pageIdx,setCellValueState);
    // console.log("created worker");
    for(let i=0;i<ObjArr.length;i++){
        let cellId=0;
        for (let key in ObjArr[i]){
            setCellValueState(pageIdx,i,cellId,ObjArr[i][key]);
            cellId+=1;
        }
    }
    console.log("setData::finished setting data", pageIdx," ",timer.getTime());
};

export const setAgg=(ObjArr:any)=>{
    console.log("started setting aggregation result",ObjArr);
    for(let i=0;i<ObjArr.length;i++){
        for (let key in ObjArr[i]){
            setRecoil(AggResState,ObjArr[i][key]);
            console.log("finished setting aggregation result", ObjArr[i][key]);
        }
    }
    
};
