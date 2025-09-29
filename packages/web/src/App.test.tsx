import { render } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn((_auth, callback) => {
    // Simulate user being authenticated
    callback({ uid: '123', email: 'test@example.com' });
    // Return a mock unsubscribe function
    return vi.fn();
  }),
}));

// Mock Firebase Config
vi.mock('./firebase/firebaseConfig', () => ({
  auth: {}, // Mock auth object
}));

test('renders without crashing', () => {
  const { baseElement } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  expect(baseElement).toBeDefined();
});