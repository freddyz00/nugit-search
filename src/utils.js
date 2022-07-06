import axios from "axios";

const GITHUB_SEARCH_API_URL = "https://api.github.com/search/repositories";

export const getSearchResults = async (searchTerm, page) => {
  try {
    const { data } = await axios.get(
      `${GITHUB_SEARCH_API_URL}?q=${searchTerm}&page=${page}`
    );
    return data;
  } catch (error) {
    if (error.response.status === 403) {
      alert(error.response.data.message);
    }
    return { status: 403, message: error.response.data.message };
  }
};
