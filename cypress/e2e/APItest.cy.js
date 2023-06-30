import posts from '../fixtures/posts.json'
import { faker } from '@faker-js/faker';

describe('Get All Posts', () => {
    it('return all posts and verify response status code', () => {
        cy.request('GET', '/posts')
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.headers['content-type']).to.include('application/json');
                expect(response.body).to.have.length.greaterThan(0);
            });
    });
});

it('return only the first 10 posts ', () => {
    cy.request('GET', '/posts')
        .then((response) => {
            expect(response.status).to.eq(200);

            const firstPosts = response.body.slice(0, 10);
            firstPosts.forEach((post) => {
                expect(post).to.have.property('id');
            });
            const hasPostWithId10 = response.body.some(post => post.id === 10);
            expect(hasPostWithId10).to.be.true;
        });
});

it('return posts with ID 55 and ID 60 and verify response status code', () => {
    const expectedIds = [55, 60];

    cy.request('GET', '/posts')
      .then((response) => {
        expect(response.status).to.eq(200);

        const returnedPosts = response.body;
        const returnedIds = returnedPosts.map((post) => post.id);

        expect(returnedIds).to.include.members(expectedIds);
      });
  });

it('should create a post and verify response status code', () => {
    const newPost = {
        text: 'blabla'
    };

    cy.request({
        method: 'POST',
        url: '/664/posts',
        body: newPost,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
  });

  it('create a post entity and verify response status code', () => {
    const newPost = {
      userId: faker.number.int(),
      id: faker.number.int(),
      title: faker.lorem.text(),
      body: faker.lorem.sentence()
    };

    cy.request('POST', '/posts', newPost)
      .then((response) => {
        expect(response.status).to.eq(201);

        expect(response.body.userId).to.eq(newPost.userId);
        expect(response.body.id).to.eq(newPost.id);
        expect(response.body.title).to.eq(newPost.title);
        expect(response.body.body).to.eq(newPost.body);
      });
  });

  it('status 401 when updating a non-existing entity', () => {
    const updatedData = {
        userId: faker.number.int(),
        id: faker.number.int(),
        title: faker.lorem.text(),
        body: faker.lorem.sentence()
    };

    cy.request({
      method: 'PUT',
      url: `/posts`,
      body: updatedData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  describe('Create and Update a Post Entity', () => {
    let createdPost;
  
    it(' create a post entity', () => {
      const newPost = {
        title: 'some text234',
        body: 'This is a new post content.',
        userId: 1
      };
  
      cy.request('POST', '/posts', newPost)
        .then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('id');
          createdPost = response.body.id; 
        });
    });
  
    it('update the created post entity', () => {
      const updatedPostData = {
        title: 'some text',
        body: 'This is the updated post content.'
      };
  
      cy.request('PUT', `/posts/${createdPost}`, updatedPostData)
        .then((response) => {
          expect(response.status).to.eq(200);
  
          expect(response.body.title).to.eq(updatedPostData.title);
          expect(response.body.body).to.eq(updatedPostData.body);
        });
    });
  });
  
  it('status 404 when deleting a non-existing post entity', () => {
    cy.request({
      method: 'DELETE',
      url: `/posts`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  describe('Create, Update, and Delete Post Entity', () => {
    let createdPost;
  
    it('create a post entity', () => {
      const newPost = {
        title: 'New test',
        body: 'This is a new test',
        userId: 1
      };
  
      cy.request('POST', '/posts', newPost)
        .then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('id');
          createdPost = response.body.id;
        });
    });
  
    it('update the created post entity', () => {
      const updatedPostData = {
        title: 'Updated Post',
        body: 'This is the updated post'
      };
  
      cy.request('PUT', `/posts/${createdPost}`, updatedPostData)
        .then((response) => {
          expect(response.status).to.eq(200);
  
          expect(response.body.title).to.eq(updatedPostData.title);
          expect(response.body.body).to.eq(updatedPostData.body);
        });
    });
  
    it('delete the created post entity', () => {
      cy.request('DELETE', `/posts/${createdPost}`)
        .then((response) => {
          expect(response.status).to.eq(200);
        });
    });
  });
  