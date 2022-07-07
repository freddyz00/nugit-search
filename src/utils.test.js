import axios from "axios";
import { getSearchResults } from "./utils";

jest.mock("axios");

describe("utility functions", () => {
  it("fetches data", async () => {
    const mockData = { items: [{ name: "react" }] };
    const response = { data: mockData };
    axios.get.mockResolvedValue(response);

    const data = await getSearchResults("react", 1);
    expect(data).toMatchObject(mockData);
  });
});
