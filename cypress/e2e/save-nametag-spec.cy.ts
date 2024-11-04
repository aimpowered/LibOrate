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

    // Enter name tag information
    const displayName = "Chester McAnderson III";
    const pronoun = "He/Him";
    const disclosure = "I love spaghetti! 🍝";
    cy.contains("Preferred Name").click().type(`{selectall}${displayName}`);
    cy.contains("Pronouns").next().select(pronoun);
    cy.contains("Something About Me").click().type(`{selectall}${disclosure}`);
    // and save it
    cy.contains("Save Name Tag").click();

    // Go back to homepage
    cy.visit("/");
    cy.contains("Email").click().type(email);
    cy.contains("Password").click().type(password);
    cy.contains("Sign In").click();

    // Check that saved info is still there
    cy.contains("Something About Me").next().should("have.value", disclosure);
    cy.contains("Pronouns").next().should("have.value", pronoun);
    cy.contains("Preferred Name").next().should("have.value", displayName);
  });
});
