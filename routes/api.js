'use strict';
const transactions = require('../models/issueModel');
const db = require('../models/issueModel')

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      try {
        let project = req.params.project;
        const queries = req.query;
        queries.project = project;
        const foundIssues = await transactions.findIssues(queries);
        const result = foundIssues.map((issue) => {
          return {
            _id: issue._id,
            issue_title: issue.issue_title,
            issue_text: issue.issue_text,
            created_on: issue.created_on,
            updated_on: issue.updated_on,
            created_by: issue.created_by,
            assigned_to: issue.assigned_to,
            open: issue.open,
            status_text: issue.status_text
          }
        });
        
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json('Internal Server Error');
      }

    })
    
    .post(async function (req, res){
      try {
        let project = req.params.project;
        const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
        if (issue_text === '' || issue_title === '' || created_by === '') {
          return res.json('missing required field(s)');
        }
        
        const savedIssue = await db.createNewIssue(project, issue_title, issue_text, created_by, assigned_to, status_text);

        if (savedIssue === null) {
          return res.status(500).json('Internal Server Error');
        }

        res.json({
          assigned_to: savedIssue.assigned_to,
          status_text: savedIssue.status_text,
          open: savedIssue.open,
          _id: savedIssue._id,
          issue_title: savedIssue.issue_title,
          issue_text: savedIssue.issue_text,
          created_by: savedIssue.created_by,
          created_on: savedIssue.created_on,
          updated_on: savedIssue.updated_on                      
        });
      } catch (err) {
        console.log(err);
        res.status(401).json('Invalid field value');
      }
      
    })
    
    .put(async function (req, res){
      try {
        let project = req.params.project;
        let updateValues = req.body;
        const _id = req.body._id

        if (_id === '') {
          return res.json('_id field cannot be empty');
        }

        for (const key in updateValues) {
          if (updateValues[key] === '') {
            delete updateValues[key];
          }
        }

        updateValues.project = project;
        const updatedIssue = await transactions.updateIssue(updateValues);
        res.json({ result: updatedIssue, _id: _id });

      } catch (err) {
        console.log(err)
        res.status(403).json({ result: 'could not update', _id: _id });
      }
      
    })
    
    .delete( async function (req, res){
      try {
        // let project = req.params.project;
        const _id = req.body._id;

        if (_id === '') {
          return res.json('_id field cannot be empty');
        }

        const deletedIssue = await transactions.deleteIssue(_id);
        res.json({ result: deletedIssue, _id: _id });

      } catch (err) {
        console.error(err);
        return res.json({ result: 'could not delete', _id: _id });
      }
      
    });
    
};
