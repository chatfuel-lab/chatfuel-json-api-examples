const calculateLeftProducts = (products, questions, answers) =>
  products.filter(product => answers.every((answer, index) => product[questions[index].category] === answer));

const calculateResponseByLeftProducts = ({
  leftProducts,
  questions,
  answers,
  activeQuestionIndex,
  questionsStatus,
  recommendedProductIndex,
  mapProductToAttributes
}) => {
  if (leftProducts.length === 0) {
    return {
      set_attributes: {
        questions_status: 'inactive',
        recommended_products_count: 0
      }
    };
  }

  if (leftProducts.length === 1) {
    const [chosenProduct] = leftProducts;
    return {
      set_attributes: {
        ...mapProductToAttributes(chosenProduct),
        questions_status: 'inactive',
        recommended_products_count: 1
      }
    };
  }

  if (questions.length <= activeQuestionIndex || questionsStatus === 'inactive') {
    const indexIsValid = recommendedProductIndex && recommendedProductIndex < leftProducts.length;
    const index = indexIsValid ? recommendedProductIndex : 0;
    const chosenProduct = leftProducts[index];
    return {
      set_attributes: {
        ...mapProductToAttributes(chosenProduct),
        questions_status: 'inactive',
        recommended_products_count: leftProducts.length
      }
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
};

const createMapFunction = productPropToAttribute => product => {
  const result = {};

  Object.keys(productPropToAttribute).forEach(productProp => {
    result[productPropToAttribute[productProp]] = product[productProp];
  });

  return result;
};

/**
 * @param {Object[]} products - products list
 * @param {Object[]} questions - questions list
 * @param {string[]} answers - user answers
 * @param {number} activeQuestionIndex - current questions index
 * @param {'active' | 'inactive'} questionsStatus - question status
 * @param {number} recommendedProductIndex - index of recommended product
 * @param {Object} productPropToAttribute - product property to bot attribute
 * @return {Object} Chatfuel JSON API response
 */
const calculateProductGuideResponse = ({
  products,
  questions,
  answers,
  activeQuestionIndex,
  questionsStatus = 'active',
  recommendedProductIndex = 0,
  productPropToAttribute = { name: 'recommended_product_name' }
}) => {
  const leftProducts = calculateLeftProducts(products, questions, answers);
  const mapProductToAttributes = createMapFunction(productPropToAttribute);
  return calculateResponseByLeftProducts({
    leftProducts,
    questions,
    answers,
    activeQuestionIndex,
    questionsStatus,
    recommendedProductIndex,
    mapProductToAttributes
  });
};

module.exports = {
  calculateProductGuideResponse
};
