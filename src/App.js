import "./App.css";
import { useEffect, useState } from "react";
import SearchForm from "./components/SearchForm";
import SearchResultItem from "./components/SearchResultItem";

function App() {
  const [autoCompleteSuggestions, setAutoCompleteSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {}, []);

  return (
    <div className="App">
      <header>
        <h1>Nugit Search</h1>
      </header>

      <main>
        {/* Search Form */}
        <SearchForm setSearchResults={setSearchResults} />

        {/* Search Results */}
        <div>
          {searchResults.total_count === 0 && <p>No items match your search</p>}
          {searchResults.total_count > 0 && (
            <>
              <p>{searchResults.total_count} results</p>
            </>
          )}

          {searchResults.items?.map((result) => (
            <SearchResultItem
              key={result.id}
              name={result.name}
              owner={result.owner.login}
              description={result.description}
              language={result.language}
              htmlUrl={result.html_url}
              topics={result.topics}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
