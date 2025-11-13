
import type {
  TeamCreateRequest,
  TeamInviteRequest,
  TeamResponse,
  TeamUpdateRequest,
} from '@/feature/team/types';
import { delay, MOCK_DELAYS } from './mockConstants';
import type { MockUser } from './mockData';
import { initialMockData } from './mockData';
import { MOCK_ERRORS } from './mockErrors';
import { mockStorage } from './mockStorage';

interface StoredTeam {
  id: number;
  name: string;
  leaderId: number;
  inviteCode: string;
  memberIds: number[];
}

function getTeams(): StoredTeam[] {
  return mockStorage.getOrDefault('teams', initialMockData.teams);
}

function getUsers(): MockUser[] {
  return mockStorage.getOrDefault('users', initialMockData.users);
}

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function toTeamResponse(team: StoredTeam, users: MockUser[]): TeamResponse {
  const leader = users.find((u) => u.id === team.leaderId);
  const members = users.filter((u) => team.memberIds.includes(u.id));

  return {
    id: team.id,
    name: team.name,
    leader: leader?.username || 'Unknown',
    inviteCode: team.inviteCode,
    members: members.map((m) => m.username),
  };
}

export const mockTeamApi = {
  createTeam: async (data: TeamCreateRequest): Promise<TeamResponse> => {
    await delay(MOCK_DELAYS.NORMAL);

    const teams = getTeams();
    const users = getUsers();
    const currentUser = mockStorage.get<MockUser>('currentUser');

    if (!currentUser) {
      throw new Error(MOCK_ERRORS.AUTH_REQUIRED);
    }

    const newTeam: StoredTeam = {
      id: mockStorage.getNextId(),
      name: data.name || `${currentUser.username}의 팀`,
      leaderId: currentUser.id,
      inviteCode: generateInviteCode(),
      memberIds: [currentUser.id],
    };

    teams.push(newTeam);
    mockStorage.set('teams', teams);

    currentUser.teamIds = [...currentUser.teamIds, newTeam.id];
    mockStorage.set('currentUser', currentUser);

    const allUsers = getUsers();
    const userIndex = allUsers.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      allUsers[userIndex] = currentUser;
      mockStorage.set('users', allUsers);
    }

    return toTeamResponse(newTeam, users);
  },

  getTeams: async (): Promise<TeamResponse[]> => {
    await delay(MOCK_DELAYS.FAST);

    const teams = getTeams();
    const users = getUsers();
    const currentUser = mockStorage.get<MockUser>('currentUser');

    if (!currentUser) {
      return [];
    }

    const userTeams = teams.filter((t) => t.memberIds.includes(currentUser.id));

    return userTeams.map((t) => toTeamResponse(t, users));
  },

  getTeam: async (teamId: number): Promise<TeamResponse> => {
    await delay(MOCK_DELAYS.FAST);

    const teams = getTeams();
    const users = getUsers();
    const team = teams.find((t) => t.id === teamId);

    if (!team) {
      throw new Error(MOCK_ERRORS.TEAM_NOT_FOUND);
    }

    return toTeamResponse(team, users);
  },

  updateTeam: async (teamId: number, data: TeamUpdateRequest): Promise<TeamResponse> => {
    await delay(MOCK_DELAYS.NORMAL);

    const teams = getTeams();
    const users = getUsers();
    const index = teams.findIndex((t) => t.id === teamId);

    if (index === -1) {
      throw new Error(MOCK_ERRORS.TEAM_NOT_FOUND);
    }

    teams[index] = { ...teams[index], ...data };
    mockStorage.set('teams', teams);

    return toTeamResponse(teams[index], users);
  },

  deleteTeam: async (teamId: number): Promise<void> => {
    await delay(MOCK_DELAYS.NORMAL);

    const teams = getTeams();
    const users = getUsers();
    const team = teams.find((t) => t.id === teamId);

    if (!team) {
      throw new Error(MOCK_ERRORS.TEAM_NOT_FOUND);
    }

    const filtered = teams.filter((t) => t.id !== teamId);
    mockStorage.set('teams', filtered);

    const updatedUsers = users.map((u) => ({
      ...u,
      teamIds: u.teamIds.filter((id) => id !== teamId),
    }));
    mockStorage.set('users', updatedUsers);

    const currentUser = mockStorage.get<MockUser>('currentUser');
    if (currentUser) {
      currentUser.teamIds = currentUser.teamIds.filter((id) => id !== teamId);
      mockStorage.set('currentUser', currentUser);
    }
  },

  joinTeam: async (data: TeamInviteRequest): Promise<TeamResponse> => {
    await delay(MOCK_DELAYS.NORMAL);

    const teams = getTeams();
    const users = getUsers();
    const currentUser = mockStorage.get<MockUser>('currentUser');

    if (!currentUser) {
      throw new Error(MOCK_ERRORS.AUTH_REQUIRED);
    }

    const team = teams.find((t) => t.inviteCode === data.inviteCode);
    if (!team) {
      throw new Error(MOCK_ERRORS.INVALID_INVITE_CODE);
    }

    if (team.memberIds.includes(currentUser.id)) {
      throw new Error(MOCK_ERRORS.ALREADY_TEAM_MEMBER);
    }

    team.memberIds.push(currentUser.id);
    mockStorage.set('teams', teams);

    currentUser.teamIds = [...currentUser.teamIds, team.id];
    mockStorage.set('currentUser', currentUser);

    const allUsers = getUsers();
    const userIndex = allUsers.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      allUsers[userIndex] = currentUser;
      mockStorage.set('users', allUsers);
    }

    return toTeamResponse(team, users);
  },

  leaveTeam: async (teamId: number): Promise<void> => {
    await delay(MOCK_DELAYS.NORMAL);

    const teams = getTeams();
    const _users = getUsers();
    const currentUser = mockStorage.get<MockUser>('currentUser');

    if (!currentUser) {
      throw new Error(MOCK_ERRORS.AUTH_REQUIRED);
    }

    const team = teams.find((t) => t.id === teamId);
    if (!team) {
      throw new Error(MOCK_ERRORS.TEAM_NOT_FOUND);
    }

    if (team.leaderId === currentUser.id) {
      throw new Error(MOCK_ERRORS.LEADER_CANNOT_LEAVE);
    }

    team.memberIds = team.memberIds.filter((id) => id !== currentUser.id);
    mockStorage.set('teams', teams);

    currentUser.teamIds = currentUser.teamIds.filter((id) => id !== teamId);
    mockStorage.set('currentUser', currentUser);

    const allUsers = getUsers();
    const userIndex = allUsers.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      allUsers[userIndex] = currentUser;
      mockStorage.set('users', allUsers);
    }
  },

  removeMember: async (teamId: number, memberId: number): Promise<void> => {
    await delay(MOCK_DELAYS.NORMAL);

    const teams = getTeams();
    const _users = getUsers();
    const currentUser = mockStorage.get<MockUser>('currentUser');

    if (!currentUser) {
      throw new Error(MOCK_ERRORS.AUTH_REQUIRED);
    }

    const team = teams.find((t) => t.id === teamId);
    if (!team) {
      throw new Error(MOCK_ERRORS.TEAM_NOT_FOUND);
    }

    if (team.leaderId !== currentUser.id) {
      throw new Error(MOCK_ERRORS.ONLY_LEADER_CAN_REMOVE);
    }

    if (memberId === currentUser.id) {
      throw new Error(MOCK_ERRORS.LEADER_CANNOT_REMOVE_SELF);
    }

    team.memberIds = team.memberIds.filter((id) => id !== memberId);
    mockStorage.set('teams', teams);

    const allUsers = getUsers();
    const userIndex = allUsers.findIndex((u) => u.id === memberId);
    if (userIndex !== -1) {
      allUsers[userIndex].teamIds = allUsers[userIndex].teamIds.filter((id) => id !== teamId);
      mockStorage.set('users', allUsers);
    }
  },
};
