type MemoizedContent={
    [key:string]:any;
}

const memoizedContent: MemoizedContent={};

export const memoize=(cellId: string,  atomFactory: any)=>{
    if(!memoizedContent.hasOwnProperty(cellId)){
        memoizedContent[cellId]=atomFactory();
    };
    return memoizedContent[cellId];
}