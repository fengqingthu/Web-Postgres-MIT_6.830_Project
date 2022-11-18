import {atom} from "recoil";
import {memoize} from "../utils/memoize"


export const CellValueState=(cellId:string,)=>memoize(cellId,(value:"")=>atom({
    key:`cell_${cellId}`,
    default:"",
})
);

