const { calculateProductGuideResponse } = require('../utils/product-guide-utils');
const products = require('./products.json');
const questions = require('./questions.json');

exports.handler = async (event) => {
  const payload = JSON.parse(event.body);
  const { questions_answers, active_question_index } = payload;

  const userHasAnswers = questions_answers && questions_answers !== '_';

  const response = calculateProductGuideResponse({
    products,
    questions,
    answers: userHasAnswers ? questions_answers.split(',') : [],
    activeQuestionIndex: parseInt(active_question_index)
  });

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
