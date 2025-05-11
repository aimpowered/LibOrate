describe("Logging in spec", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should log in with mocked Zoom API", () => {
    cy.url().should("include", "/main"); // Verify successful login
  });
});
