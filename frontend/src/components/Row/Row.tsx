import React, {ComponentType, FunctionComponent, ReactNode} from 'react';
import classes from './Row.module.css';

export type RowProps={
    children?: ReactNode | undefined;
};

const Row: FunctionComponent<RowProps>=(props)=>{
    return <tr>{props.children}</tr>;
}
    

export default Row