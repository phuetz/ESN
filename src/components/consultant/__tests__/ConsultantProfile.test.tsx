import { render, screen, fireEvent } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import ConsultantProfile from '../ConsultantProfile';

describe('ConsultantProfile', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders forms and allows saving', () => {
    fetchMock.mockResponseOnce(JSON.stringify({ id: '1' }));
    render(<ConsultantProfile />);
    expect(screen.getByPlaceholderText('Prénom')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Date de naissance'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('Titre'), { target: { value: 'Dev' } });
    fireEvent.change(screen.getAllByPlaceholderText('Niveau')[0], {
      target: { value: 'Senior' },
    });
    fireEvent.change(screen.getByPlaceholderText("Années d'expérience"), { target: { value: '5' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@doe.com' } });
    fireEvent.change(screen.getByPlaceholderText('Téléphone'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Adresse'), { target: { value: 'Paris' } });
    fireEvent.click(screen.getByText('Sauvegarder'));
  });
});
