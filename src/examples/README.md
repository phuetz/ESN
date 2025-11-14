# Examples

This directory contains example components demonstrating how to use the various hooks, services, and utilities in the ESN Manager Pro application.

## Available Examples

### ConsultantListExample

A complete example showing how to:
- Use the `useConsultants` hook for CRUD operations
- Implement pagination with the `Pagination` component
- Add search and filter functionality
- Show loading states with `TableSkeleton`
- Use confirmation dialogs with `useConfirmDialog`
- Format data with utility functions
- Handle API errors with toast notifications

## Usage

To use these examples in your application:

```tsx
import ConsultantListExample from './examples/ConsultantListExample';

// In your component or route
<ConsultantListExample />
```

## Key Patterns Demonstrated

### 1. Data Fetching with Custom Hooks

```tsx
const {
  consultants,
  loading,
  pagination,
  fetchConsultants,
  createConsultant,
  updateConsultant,
  deleteConsultant,
} = useConsultants();

// Fetch with filters
useEffect(() => {
  fetchConsultants({
    page: currentPage,
    limit: 10,
    search: searchQuery,
    status: statusFilter,
  });
}, [currentPage, searchQuery, statusFilter]);
```

### 2. Confirmation Dialogs

```tsx
const { confirm, ConfirmDialog } = useConfirmDialog();

const handleDelete = async (item) => {
  const confirmed = await confirm(
    'Delete Item',
    'Are you sure you want to delete this item?',
    { variant: 'danger' }
  );

  if (confirmed) {
    await deleteItem(item.id);
  }
};

// Render the dialog
<ConfirmDialog />
```

### 3. Loading States

```tsx
{loading ? (
  <TableSkeleton rows={5} columns={6} />
) : (
  <DataTable data={data} />
)}
```

### 4. Toast Notifications

Notifications are automatically shown by the custom hooks when operations succeed or fail. The hooks integrate with `useToast` internally.

### 5. Pagination

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={pagination.pages}
  totalItems={pagination.total}
  itemsPerPage={pagination.limit}
  onPageChange={handlePageChange}
/>
```

### 6. Data Formatting

```tsx
import { formatDate, formatCurrency, getInitials } from '../utils/format';

// Format currency
{formatCurrency(consultant.dailyRate)}

// Format dates
{formatDate(consultant.createdAt)}

// Get initials
{getInitials(consultant.firstName, consultant.lastName)}
```

## Best Practices

1. **Always handle loading states** - Show skeletons or spinners while data loads
2. **Confirm destructive actions** - Use confirmation dialogs for delete operations
3. **Show user feedback** - Toast notifications are handled automatically by hooks
4. **Reset pagination on filter change** - Set page to 1 when filters are applied
5. **Debounce search inputs** - Use the `debounce` utility for search inputs
6. **Handle errors gracefully** - Custom hooks automatically show error toasts

## Integration with Existing Components

These patterns can be integrated into your existing components:

```tsx
// Replace manual fetch calls with custom hooks
// Before:
const [consultants, setConsultants] = useState([]);
const fetchData = async () => {
  const response = await fetch('/api/consultants');
  const data = await response.json();
  setConsultants(data);
};

// After:
const { consultants, fetchConsultants } = useConsultants();
```

## Additional Resources

- See `src/hooks/` for all available custom hooks
- See `src/utils/` for utility functions
- See `src/components/ui/` for reusable UI components
- See `src/services/` for API client and services
