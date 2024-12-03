import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import PatientRegistration from './PatientRegistration';

// Mock fetch API
global.fetch = vi.fn();

describe('PatientRegistration Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders the form correctly', () => {
    render(
      <BrowserRouter>
        <PatientRegistration />
      </BrowserRouter>
    );

    // Check if form fields are rendered
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Middle Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Sex')).toBeInTheDocument();
    expect(screen.getByLabelText('Age *')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number *')).toBeInTheDocument();
  });

  it('validates age and birthday correctly', async () => {
    render(
      <BrowserRouter>
        <PatientRegistration />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Middle Name'), { target: { value: 'A' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Sex'), { target: { value: 'M' } });
    fireEvent.change(screen.getByLabelText('Phone Number *'), { target: { value: '09123456789' } });
    fireEvent.change(screen.getByLabelText('Email Address *'), { target: { value: 'john.doe@example.com' } });
    // Fill out birthday and mismatched age
    const birthdayInput = screen.getByLabelText('Birthdate');
    const ageInput = screen.getByLabelText('Age *');
    fireEvent.change(birthdayInput, { target: { value: '2000-01-01' } });
    fireEvent.change(ageInput, { target: { value: '10' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit data/i }));

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Age and Birthday does not match!/i)).toBeInTheDocument();
    });
  });

  it('submits valid data and navigates on success', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(
      <BrowserRouter>
        <PatientRegistration />
      </BrowserRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Middle Name'), { target: { value: 'A' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Sex'), { target: { value: 'M' } });
    fireEvent.change(screen.getByLabelText('Birthdate'), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText('Age *'), { target: { value: '23' } });
    fireEvent.change(screen.getByLabelText('Phone Number *'), { target: { value: '09123456789' } });
    fireEvent.change(screen.getByLabelText('Email Address *'), { target: { value: 'john.doe@example.com' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit data/i }));

    // Wait for fetch to resolve and check for navigation
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/addpatient', expect.any(Object));
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  
});
