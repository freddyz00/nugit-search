import { render, screen } from "@testing-library/react";
import renderer from "react-test-renderer";
import SearchResultItem from "./SearchResultItem";

describe("Search Result Item", () => {
  it("renders correct information", () => {
    const tree = renderer
      .create(
        <SearchResultItem
          name="name"
          owner="owner"
          description="This is a description"
          language="JavaScript"
          htmlUrl="https://www.github.com"
          topics={["react", "javascript"]}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
