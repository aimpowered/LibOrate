import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "../app/sign-up/page";

jest.mock("next/navigation", () => jest.requireActual("next-router-mock"));

describe("Page", () => {
  it("creates email sign up field", () => {
    render(<Page />);

    const username = screen.queryByPlaceholderText("Username");

    expect(username).not.toBeInTheDocument();
  });
});
