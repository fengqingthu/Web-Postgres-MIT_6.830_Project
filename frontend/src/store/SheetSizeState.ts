import {atom} from "recoil";
export const SheetSizeState=atom({
    key: "SheetSizeState",
    default:{
        width: 1200,
        height: 25000,
    }
})