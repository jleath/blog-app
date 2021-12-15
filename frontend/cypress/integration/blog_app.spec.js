describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    cy.visit('http://localhost:3000');
  });

  it('front page can be opened', function() {
    cy.contains('blogs');
  });

  it('login button is displayed by default', function() {
    cy.contains('log in');
  });

  describe('login', function() {
    beforeEach(function() {
      const user = {
        username: 'root',
        name: 'root user',
        password: 'itsasecret',
      };
      cy.createUser(user);
      cy.visit('http://localhost:3000');
      cy.contains('log in').click();
    });

    it('user can log in', function() {
      cy.get('#username-input').type('root');
      cy.get('#password-input').type('itsasecret');
      cy.get('#login-button').click();
      cy.contains('root logged in');
      cy.get('.success').should('have.css', 'color', 'rgb(0, 128, 0)');
    });

    it('logging in with invalid password fails', function() {
      cy.get('#username-input').type('root');
      cy.get('#password-input').type('notmysecret');
      cy.get('#login-button').click();
      cy.contains('Error logging in');
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)');
    });

    describe('when logged in', function() {
      beforeEach(function() {
        cy.login({ username: 'root', password: 'itsasecret' });
      });
      it('a new blog can be created', function() {
        cy.contains('add blog').click();
        cy.get('#titleInput').type('first blog');
        cy.get('#authorInput').type('first author');
        cy.get('#urlInput').type('first url');
        cy.get('#blog-create-button').click();
        cy.get('#blog-list').contains('first blog');
        cy.get('.success').contains('first blog');
      });

      describe('when multiple blogs have been added', function() {
        beforeEach(function() {
          cy.addBlog({ title: 'first blog', author: 'first author', url: 'first url' });
          cy.addBlog({ title: 'second blog', author: 'second author', url: 'second url' });
          cy.addBlog({ title: 'third blog', author: 'third author', url: 'third url' });
          cy.visit('http://localhost:3000');
          cy.get('#blog-list').contains('second blog').parent().as('secondBlog');
        });
        it('blog details are hidden by default', function() {
          cy.get('@secondBlog').get('.blogDetails').should('not.be.visible');
        });
        it('blog details can be displayed', function() {
          cy.get('@secondBlog').contains('show').click();
          cy.get('@secondBlog').get('.blogDetails').should('be.visible');
        });

        describe('when a blogs details are displayed', function() {
          beforeEach(function() {
            cy.get('@secondBlog').contains('show').click();
          });
          it('a blog can be liked', function() {
            cy.get('@secondBlog').find('.like-button').click();
            cy.contains('Likes: 1');
          });
          it('a blog can be deleted', function() {
            cy.get('@secondBlog').find('.delete-button').click();
            cy.get('#blog-list').contains('second blog').should('not.exist');
          });
        });

        it('user can log out', function() {
          cy.contains('log out').click();
          cy.contains('log in');
        });

        describe('when a new user is logged in', function() {
          beforeEach(function() {
            const secondUser = {
              username: 'notroot',
              name: 'not root user',
              password: 'stillasecret',
            };
            cy.createUser(secondUser);
            cy.contains('log out').click();
            cy.login({ username: 'notroot', password: 'stillasecret' });
            cy.visit('http://localhost:3000');
          });

          it('they cannot delete blogs entered by the previous user', function() {
            cy.get('@secondBlog').contains('show').click();
            cy.get('@secondBlog').find('.delete-button').click();
            cy.get('.error');
            cy.get('#blog-list').contains('second blog');
          });

        });
      });
    });
  });
});