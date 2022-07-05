import "./App.css";
import { useEffect, useState } from "react";
import SearchForm from "./components/SearchForm";
import SearchResultItem from "./components/SearchResultItem";
import { getSearchResults } from "./utils";

function App() {
  const [autoCompleteSuggestions, setAutoCompleteSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {}, []);

  useEffect(() => {
    if (searchTerm && page > 0) {
      getSearchResults(searchTerm, page).then((data) => {
        setSearchResults(data);
        document.documentElement.scrollTop = 0;
      });
    }
  }, [page]);

  return (
    <div className="app">
      <header>
        <h1>Nugit Search</h1>
      </header>

      <main>
        {/* Search Form */}
        <SearchForm
          page={page}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setSearchResults={setSearchResults}
        />

        {/* Search Results */}
        <div>
          {searchResults.total_count === 0 && <p>No items match your search</p>}
          {searchResults.total_count > 0 && (
            <p>{searchResults.total_count} results</p>
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

        {searchResults.total_count > 0 && (
          <div className="app__pagination">
            <button
              onClick={() => {
                if (page > 1) {
                  setPage((currentPage) => currentPage - 1);
                }
              }}
            >
              Prev
            </button>
            <span>{page}</span>
            <button
              onClick={() => {
                setPage((currentPage) => currentPage + 1);
              }}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
