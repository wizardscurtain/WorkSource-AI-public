import { render, screen, fireEvent } from '@testing-library/react';
import LandingPage from './LandingPage';

function loginFlow(username, password) {
  const userInput = screen.getByPlaceholderText(/enter username/i);
  const passInput = screen.getByPlaceholderText(/enter password/i);
  fireEvent.change(userInput, { target: { value: username } });
  fireEvent.change(passInput, { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
}

describe('LandingPage auth gate', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('rejects invalid credentials', () => {
    render(<LandingPage />);
    loginFlow('bad', 'creds');
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    expect(localStorage.getItem('kabam_vg_auth')).toBeNull();
  });

  test('accepts correct kabam/kabam credentials', () => {
    render(<LandingPage />);
    loginFlow('kabam', 'kabam');
    expect(localStorage.getItem('kabam_vg_auth')).toBe('1');
    // After auth the logout button should appear
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });
});
