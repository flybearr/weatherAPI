import { useState } from 'react'
import './App.css'
import { example } from './example'
function App() {
  const [displayIndex, setDisplayIndex] = useState(0)
  const selection = (
    <select
      value={displayIndex}
      onChange={(e) => {
        setDisplayIndex(Number(e.target.value));
      }}
    >
      {example.map((v, i) => {
        return (
          <option key={i} value={i}>
            {v.name}
          </option>
        );
      })}
    </select>
  );

   // 動態元件語法，注意命名開頭英文一定要大寫
   const MyComponent = example[displayIndex].component;
  return (
    <div className='App'>
      {selection}
      <hr />
      <MyComponent />
    </div>
  )
}

export default App
