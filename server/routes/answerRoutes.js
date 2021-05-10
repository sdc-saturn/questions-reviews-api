const router = require('express').Router();
const answerController = require('../controllers/answerController');

router.put('/answers/:answer_id/helpful', answerController.markAnswerHelpful);
router.put('/answers/:answer_id/report', answerController.reportAnswer);

module.exports = router