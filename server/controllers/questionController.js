const pool = require('../db/db.js');
const helpers = require('../helpers');

module.exports = {

  getQuestions: (req, res) => {
    const { product_id } = req.params;
    helpers.getQuestions(product_id)
    .then((response) => {
      res.status(200).send(response)
    })
    .catch((err) => res.status(404).send(err))
  },
  getAnswers: (req, res) => {
    const { question_id } = req.params;
    helpers.getAnswers(question_id)
    .then((response) => {
      res.status(200).send(response)
    })
    .catch((err) => res.status(404).send(err))
  },
  addQuestion: (req, res) => {
    const payload = {
      ...req.body,
      product_id: req.params.product_id,
      question_date: new Date()
    }
    helpers.addQuestion(payload)
    .then((response) => {
      console.log(response, 'res')
      res.status(201).end()
    })
    .catch((err) => res.status(404).send(err))
  },
  addAnswer: (req, res) => {
    const payload = {
      ...req.body,
      product_id: req.params.question_id
    }
    helpers.addAnswer(payload)
    .then((response) => {
      res.status(201).end()
    })
    .catch((err) => res.status(404).send(err))
  },
  reportQuestion: (req, res) => {
    const payload = {
      reported: req.body.reported,
      id: req.params.question_id
    }
    helpers.reportQuestion(payload)
    .then((response) => {
      res.status(204).end()
    })
    .catch((err) => res.status(404).send(err))
  },
  markQuestionHelpful: (req, res) => {
    const payload = {
      helpful: req.body.helpful,
      id: req.params.question_id
    }
    helpers.markQuestionHelpful(payload)
    .then((response) => {
      res.status(204).end()
    })
    .catch((err) => res.status(404).send(err))
  }
}