describe('vendor update test', () => {
    it('visits the vendor page and updates an vendor', () => {
        cy.visit('/');
        cy.get('button').click();
        cy.contains('a', 'vendors').click();
        cy.contains('SK Depot').click();
        cy.get("[type='email']").clear();
        cy.get("[type='email']").type('s_kostyukov@fanshaweonline.ca');
        cy.get('form').submit();
        cy.contains('updated!');
    });
});
