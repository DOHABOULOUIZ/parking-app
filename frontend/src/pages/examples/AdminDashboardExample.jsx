// 🎨 EXAMPLE: How to use the new Professional UI Components
// Copy this as a template for your admin pages

import React, { useState } from 'react';
import {
  Button,
  Card,
  Badge,
  Alert,
  StatCard,
  FormGroup,
  DataTable,
  LoadingSpinner,
  Modal,
} from '../components/ui/index';

export function AdminDashboardExample() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Example data
  const stats = [
    { label: 'Total Places', value: '150', change: 12, type: 'primary', icon: 'car-front' },
    { label: 'Available', value: '45', change: 8, type: 'success', icon: 'check-circle' },
    { label: 'Occupied', value: '95', change: 5, type: 'danger', icon: 'dash-circle' },
    { label: 'Reserved', value: '10', change: -2, type: 'warning', icon: 'bookmark' },
  ];

  const places = [
    { id: 1, number: 'A-1', sector: 'Sector A', status: 'available', user: 'Available' },
    { id: 2, number: 'A-2', sector: 'Sector A', status: 'occupied', user: 'John Doe' },
    { id: 3, number: 'B-1', sector: 'Sector B', status: 'reserved', user: 'Reserved' },
    { id: 4, number: 'B-2', sector: 'Sector B', status: 'occupied', user: 'Jane Smith' },
  ];

  const placesColumns = [
    { key: 'number', label: 'Place Number' },
    { key: 'sector', label: 'Sector' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => <Badge status={status} />,
    },
    { key: 'user', label: 'User/Owner' },
  ];

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* SUCCESS ALERT EXAMPLE */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Alert type="success" title="Welcome!">
        Your dashboard is ready to use. All systems are operational.
      </Alert>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* STAT CARDS */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section">
        <h2 style={{ marginBottom: 'var(--space-6)' }}>📊 Overview</h2>
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              type={stat.type}
              icon={stat.icon}
            />
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* DATA TABLE */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section">
        <h2 style={{ marginBottom: 'var(--space-4)' }}>🅿️ Places</h2>
        <DataTable
          title="Parking Spaces"
          columns={placesColumns}
          rows={places}
          onEdit={(place) => {
            setSelectedItem(place);
            setModalOpen(true);
          }}
          onDelete={(place) => alert(`Delete: ${place.number}`)}
          pagination={{
            page: 1,
            totalPages: 3,
            onPageChange: (page) => console.log('Go to page:', page),
          }}
        />
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* FORM EXAMPLE */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section">
        <h2 style={{ marginBottom: 'var(--space-4)' }}>➕ Add New Place</h2>
        <Card>
          <div style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>
              <i className="bi bi-plus-circle" style={{ marginRight: '8px' }}></i>
              Form Example
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-4)',
              }}
            >
              <FormGroup label="Place Number" required hint="e.g., A-1, B-5">
                <input type="text" placeholder="Enter place number" />
              </FormGroup>

              <FormGroup label="Sector" required>
                <select>
                  <option>Select Sector</option>
                  <option>Sector A</option>
                  <option>Sector B</option>
                  <option>Sector C</option>
                </select>
              </FormGroup>

              <FormGroup label="Status" required>
                <select>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                </select>
              </FormGroup>

              <FormGroup label="Description">
                <textarea placeholder="Optional description..." />
              </FormGroup>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <Button variant="primary" icon="plus-circle">
                Create Place
              </Button>
              <Button variant="secondary" icon="x-circle">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* BUTTON VARIANTS */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section">
        <h2 style={{ marginBottom: 'var(--space-4)' }}>🔘 Button Variants</h2>
        <Card>
          <div style={{ padding: 'var(--space-6)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <Button variant="primary" icon="check">Primary</Button>
            <Button variant="secondary" icon="pencil">Secondary</Button>
            <Button variant="success" icon="check-circle">Success</Button>
            <Button variant="danger" icon="trash">Danger</Button>
            <Button variant="ghost" icon="download">Ghost</Button>
            <Button variant="primary" size="sm" icon="save">Small</Button>
            <Button variant="primary" size="lg" icon="plus-circle">Large</Button>
            <Button variant="primary" loading>Loading...</Button>
          </div>
        </Card>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ALERTS */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section">
        <h2 style={{ marginBottom: 'var(--space-4)' }}>⚠️ Alert Types</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <Alert type="success" title="Success!" onClose={() => console.log('close')}>
            This is a success alert. Everything went well!
          </Alert>

          <Alert type="info" title="Information">
            This is an info alert. Some useful information for you.
          </Alert>

          <Alert type="warning" title="Warning!">
            This is a warning alert. Pay attention to this!
          </Alert>

          <Alert type="danger" title="Error!">
            This is an error alert. Something went wrong.
          </Alert>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* MODAL EXAMPLE */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="section">
        <Button 
          variant="primary" 
          onClick={() => setModalOpen(true)}
          icon="window-plus"
        >
          Open Modal Example
        </Button>
      </section>

      <Modal
        open={modalOpen}
        title={`Edit Place: ${selectedItem?.number || 'New'}`}
        onClose={() => setModalOpen(false)}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon="check">
              Save Changes
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <FormGroup label="Place Number" required>
            <input type="text" defaultValue={selectedItem?.number} />
          </FormGroup>
          <FormGroup label="Status">
            <select defaultValue={selectedItem?.status}>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
            </select>
          </FormGroup>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </Modal>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 
// HOW TO MIGRATE YOUR EXISTING PAGES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/* 

// BEFORE (Old way):
<div style={{ padding: '1rem', background: '#fff', borderRadius: '8px' }}>
  <button style={{ padding: '8px 16px', background: '#007bff', color: '#fff' }}>
    Create
  </button>
</div>

// AFTER (New professional way):
<Card>
  <div style={{ padding: 'var(--space-6)' }}>
    <Button variant="primary" icon="plus-circle">
      Create
    </Button>
  </div>
</Card>

*/

export default AdminDashboardExample;
