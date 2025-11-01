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
    cy.get('textarea[placeholder="Introduce yourself..."]').type(fullMessage);
    // and save it - click the first Save button
    cy.contains("button", "Save").first().click();

    // Go back to homepage
    cy.reload();
    // Check that saved info is still there
    cy.contains("Something About Me").next().should("have.value", disclosure);
    cy.contains("Pronouns").next().should("have.value", pronoun);
    cy.contains("Preferred Name").next().should("have.value", displayName);
    cy.get('textarea[placeholder="Introduce yourself..."]').should(
      "have.value",
      fullMessage,
    );
  });

  it("should show toast notification when Send to Meeting is clicked", () => {
    // Enter full message
    const fullMessage = "Hello everyone! This is my disclosure message.";
    cy.get('textarea[placeholder="Introduce yourself..."]').type(fullMessage);

    // Click Send to Meeting button
    cy.contains("button", "Send to Meeting").click();

    // Check that toast notification appears
    cy.contains("Disclosure message is sent to the meeting Chat").should(
      "be.visible",
    );

    // Check that toast disappears after auto-hide duration (1.5 seconds)
    cy.contains("Disclosure message is sent to the meeting Chat", {
      timeout: 2000,
    }).should("not.exist");
  });
});
