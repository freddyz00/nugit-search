import axios from "axios";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-test-renderer";
import App from "../App";
import AutocompleteSearchForm from "./AutocompleteSearchForm";

jest.mock("axios");

describe("Autocomplete Search Form", () => {
  it("renders correctly", () => {
    render(<AutocompleteSearchForm />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("shows suggestions list that matched user input and responds correctly to events", async () => {
    // axios mock resolved value for autocomplete suggestions
    const response = {
      data: { items: [{ name: "react" }, { name: "redux" }] },
    };
    axios.get.mockResolvedValue(response);

    await act(() => {
      render(
        <App>
          <AutocompleteSearchForm />
        </App>
      );
    });

    // asserts no suggestions on initial render
    expect(screen.queryByTestId("suggestions")).not.toBeInTheDocument();

    // shows matching suggestions when typing
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "r" } });
    const suggestionsList = await screen.findByTestId("suggestions");
    expect(suggestionsList).not.toBeNull();
    expect(suggestionsList.children.length).toBe(2);

    // press arrow down key and shows the selected item
    fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 40 });
    expect(screen.getAllByRole("listitem")[0]).toHaveClass(
      "search-form__suggestions--active"
    );
    expect(screen.getByRole("textbox")).toHaveValue("react");

    // press the arrow up key and nothing changes if the selected item is the first in the list
    fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 38 });
    expect(screen.getAllByRole("listitem")[0]).toHaveClass(
      "search-form__suggestions--active"
    );

    // press the arrow down key followed by arrow up key, should end up with the same selected item
    fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 40 });
    fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 38 });
    expect(screen.getAllByRole("listitem")[0]).toHaveClass(
      "search-form__suggestions--active"
    );
    expect(screen.getByRole("textbox")).toHaveValue("react");

    // press the arrow down key and nothing changes if the selected item is the last in the list
    fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 40 });
    fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 40 });
    expect(screen.getAllByRole("listitem")[1]).toHaveClass(
      "search-form__suggestions--active"
    );

    // press the escape key to hide the suggestions list
    fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 27 });
    expect(screen.queryByTestId("suggestions")).not.toBeInTheDocument();
  });

  it("handles form submission", async () => {
    // axios mock resolved value for autocomplete suggestions
    let response = {
      data: { items: [{ name: "react" }, { name: "redux" }] },
    };
    axios.get.mockResolvedValue(response);

    await act(() => {
      render(
        <App>
          <AutocompleteSearchForm />
        </App>
      );
    });

    // change axios mock resolved value for searching
    response = {
      data: {
        total_count: 2,
        items: [
          {
            id: 1,
            name: "react",
            owner: { login: "facebook" },
            description:
              "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
            language: "JavaScript",
            html_url: "https://github.com/facebook/react",
            topics: ["javascript", "frontend"],
          },
          {
            id: 2,
            name: "flask",
            owner: { login: "pallets" },
            description:
              "The Python micro framework for building web applications.",
            language: "Python",
            html_url: "https://github.com/pallets/flask",
            topics: ["flask", "python"],
          },
        ],
      },
    };
    axios.get.mockResolvedValue(response);

    // type in "r" and click on the first item, should display results
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "r" } });
    await act(() => {
      fireEvent.click(screen.getAllByRole("listitem")[0]);
    });
    expect(await screen.findByTestId("results")).not.toBeNull();

    // type in something, press enter key, should hide the suggestions and display corresponding results
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "react" },
    });
    await act(() => {
      fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 13 });
    });
    expect(screen.queryByTestId("suggestions")).not.toBeInTheDocument();
    expect(await screen.findByTestId("results")).not.toBeNull();

    // submit the form and display the results
    await act(() => {
      fireEvent.submit(screen.getByTestId("form"));
    });
    expect(await screen.findByTestId("results")).not.toBeNull();
  });
});
