import axios from "axios";
import React, { useState } from "react";

import "./SearchForm.css";

const GITHUB_SEARCH_API_URL = "https://api.github.com/search/repositories";

function SearchForm({ setSearchResults }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .get(`${GITHUB_SEARCH_API_URL}?q=${searchTerm}&page=${page}`)
      .then((response) => {
        console.log(response.data);
        setSearchResults(response.data);
      });
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
