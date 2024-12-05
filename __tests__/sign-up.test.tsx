import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "../app/sign-up/page";

jest.mock("next/navigation", () => jest.requireActual("next-router-mock"));

describe("Sign-up page", () => {
  it("renders an email and password input", () => {
    render(<Page />);

    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toBeInTheDocument();
  });
});
