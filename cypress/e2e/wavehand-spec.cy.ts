describe("WaveHandPicker in spec", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should allow selecting, adding, and deleting wave hand buttons", () => {
    // select the first button

    cy.contains("👋").first().as("button");
    cy.get("@button").should("not.have.class", "selected");
    cy.get("@button").click();
    cy.get("@button").should("have.class", "selected");

    // add a new button
    cy.contains("➕ Add").click();
    cy.get("input[placeholder='Enter text']")
      .should("exist")
      .and("be.focused")
      .type("Hello, LibOrate{enter}");

    cy.contains("Hello, LibOrate").should("exist");
    cy.reload();
    cy.contains("Hello, LibOrate").should("exist");

    // delete the first button
    cy.contains("👋")
      .should("have.length.greaterThan", 0)
      .then((buttonsBefore) => {
        const initialCount = buttonsBefore.length;
        console.log(`initial count: ${initialCount}`);
        cy.wrap(buttonsBefore).each(($button) => {
          console.log(`Button text: ${$button.text()}`);
        });
        cy.contains("👋").first().as("button");
        cy.get("@button").contains("✖").click({ force: true });
        cy.reload();
        cy.contains("👋").should("have.length", initialCount - 1);
      });
  });
});
