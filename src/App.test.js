// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './components/App';

// /* it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// }); */

// it('has a test', () => {
//   '';
// });



function sum(a, b) {
  return a + b;
}

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
