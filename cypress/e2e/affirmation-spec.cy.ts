describe("Affirmation in spec", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should allow updating, adding, and deleting affirmations", () => {
    // Edit affirmation card
    cy.get('button[aria-label="more actions"]').first().click();
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
    cy.get('button[aria-label="more actions"]').first().click();
    cy.contains("Delete").click();
    cy.contains("button", "Confirm").click();
    cy.contains("Update affirmation").should("not.exist");
    cy.reload();
    cy.contains("Update affirmation").should("not.exist");

    // Add affirmation card
    function clickNextUntilDisabled() {
      cy.contains("span", "Next slide")
        .parent("button")
        .then(($btn) => {
          if ($btn.is(":disabled")) return;
          cy.wrap($btn).click();
          clickNextUntilDisabled();
        });
    }
    clickNextUntilDisabled();
    cy.get('button[aria-label="Add new affirmation button"]').click();
    cy.get('textarea[placeholder="Write your message"]')
      .should("be.visible")
      .click()
      .type("Hello world");
    cy.contains("button", /^Save$/).click();
    cy.contains("span", "Previous slide")
      .parent("button")
      .should("not.be.disabled")
      .click();
    cy.contains("Hello world").should("exist");
  });
});
