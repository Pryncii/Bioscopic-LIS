import { render, screen, fireEvent } from '@testing-library/react';
import { expect, vi } from 'vitest';
import ModalEditRequest from './ModalEditRequest'; // Adjust the import path

describe('ModalEditRequest Component', () => {
  const mockHandleClose = vi.fn();
  const mockHandleSubmit = vi.fn();

  const mockProps = {
    show: true,
    category: 'Hematology', // Ensure this is a defined string
    patient: {
      name: 'John Doe', // Ensure this is a defined string
      patientID: '12345',
      requestID: '67890',
    },
    users: [
      { name: 'Dr. Smith', medtechID: '1' },
      { name: 'Dr. Jones', medtechID: '2' },
    ],
    testValues: [
      {
        requestID: '67890',
        hemoglobin: 12.5,
        hematocrit: 40,
        rbcCount: 4.2,
        wbcCount: 5.6,
        neutrophil: 60,
        lymphocyte: 30,
        monocyte: 5,
        eosinophil: 3,
        basophil: 2,
        plateletCount: 150,
        esr: 10,
        bloodWithRh: 'A+',
        clottingTime: 10,
        bleedingTime: 5,
      },
    ],
    testOptions: [
      { name: 'ESR', options: ['Normal', 'Elevated', 'Low'] },
      { name: 'Blood with RH', options: ['A+', 'B+', 'O-', 'AB+'] },
    ],
    handleClose: mockHandleClose,
    handleSubmit: mockHandleSubmit,
  };

  it('should render modal with correct category and patient name', () => {
    render(<ModalEditRequest {...mockProps} />);
    
    // Check if the category and patient name are correctly rendered
    expect(screen.getByText('Hematology')).toBeInTheDocument(); // Check for the category
    expect(screen.getByText('John Doe')).toBeInTheDocument(); // Check for the patient name

    // Check if buttons are rendered
    expect(screen.getByText('Close')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('should call handleClose when Close button is clicked', () => {
    render(<ModalEditRequest {...mockProps} />);
    
    fireEvent.click(screen.getByText('Close'));
    
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('should call handleSubmit when Submit button is clicked', () => {
    render(<ModalEditRequest {...mockProps} />);
    
    fireEvent.click(screen.getByText('Submit'));
    
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
