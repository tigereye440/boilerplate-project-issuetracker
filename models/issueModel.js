require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('Connected to database'))
        .catch(err => console.error(err));

const issueSchema = new mongoose.Schema({
    project: {type: String, required: true},
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_on: { type: Date, default: Date.now() },
    updated_on: { type: Date, default: Date.now() },
    created_by: { type: String, required: true },
    assigned_to: { type: String, default: '' },
    open: { type: Boolean, default: true },
    status_text: { type: String, default: '' }
});

const issues = mongoose.model('issue', issueSchema);

let transactions = {};

transactions.findIssues = async (query) => {
    const foundIssues = await issues.find(query);
    return foundIssues;
};

transactions.updateIssue = async (query) => {
    const _id = query._id;
    try {
        const issueExist = await issues.findById(_id);
        if (issueExist === null) {
            return { error: 'could not update', _id:_id }
        } 

        query.updated_on = Date.now();
        
        const updatedIssue = await issues.findByIdAndUpdate(_id, query);

        if (updatedIssue === null) {
            return { error: 'could not update', _id: _id }
        }

        return { result: 'successfully updated', _id: _id };

    } catch (err) {
        console.log(err);
        return { error: 'could not update', _id: _id };
    }
    
}

transactions.createNewIssue = async  (
    project,
    issue_title, 
    issue_text, 
    created_by, 
    assigned_to, 
    status_text
) => {
    try {
        const newIssue = new issues({
            project: project,
            issue_title: issue_title,
            issue_text: issue_text,
            created_by: created_by,
            assigned_to: assigned_to,
            status_text: status_text
        });
        const savedIssue = await newIssue.save();
        return savedIssue;
    } catch (err) {
        console.error('Error creating issue: ', err);
        return null;
    }
};

transactions.deleteIssue = async (_id) =>  {
    try {
        const issueExists = await issues.findById(_id);

        if (issueExists === null) {
            return { error: 'could not delete', _id: _id }
        }


        const deletedIssue = await issues.findByIdAndDelete(_id);
        if (deletedIssue === null) {
            return { error: 'could not delete issue', _id: _id }
        }

        return { result: 'successfully deleted', _id: _id }
    } catch (err) {
        console.log(err);
        return { error: 'could not delete', _id: _id }
    }
}


module.exports = transactions;

