import {Interface } from './components/Interface/Interface';
import { RecoilRoot } from 'recoil';
import './App.css';
import Cell from './components/Cell/Cell';
import SheetContainer from './containers/SheetContainer';

function App() {
  return (
    <RecoilRoot>
      <Interface></Interface>
        {/* <div className="contentContainer">
          <h3>Type SQL</h3>
          <input className="sqlInput"></input>
          
          <div className="excelContainer">
            <h3>Excel</h3>
            <SheetContainer ></SheetContainer>
          </div>
        </div> */}
    </RecoilRoot>
  );
}

export default App;
