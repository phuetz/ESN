import { renderHook, act } from '@testing-library/react';
import { useConsultantForm } from '../hooks/useConsultantForm';

describe('useConsultantForm', () => {
  it('updates personal info', () => {
    const { result } = renderHook(() => useConsultantForm());
    act(() => {
      result.current.updatePersonalInfo({ firstName: 'Jane' });
    });
    expect(result.current.consultant.firstName).toBe('Jane');
  });
});
