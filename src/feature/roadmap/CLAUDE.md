# Roadmap Feature

This feature handles roadmap creation, management, and visualization in the Horizon application.

## Overview

The roadmap feature provides:
- Personal and team roadmap creation
- Roadmap folder organization
- Multi-step roadmap creation flow
- Roadmap list views (list and thumbnail)
- Roadmap filtering and sorting
- Style customization (colors and icons)

## Architecture

### Key Components

#### Roadmap Creation
- **RoadmapStyleModal**: Select color and icon for new roadmaps
- **ColorDropdown**: Color picker for roadmaps
- **IconDropdown**: Icon picker for roadmaps

#### Roadmap Display
- **RoadmapList**: Display roadmaps in list format
- **RoadmapListItem**: Individual roadmap card in list view
- **RoadmapThumbnail**: Roadmap preview thumbnail
- **FolderList**: Display folders containing roadmaps
- **FolderCard**: Individual folder card
- **FolderRoadmapList**: Roadmaps within a specific folder

#### Filters and Navigation
- **FilterTabs**: Tab-based filtering for roadmaps
- **Pagination**: Page navigation for roadmap lists

### API Layer

#### roadmapApi (`api/roadmapApi.ts`)
All roadmap CRUD operations:
- `getRoadmaps`: Fetch user's roadmaps
- `createRoadmap`: Create new personal roadmap
- `createTeamRoadmap`: Create new team roadmap
- `getRoadmapById`: Fetch single roadmap details
- `updateRoadmap`: Update roadmap information
- `deleteRoadmap`: Remove roadmap

#### nodeApi (`api/nodeApi.ts`)
Roadmap node operations:
- `getNodes`: Fetch nodes for a roadmap
- `createNode`: Add new node
- `updateNode`: Modify node
- `deleteNode`: Remove node

### Hooks

#### Query Hooks (`hooks/useRoadmapQueries.ts`)
- `useRoadmaps`: Fetch all roadmaps for current user
- `useCreateRoadmap`: Mutation for personal roadmap creation
- `useCreateTeamRoadmap`: Mutation for team roadmap creation
- **Note**: Team roadmap fetching is not yet fully implemented (API pending)

#### Feature Hooks
- `useMyRoadmaps`: Combine roadmap fetching with filtering/sorting
- `useFolderDetail`: Fetch roadmaps within a specific folder

### State Management

#### roadmapFormFlow Store (`stores/roadmapFormFlow.ts`)
Manages the multi-step roadmap creation modal:
- Steps: `category` → `folder` → `team` → `info` → `style`
- Form data persistence across steps
- Modal open/close state
- Step navigation

### Utilities

#### styleConverter (`utils/styleConverter.ts`)
Type-safe conversion utilities:
- `toColorEnum(color: string): Color`: Convert lowercase color to Color enum
- `toIconEnum(icon: string): Icon`: Convert lowercase icon to Icon enum

**Purpose**: These utilities replace `as any` type assertions and provide validation + default fallbacks.

### Validation

Zod schemas in `validations/roadmap.ts`:
- `categoryStepSchema`: Personal vs team selection
- `folderStepSchema`: Folder selection or creation
- `teamStepSchema`: Team selection for team roadmaps
- `infoStepSchema`: Roadmap name and description
- `styleStepSchema`: Color and icon selection
- `roadmapFormSchema`: Combined schema for all steps

### Constants

- `constants/index.ts`: Roadmap color options and configuration
- `constants/FolderFilter.constants.ts`: Folder filter tab definitions
- `constants/MyRoadmapsFilter.constants.ts`: My Roadmaps page filter tabs

## Usage Examples

### Import Pattern

Always import from the feature's public API:

```typescript
// ✅ Correct
import {
  useRoadmaps,
  useCreateRoadmap,
  RoadmapList,
  toColorEnum,
  toIconEnum
} from '@/feature/roadmap';

// ❌ Incorrect
import { useRoadmaps } from '@/feature/roadmap/hooks/useRoadmapQueries';
```

### Creating a Roadmap

```typescript
import { useCreateRoadmap, toColorEnum, toIconEnum } from '@/feature/roadmap';

export const CreateRoadmapButton = () => {
  const createRoadmap = useCreateRoadmap();

  const handleCreate = async (data: {
    name: string;
    color: string;
    icon: string;
    directoryUuid?: number;
  }) => {
    await createRoadmap.mutateAsync({
      name: data.name,
      color: toColorEnum(data.color), // Type-safe conversion
      icon: toIconEnum(data.icon),     // Type-safe conversion
      directoryUuid: data.directoryUuid,
    });
  };

  return <button onClick={handleCreate}>Create Roadmap</button>;
};
```

### Displaying Roadmaps

```typescript
import { useRoadmaps, RoadmapList } from '@/feature/roadmap';

export const MyRoadmapsPage = () => {
  const { data: roadmaps, isLoading } = useRoadmaps();

  if (isLoading) return <div>Loading...</div>;

  return <RoadmapList roadmaps={roadmaps || []} />;
};
```

### Using the Multi-Step Form

```typescript
import { useRoadmapFormFlow } from '@/feature/roadmap';

export const RoadmapModal = () => {
  const { currentStep, formData, goToStep, saveStepData, closeModal } = useRoadmapFormFlow();

  const handleNext = (stepData: any) => {
    saveStepData(stepData);
    goToStep('nextStep');
  };

  return (
    <div>
      Current Step: {currentStep}
      {/* Render appropriate step component */}
    </div>
  );
};
```

## Key Files

- `api/roadmapApi.ts`: Roadmap CRUD API endpoints
- `api/nodeApi.ts`: Node CRUD API endpoints
- `components/RoadmapList.tsx`: Main roadmap list component
- `components/ColorDropdown.tsx`: Color picker
- `components/IconDropdown.tsx`: Icon picker
- `forms/RoadmapStyleModal.tsx`: Style selection modal
- `hooks/useRoadmapQueries.ts`: React Query hooks
- `stores/roadmapFormFlow.ts`: Multi-step form state
- `utils/styleConverter.ts`: Type-safe enum converters
- `validations/roadmap.ts`: Form validation schemas
- `index.ts`: Public API exports

## Important Notes

### Color and Icon Handling
**Always use the converter utilities** to convert user input to enums:

```typescript
import { toColorEnum, toIconEnum } from '@/feature/roadmap';

// These provide validation and default fallbacks
const color = toColorEnum('red');   // Returns Color.RED
const icon = toIconEnum('database'); // Returns Icon.DATABASE

// Invalid values get fallbacks
const invalid = toColorEnum('invalid'); // Returns Color.BLUE (default)
```

### Roadmap Types
There are multiple roadmap types in the codebase:
1. `Roadmap` (from this feature): Full roadmap data
2. `DashboardRoadmapCard` (from dashboard feature): Simplified card view
3. `TeamRoadmap` (from team feature): Team-specific roadmap

Use mapper utilities (`team/utils/roadmapMapper.ts`) to convert between types.

### Personal vs Team Roadmaps
- Personal roadmaps: Created via `useCreateRoadmap()`
- Team roadmaps: Created via `useCreateTeamRoadmap(teamId)`
- Team roadmaps require a valid `teamId` parameter

### API Status
⚠️ Some team roadmap endpoints are not yet implemented on the backend. Check `useRoadmapQueries.ts` for `enabled: false` flags.

## Dependencies on Other Features

- **folder feature**: Roadmap folder organization
- **team feature**: Team roadmap functionality
- **dashboard feature**: Roadmap display on dashboard

## Exports

See `index.ts` for the complete public API. Key exports:
- API: `roadmapApi`, `nodeApi`
- Components: `RoadmapList`, `RoadmapStyleModal`, `ColorDropdown`, `IconDropdown`
- Hooks: `useRoadmaps`, `useCreateRoadmap`, `useCreateTeamRoadmap`
- Utilities: `toColorEnum`, `toIconEnum`
- Store: `useRoadmapFormFlow`
- Types: `Roadmap`, `CreateRoadmapRequest`, `RoadmapStatus`
