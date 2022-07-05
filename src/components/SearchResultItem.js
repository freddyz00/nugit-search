import React from "react";
import "./SearchResultItem.css";

function SearchResultItem({
  name,
  owner,
  description,
  language,
  htmlUrl,
  topics,
}) {
  return (
    <div className="search-result-item">
      <h2 className="search-result-item__title">
        <a href={htmlUrl}>
          <span className="search-result-item__owner">{`${owner} / `}</span>
          <span className="search-result-item__name">{name}</span>
        </a>
        <span className="search-result-item__language">{language}</span>
      </h2>
      <p>{description}</p>
      <div className="search-result-item__topics">
        {topics.map((topic, index) => (
          <a href={`http://www.github.com/topics/${topic}`} key={index}>
            {topic}
          </a>
        ))}
      </div>
    </div>
  );
}

export default SearchResultItem;
