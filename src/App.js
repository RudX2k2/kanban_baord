import logo from './logo.svg';
import './App.css';
import Board from "./components/Board";


function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Kanban Board</h1>
      <Board />
    </div>
  );
}

export default App;
