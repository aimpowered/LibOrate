import { render, screen, waitFor, act } from "@testing-library/react";
import MyApp from "@/app/page";
import "@testing-library/jest-dom";
import { signIn, useSession } from "next-auth/react";
import routerMock from "next-router-mock";

jest.mock("next/navigation", () => require("next-router-mock"));
jest.mock("../lib/zoomapi", () => jest.requireActual("../lib/fakezoomapi"));
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  useSession: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const mockUseSession = useSession as jest.Mock;

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: "Success" }),
  }),
) as jest.Mock;

describe("landing page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loading", async () => {
    mockUseSession.mockReturnValue({ data: null, status: "loading" });
    render(<MyApp />);
    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  test("signin", async () => {
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
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
