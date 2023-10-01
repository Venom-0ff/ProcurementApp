describe('product add test', () => {
    it('visits the product page and adds a product', () => {
        cy.visit('/');
        cy.get('button').click();
        cy.contains('a', 'products').click();
        cy.contains('control_point').click();
        cy.get('input[formcontrolname=id]').type('12Q-W3E45');
        cy.get('mat-select[formcontrolname=vendorid]').click({ force: true });
        cy.get('mat-option').contains('SK Depot').click({ force: true });
        cy.get('input[formcontrolname=name]').type('TEST PRODUCT');
        cy.get('input[formcontrolname=msrp]').clear();
        cy.get('input[formcontrolname=msrp]').type('99.99');
        cy.get('input[formcontrolname=costprice]').clear();
        cy.get('input[formcontrolname=costprice]').type('9.99');
        cy.get('.mat-expansion-indicator').eq(0).click();
        cy.get('.mat-expansion-indicator').eq(1).click();
        cy.get('input[formcontrolname=rop]').clear();
        cy.get('input[formcontrolname=rop]').type('10');
        cy.get('input[formcontrolname=eoq]').clear();
        cy.get('input[formcontrolname=eoq]').type('10');
        cy.get('input[formcontrolname=qoh]').clear();
        cy.get('input[formcontrolname=qoh]').type('10');
        cy.get('input[formcontrolname=qoo]').clear();
        cy.get('input[formcontrolname=qoo]').type('10');
        cy.get('button').contains('Save').click();
        cy.contains('added!');
    });
});