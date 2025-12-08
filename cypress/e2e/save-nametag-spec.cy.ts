/// <reference types="cypress" />

describe("Save nametag button", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("is able to save nametag and persist it across logins", () => {
    // Enter name tag information
    const displayName = "Chester McAnderson III";
    const pronoun = "He/Him";
    const disclosure = "I love spaghetti! 🍝";
    const fullMessage = `Hi! My name is ${displayName} and I am a ${pronoun}. ${disclosure}`;
    cy.contains("Preferred Name").click().type(`{selectall}${displayName}`);
    cy.contains("Pronouns").next().select(pronoun);
    cy.contains("Something About Me").click().type(`{selectall}${disclosure}`);
    cy.get('[data-testid="full-message-textarea"]')
      .should("exist")
      .type(fullMessage);
    // and save it
    cy.contains("button", "Save").first().click();

    // Go back to homepage
    cy.reload();
    // Check that saved info is still there
    cy.contains("Something About Me").next().should("have.value", disclosure);
    cy.contains("Pronouns").next().should("have.value", pronoun);
    cy.contains("Preferred Name").next().should("have.value", displayName);
    cy.get('[data-testid="full-message-textarea"]')
      .should("exist")
      .should("have.value", fullMessage);
  });

  it("should show toast notification when Send to Meeting is clicked", () => {
    // Enter full message
    const fullMessage = "Hello everyone! This is my disclosure message.";
    cy.get('[data-testid="full-message-textarea"]')
      .should("exist")
      .type(fullMessage);

    cy.contains("button", "Send to Chat").click();

    cy.contains("Message sent to the meeting chat").should("be.visible");

    cy.contains("Message sent to the meeting chat", {
      timeout: 4000,
    }).should("not.exist");
  });
});
