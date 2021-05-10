const router = require('express').Router();
const questionController = require('../controllers/questionController');

router.get('/questions/:product_id', questionController.getQuestions);
router.get('/questions/:question_id/answers', questionController.getAnswers);
router.post('/questions/:product_id', questionController.addQuestion);
router.post('/questions/:question_id/answers', questionController.addAnswer);
router.put('/questions/:question_id/helpful', questionController.markQuestionHelpful);
router.put('/questions/:question_id/report', questionController.reportQuestion);

module.exports = router;