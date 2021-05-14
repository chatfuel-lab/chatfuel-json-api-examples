const fetch = require('node-fetch');
const { calculateProductGuideResponse } = require('./utils/product-guide-utils');

exports.handler = async event => {
  const payload = JSON.parse(event.body);
  const { questions_answers, active_question_index } = payload;
  const { products_table_ref, questions_table_ref } = payload;
  const { questions_status, recommended_product_index, product_prop_to_attr } = payload;

  const userHasAnswers = questions_answers && questions_answers !== '_';
  const products = await fetch(products_table_ref).then(res => res.json());
  const questions = await fetch(questions_table_ref).then(res => res.json());

  const response = calculateProductGuideResponse({
    products,
    questions,
    answers: userHasAnswers ? questions_answers.split(',') : [],
    activeQuestionIndex: parseInt(active_question_index),
    questionsStatus: questions_status,
    recommendedProductIndex: recommended_product_index,
    productPropToAttribute: product_prop_to_attr
  });

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};
