/**
 * Mock Team API
 */

import { mockDatabase } from './mockDatabase';
import { mockStorage } from './mockStorage';
import type {
  TeamApplyListResponse,
  TeamApplyResponse,
  TeamCreateRequest,
  TeamMembersResponse,
  TeamResponse,
  TeamUpdateRequest,
} from '@/feature/team/types';
import type { TeamMemberResponse } from '@/shared/api/types';

// 초대 코드 생성
const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const mockTeamApi = {
  // ===================================
  // Team API
  // ===================================

  // 팀 생성
  createTeam: async (data: TeamCreateRequest): Promise<TeamResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const uuid = mockStorage.getNextId('Team');
    const now = new Date().toISOString();

    const newTeam = {
      uuid,
      name: data.name,
      description: data.description,
      inviteCode: generateInviteCode(),
      memberUuids: [currentUser.uuid],
      createdAt: now,
      updatedAt: now,
    };

    mockDatabase.addTeam(newTeam);

    // 팀 멤버 추가
    mockDatabase.addTeamMember({
      userUuid: currentUser.uuid,
      teamUuid: uuid,
      joinedAt: now,
    });

    // 사용자의 팀 목록 업데이트
    currentUser.teams.push(uuid);
    mockDatabase.updateUser(currentUser.uuid, { teams: currentUser.teams });

    return {
      uuid: newTeam.uuid,
      name: newTeam.name,
      description: newTeam.description,
      inviteCode: newTeam.inviteCode,
      memberCount: 1,
      createdAt: newTeam.createdAt,
      updatedAt: newTeam.updatedAt,
    };
  },

  // 팀 전체 조회 (내가 속한 팀 목록)
  getTeams: async (): Promise<TeamResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const allTeams = mockDatabase.getTeams();
    const myTeams = allTeams.filter((team) => currentUser.teams.includes(team.uuid));

    return myTeams.map((team) => ({
      uuid: team.uuid,
      name: team.name,
      description: team.description,
      inviteCode: team.inviteCode,
      memberCount: team.memberUuids.length,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    }));
  },

  // 팀 단일 조회
  getTeam: async (teamId: number): Promise<TeamResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const team = mockDatabase.getTeam(teamId);
    if (!team) {
      throw new Error('팀을 찾을 수 없습니다.');
    }

    return {
      uuid: team.uuid,
      name: team.name,
      description: team.description,
      inviteCode: team.inviteCode,
      memberCount: team.memberUuids.length,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  },

  // 팀 수정
  updateTeam: async (teamId: number, data: TeamUpdateRequest): Promise<TeamResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const updated = mockDatabase.updateTeam(teamId, data);
    if (!updated) {
      throw new Error('팀을 찾을 수 없습니다.');
    }

    return {
      uuid: updated.uuid,
      name: updated.name,
      description: updated.description,
      inviteCode: updated.inviteCode,
      memberCount: updated.memberUuids.length,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  },

  // 팀 삭제
  deleteTeam: async (teamId: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const success = mockDatabase.deleteTeam(teamId);
    if (!success) {
      throw new Error('팀을 찾을 수 없습니다.');
    }

    // 모든 사용자에서 팀 제거
    const users = mockDatabase.getUsers();
    for (const user of users) {
      if (user.teams.includes(teamId)) {
        user.teams = user.teams.filter((id) => id !== teamId);
        mockDatabase.updateUser(user.uuid, { teams: user.teams });
      }
    }
  },

  // 팀 멤버 조회
  getTeamMembers: async (teamId: number): Promise<TeamMembersResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const team = mockDatabase.getTeam(teamId);
    if (!team) {
      throw new Error('팀을 찾을 수 없습니다.');
    }

    const teamMembers = mockDatabase.getTeamMembers(teamId);
    const members: TeamMemberResponse[] = [];

    for (const member of teamMembers) {
      const user = mockDatabase.getUser(member.userUuid);
      if (user) {
        members.push({
          uuid: user.uuid,
          username: user.username,
          email: user.email,
          role: user.role,
          joinedAt: member.joinedAt,
        });
      }
    }

    return { members };
  },

  // 팀 멤버 삭제 (추방)
  removeTeamMember: async (teamId: number, memberUuid: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const success = mockDatabase.removeTeamMember(teamId, memberUuid);
    if (!success) {
      throw new Error('팀 멤버를 찾을 수 없습니다.');
    }

    // 사용자의 팀 목록에서 제거
    const user = mockDatabase.getUser(memberUuid);
    if (user) {
      user.teams = user.teams.filter((id) => id !== teamId);
      mockDatabase.updateUser(memberUuid, { teams: user.teams });
    }
  },

  // ===================================
  // Team Apply API
  // ===================================

  // 팀 신청
  applyToTeam: async (teamId: number): Promise<TeamApplyResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const team = mockDatabase.getTeam(teamId);
    if (!team) {
      throw new Error('팀을 찾을 수 없습니다.');
    }

    const uuid = mockStorage.getNextId('Apply');
    const now = new Date().toISOString();

    const newApply = {
      uuid,
      teamUuid: teamId,
      userUuid: currentUser.uuid,
      status: 'SUBMITTED' as const,
      appliedAt: now,
    };

    mockDatabase.addTeamApply(newApply);

    return {
      uuid: newApply.uuid,
      teamName: team.name,
      username: currentUser.username,
      email: currentUser.email,
      status: newApply.status,
      appliedAt: newApply.appliedAt,
    };
  },

  // 팀 신청 목록 조회 (팀장/관리자용)
  getTeamApplications: async (teamId: number): Promise<TeamApplyListResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const team = mockDatabase.getTeam(teamId);
    if (!team) {
      throw new Error('팀을 찾을 수 없습니다.');
    }

    const applies = mockDatabase.getTeamApplies(teamId);
    const applications: TeamApplyResponse[] = [];

    for (const apply of applies) {
      const user = mockDatabase.getUser(apply.userUuid);
      if (user) {
        applications.push({
          uuid: apply.uuid,
          teamName: team.name,
          username: user.username,
          email: user.email,
          status: apply.status,
          appliedAt: apply.appliedAt,
          processedAt: apply.processedAt,
        });
      }
    }

    return { applications };
  },

  // 팀 신청 수락
  approveTeamApplication: async (applyId: number): Promise<TeamApplyResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const apply = mockDatabase.getTeamApply(applyId);
    if (!apply) {
      throw new Error('신청을 찾을 수 없습니다.');
    }

    const team = mockDatabase.getTeam(apply.teamUuid);
    const user = mockDatabase.getUser(apply.userUuid);
    if (!team || !user) {
      throw new Error('팀 또는 사용자를 찾을 수 없습니다.');
    }

    // 신청 상태 업데이트
    const updated = mockDatabase.updateTeamApply(applyId, {
      status: 'APPROVED',
      processedAt: new Date().toISOString(),
    });

    if (!updated) {
      throw new Error('신청 업데이트에 실패했습니다.');
    }

    // 팀 멤버 추가
    mockDatabase.addTeamMember({
      userUuid: user.uuid,
      teamUuid: team.uuid,
      joinedAt: new Date().toISOString(),
    });

    // 사용자의 팀 목록 업데이트
    if (!user.teams.includes(team.uuid)) {
      user.teams.push(team.uuid);
      mockDatabase.updateUser(user.uuid, { teams: user.teams });
    }

    return {
      uuid: updated.uuid,
      teamName: team.name,
      username: user.username,
      email: user.email,
      status: updated.status,
      appliedAt: updated.appliedAt,
      processedAt: updated.processedAt,
    };
  },

  // 팀 신청 거절
  rejectTeamApplication: async (applyId: number): Promise<TeamApplyResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const apply = mockDatabase.getTeamApply(applyId);
    if (!apply) {
      throw new Error('신청을 찾을 수 없습니다.');
    }

    const team = mockDatabase.getTeam(apply.teamUuid);
    const user = mockDatabase.getUser(apply.userUuid);
    if (!team || !user) {
      throw new Error('팀 또는 사용자를 찾을 수 없습니다.');
    }

    // 신청 상태 업데이트
    const updated = mockDatabase.updateTeamApply(applyId, {
      status: 'REJECTED',
      processedAt: new Date().toISOString(),
    });

    if (!updated) {
      throw new Error('신청 업데이트에 실패했습니다.');
    }

    return {
      uuid: updated.uuid,
      teamName: team.name,
      username: user.username,
      email: user.email,
      status: updated.status,
      appliedAt: updated.appliedAt,
      processedAt: updated.processedAt,
    };
  },

  // 팀 신청 삭제 (신청 취소)
  deleteTeamApplication: async (applyId: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const success = mockDatabase.deleteTeamApply(applyId);
    if (!success) {
      throw new Error('신청을 찾을 수 없습니다.');
    }
  },
};
