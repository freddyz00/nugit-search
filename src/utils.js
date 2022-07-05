import axios from "axios";

const GITHUB_SEARCH_API_URL = "https://api.github.com/search/repositories";

export const getSearchResults = async (searchTerm, page) => {
  const { data } = await axios.get(
    `${GITHUB_SEARCH_API_URL}?q=${searchTerm}&page=${page}`
  );
  return data;
};
