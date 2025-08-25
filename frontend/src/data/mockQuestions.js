// src/mockQuestions.js

export const mockQuestions = [
  {
    id: 1,
    difficulty: 'EASY',
    text: 'Which programming language is most commonly associated with developing high-performance applications and is often used in GPU programming?',
    options: ['Java', 'Python', 'C++', 'JavaScript'],
    answer: 'C++',
  },
  {
    id: 2,
    difficulty: 'EASY',
    text: 'What does HTML stand for?',
    options: [
      'Hyper Text Markup Language',
      'High Tech Modern Language',
      'Hyperlink and Text Markup Language',
      'Home Tool Markup Language',
    ],
    answer: 'Hyper Text Markup Language',
  },
  {
    id: 3,
    difficulty: 'MEDIUM',
    text: 'In React, what is the purpose of a "key" prop when rendering a list of elements?',
    options: [
      'It is a unique identifier for CSS styling.',
      'It helps React identify which items have changed, are added, or are removed.',
      'It is used to store data in the browser\'s local storage.',
      'It sets the encryption key for the component data.',
    ],
    answer: 'It helps React identify which items have changed, are added, or are removed.',
  },
    {
    id: 4,
    difficulty: 'HARD',
    text: 'What is the time complexity of a binary search algorithm?',
    options: [
      'O(n)',
      'O(log n)',
      'O(n^2)',
      'O(1)',
    ],
    answer: 'O(log n)',
  },
];