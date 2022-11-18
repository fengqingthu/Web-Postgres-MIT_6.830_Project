import {memoize} from '../utils/memoize';
type JsonFile={
    [key:string]:any;
}

// when a new query is sent, fetch from batch 0
export const ProcessQuery=(query: string):any =>{

    //send query to backend

    //fetchData from backend
    const jsonFile=fetchData(0, query);

    //memoize data
    cache(jsonFile);

}

//called when cannot find the tuple in memory, may want to reread the page into memory
const getTuple=(tupleIdx:number, fieldIndex:number, query: string)=>{

}

//fetch specific page/batch
const fetchData=(page:number,query: string):any =>{


}

const cache=(json:JsonFile)=>{
    //use the function memoize in "../utils/memoize" to memoize the tuples
    //cell id would be `${tupleIndex},${fieldIndex}` or string(tupleIndex)+","+stirng(fieldIndex);
    //be consitent with tuple and field indexing

}

