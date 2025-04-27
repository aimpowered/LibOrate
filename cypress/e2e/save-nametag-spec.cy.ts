describe("Save nametag button", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("is able to save nametag and persist it across logins", () => {
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
    cy.reload();
    // Check that saved info is still there
    cy.contains("Something About Me").next().should("have.value", disclosure);
    cy.contains("Pronouns").next().should("have.value", pronoun);
    cy.contains("Preferred Name").next().should("have.value", displayName);
  });
});
