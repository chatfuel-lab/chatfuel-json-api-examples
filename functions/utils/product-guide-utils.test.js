const { calculateProductGuideResponse } = require('./product-guide-utils');

const products = [
  { name: 'Macbook Air', device: 'laptop', size: 'small' },
  { name: 'Macbook Pro 13', device: 'laptop', size: 'medium' },
  { name: 'Macbook Pro 16', device: 'laptop', size: 'large' },
  { name: 'Mac Pro', device: 'desktop', size: 'large' }
];

const questions = [
  { category: 'device', text: 'What device do you want?' },
  { category: 'size', text: 'What size do you want?' }
];

describe('Product guide utils tests', function () {
  it('should return inactive state with all products as a result', function () {
    const response = calculateProductGuideResponse({
      products,
      questions,
      answers: [],
      activeQuestionIndex: 2
    });

    expect(response).toEqual({
      set_attributes: {
        questions_status: 'inactive',
        recommended_product_name: 'Macbook Air',
        recommended_products_count: 4
      }
    });
  });

  it('should return inactive state with single Mac Pro as a result', function () {
    const response = calculateProductGuideResponse({
      products,
      questions,
      answers: ['desktop'],
      activeQuestionIndex: 1
    });

    expect(response).toEqual({
      set_attributes: {
        questions_status: 'inactive',
        recommended_product_name: 'Mac Pro',
        recommended_products_count: 1
      }
    });
  });
});
