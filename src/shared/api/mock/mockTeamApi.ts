/**
 * Mock Team API (Swagger 완벽 일치)
 */

import { MOCK_DELAYS, delay } from './mockConstants';
import { MOCK_ERRORS } from './mockErrors';
import { mockStorage } from './mockStorage';
import { initialMockData } from './mockData';
import type {
  TeamCreateRequest,
  TeamResponse,
  TeamUpdateRequest,
  TeamInviteRequest,
} from '@/feature/team/types';
import type { MockUser } from './mockData';

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

// StoredTeam을 TeamResponse로 변환 (멤버 이름 포함)
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

    if (!currentUser) throw new Error(MOCK_ERRORS.AUTH_REQUIRED);

    const newTeam: StoredTeam = {
      id: mockStorage.getNextId(),
      name: data.name || `${currentUser.username}의 팀`,
      leaderId: currentUser.id,
      inviteCode: generateInviteCode(),
      memberIds: [currentUser.id],
    };

    teams.push(newTeam);
    mockStorage.set('teams', teams);

    // 사용자의 팀 목록 업데이트
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

    if (!currentUser) return [];

    // 현재 사용자가 속한 팀만 반환
    const userTeams = teams.filter((t) => t.memberIds.includes(currentUser.id));

    return userTeams.map((t) => toTeamResponse(t, users));
  },

  getTeam: async (teamId: number): Promise<TeamResponse> => {
    await delay(MOCK_DELAYS.FAST);

    const teams = getTeams();
    const users = getUsers();
    const team = teams.find((t) => t.id === teamId);

    if (!team) throw new Error(MOCK_ERRORS.TEAM_NOT_FOUND);

    return toTeamResponse(team, users);
  },

  updateTeam: async (teamId: number, data: TeamUpdateRequest): Promise<TeamResponse> => {
    await delay(MOCK_DELAYS.NORMAL);

    const teams = getTeams();
    const users = getUsers();
    const index = teams.findIndex((t) => t.id === teamId);

    if (index === -1) throw new Error(MOCK_ERRORS.TEAM_NOT_FOUND);

    teams[index] = { ...teams[index], ...data };
    mockStorage.set('teams', teams);

    return toTeamResponse(teams[index], users);
  },

  deleteTeam: async (teamId: number): Promise<void> => {
    await delay(MOCK_DELAYS.NORMAL);

    const teams = getTeams();
    const users = getUsers();
    const team = teams.find((t) => t.id === teamId);

    if (!team) throw new Error(MOCK_ERRORS.TEAM_NOT_FOUND);

    // 팀 삭제
    const filtered = teams.filter((t) => t.id !== teamId);
    mockStorage.set('teams', filtered);

    // 모든 사용자의 팀 목록에서 제거
    const updatedUsers = users.map((u) => ({
      ...u,
      teamIds: u.teamIds.filter((id) => id !== teamId),
    }));
    mockStorage.set('users', updatedUsers);

    // 현재 사용자도 업데이트
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

    if (!currentUser) throw new Error(MOCK_ERRORS.AUTH_REQUIRED);

    const team = teams.find((t) => t.inviteCode === data.inviteCode);
    if (!team) throw new Error(MOCK_ERRORS.INVALID_INVITE_CODE);

    // 이미 팀 멤버인지 확인
    if (team.memberIds.includes(currentUser.id)) {
      throw new Error(MOCK_ERRORS.ALREADY_TEAM_MEMBER);
    }

    // 팀에 사용자 추가
    team.memberIds.push(currentUser.id);
    mockStorage.set('teams', teams);

    // 사용자의 팀 목록에 추가
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
    const users = getUsers();
    const currentUser = mockStorage.get<MockUser>('currentUser');

    if (!currentUser) throw new Error(MOCK_ERRORS.AUTH_REQUIRED);

    const team = teams.find((t) => t.id === teamId);
    if (!team) throw new Error(MOCK_ERRORS.TEAM_NOT_FOUND);

    // 팀장은 탈퇴 불가
    if (team.leaderId === currentUser.id) {
      throw new Error(MOCK_ERRORS.LEADER_CANNOT_LEAVE);
    }

    // 팀에서 사용자 제거
    team.memberIds = team.memberIds.filter((id) => id !== currentUser.id);
    mockStorage.set('teams', teams);

    // 사용자의 팀 목록에서 제거
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
    const users = getUsers();
    const currentUser = mockStorage.get<MockUser>('currentUser');

    if (!currentUser) throw new Error(MOCK_ERRORS.AUTH_REQUIRED);

    const team = teams.find((t) => t.id === teamId);
    if (!team) throw new Error(MOCK_ERRORS.TEAM_NOT_FOUND);

    // 팀장만 멤버 제거 가능
    if (team.leaderId !== currentUser.id) {
      throw new Error(MOCK_ERRORS.ONLY_LEADER_CAN_REMOVE);
    }

    // 팀장 자신은 제거 불가
    if (memberId === currentUser.id) {
      throw new Error(MOCK_ERRORS.LEADER_CANNOT_REMOVE_SELF);
    }

    // 팀에서 사용자 제거
    team.memberIds = team.memberIds.filter((id) => id !== memberId);
    mockStorage.set('teams', teams);

    // 해당 사용자의 팀 목록에서 제거
    const allUsers = getUsers();
    const userIndex = allUsers.findIndex((u) => u.id === memberId);
    if (userIndex !== -1) {
      allUsers[userIndex].teamIds = allUsers[userIndex].teamIds.filter((id) => id !== teamId);
      mockStorage.set('users', allUsers);
    }
  },
};
