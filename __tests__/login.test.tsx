import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Page from "../app/page";
import mockRouter from "next-router-mock";

jest.mock("next/navigation", () => jest.requireActual("next-router-mock"));

describe("Landing page", () => {
  it("renders an email and password input", () => {
    render(<Page />);

    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toBeInTheDocument();
  });

  it("has sign-in button", () => {
    render(<Page />);

    const signInButton = screen.getByText("Sign In");
    expect(signInButton).toBeInTheDocument();

    fireEvent.click(signInButton);

    // TODO, test sign in flow
  });

  it("has sign-up link", async () => {
    render(<Page />);

    const signupButton = screen.getByText("sign up");
    expect(signupButton).toBeInTheDocument();

    fireEvent.click(signupButton);

    // TODO, test sign up flow
  });
});
