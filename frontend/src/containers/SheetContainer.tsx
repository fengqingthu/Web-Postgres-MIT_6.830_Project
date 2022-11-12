import { table } from 'console';
import React, {ComponentType, FunctionComponent} from 'react';
import Sheet from '../components/Sheet/Sheet';
import classes from './SheetContainer.module.css';

export type SheetContainerProps={

};

const SheetContainer: FunctionComponent<SheetContainerProps>=(props)=>{
    return <Sheet/>;
}
    


export default SheetContainer;