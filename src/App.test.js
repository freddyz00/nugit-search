import axios from "axios";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react-test-renderer";

import App from "./App";

jest.mock("axios");

describe("app", () => {
  it("renders and fetches api on mount", async () => {
    const response = {
      data: { items: [{ name: "react" }, { name: "redux" }] },
    };
    axios.get.mockResolvedValue(response);

    await act(() => {
      render(<App />);
    });
    expect(screen.getByRole("heading")).toHaveTextContent("Nugit Search");
  });

  it("returns new search results on page change", async () => {
    let response = {
      data: { items: [{ name: "react" }, { name: "redux" }] },
    };
    axios.get.mockResolvedValue(response);

    await act(() => {
      render(<App />);
    });

    response = {
      data: {
        total_count: 1,
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
        ],
      },
    };
    axios.get.mockResolvedValue(response);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "react" },
    });
    await act(() => {
      fireEvent.submit(screen.getByTestId("form"));
    });
    expect(screen.getByTestId("page")).toHaveTextContent("1");

    await act(() => {
      fireEvent.click(screen.getAllByRole("button")[1]);
    });
    expect(screen.getByTestId("page")).toHaveTextContent("1");

    response = {
      data: {
        total_count: 1,
        items: [
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

    await act(() => {
      fireEvent.click(screen.getAllByRole("button")[2]);
    });
    expect(screen.getByTestId("page")).toHaveTextContent("2");

    await act(() => {
      fireEvent.click(screen.getAllByRole("button")[1]);
    });
    expect(screen.getByTestId("page")).toHaveTextContent("1");

    response = {
      data: {
        total_count: 0,
        items: [],
      },
    };
    axios.get.mockResolvedValue(response);

    await act(() => {
      fireEvent.submit(screen.getByTestId("form"));
    });

    expect(screen.getByText(/No items/)).toBeInTheDocument();
  });
});
