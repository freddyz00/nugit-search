import React, { useState } from "react";
import { getSearchResults } from "../utils";

import "./AutocompleteSearchForm.css";

function AutocompleteSearchForm({
  setPage,
  searchTerm,
  setSearchTerm,
  autoCompleteSuggestions,
  setSearchResults,
}) {
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [matchedSuggestions, setMatchedSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Update the suggestions that match user input
  const onChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setMatchedSuggestions(
      autoCompleteSuggestions
        .filter((suggestion) => {
          return (
            suggestion.substring(0, value.length).toLowerCase() ===
            value.toLowerCase()
          );
        })
        .slice(0, 10)
    );
    setActiveSuggestionIndex(-1);
    setShowSuggestions(true);
  };

  // Make a new request to get the results that match the search term
  const onClick = async (item) => {
    setSearchTerm(item);
    setShowSuggestions(false);
    setMatchedSuggestions([]);
    setActiveSuggestionIndex(-1);
    setPage(1);
    const data = await getSearchResults(item, 1);
    setSearchResults(data);
  };

  // Handle keyboard presses for the autocomplete part
  const onKeyDown = async (event) => {
    switch (event.keyCode) {
      case 13: // Enter
        setActiveSuggestionIndex(-1);
        setShowSuggestions(false);
        return;
      case 27: // Escape
        setShowSuggestions(false);
        return;
      case 38: // Arrow Up
        event.preventDefault();
        if (activeSuggestionIndex === 0) return;
        setSearchTerm(matchedSuggestions[activeSuggestionIndex - 1]);
        setActiveSuggestionIndex(activeSuggestionIndex - 1);
        return;
      case 40: // Arrow Down
        event.preventDefault();
        if (activeSuggestionIndex === matchedSuggestions.length - 1) return;
        setSearchTerm(matchedSuggestions[activeSuggestionIndex + 1]);
        setActiveSuggestionIndex(activeSuggestionIndex + 1);
        return;
    }
  };

  // Make a request to the API using the search term provided by the user
  const handleSubmit = async (event) => {
    event.preventDefault();
    setPage(1);
    const data = await getSearchResults(searchTerm, 1);
    setSearchResults(data);
  };

  // Render the autocomplete suggestions as the user types in
  // If there are no matches, return nothing
  const renderSuggestionsList = () => {
    return (
      matchedSuggestions.length > 0 && (
        <ul className="search-form__suggestions" data-testid="suggestions">
          {matchedSuggestions.map((item, index) => (
            <li
              key={index}
              className={`${
                activeSuggestionIndex === index &&
                "search-form__suggestions--active"
              }`}
              onClick={() => onClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )
    );
  };

  return (
    <div className="search-form">
      {/* autocomplete form */}
      <form onSubmit={handleSubmit} data-testid="form">
        <input
          name="search"
          type="text"
          value={searchTerm}
          className="search-form__input"
          autoComplete="off"
          onKeyDown={onKeyDown}
          onChange={onChange}
        />
        <button className="search-form__button">Search</button>
      </form>

      {/* autocomplete suggestions */}
      {showSuggestions && searchTerm && renderSuggestionsList()}
    </div>
  );
}

export default AutocompleteSearchForm;
