describe("Save nametag button", () => {
  it("is able to save nametag and persist it across logins", () => {
    const email = "foobar@example.com";
    const password = "secret";
    cy.visit("/");

    // Sign-up
    cy.contains("sign up").click();
    cy.contains("Create an account");
    cy.contains("Email").click().type(email);
    cy.contains("Password").click().type(password);
    cy.contains("Sign Up").click();
    cy.wait(5000); // TODO: make this faster and remove this line
    // Sign up successful
    cy.contains("User created successfully");

    // Sign-in
    cy.contains("sign in").click();
    cy.contains("Email").click().type(email);
    cy.contains("Password").click().type(password);
    cy.contains("Sign In").click();

    const displayName = "Chester McAnderson III";
    // Type in info
    cy.contains("Preferred Name").click().type(`{selectall}${displayName}`);
    cy.contains("Save Name Tag").click();

    // Go back to homepage
    cy.visit("/");
    cy.contains("Email").click().type(email);
    cy.contains("Password").click().type(password);
    cy.contains("Sign In").click();

    // Check that preferred name is still there
    cy.contains("Preferred Name")
      .get("input")
      .should("have.value", displayName);
  });
});
