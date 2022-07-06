import React, { useEffect, useState } from "react";
import { getSearchResults } from "../utils";

import "./SearchForm.css";

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

  const onChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setMatchedSuggestions(
      autoCompleteSuggestions.filter((suggestion) => {
        return (
          suggestion.substring(0, value.length).toLowerCase() ===
          value.toLowerCase()
        );
      })
    );
    setActiveSuggestionIndex(-1);
    setShowSuggestions(true);
  };

  const onClick = async (item) => {
    setSearchTerm(item);
    setShowSuggestions(false);
    setMatchedSuggestions([]);
    setActiveSuggestionIndex(-1);
    setPage(1);
    const data = await getSearchResults(item, 1);
    setSearchResults(data);
  };

  const onKeyDown = async (event) => {
    console.log(event);
    switch (event.keyCode) {
      case 13:
        setActiveSuggestionIndex(-1);
        setShowSuggestions(false);
        return;
      // case 27:
      //   setShowSuggestions(false);
      //   return;
      case 38:
        event.preventDefault();
        if (activeSuggestionIndex === 0) return;
        setSearchTerm(matchedSuggestions[activeSuggestionIndex - 1]);
        setActiveSuggestionIndex(activeSuggestionIndex - 1);
        return;
      case 40:
        event.preventDefault();
        if (activeSuggestionIndex === matchedSuggestions.length - 1) return;
        setSearchTerm(matchedSuggestions[activeSuggestionIndex + 1]);
        setActiveSuggestionIndex(activeSuggestionIndex + 1);
        return;
      default:
        return;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPage(1);
    const data = await getSearchResults(searchTerm, 1);
    setSearchResults(data);
  };

  const renderSuggestionsList = () => {
    return (
      matchedSuggestions.length > 0 && (
        <ul className="search-form__suggestions">
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
      <form onSubmit={handleSubmit}>
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

      {showSuggestions && searchTerm && renderSuggestionsList()}
    </div>
  );
}

export default AutocompleteSearchForm;
