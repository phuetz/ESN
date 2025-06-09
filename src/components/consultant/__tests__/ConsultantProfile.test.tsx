import { render, screen, fireEvent } from '@testing-library/react';
import ConsultantProfile from '../ConsultantProfile';

describe('ConsultantProfile', () => {
  it('renders forms and allows saving', () => {
    render(<ConsultantProfile />);
    expect(screen.getByPlaceholderText('Prénom')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Date de naissance'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('Titre'), { target: { value: 'Dev' } });
    fireEvent.change(screen.getByPlaceholderText('Niveau'), { target: { value: 'Senior' } });
    fireEvent.change(screen.getByPlaceholderText("Années d'expérience"), { target: { value: '5' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@doe.com' } });
    fireEvent.change(screen.getByPlaceholderText('Téléphone'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Adresse'), { target: { value: 'Paris' } });
    fireEvent.click(screen.getByText('Sauvegarder'));
    expect(screen.getByText('john@doe.com')).toBeInTheDocument();
  });
});
