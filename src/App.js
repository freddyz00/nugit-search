import "./App.css";
import { useEffect, useState } from "react";
import SearchResultItem from "./components/SearchResultItem";
import AutocompleteSearchForm from "./components/AutocompleteSearchForm";
import { getSearchResults } from "./utils";
import axios from "axios";

function App() {
  const [autoCompleteSuggestions, setAutoCompleteSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);

  // Fetch the autocomplete suggestions from the github search api using the repositories with the most stars
  useEffect(() => {
    const fetchAutoCompleteSuggestions = async () => {
      const { data } = await axios.get(
        "https://api.github.com/search/repositories?q=stars:>=500&per_page=100&sort=starsgazers_count&order=desc"
      );
      setAutoCompleteSuggestions(data.items.map((item) => item.name));
    };
    fetchAutoCompleteSuggestions();
  }, []);

  // Create a new request to the API to get the search results when the user navigates to another page
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
      {/* header title */}
      <header>
        <h1>Nugit Search</h1>
      </header>

      <main>
        {/* Autocomplete Search Form */}
        <AutocompleteSearchForm
          setPage={setPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          autoCompleteSuggestions={autoCompleteSuggestions}
          setSearchResults={setSearchResults}
        />

        {/* Search Results */}
        <div>
          {searchResults.total_count === 0 && <p>No items match your search</p>}
          {searchResults.total_count > 0 && (
            <>
              <p>{searchResults.total_count} results</p>

              <div data-testid="results">
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
            </>
          )}
        </div>

        {/* Pagination */}
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
            <span data-testid="page">{page}</span>
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
