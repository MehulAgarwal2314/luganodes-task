import './App.css';
import CustomizedTables from "./transactions/Table.jsx"

function App() {

  return (
    <div className="App">
      <div className='title'>
        <h1 className='titleName'>
          Ethereum Deposit Tracker By Mehul Agarwal
        </h1>
      </div>
      <div className='tables'>
        <CustomizedTables />
      </div>
      <div>
        Copyright - 21BEC0961
      </div>  
    </div>
  );
}

export default App;
