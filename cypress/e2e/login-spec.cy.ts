describe("Logging in spec", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.zoomApi = {
          authorize: async (options): Promise<{ message: string }> => {
            console.log("✅ Mocked authorize called!");
            return { message: "Success" };
          },
          setAuthorizeCallback: (cb) => {
            console.log("✅ Mocked setAuthorizeCallback called!");
            setTimeout(() => cb({ code: "mocked_code" }), 100);
          },
        };
      },
    });
  });

  it("should log in with mocked Zoom API", () => {
    cy.url().should("include", "/main"); // Verify successful login
  });
});
