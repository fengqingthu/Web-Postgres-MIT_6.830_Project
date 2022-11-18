import {resetRecoil} from "recoil-nexus";
type MemorizedPage={
    [key:string]:any;
}
type MemoizedPages={
    [key:number]:MemorizedPage;
}
type MemoizedContent={
    // [key: int]:MemorizedPage;
    [key:string]:any;
}

const cached=new Array<number>();
const memoizedContent: MemoizedContent={};
const memoizedPages: MemoizedPages={};
export const add2cache=()=>{
    
}
export const memoize=(cellId: string,  atomFactory: any)=>{
    const p=parseInt(cellId.split(",")[0]);
    if(!memoizedPages.hasOwnProperty(p)){
        memoizedPages[p]={};
    }
    
    if(!memoizedContent.hasOwnProperty(cellId)){
        memoizedContent[cellId]=atomFactory(cellId);
    }
    if(!memoizedPages[p].hasOwnProperty(cellId)){
        memoizedPages[p][cellId]=memoizedContent[cellId];
    }
    return memoizedPages[p][cellId];
    // if(!memoizedContent.hasOwnProperty(cellId)){
    //     // console.log("createAtom,",cellId)
    //     memoizedContent[cellId]=atomFactory(cellId);
    // }

        
    // };
    // // console.log(memoizedContent);
    // return memoizedContent[cellId];
}


// don't use this
const updateMemoize=(cellId: string,  atomFactory: any)=>{
    memoizedContent[cellId]=atomFactory(cellId);
}


//clear pages that are not currently relevent 
export const clearMemory=(page:number)=>{
    console.log("clearing page",page)
    for (let a in memoizedPages[page]){
        resetRecoil(memoizedPages[page][a]);
    }
    delete memoizedPages[page];
}

export const clearAllPages=()=>{
    for( let key in memoizedPages){
        if (parseInt(key)!==0){
            clearMemory(parseInt(key));
        }
    }
    while(cached.length > 0) {
        cached.pop();
    }
}

export const checkHasPage=(pageIdx:number)=>{
    return memoizedPages.hasOwnProperty(pageIdx);
}
