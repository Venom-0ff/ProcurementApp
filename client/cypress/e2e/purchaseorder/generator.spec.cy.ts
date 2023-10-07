describe('generate product purchase order test', () => {
    it('visits the generator page and selects an employee and products', () => {
        cy.visit('/');
        cy.get('button').click();
        cy.contains('a', 'generator').click();
        cy.wait(500); // http call
        cy.get('mat-select[formcontrolname="vendorid"]').click();
        cy.contains('ABC').click();
        cy.wait(500); // http call
        cy.get('mat-select[formcontrolname="productid"]').click({ force: true });
        cy.contains('Product B').click({ force: true });
        cy.wait(500); // http call
        cy.get('mat-select[formcontrolname="selectqty"]').click({ force: true });
        cy.contains('200').click({ force: true });
        cy.get('button').contains('Save PO').click();
        cy.contains('added!');
    });
});