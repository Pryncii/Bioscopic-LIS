import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import ModalEditStatus from './ModalEditStatus';
import React from 'react';

describe('ModalEditStatus Component', () => {
  const mockHandleClose = vi.fn();
  const mockOnStatusUpdate = vi.fn();
  const patientMock = {
    name: 'John Doe',
    patientID: 123,
    requestID: 456,
    paymentStatus: 'Paid',
    remarks: 'No issues',
  };

  it('renders the modal with patient details', () => {
    render(
      <ModalEditStatus
        patient={patientMock}
        show={true}
        handleClose={mockHandleClose}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.getByText('Edit Status')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Patient ID: 123')).toBeInTheDocument();
    expect(screen.getByText('Request ID: 456')).toBeInTheDocument();
  });

  it('allows editing of payment status and remarks', () => {
    render(
      <ModalEditStatus
        patient={patientMock}
        show={true}
        handleClose={mockHandleClose}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    const paymentSelect = screen.getByLabelText(/Payment Status/i);
    const remarksTextarea = screen.getByLabelText(/Medical Technologist's Remarks/i);

    fireEvent.change(paymentSelect, { target: { value: 'Unpaid' } });
    fireEvent.change(remarksTextarea, { target: { value: 'Updated remarks' } });

    expect(paymentSelect.value).toBe('Unpaid');
    expect(remarksTextarea.value).toBe('Updated remarks');
  });


});
