import { RecoilRoot } from 'recoil';
import './App.css';
import Cell from './components/Cell/Cell';
import SheetContainer from './containers/SheetContainer';

function App() {
  return (
    <RecoilRoot>
        <SheetContainer></SheetContainer>
    </RecoilRoot>
  );
}

export default App;
