#!/usr/bin/env node
/**
 * 🚀 QUICK START SNIPPETS
 * Copy & paste these snippets into your pages for instant improvements
 */

// ═════════════════════════════════════════════════
// 1️⃣  ADMIN PAGE TEMPLATE
// ═════════════════════════════════════════════════

const AdminPageTemplate = `
import React, { useState } from 'react';
import { Button, Card, Badge, Alert, DataTable, StatCard } from '../components/ui/index';

export default function AdminPage() {
  const [data, setData] = useState([]);
  
  return (
    <div style={{ padding: 'var(--space-6)' }}>
      {/* Header Alert */}
      <Alert type="info">
        Welcome to your admin dashboard
      </Alert>

      {/* Stats Section */}
      <section className="section">
        <h2>📊 Overview</h2>
        <div className="stats-grid">
          <StatCard label="Total" value="150" change={12} type="primary" />
          <StatCard label="Active" value="95" change={8} type="success" />
          <StatCard label="Pending" value="32" change={-5} type="warning" />
        </div>
      </section>

      {/* Data Table */}
      <section className="section">
        <h2>📋 Data</h2>
        <DataTable 
          title="Items"
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'status', label: 'Status', render: (s) => <Badge status={s} /> }
          ]}
          rows={data}
          onEdit={(item) => console.log('Edit:', item)}
          onDelete={(item) => console.log('Delete:', item)}
        />
      </section>

      {/* Form Card */}
      <section className="section">
        <h2>➕ Add New</h2>
        <Card>
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label>Name</label>
              <input type="text" placeholder="Enter name" />
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <Button variant="primary">Save</Button>
              <Button variant="secondary">Cancel</Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
`;

// ═════════════════════════════════════════════════
// 2️⃣  BUTTON VARIANTS
// ═════════════════════════════════════════════════

const ButtonExamples = `
/* ✨ All Button Types */

<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="success">Confirm</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">Learn More</Button>

/* 📏 Sizes */
<Button size="sm">Small</Button>
<Button size="md">Medium (Default)</Button>
<Button size="lg">Large</Button>

/* 🎨 With Icons */
<Button icon="plus-circle">Add</Button>
<Button icon="pencil">Edit</Button>
<Button icon="trash">Delete</Button>
<Button icon="save">Save</Button>

/* ⚙️ States */
<Button loading>Processing...</Button>
<Button disabled>Disabled</Button>

/* 🔥 Combinations */
<Button variant="success" size="lg" icon="check">
  Confirm & Save
</Button>
`;

// ═════════════════════════════════════════════════
// 3️⃣  FORM TEMPLATE
// ═════════════════════════════════════════════════

const FormTemplate = `
import { FormGroup, Button, Card, Alert } from '../components/ui/index';

export function MyForm() {
  const [errors, setErrors] = useState({});
  
  return (
    <Card>
      <div style={{ padding: 'var(--space-6)' }}>
        <h3 style={{ marginBottom: 'var(--space-6)' }}>📝 Form Title</h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-4)'
        }}>
          
          <FormGroup 
            label="Email" 
            required 
            error={errors.email}
            hint="We'll never share your email"
          >
            <input 
              type="email" 
              placeholder="your@email.com"
              onChange={(e) => setErrors({})}
            />
          </FormGroup>

          <FormGroup 
            label="Status" 
            required
          >
            <select>
              <option>Choose One</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </FormGroup>

          <FormGroup label="Description">
            <textarea placeholder="Optional description..." />
          </FormGroup>

        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Button variant="primary" icon="check">Submit</Button>
          <Button variant="secondary" icon="x">Cancel</Button>
        </div>
      </div>
    </Card>
  );
}
`;

// ═════════════════════════════════════════════════
// 4️⃣  ALERTS & NOTIFICATIONS
// ═════════════════════════════════════════════════

const AlertExamples = `
import { Alert } from '../components/ui/index';

/* Success */
<Alert type="success" title="Done!">
  Your changes have been saved successfully.
</Alert>

/* Error */
<Alert type="danger" title="Error!">
  Something went wrong. Please try again.
</Alert>

/* Warning */
<Alert type="warning" title="Warning">
  Please review your information before proceeding.
</Alert>

/* Info */
<Alert type="info" title="FYI">
  This is informational only.
</Alert>

/* Dismissible */
<Alert 
  type="success" 
  onClose={() => setShowAlert(false)}
>
  Click X to close this alert
</Alert>
`;

// ═════════════════════════════════════════════════
// 5️⃣  DATA TABLE TEMPLATE
// ═════════════════════════════════════════════════

const DataTableTemplate = `
import { DataTable, Badge, Button } from '../components/ui/index';

export function MyDataTable() {
  const [data, setData] = useState(items);
  
  const columns = [
    { 
      key: 'name', 
      label: 'Name' 
    },
    { 
      key: 'email', 
      label: 'Email' 
    },
    { 
      key: 'status',
      label: 'Status',
      render: (status) => <Badge status={status} />
    },
    {
      key: 'date',
      label: 'Date',
      render: (date) => new Date(date).toLocaleDateString()
    }
  ];

  return (
    <DataTable
      title="Users"
      columns={columns}
      rows={data}
      loading={isLoading}
      onEdit={(row) => handleEdit(row)}
      onDelete={(row) => handleDelete(row)}
      pagination={{
        page: currentPage,
        totalPages: totalPages,
        onPageChange: setPage
      }}
    />
  );
}
`;

// ═════════════════════════════════════════════════
// 6️⃣  STAT CARDS FOR DASHBOARDS
// ═════════════════════════════════════════════════

const StatsTemplate = `
import { StatCard } from '../components/ui/index';

export function Dashboard() {
  const stats = [
    { 
      label: 'Total Users', 
      value: '1,234', 
      change: 12,
      type: 'primary',
      icon: 'people'
    },
    { 
      label: 'Revenue', 
      value: '\\$45,231', 
      change: 8,
      type: 'success',
      icon: 'cash-coin'
    },
    { 
      label: 'Pending', 
      value: '127', 
      change: -3,
      type: 'warning',
      icon: 'clock-history'
    },
    { 
      label: 'Issues', 
      value: '18', 
      change: -5,
      type: 'danger',
      icon: 'exclamation-triangle'
    }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
}
`;

// ═════════════════════════════════════════════════
// 7️⃣  CSS UTILITY CLASSES
// ═════════════════════════════════════════════════

const UtilityClasses = `
/* Spacing */
<div style={{ padding: 'var(--space-4)' }}>Content</div>
<div style={{ gap: 'var(--space-6)' }}>Items</div>

/* Colors */
<p className="text-primary">Primary Text</p>
<p className="text-secondary">Secondary Text</p>
<p className="text-success">Success!</p>
<p className="text-danger">Error!</p>
<p className="text-warning">Warning!</p>

/* Shadows */
<div className="shadow-sm">Subtle Shadow</div>
<div className="shadow-md">Medium Shadow</div>
<div className="shadow-lg">Large Shadow</div>
<div className="shadow-xl">Extra Large Shadow</div>

/* Border Radius */
<div className="rounded-xs">Extra Small</div>
<div className="rounded-md">Medium</div>
<div className="rounded-lg">Large</div>
<div className="rounded-xl">Extra Large</div>

/* Font Sizes */
<p className="text-xs">Extra Small</p>
<p className="text-sm">Small</p>
<p className="text-lg">Large</p>
<p className="text-xl">Extra Large</p>

/* Font Weights */
<p className="font-semibold">Semi Bold (600)</p>
<p className="font-bold">Bold (700)</p>

/* Animations */
<div className="animate-fadeIn">Fade In</div>
<div className="animate-slideUp">Slide Up</div>
<div className="animate-slideDown">Slide Down</div>
<div className="animate-spin">Spinning</div>
<div className="animate-pulse">Pulsing</div>

/* Transitions */
<div className="transition-all">Smooth All Changes</div>
<div className="transition-colors">Smooth Color Changes</div>
`;

// ═════════════════════════════════════════════════
// 8️⃣  MODAL DIALOG
// ═════════════════════════════════════════════════

const ModalTemplate = `
import { Modal, Button, FormGroup } from '../components/ui/index';
import { useState } from 'react';

export function ModalExample() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button 
        variant="primary" 
        onClick={() => setOpen(true)}
      >
        Open Modal
      </Button>

      <Modal
        open={open}
        title="Add New Item"
        onClose={() => setOpen(false)}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon="check">
              Create
            </Button>
          </>
        }
      >
        <FormGroup label="Name" required>
          <input type="text" placeholder="Enter name" />
        </FormGroup>
        <FormGroup label="Description">
          <textarea placeholder="Optional description..." />
        </FormGroup>
      </Modal>
    </>
  );
}
`;

// ═════════════════════════════════════════════════
// EXPORT ALL SNIPPETS
// ═════════════════════════════════════════════════

export const SNIPPETS = {
  AdminPageTemplate,
  ButtonExamples,
  FormTemplate,
  AlertExamples,
  DataTableTemplate,
  StatsTemplate,
  UtilityClasses,
  ModalTemplate,
};

export default SNIPPETS;
