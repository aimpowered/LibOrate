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

    cy.get("#name").clear().type(displayName);

    cy.get("#pronouns").click();
    cy.contains("li", pronoun).click();

    cy.get("#disclosure").clear().type(disclosure);

    cy.get('[data-testid="full-message-textarea"]')
      .should("exist")
      .clear()
      .type(fullMessage);

    // and save it
    cy.contains("button", "Save").first().click();

    // Go back to homepage
    cy.reload();

    // Check that saved info is still there
    cy.get("#name").should("have.value", displayName);
    cy.get("#pronouns").should("have.text", pronoun);
    cy.get("#disclosure").should("have.value", disclosure);
    cy.get('[data-testid="full-message-textarea"]')
      .should("exist")
      .should("have.value", fullMessage);
  });

  it("should show info toast when Send to Meeting is clicked with empty message", () => {
    // Clear full message
    cy.get('[data-testid="full-message-textarea"]')
      .should("exist")
      .clear();

    cy.contains("button", "Send to Chat").click();

    cy.contains("Please type a disclosure message before sending").should(
      "be.visible"
    );

    cy.contains("Please type a disclosure message before sending", {
      timeout: 4000,
    }).should("not.exist");
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
