import React, {useState} from 'react';
import './App.css';
import FilterBar from './components/FilterBar/FilterBar';
import Results from './components/Results/Results';

function App() {

    const [filteredItems, setFilteredItems] = useState(null);
    const resultsFetched = (data) => {
        setFilteredItems(data);
    };


    return (
      <>
          <header className='container'>
              <FilterBar resultsFetched={resultsFetched} />
          </header>
          <main className='container'>
              <Results filteredItems={filteredItems}/>
          </main>
      </>
  );
}

export default App;
