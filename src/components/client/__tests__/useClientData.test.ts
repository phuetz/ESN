import { renderHook, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import { useClientData } from '../hooks/useClientData';

describe('useClientData', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('fetches clients on mount', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([{ id: '1', name: 'Test', status: 'actif' }]));
    const { result } = renderHook(() => useClientData());
    await waitFor(() => expect(result.current.clients).toHaveLength(1));
  });
});
