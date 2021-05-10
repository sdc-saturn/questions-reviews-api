const pool = require('../db/db.js');
const helpers = require('../helpers');

module.exports = {
  markAnswerHelpful: (req, res) => {
    const payload = {
      helpful: req.body.helpful,
      id: req.params.answer_id
    }
    helpers.markAnswerHelpful(payload)
    .then((response) => {
      res.status(204).end()
    })
    .catch((err) => res.status(404).send(err))
  },
  reportAnswer:  (req, res) => {
    const payload = {
      reported: req.body.reported,
      id: req.params.answer_id
    }
    helpers.reportAnswer(payload)
    .then((response) => {
      res.status(204).end()
    })
    .catch((err) => res.status(404).send(err))
  }
}