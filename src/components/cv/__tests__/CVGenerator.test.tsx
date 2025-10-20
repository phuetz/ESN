import { render, screen, fireEvent } from '@testing-library/react';
import CVGenerator from '../CVGenerator';

describe('CVGenerator', () => {
  it('updates preview when personal info changes', () => {
    render(<CVGenerator />);
    const input = screen.getByPlaceholderText('Prénom');
    fireEvent.change(input, { target: { value: 'Jean' } });
    fireEvent.blur(input);
    expect(screen.getByTestId('cv-preview')).toHaveTextContent('Jean');
  });

  it('renders template buttons', () => {
    render(<CVGenerator />);
    expect(screen.getByText('Simple')).toBeInTheDocument();
    expect(screen.getByText('Modern')).toBeInTheDocument();
  });
});
