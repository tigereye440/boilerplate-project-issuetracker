const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');


chai.use(chaiHttp);

suite('Functional Tests', function() {
    this.timeout(5000);
    suite('Routes testing', function() {
        suite('POST REQUESTS', function() {
            /#1/
            test('Create an issue with every field: POST request', function (done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post('/api/issues/apitest')
                    .send({
                        issue_title: 'test',
                        issue_text: 'text',
                        created_by: 'cb',
                        assigned_to: 'at',
                        status_text: 'st'
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.issue_title, 'test');
                        assert.equal(res.body.issue_text, 'text');
                        assert.equal(res.body.created_by, 'cb');
                        assert.equal(res.body.assigned_to, 'at')
                        assert.equal(res.body.status_text, 'st'); 
                        assert.equal(res.body.open, true);
                        done();
                    });
                    
            });

            /#2/
            test('Create an issue with only required fields: POST request', function(done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post('/api/issues/apitest')
                    .send({
                        issue_title: 'test',
                        issue_text: 'text',
                        created_by: 'cb',
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.issue_title, 'test');
                        assert.equal(res.body.issue_text, 'text');
                        assert.equal(res.body.created_by, 'cb');
                        assert.equal(res.body.assigned_to, '')
                        assert.equal(res.body.status_text, ''); 
                        assert.equal(res.body.open, true);
                        done();
                    });
            });

            /#3/
            test('Create an issue with missing required fields: POST request', function(done) {
                chai
                    .request(server)
                    .keepOpen()
                    .post('/api/issues/apitest')
                    .send({
                        issue_title: '',
                        issue_text: '',
                        created_by: 'cb',
                        assigned_to: 'at',
                        status_text: 'st'
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body, 'missing required field(s)');
                        done();
                    });
            });
                
        });

        suite('GET REQUESTS', function() {
            /#4/
            test('View issues on a project: GET request', function(done) {
                chai   
                    .request(server)
                    .keepOpen()
                    .get('/api/issues/apitest')
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.isArray(res.body, 'body should be an array');
                        assert.isObject(res.body[0], 'element[0] should be an object');
                        done();
                    });
            });
        
            /#5/
            test('View issues on a project with one filter: GET request', function(done) {
                chai   
                    .request(server)
                    .keepOpen()
                    .get('/api/issues/apitest')
                    
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.isArray(res.body);
                        done();
                    });
            });
        
            /#6/
            test('View issues on a project with multiple filters: GET request', function(done) {
                chai   
                    .request(server)
                    .keepOpen()
                    .get('/api/issues/apitest?created_by=cb')
                    
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.isArray(res.body);
                        done();
                    });
            });

        });

        suite('PUT REQUESTS', function() {

            /#7/
            test('Update one field on an issue: PUT request', function(done) {
                chai
                    .request(server)
                    .keepOpen()
                    .put('/api/issues/apitest')
                    .send({
                        _id: '668fd8cba4f99c5efe9e8bc1',
                        open: false 
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, 'updated successfully');
                        assert.equal(res.body._id, '668fd8cba4f99c5efe9e8bc1');
                        done();
                    });
            });

            /#8/
            test('Update multiple fields on an issue: PUT request', function(done) {
                chai
                    .request(server)
                    .keepOpen()
                    .put('/api/issues/apitest')
                    .send({
                        _id: '668fd8cba4f99c5efe9e8bc1',
                        issue_title: 'title',
                        open: false 
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, 'updated successfully');
                        assert.equal(res.body._id, '668fd8cba4f99c5efe9e8bc1');
                        done();
                    });
            });

            /#9/
            test('Update an issue with missing _id: PUT request', function(done) {
                chai
                    .request(server)
                    .keepOpen()
                    .put('/api/issues/apitest')
                    .send({
                        _id: '',
                        issue_title: 'title',
                        open: false 
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body, '_id field cannot be empty');
                        done();
                    });
            });

            /#10/
            test('Update an issue with no fields to update: PUT request', function(done) {
                chai
                    .request(server)
                    .keepOpen()
                    .put('/api/issues/apitest')
                    .send({
                        _id: '668fd8cba4f99c5efe9e8bc1',
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, 'updated successfully');
                        assert.equal(res.body._id, '668fd8cba4f99c5efe9e8bc1');
                        done();
                    });
            });

            /#11/
            test('Update an issue with an invalid _id: PUT request', function(done) {
                chai
                    .request(server)
                    .keepOpen()
                    .put('/api/issues/apitest')
                    .send({
                        _id: '668fd86125c8be2164c456d1',
                        issue_title: 'title',
                        open: false 
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, 'could not update');
                        assert.equal(res.body._id, '668fd86125c8be2164c456d1')
                        done();
                    });
            });
            
        });

        suite('DELETE REQUESTS', function() {

            /#12/
            test('Delete an issue: DELETE request', function(done) {
                chai   
                    .request(server)
                    .keepOpen()
                    .delete('/api/issues/apitest')
                    .send({
                        _id: '668fe3cd853ddd304605b85b'
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, 'successfully deleted');
                        assert.equal(res.body._id, '668fe3cd853ddd304605b85b');
                        done();
                    });
            });

            /#13/
            test('Delete an with an invalid id: DELETE request', function(done) {
                chai   
                    .request(server)
                    .keepOpen()
                    .delete('/api/issues/apitest')
                    .send({
                        _id: '668fd86125c67e1764c456d1'
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, 'could not delete');
                        assert.equal(res.body._id, '668fd86125c67e1764c456d1');
                        done();
                    });
            });

            /#14/
            test('Delete an with missing id: DELETE request', function(done) {
                chai   
                    .request(server)
                    .keepOpen()
                    .delete('/api/issues/apitest')
                    .send({
                        _id: ''
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body, '_id field cannot be empty');
                        done();
                    });
            });
        });
    });  
});
