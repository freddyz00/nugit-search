import axios from "axios";
import React, { useState } from "react";
import { getSearchResults } from "../utils";

import "./SearchForm.css";

function SearchForm({ page, searchTerm, setSearchTerm, setSearchResults }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await getSearchResults(searchTerm, page);
    setSearchResults(data);
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
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-form__button">Search</button>
      </form>
    </div>
  );
}

export default SearchForm;
