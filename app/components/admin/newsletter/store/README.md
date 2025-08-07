# Newsletter Zustand Store

This directory contains the Zustand store implementation for the newsletter admin panel, replacing the complex `useNewsletterState` hook.

## Migration Benefits

- **Simplified State Management**: Reduced from 280+ lines to a clean, centralized store
- **Better Performance**: Automatic memoization and selective re-renders
- **Easier Debugging**: Zustand DevTools support for state inspection
- **Type Safety**: Full TypeScript support with automatic type inference
- **Modular Design**: Separate selectors for different components

## Store Structure

### State
- **UI State**: Search, filters, pagination, selections
- **Data State**: Subscribers, categories, stats
- **Loading States**: Multiple loading indicators
- **Modal State**: Add subscriber modal and error handling
- **Recently Deleted**: Temporary storage for undo functionality

### Actions
- **Simple Setters**: Direct state updates
- **Complex Actions**: Async operations with error handling
- **Data Fetching**: Centralized API calls
- **Bulk Operations**: Multi-subscriber actions

## Usage

### Main Hook
```typescript
import { useNewsletterZustand } from './hooks/useNewsletterZustand';

const {
  subscribers,
  loading,
  handleAddSubscriber,
  // ... all state and actions
} = useNewsletterZustand();
```

### Selector Hooks
```typescript
import { useNewsletterStats } from './hooks/useNewsletterSelectors';

const stats = useNewsletterStats(); // Only re-renders when stats change
```

## Performance Optimizations

1. **Selective Subscriptions**: Components only re-render when their specific state changes
2. **Debounced Search**: 300ms debounce for search operations
3. **Auto-cleanup**: Recently deleted items automatically expire after 5 seconds
4. **Memoized Selectors**: Efficient state access patterns

## Migration Notes

- Replaced `useNewsletterState` hook (280+ lines)
- Maintained all existing functionality
- Improved error handling
- Added automatic cleanup for recently deleted items
- Simplified component props (e.g., NewsletterStats no longer needs stats prop)
