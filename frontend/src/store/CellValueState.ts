import {atom} from "recoil";
import {memoize, checkHasPage} from "../utils/memoize"
import {setRecoil } from "recoil-nexus";


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


export const fetchFirstPage=()=>{
    
    for(let i=0;i<10;i++){
        for(let j=0;j<2;j++){
        setCellValueState(0,i,j,"pageid: 0");
        }
    }
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
        .then(response => console.log(JSON.stringify(response)))       
        for(let i=0;i<10;i++){
            for(let j=0;j<2;j++){
            setCellValueState(pageIdx,i,j,"pageid: "+pageIdx.toString());
            }
        }
        
    }
    
    
}


