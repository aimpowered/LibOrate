describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000');
    cy.contains('sign up').click();
    cy.contains('Email').click().type('foobar@example.com');
    cy.contains('Password').click().type('secret');
    cy.contains('Sign Up').click();
  })
})
