# Horizon API Documentation

> https://raw.githubusercontent.com/leegunwoooo/swagger-ui/refs/heads/master/swagger.json
> OpenAPI 3.0.1 | Base URL: `http://localhost:8080`

## Table of Contents

- [Authentication](#authentication)
- [User Management](#user-management)
- [Verification](#verification)
- [Roadmap](#roadmap)
- [Node](#node)
- [Directory](#directory)
- [Team](#team)
- [Team Roadmap](#team-roadmap)
- [AI Features](#ai-features)
- [Problem/Quiz](#problemquiz)
- [Section](#section)
- [Text](#text)
- [Root Content](#root-content)
- [Education](#education)
- [Schemas](#schemas)

---

## Response Format

All API responses follow this standard format:

```typescript
interface ApiResponse<T> {
  code: string;      // 'OK' for success
  message: string;   // Human-readable message
  data: T;          // Response payload
}
```

---

## Authentication

### Login

**POST** `/auth`

Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "string",     // required
  "password": "string"   // required
}
```

**Response:** `200 OK`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

### Refresh Token

**PUT** `/auth/token`

Refresh expired access token.

**Headers:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `Refresh-Token` | string | Yes | Current refresh token |

**Response:** `200 OK`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

### Logout

**DELETE** `/auth`

Logout current user and invalidate tokens.

**Response:** `204 No Content`

---

## User Management

### Get Current User

**GET** `/users`

Retrieve authenticated user information.

**Response:** `200 OK`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "userInfo": {
      "uuid": 0,
      "username": "string",
      "email": "string",
      "role": "string"
    },
    "teams": ["string"],
    "school": "string",
    "isConnectedSchool": false
  }
}
```

### Sign Up

**POST** `/users`

Register a new user account.

**Request Body:**
```json
{
  "email": "string",     // required
  "username": "string",  // required
  "password": "string"   // required
}
```

**Response:** `201 Created`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "userInfo": {
      "uuid": 0,
      "username": "string",
      "email": "string",
      "role": "string"
    }
  }
}
```

### Update Password

**PUT** `/users`

Update user password.

**Request Body:**
```json
{
  "email": "string",     // required
  "password": "string"   // required (new password)
}
```

**Response:** `204 No Content`

### Delete User

**DELETE** `/users`

Delete user account.

**Request Body:**
```json
{}
```

**Response:** `204 No Content`

### Connect School

**PUT** `/users/school`

Connect user account to a school.

**Response:** `200 OK`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "userInfo": { ... },
    "teams": ["string"],
    "school": "string",
    "isConnectedSchool": true
  }
}
```

---

## Verification

### Send Verification Code

**POST** `/verification`

Send email verification code for signup.

**Request Body:**
```json
{
  "email": "string"  // required
}
```

**Response:** `200 OK`

### Verify Code

**PATCH** `/verification`

Verify the received code.

**Request Body:**
```json
{
  "email": "string",  // required
  "code": "string"    // required
}
```

**Response:** `200 OK`

### Send Password Reset Code

**POST** `/verification/password`

Send verification code for password reset.

**Request Body:**
```json
{
  "email": "string"  // required
}
```

**Response:** `200 OK`

### Verify Password Reset Code

**PUT** `/verification`

Verify password reset code.

**Request Body:**
```json
{
  "email": "string",  // required
  "code": "string"    // required
}
```

**Response:** `200 OK`

---

## Roadmap

### Create Roadmap

**POST** `/roadmap`

Create a new personal roadmap.

**Request Body:**
```json
{
  "title": "string",        // required, max 64 chars
  "description": "string",  // required, max 150 chars
  "directoryId": 0,         // required
  "color": "RED",           // required, enum: RED|ORANGE|YELLOW|GREEN|BLUE|PURPLE
  "icon": "CODE"            // required, see IconType enum
}
```

**Icon Types:**
`LANGUAGE` | `CODE` | `SHIELD` | `DATABASE` | `HOST` | `HTML` | `CSS` | `JAVASCRIPT` | `PSYCHIATRY` | `DEPLOYED_CODE` | `ASTERISK` | `EXTENSION` | `SCHOOL` | `FUNCTION` | `PUBLIC` | `NETWORK_INTELLIGENCE` | `NETWORK_INTEL_NODE`

**Response:** `201 Created`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "roadmapInfo": {
      "id": 0,
      "title": "string",
      "description": "string",
      "lastModifiedAt": "2024-01-01",
      "lastAccessedAt": "2024-01-01T00:00:00",
      "isFavorite": false,
      "directoryId": 0
    },
    "uuid": 0,
    "color": "RED",
    "icon": "string",
    "progress": 0
  }
}
```

### Get Roadmap

**GET** `/roadmap/{id}`

Retrieve a specific roadmap.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | int64 | Yes | Roadmap ID |

**Response:** `200 OK` - PersonalRoadmapResponse

### Update Roadmap

**PUT** `/roadmap/{id}`

Update roadmap details.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | int64 | Yes | Roadmap ID |

**Request Body:** RoadmapRequest

**Response:** `200 OK` - PersonalRoadmapResponse

### Delete Roadmap

**DELETE** `/roadmap/{id}`

Delete a roadmap.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | int64 | Yes | Roadmap ID |

**Response:** `204 No Content`

### Toggle Favorite

**POST** `/roadmap/{id}/favorite`

Toggle roadmap favorite status.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | int64 | Yes | Roadmap ID |

**Response:** `200 OK` - PersonalRoadmapResponse

### Get Roadmaps by Directory

**GET** `/roadmap/directory-id`

Get all roadmaps in a directory.

**Response:** `200 OK`
```json
{
  "code": "OK",
  "message": "string",
  "data": [PersonalRoadmapResponse]
}
```

### Get Last Accessed Roadmap

**GET** `/roadmap/last-accessed`

Get the most recently accessed roadmap.

**Response:** `200 OK` - PersonalRoadmapResponse

### Get Roadmap Count

**GET** `/roadmap/count`

Get total count of user's roadmaps.

**Response:** `200 OK`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "count": 0
  }
}
```

### Get Team Count

**GET** `/roadmap/count/teams`

Get total count of user's teams.

**Response:** `200 OK` - CountResponse

### Get Team Roadmap Count

**GET** `/roadmap/count/teams-roadmaps`

Get total count of team roadmaps.

**Response:** `200 OK` - CountResponse

---

## Node

### Create Node

**POST** `/roadmap/{roadmapId}/nodes`

Create a new node in a roadmap.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `roadmapId` | int64 | Yes | Roadmap ID |

**Request Body:**
```json
{
  "title": "string",        // required, max 64 chars
  "description": "string",  // required, max 1500 chars
  "height": 100,            // required
  "width": 200,             // required
  "type": "TOP",            // required, enum: TOP|MIDDLE|BOTTOM
  "x": 0,                   // required
  "y": 0,                   // required
  "color": "RED",           // required, enum: RED|ORANGE|YELLOW|GREEN|BLUE|PURPLE
  "parentNodeId": null      // optional
}
```

**Response:** `201 Created`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "id": 0,
    "title": "string",
    "description": "string",
    "height": 100,
    "width": 200,
    "type": "TOP",
    "x": 0,
    "y": 0,
    "color": "RED",
    "roadmapId": 0,
    "parentNodeId": null,
    "childNode": [],
    "progress": 0,
    "isEducation": false,
    "subject": null
  }
}
```

### Get Nodes by Roadmap

**GET** `/roadmap/{roadmapId}/nodes`

Get all nodes in a roadmap.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `roadmapId` | int64 | Yes | Roadmap ID |

**Response:** `200 OK`
```json
{
  "code": "OK",
  "message": "string",
  "data": [NodeResponse]
}
```

### Get Node

**GET** `/roadmap/{roadmapId}/nodes/{nodeId}`

Get a specific node.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `roadmapId` | int64 | Yes | Roadmap ID |
| `nodeId` | int64 | Yes | Node ID |

**Response:** `200 OK` - NodeResponse

### Update Node

**PUT** `/roadmap/{roadmapId}/nodes/{nodeId}`

Update node details.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `roadmapId` | int64 | Yes | Roadmap ID |
| `nodeId` | int64 | Yes | Node ID |

**Request Body:** NodeRequest

**Response:** `200 OK` - NodeResponse

### Delete Node

**DELETE** `/roadmap/{roadmapId}/nodes/{nodeId}`

Delete a node.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `roadmapId` | int64 | Yes | Roadmap ID |
| `nodeId` | int64 | Yes | Node ID |

**Response:** `204 No Content`

### Update Education Subject

**PATCH** `/roadmap/{roadmapId}/nodes/{nodeId}`

Set education subject for a node.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `roadmapId` | int64 | Yes | Roadmap ID |
| `nodeId` | int64 | Yes | Node ID |

**Request Body:**
```json
{
  "subject": "JAVA"  // required, see SubjectType enum below
}
```

**Subject Types:**
`MATH_AND_AI` | `AI_PROGRAMMING` | `SCREEN_IMPLEMENTATION` | `ADVANCED_SCREEN_IMPLEMENTATION` | `APPLICATION_PROGRAMMING` | `WEB_PROGRAMMING` | `WEB_PROGRAMMING_PRACTICE` | `FRONTEND_BASIC` | `SQL` | `APPLICATION_DEV` | `DATABASE_PROGRAMMING` | `JAVA_PROGRAMMING` | `PROGRAMMING` | `NETWORK_PROGRAMMING` | `AWS_BASIC` | `MICROPROCESSOR` | `MICROPROCESSOR_CONTROL` | `EMBEDDED_AUTO_CONTROL` | `STM32` | `COMPUTER_GRAPHIC` | `MOTION_GRAPHIC` | `DESIGN_GENERAL` | `ALGORITHM_DESIGN` | `ALGORITHM_BASIC` | `AI_GENERAL` | `BIGDATA_ANALYSIS` | `ROBOT_PROGRAMMING` | `NETWORK_THEORY` | `APP_PROGRAMMING` | `MOBILE_PROGRAMMING` | `BIGDATA_EXCEL` | `PROJECT_PRACTICE` | `SYSTEM_MANAGEMENT` | `JAVA` | `COMPUTER_STRUCTURE` | `DATA_STRUCTURE` | `IOT_AND_SENSOR` | `AI_MATH_BASIC` | `PROBLEM_SOLVING_BASIC` | `ROBOT_SOFTWARE_DEV` | `EMBEDDED_SYSTEM` | `ELECTRONIC_CIRCUIT` | `ELECTRONIC_CAD` | `PCB`

**Response:** `200 OK` - NodeResponse

---

## Directory

### Get Directories

**GET** `/directories`

Get all user directories.

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sort` | string | No | Sort order |

**Response:** `200 OK`
```json
{
  "code": "OK",
  "message": "string",
  "data": [
    {
      "id": 0,
      "description": "string",
      "name": "string",
      "roadmapCount": 0,
      "completedRoadmapCount": 0,
      "lastAcessedRoadmapName": "string"
    }
  ]
}
```

### Create Directory

**POST** `/directories`

Create a new directory.

**Request Body:**
```json
{
  "name": "string",        // required, max 64 chars
  "description": "string", // optional
  "parentId": null         // optional
}
```

**Response:** `201 Created`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "description": "string",
    "parentId": null,
    "directories": [],
    "roadmaps": []
  }
}
```

### Update Directory

**PUT** `/directories/{directoryId}`

Update directory details.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `directoryId` | int64 | Yes | Directory ID |

**Request Body:** DirectoryRequest

**Response:** `200 OK` - DirectoryResponse

### Delete Directory

**DELETE** `/directories/{directoryId}`

Delete a directory.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `directoryId` | int64 | Yes | Directory ID |

**Response:** `204 No Content`

### Create Team Directory

**POST** `/directories/team/{teamId}`

Create a directory for a team.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `teamId` | int64 | Yes | Team ID |

**Request Body:** DirectoryRequest

**Response:** `201 Created` - TeamDirectoryResponse

### Update Team Directory

**PUT** `/directories/{directoryId}/team/{teamId}`

Update a team directory.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `directoryId` | int64 | Yes | Directory ID |
| `teamId` | int64 | Yes | Team ID |

**Request Body:** DirectoryRequest

**Response:** `200 OK` - TeamDirectoryResponse

### Delete Team Directory

**DELETE** `/directories/{directoryId}/team/{teamId}`

Delete a team directory.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `directoryId` | int64 | Yes | Directory ID |
| `teamId` | int64 | Yes | Team ID |

**Response:** `204 No Content`

---

## Team

### Get Teams

**GET** `/teams`

Get all teams for the current user.

**Response:** `200 OK`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "teams": [
      {
        "id": 0,
        "name": "string"
      }
    ]
  }
}
```

### Create Team

**POST** `/teams`

Create a new team.

**Request Body:**
```json
{
  "name": "string"
}
```

**Response:** `201 Created`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "id": 0,
    "name": "string",
    "leader": "string",
    "inviteCode": "string",
    "members": ["string"]
  }
}
```

### Get Team Info

**GET** `/teams/{id}`

Get detailed team information.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | int64 | Yes | Team ID |

**Response:** `200 OK` - TeamResponse

### Delete Team

**DELETE** `/teams/{id}`

Delete a team.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | int64 | Yes | Team ID |

**Response:** `204 No Content`

### Join Team (Invite)

**PATCH** `/teams`

Join a team using invite code.

**Request Body:**
```json
{
  "inviteCode": "string"  // required
}
```

**Response:** `204 No Content`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "id": 0,
    "name": "string"
  }
}
```

---

## Team Roadmap

### Create Team Roadmap

**POST** `/teams/{teamId}/roadmap`

Create a roadmap for a team.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `teamId` | int64 | Yes | Team ID |

**Request Body:** RoadmapRequest

**Response:** `201 Created`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "roadmapInfo": { ... },
    "uuid": 0,
    "color": "RED",
    "icon": "string",
    "teamId": 0,
    "teamName": "string",
    "progress": 0
  }
}
```

### Get Team Roadmaps

**GET** `/teams/{teamId}/roadmap/{directory-id}`

Get all roadmaps for a team.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `teamId` | int64 | Yes | Team ID |

**Response:** `200 OK`
```json
{
  "code": "OK",
  "message": "string",
  "data": [TeamRoadmapResponse]
}
```

---

## AI Features

### Generate AI Roadmap

**POST** `/directories/{directoryId}/nodes/ai`

Generate a roadmap with AI-created nodes.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `directoryId` | int64 | Yes | Directory ID |

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `teamId` | int64 | No | Team ID (for team roadmaps) |

**Request Body:**
```json
{
  "description": "string",  // required
  "language": "string",     // required
  "courses": [              // required
    {
      "title": "string",       // required
      "description": "string"  // required
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "roadmap": {
      "id": 0,
      "title": "string"
    },
    "nodes": [NodeResponse]
  }
}
```

### Update AI Nodes

**PUT** `/roadmap/{roadmapId}/nodes/ai`

Modify existing nodes using AI.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `roadmapId` | int64 | Yes | Roadmap ID |

**Request Body:**
```json
{
  "description": "string",  // required
  "nodes": [                // required
    {
      "id": 0,
      "title": "string",
      "description": "string",
      "type": "TOP",
      "x": 0,
      "y": 0,
      "parentNodeId": null,
      "isEducation": false
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "code": "OK",
  "message": "string",
  "data": [SimpleNodeResponse]
}
```

---

## Problem/Quiz

### Create Problem

**POST** `/{nodeId}/problems`

Create a quiz problem for a node.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `nodeId` | int64 | Yes | Node ID |

**Request Body:**
```json
{
  "title": "string",    // required - question text
  "choices": [          // required - answer options
    "string"
  ],
  "correct": 0          // required - correct answer index (0-based)
}
```

**Response:** `201 Created`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "id": 0,
    "title": "string",
    "choices": ["string"],
    "status": "UNRESOLVED"  // UNRESOLVED|RESOLVED|FAILED
  }
}
```

### Generate AI Problems

**POST** `/{nodeId}/problems/ai`

Generate quiz problems using AI.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `nodeId` | int64 | Yes | Node ID |

**Request Body:**
```json
{
  "title": "string",       // required
  "description": "string"  // required
}
```

**Response:** `201 Created`
```json
{
  "code": "OK",
  "message": "string",
  "data": [ProblemResponse]
}
```

### Solve Problem

**PATCH** `/{nodeId}/problems`

Submit an answer to a problem.

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `problemId` | int64 | Yes | Problem ID |

**Request Body:**
```json
{
  "answer": 0  // required - selected answer index (0-based)
}
```

**Response:** `204 No Content`

---

## Section

### Create Section

**POST** `/{roadmap-id}/section`

Create a section in a roadmap.

**Request Body:**
```json
{
  "name": "string",   // required
  "x": 0,             // required
  "y": 0,             // required
  "width": 200,       // required
  "height": 100       // required
}
```

**Response:** `200 OK`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "section": {
      "id": 0,
      "name": "string",
      "x": 0,
      "y": 0,
      "width": 200,
      "height": 100,
      "nodes": []
    }
  }
}
```

### Get Section

**GET** `/{roadmap-id}/section/{section-id}`

Get section details.

**Response:** `200 OK`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "id": 0,
    "name": "string"
  }
}
```

### Update Section

**PATCH** `/{roadmap-id}/section/{section-id}`

Update section details.

**Request Body:**
```json
{
  "name": "string",   // required
  "x": 0,             // required
  "y": 0,             // required
  "width": 200,       // required
  "height": 100,      // required
  "nodeIds": [0]      // required - IDs of nodes in this section
}
```

**Response:** `200 OK` - SectionResponse

### Delete Section

**DELETE** `/{roadmap-id}/section/{section-id}`

Delete a section.

**Response:** `200 OK`

---

## Text

### Create Text

**POST** `/{roadmap-id}/text`

Create a text element in a roadmap.

**Request Body:**
```json
{
  "text": "string",  // required
  "type": "TITLE"    // required, enum: TITLE|PARAGRAPH
}
```

**Response:** `200 OK`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "texts": {
      "id": 0,
      "text": "string",
      "type": "TITLE",
      "roadmapId": 0,
      "sectionId": null
    }
  }
}
```

### Get Text

**GET** `/{roadmap-id}/text/{id}`

Get a text element.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | int64 | Yes | Text ID |

**Response:** `200 OK` - TextResponse

### Update Text

**PATCH** `/{roadmap-id}/text/{id}`

Update a text element.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | int64 | Yes | Text ID |

**Request Body:**
```json
{
  "text": "string",    // required
  "type": "TITLE",     // required, enum: TITLE|PARAGRAPH
  "sectionId": null    // optional
}
```

**Response:** `200 OK` - TextResponse

### Delete Text

**DELETE** `/{roadmap-id}/text/{id}`

Delete a text element.

**Path Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | int64 | Yes | Text ID |

**Response:** `200 OK`

---

## Root Content

### Get Personal Root Content

**GET** `/root`

Get root directory content for personal roadmaps.

**Response:** `200 OK`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "directories": [
      {
        "id": 0,
        "name": "string",
        "description": "string",
        "roadmapCount": 0,
        "roadmaps": [
          {
            "id": 0,
            "title": "string",
            "description": "string",
            "progress": 0
          }
        ]
      }
    ]
  }
}
```

### Get Team Root Content

**GET** `/root/team`

Get root directory content for a team.

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `teamId` | int64 | Yes | Team ID |

**Response:** `200 OK` - RootContentResponse

---

## Education

### Get Education List

**GET** `/education`

과목별 교육 자료 목록을 조회합니다.

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `subject` | Subject | Yes | 필터링할 과목 |

**Response:** `200 OK`
```json
{
  "code": "OK",
  "message": "string",
  "data": [
    {
      "id": 0,
      "title": "string",
      "description": "string",
      "progress": 0
    }
  ]
}
```

### Get Education Info

**GET** `/education/subject`

교육 정보를 조회합니다.

**Response:** `200 OK`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "id": 0,
    "title": "string",
    "description": "string",
    "subject": "FRONTEND_BASIC",
    "teacher": "string",
    "nodeCount": 0
  }
}
```

### Get Education Count

**GET** `/education/count`

교육 노드 개수를 조회합니다.

**Response:** `200 OK`
```json
{
  "code": "OK",
  "message": "string",
  "data": {
    "count": 0
  }
}
```

---

## Schemas

### Enums

#### ColorType
```
RED | ORANGE | YELLOW | GREEN | BLUE | PURPLE
```

#### NodeType
```
TOP | MIDDLE | BOTTOM
```

#### TextType
```
TITLE | PARAGRAPH
```

#### ProblemStatus
```
UNRESOLVED | RESOLVED | FAILED
```

### Common Response Types

#### UserInfo
```typescript
{
  uuid: number;
  username: string;
  email: string;
  role: string;
}
```

#### NodeResponse
```typescript
{
  id: number;
  title: string;
  description: string;
  height: number;
  width: number;
  type: 'TOP' | 'MIDDLE' | 'BOTTOM';
  x: number;
  y: number;
  color: ColorType;
  roadmapId: number;
  parentNodeId: number | null;
  childNode: SimpleNodeResponse[];
  progress: number;
  isEducation: boolean;
  subject: string | null;
}
```

#### SimpleNodeResponse
```typescript
{
  id: number;
  title: string;
  description: string;
  problemCount: number;
  solverProblemCount: number;
}
```

#### RoadmapResponseVO
```typescript
{
  id: number;
  title: string;
  description: string;
  lastModifiedAt: string;      // date format
  lastAccessedAt: string;      // datetime format
  isFavorite: boolean;
  directoryId: number;
}
```

#### PersonalRoadmapResponse
```typescript
{
  roadmapInfo: RoadmapResponseVO;
  uuid: number;
  color: ColorType;
  icon: string;
  progress: number;
}
```

#### TeamRoadmapResponse
```typescript
{
  roadmapInfo: RoadmapResponseVO;
  uuid: number;
  color: ColorType;
  icon: string;
  teamId: number;
  teamName: string;
  progress: number;
}
```

#### DirectoryResponse
```typescript
{
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  directories: SimpleDirectoryResponse[];
  roadmaps: SimpleRoadmapResponse[];
}
```

#### TeamResponse
```typescript
{
  id: number;
  name: string;
  leader: string;
  inviteCode: string;
  members: string[];
}
```

---

## Error Handling

All error responses follow the standard ApiResponse format:

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "data": null
}
```

### Common HTTP Status Codes

| Status | Description |
|--------|-------------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request succeeded, no body returned |
| 400 | Bad Request - Invalid request body or parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server-side error |

---

## Authentication

All endpoints except the following require authentication via JWT token in the `Authorization` header:

**Public Endpoints:**
- `POST /auth` - Login
- `POST /users` - Sign up
- `POST /verification` - Send verification code
- `PATCH /verification` - Verify code
- `POST /verification/password` - Send password reset code
- `PUT /verification` - Verify password reset code

**Header Format:**
```
Authorization: Bearer <access_token>
```

When the access token expires, use `PUT /auth/token` with the refresh token to obtain a new access token.
