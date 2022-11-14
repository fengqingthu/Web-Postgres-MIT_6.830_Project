
import React, {FunctionComponent} from 'react';
import SheetContainer from '../../containers/SheetContainer';
import "./Interface.module.css";
import {SqlInput} from "../SqlInput/SqlInput";
export type InterfaceProps={};
export const Interface:FunctionComponent<InterfaceProps>=(props)=> {
    return (

          <div className="contentContainer">
            <h3>Type SQL</h3>
            <SqlInput></SqlInput>
            <div className="excelContainer">
              <h3>Excel</h3>
              <SheetContainer ></SheetContainer>
            </div>
          </div>
    );
  }

  export default Interface;