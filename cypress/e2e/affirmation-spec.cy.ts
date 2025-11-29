/// <reference types="cypress" />

describe("Affirmation in spec", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should allow updating, adding, and deleting affirmations", () => {
    // Edit affirmation card
    cy.get('[data-testid="affirmation-card-menu"]').first().click();
    cy.contains("Edit").click();
    cy.get('textarea[placeholder="Write your message"]')
      .should("be.visible")
      .click()
      .type("{selectall}{backspace}Update affirmation");

    cy.contains("button", /^Save$/).click();

    cy.contains("Update affirmation").should("exist");
    cy.reload();
    cy.contains("Update affirmation").should("exist");

    // Delete affirmation card
    cy.get('[data-testid="affirmation-card-menu"]').first().click();
    cy.contains("Delete").click();
    cy.contains("button", "Confirm").click();
    cy.contains("Update affirmation").should("not.exist");
    cy.reload();
    cy.contains("Update affirmation").should("not.exist");

    // Add affirmation card
    // Navigate to the end to find the add button
    cy.get('[data-testid="carousel-next-button"]').then(($btn) => {
      function clickUntilDisabled() {
        if (!$btn.is(":disabled")) {
          cy.wrap($btn).click();
          // cy.wait(100); // Small wait for animation
          cy.get('[data-testid="carousel-next-button"]').then(($nextBtn) => {
            if (!$nextBtn.is(":disabled")) {
              clickUntilDisabled();
            }
          });
        }
      }
      clickUntilDisabled();
    });

    cy.get('button[aria-label="Add new affirmation"]').click();
    cy.get('textarea[placeholder="Write your message"]')
      .should("be.visible")
      .click()
      .type("Hello world");
    cy.contains("button", /^Save$/).click();
    cy.contains("Hello world").should("exist");
  });
});
