describe("Logging in spec", () => {
  it("is able to create new account and log in with it", () => {
    const email = "foobar@example.com";
    const password = "secret";
    cy.visit("http://localhost:3000");

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
    // Sign in successful (reach name tag page)
    cy.contains("Preferred Name");
  });
});
