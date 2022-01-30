import { render, screen } from '@testing-library/react';
import App from './App';

describe("World of Wordle Page", () => {
  test('renders World of Wordle title', () => {
    render(<App />);
    const titleElement = screen.getByText(/world of wordle/i);
    expect(titleElement).toBeInTheDocument();
  });
  test('renders clear button', () => {
    render(<App />);
    const clearButton = screen.getByRole('button', { name: 'Clear' });
    expect(clearButton).toBeInTheDocument();
  });
  test('renders 5 input boxes', () => {
    render(<App />);
    const inputBoxes = screen.getByRole('input');
    expect(inputBoxes).toBeInTheDocument();
  });
})

