import { render, screen, waitFor } from "@testing-library/react";
import MyApp from "@/app/page";
import "@testing-library/jest-dom";
import { signIn } from "next-auth/react";
import routerMock from "next-router-mock";

jest.mock("next/navigation", () => require("next-router-mock"));
jest.mock("../lib/zoomapi", () => jest.requireActual("../lib/fakezoomapi"));
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  useSession: jest.fn(() => ({ data: null, status: "loading" })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: "Success" }),
  }),
) as jest.Mock;

describe("landing page", () => {
  test("loading", async () => {
    console.log("Starting test..."); // Debugging log
    render(<MyApp />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("signin", async () => {
    routerMock.push("/");
    render(<MyApp />);
    await waitFor(() =>
      expect(signIn).toHaveBeenCalledWith("credentials", {
        code: "mocked_code",
        redirect: false,
      }),
    );
    await waitFor(() =>
      expect(routerMock).toMatchObject({ pathname: "/main" }),
    );
  });
});
