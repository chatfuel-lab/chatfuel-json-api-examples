const calculateLeftProducts = (products, questions, answers) =>
  products.filter(product =>
    answers.every((answer, index) => product[questions[index].category] === answer))

const calculateResponseByLeftProducts = (leftProducts, questions, answers, activeQuestionIndex) => {
  if (leftProducts.length === 0) {
    return {
      set_attributes: {
        questions_status: 'inactive'
      }
    };
  }

  if (leftProducts.length === 1) {
    const [chosenProduct] = leftProducts;
    return {
      set_attributes: {
        questions_status: 'inactive'
      },
      messages: [{ text: `Congrats your choice - ${chosenProduct.name}` }]
    };
  }

  if (questions.length <= activeQuestionIndex) {
    const chosen = leftProducts.map(product => product.name).join(', ');
    return {
      set_attributes: {
        questions_status: 'inactive'
      },
      messages: [{ text: `Congrats your choices - ${chosen}` }]
    };
  }

  const { category, text } = questions[activeQuestionIndex];

  const options = [...new Set(leftProducts.map(product => product[category]))];

  if (options.length === 1) {
    const [option] = options;
    return {
      set_attributes: {
        questions_answers: [...answers, option].join(','),
        active_question_index: activeQuestionIndex + 1
      }
    };
  }

  return {
    messages: [
      {
        text: text,
        quick_replies: options.map(option => ({
          title: option,
          set_attributes: {
            questions_answers: [...answers, option].join(','),
            active_question_index: activeQuestionIndex + 1
          }
        }))
      }
    ]
  };

}

/**
 * @param {Object[]} products - products list
 * @param {Object[]} questions - questions list
 * @param {string[]} answers - user answers
 * @param {number} activeQuestionIndex - current questions index
 * @return {Object} Chatfuel JSON API response
 */
const calculateProductGuideResponse = ({ products, questions, answers, activeQuestionIndex }) => {
  const leftProducts = calculateLeftProducts(products, questions, answers);
  return calculateResponseByLeftProducts(leftProducts, questions, answers, activeQuestionIndex);
}

module.exports = {
  calculateProductGuideResponse
}
