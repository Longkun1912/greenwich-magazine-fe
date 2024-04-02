import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import ContributionService from '../../services/contribution.service';

const statusOptions = ['approved', 'rejected'];
const stateOptions = ['public', 'private'];

const CoordinatorEdit = (props) => {
  const { show, handleClose, contribution, contributionId } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [contributionForm, setContributionForm] = useState({
    status: '',
    state: '',
    statusError: '',
    stateError: '',
  });

  useEffect(() => {
    // Set form fields when contribution changes
    if (contribution) {
      setContributionForm({
        status: contribution.status,
        state: contribution.state,
        statusError: '',
        stateError: '',
      });
    }
  }, [contribution]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContributionForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setContributionForm((prevData) => ({
      ...prevData,
      statusError: '',
      stateError: '',
    }));
  
    const { status, state } = contributionForm;
  
    const statusError = !status ? 'Status is required' : '';
    const stateError = !state ? 'State is required' : '';
  
    if (statusError || stateError) {
      setContributionForm((prevData) => ({
        ...prevData,
        statusError,
        stateError,
      }));
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await ContributionService.EditForCoordinator(contributionId, { status, state });
      if (response && response.data) {
        setIsSubmitting(false);
        handleClose();
        // Update contribution data in UI without refreshing the page
        setContributionForm((prevData) => ({
          ...prevData,
          status: response.data.status,
          state: response.data.state,
        }));
        // Show toast notification for success
        toast.success('Contribution updated successfully!');
        // Reload the page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      } else {
        setError(error.message);
      }
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Contribution</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                fullWidth
                name="status"
                value={contributionForm.status}
                onChange={handleChange}
              >
                <MenuItem value="" disabled>
                  <em>Select a status</em>
                </MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
              {contributionForm.statusError && (
                <Alert variant="danger">{contributionForm.statusError}</Alert>
              )}
            </FormControl>
          </div>
          <div className="mb-3">
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select
                label="State"
                fullWidth
                name="state"
                value={contributionForm.state}
                onChange={handleChange}
              >
                <MenuItem value="" disabled>
                  <em>Select a state</em>
                </MenuItem>
                {stateOptions.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
              {contributionForm.stateError && (
                <Alert variant="danger">{contributionForm.stateError}</Alert>
              )}
            </FormControl>
          </div>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Save changes'}
            </Button>
          </Modal.Footer>
          {error && <Alert variant="danger">{error}</Alert>}
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default CoordinatorEdit;

