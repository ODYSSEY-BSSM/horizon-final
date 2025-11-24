# Roadmap Viewer

Read-only viewer component for displaying roadmaps without editing capabilities.

## Overview

The Roadmap Viewer provides a clean, read-only interface for viewing roadmap structures. It reuses the existing node components (`TitleNode`, `StandardNode`, `SecondaryNode`) but disables editing features.

## Components

### RoadmapViewer (Main Component)

The main wrapper component that orchestrates the viewer interface.

**Props:**
- `roadmapId: string` - Unique identifier for the roadmap
- `roadmapTitle: string` - Display title shown in the header
- `nodes: Node[]` - ReactFlow node array
- `edges: Edge[]` - ReactFlow edge array
- `onEditClick?: () => void` - Optional callback for edit button
- `showEditButton?: boolean` - Show/hide the edit button (default: true)

**Features:**
- Node selection with sidebar info
- Read-only canvas (no dragging, no connections)
- Zoom and pan controls
- Responsive layout with sidebar animation

### ViewerHeader

Top navigation header with logo, title, and edit button.

**Features:**
- Breadcrumb-style title display
- Logo with link to dashboard
- Edit button (conditional)
- Matches Figma design specifications

### ViewerCanvas

ReactFlow canvas configured for read-only viewing.

**Features:**
- Disabled node dragging (`nodesDraggable={false}`)
- Disabled connections (`nodesConnectable={false}`)
- Click-to-select nodes
- Background grid
- Zoom controls
- Fit view on mount

### ViewerSidebar

Contextual sidebar showing information about the selected node.

**Features:**
- Displays node type and metadata
- Shows child/next node indicators
- Smooth slide-in animation
- Close button

## Usage Example

```tsx
import { RoadmapViewer } from '@/feature/roadmap/viewer';

function MyViewerPage() {
  const { data: roadmap } = useRoadmapQuery(roadmapId);

  return (
    <RoadmapViewer
      roadmapId={roadmap.id}
      roadmapTitle={roadmap.title}
      nodes={roadmap.nodes}
      edges={roadmap.edges}
      onEditClick={() => router.push(`/roadmap-editor/${roadmap.id}`)}
    />
  );
}
```

## Integration with Existing Components

The viewer **reuses** your existing node components:
- `TitleNode` from `@/feature/roadmap/editor/components/nodes/HorizonNode/TitleNode`
- `StandardNode` from `@/feature/roadmap/editor/components/nodes/HorizonNode/StandardNode`
- `SecondaryNode` from `@/feature/roadmap/editor/components/nodes/HorizonNode/SecondaryNode`
- `HorizonEdge` from `@/feature/roadmap/editor/components/edges/HorizonEdge`

No duplication - same visual components, just in read-only mode!

## Styling

All styling uses your project's design tokens:
- Colors from `tokens.colors`
- Typography from `tokens.typos`
- Spacing from `tokens.spacing`
- Shadows from `tokens.shadow`
- Radius from `tokens.radius`

Matches Figma specifications:
- Header: 64px height, white background
- Logo: 40x40px with icon
- Title: H3_B_20 (Bold, 20px, 28px line-height)
- Background: neutral[100]

## Routes

Example page created at:
```
/app/(main)/roadmap-viewer/[id]/page.tsx
```

Access via: `/roadmap-viewer/{roadmapId}`

## API Integration

Replace the `EXAMPLE_NODES` and `EXAMPLE_EDGES` with your actual API data:

```tsx
'use client';

import { useRoadmapViewer } from '@/feature/roadmap/hooks';
import { RoadmapViewer } from '@/feature/roadmap/viewer';

export default function RoadmapViewerPage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useRoadmapViewer(params.id);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Roadmap not found</div>;

  return (
    <RoadmapViewer
      roadmapId={data.id}
      roadmapTitle={data.title}
      nodes={data.nodes}
      edges={data.edges}
      onEditClick={() => router.push(`/roadmap-editor/${data.id}`)}
    />
  );
}
```

## Differences from Editor

| Feature | Editor | Viewer |
|---------|--------|--------|
| Node Dragging | ✅ Enabled | ❌ Disabled |
| Node Connections | ✅ Enabled | ❌ Disabled |
| Node Selection | ✅ Enabled | ✅ Enabled |
| Toolbar | ✅ Shown | ❌ Hidden |
| Sidebar | ✅ Edit controls | ✅ Info display |
| Edit Button | ❌ N/A | ✅ Navigate to editor |

## TypeScript Types

All components are fully typed with TypeScript:
- `Node` and `Edge` types from ReactFlow
- Custom `SelectedNodeInfo` interface for sidebar
- Proper prop typing with interfaces

## Accessibility

- Semantic HTML (`<header>`, `<main>`, `<aside>`)
- ARIA labels on interactive elements
- Keyboard navigation support (ReactFlow built-in)
- Focus management for sidebar

## Performance

- Memoized callbacks with `useCallback`
- Efficient state updates
- ReactFlow optimizations built-in
- Smooth animations with CSS transitions

## Browser Support

Same as your main project (Next.js 15 + React 19):
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (though designed for desktop)
