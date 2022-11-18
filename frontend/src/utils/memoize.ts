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

const memoizedContent: MemoizedContent={};
const memoizedPages: MemoizedPages={};
export const memoize=(cellId: string,  atomFactory: any)=>{
    const p=parseInt(cellId.split(",")[0]);
    if(!memoizedPages.hasOwnProperty(p)){
        memoizedPages[p]={};
    }
    if(!memoizedPages[p].hasOwnProperty(cellId)){
        memoizedPages[p][cellId]=atomFactory(cellId);
    }
    return memoizedPages[p][cellId];
    // if(!memoizedContent.hasOwnProperty(cellId)){
    //     // console.log("createAtom,",cellId)
    //     memoizedContent[cellId]=atomFactory(cellId);

        
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
    delete memoizedPages[page];
}

export const clearAllPages=()=>{
    for( let key in memoizedPages){
        clearMemory(parseInt(key));
    }
}