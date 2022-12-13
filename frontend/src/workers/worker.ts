import{expose} from "comlink";
// import {setCellValueState} from "../store/CellValueState";
const work=(arr:any, pid:number,func: (pageIdx:number, rowIdx:number, colIdx:number,value: string)=>void)=>{
    console.log("worker :: recieved message from main thread");
    for(let i=0;i<arr.length;i++){
        let cellId=0;
        for (let key in arr[i]){
            func(pid,i,cellId,arr[i][key]);
            cellId+=1;
        }
    }
    console.log("setData::finished setting data", pid);
};
const cellWorker={
    work
};
export type CellWorker= typeof cellWorker;
expose(cellWorker);