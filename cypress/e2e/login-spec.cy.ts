describe('template spec', () => {
  it('passes', () => {
    const email = 'foobar@example.com';
    const password = 'secret';
    cy.visit('http://localhost:3000');
    cy.contains('sign up').click();
    cy.contains('Create an account');
    cy.contains('Email').click().type(email);
    cy.contains('Password').click().type(password);
    cy.contains('Sign Up').click();

    cy.wait(5000); // TODO: make this faster and remove this line
    cy.contains('User created successfully');
    cy.contains('sign in').click();
    cy.contains('Email').click().type(email);
    cy.contains('Password').click().type(password);
    cy.contains('Sign In').click();

    // Sign in successful (reach name tag page)
    cy.contains('Preferred Name');
  })
})
