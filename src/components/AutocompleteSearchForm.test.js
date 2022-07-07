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

    expect(screen.queryByTestId("suggestions")).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "r" } });
    const suggestionsList = await screen.findByTestId("suggestions");
    expect(suggestionsList).not.toBeNull();
    expect(suggestionsList.children.length).toBe(2);

    fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 40 });
    expect(screen.getAllByRole("listitem")[0]).toHaveClass(
      "search-form__suggestions--active"
    );
    expect(screen.getByRole("textbox")).toHaveValue("react");

    fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 38 });
    expect(screen.getAllByRole("listitem")[0]).toHaveClass(
      "search-form__suggestions--active"
    );

    fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 40 });
    fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 38 });
    expect(screen.getAllByRole("listitem")[0]).toHaveClass(
      "search-form__suggestions--active"
    );
    expect(screen.getByRole("textbox")).toHaveValue("react");

    fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 40 });
    fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 40 });
    expect(screen.getAllByRole("listitem")[1]).toHaveClass(
      "search-form__suggestions--active"
    );

    fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 27 });
    expect(screen.queryByTestId("suggestions")).not.toBeInTheDocument();
  });

  it("handles form submission", async () => {
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

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "r" } });
    await act(() => {
      fireEvent.click(screen.getAllByRole("listitem")[0]);
    });

    const resultsContainer = await screen.findByTestId("results");
    expect(resultsContainer).not.toBeNull();

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "react" },
    });

    await act(() => {
      fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 13 });
    });
    expect(screen.queryByTestId("suggestions")).not.toBeInTheDocument();
    expect(await screen.findByTestId("results")).not.toBeNull();

    await act(() => {
      fireEvent.submit(screen.getByTestId("form"));
    });
    expect(await screen.findByTestId("results")).not.toBeNull();
  });
});
