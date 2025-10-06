import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';

// Simple smoke test to ensure the App component renders
it('App renders without crashing', () => {
  renderer.create(<App />);
});
