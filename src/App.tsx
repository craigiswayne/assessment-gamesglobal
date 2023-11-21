import React, {useState} from 'react';
import './App.css';
import FilterBar from './components/FilterBar/FilterBar';
import Results from './components/Results/Results';

function App() {

    const [filteredItems, setFilteredItems] = useState(null);

    // @ts-ignore
    const resultsFetched = (data) => {
        setFilteredItems(data);
    };


    return (
      <>
          <header>
              <FilterBar resultsFetched={resultsFetched} />
          </header>
          <main>
              <Results filteredItems={filteredItems}/>
          </main>
      </>
  );
}

export default App;
