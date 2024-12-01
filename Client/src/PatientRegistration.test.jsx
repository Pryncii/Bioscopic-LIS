import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import PatientRegistration from './PatientRegistration';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the fetch function to simulate API calls
global.fetch = vi.fn();

// Wrapper component for testing React Router
const Wrapper = ({ children }) => {
  return <Router>{children}</Router>;
};

describe('PatientRegistration Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders the form correctly', () => {
    render(<PatientRegistration />, { wrapper: Wrapper });

    // Check if the fields are present
    expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sex/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Birthdate/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Home Address/)).toBeInTheDocument();
    expect(screen.getByLabelText(/PWD ID/)).toBeInTheDocument();
  });

  test('displays an error message if age and birthday do not match', () => {
    render(<PatientRegistration />, { wrapper: Wrapper });

    fireEvent.change(screen.getByLabelText(/Birthdate/), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Age/), { target: { value: '25' } });

    fireEvent.submit(screen.getByRole('button', { name: /Submit Data/ }));

    // Error message should be shown
    expect(screen.getByText(/Age and Birthday does not match!/)).toBeInTheDocument();
  });

  test('submits form data correctly when validation passes', async () => {
    render(<PatientRegistration />, { wrapper: Wrapper });

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/First Name/), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Middle Name/), { target: { value: 'M' } });
    fireEvent.change(screen.getByLabelText(/Last Name/), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Sex/), { target: { value: 'M' } });
    fireEvent.change(screen.getByLabelText(/Birthdate/), { target: { value: '1995-05-05' } });
    fireEvent.change(screen.getByLabelText(/Age/), { target: { value: '29' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/), { target: { value: '09123456789' } });
    fireEvent.change(screen.getByLabelText(/Email Address/), { target: { value: 'john.doe@example.com' } });

    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ message: 'Patient added successfully' }),
    });

    fireEvent.submit(screen.getByRole('button', { name: /Submit Data/ }));

    // Check if the API was called
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Check if the success message or navigation happened
    expect(screen.queryByText(/Patient Added/)).not.toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/addpatient',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.any(String),
      })
    );
  });

  test('shows alert message if there is an error adding patient', async () => {
    render(<PatientRegistration />, { wrapper: Wrapper });

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/First Name/), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/Last Name/), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Sex/), { target: { value: 'F' } });
    fireEvent.change(screen.getByLabelText(/Birthdate/), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/Age/), { target: { value: '34' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/), { target: { value: '09123456789' } });

    // Mock failed API response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: 'Error adding patient' }),
    });

    fireEvent.submit(screen.getByRole('button', { name: /Submit Data/ }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(window.alert).toHaveBeenCalledWith('Error processing request');
    });
  });
});
