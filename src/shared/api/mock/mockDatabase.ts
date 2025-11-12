/**
 * Mock Database
 * 모든 목 데이터 관리
 */

import { mockStorage } from './mockStorage';
import { initialMockData } from './mockData';
import type {
  MockUser,
  MockDirectory,
  MockRoadmap,
  MockNode,
  MockProblem,
  MockTeam,
  MockTeamMember,
  MockTeamApply,
  MockTeamDirectory,
  MockTeamRoadmap,
  MockSchool,
  MockEducationNode,
} from './mockData';

export class MockDatabase {
  private static instance: MockDatabase;

  private constructor() {
    this.initialize();
  }

  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  private initialize(): void {
    // 데이터가 없으면 초기 데이터 설정
    if (!mockStorage.has('users')) {
      this.reset();
    }
  }

  reset(): void {
    mockStorage.set('users', initialMockData.users);
    mockStorage.set('directories', initialMockData.directories);
    mockStorage.set('roadmaps', initialMockData.roadmaps);
    mockStorage.set('nodes', initialMockData.nodes);
    mockStorage.set('problems', initialMockData.problems);
    mockStorage.set('teams', initialMockData.teams);
    mockStorage.set('teamMembers', initialMockData.teamMembers);
    mockStorage.set('teamApplies', initialMockData.teamApplies);
    mockStorage.set('teamDirectories', initialMockData.teamDirectories);
    mockStorage.set('teamRoadmaps', initialMockData.teamRoadmaps);
    mockStorage.set('schools', initialMockData.schools);
    mockStorage.set('educationNodes', initialMockData.educationNodes);
    mockStorage.set('currentUser', null);
  }

  // Users
  getUsers(): MockUser[] {
    return mockStorage.get<MockUser[]>('users') || [];
  }

  getUser(uuid: number): MockUser | undefined {
    return this.getUsers().find((u) => u.uuid === uuid);
  }

  getUserByEmail(email: string): MockUser | undefined {
    return this.getUsers().find((u) => u.email === email);
  }

  addUser(user: MockUser): void {
    const users = this.getUsers();
    users.push(user);
    mockStorage.set('users', users);
  }

  updateUser(uuid: number, updates: Partial<MockUser>): MockUser | null {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.uuid === uuid);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    mockStorage.set('users', users);
    return users[index];
  }

  // Current User
  getCurrentUser(): MockUser | null {
    return mockStorage.get<MockUser>('currentUser');
  }

  setCurrentUser(user: MockUser | null): void {
    mockStorage.set('currentUser', user);
  }

  // Directories
  getDirectories(userUuid?: number): MockDirectory[] {
    const all = mockStorage.get<MockDirectory[]>('directories') || [];
    // 개인 디렉토리는 현재 사용자 것만 반환
    return userUuid ? all : all;
  }

  getDirectory(uuid: number): MockDirectory | undefined {
    return this.getDirectories().find((d) => d.uuid === uuid);
  }

  addDirectory(directory: MockDirectory): void {
    const directories = this.getDirectories();
    directories.push(directory);
    mockStorage.set('directories', directories);
  }

  updateDirectory(uuid: number, updates: Partial<MockDirectory>): MockDirectory | null {
    const directories = this.getDirectories();
    const index = directories.findIndex((d) => d.uuid === uuid);
    if (index === -1) return null;

    directories[index] = { ...directories[index], ...updates, updatedAt: new Date().toISOString() };
    mockStorage.set('directories', directories);
    return directories[index];
  }

  deleteDirectory(uuid: number): boolean {
    const directories = this.getDirectories();
    const filtered = directories.filter((d) => d.uuid !== uuid);
    if (filtered.length === directories.length) return false;

    mockStorage.set('directories', filtered);
    return true;
  }

  // Roadmaps
  getRoadmaps(userUuid?: number): MockRoadmap[] {
    const all = mockStorage.get<MockRoadmap[]>('roadmaps') || [];
    return userUuid ? all.filter((r) => r.userUuid === userUuid) : all;
  }

  getRoadmap(uuid: number): MockRoadmap | undefined {
    return this.getRoadmaps().find((r) => r.uuid === uuid);
  }

  addRoadmap(roadmap: MockRoadmap): void {
    const roadmaps = this.getRoadmaps();
    roadmaps.push(roadmap);
    mockStorage.set('roadmaps', roadmaps);

    // 디렉토리에 추가
    if (roadmap.directoryUuid) {
      const directory = this.getDirectory(roadmap.directoryUuid);
      if (directory) {
        directory.roadmapUuids.push(roadmap.uuid);
        this.updateDirectory(directory.uuid, { roadmapUuids: directory.roadmapUuids });
      }
    }
  }

  updateRoadmap(uuid: number, updates: Partial<MockRoadmap>): MockRoadmap | null {
    const roadmaps = this.getRoadmaps();
    const index = roadmaps.findIndex((r) => r.uuid === uuid);
    if (index === -1) return null;

    roadmaps[index] = { ...roadmaps[index], ...updates, updatedAt: new Date().toISOString() };
    mockStorage.set('roadmaps', roadmaps);
    return roadmaps[index];
  }

  deleteRoadmap(uuid: number): boolean {
    const roadmaps = this.getRoadmaps();
    const filtered = roadmaps.filter((r) => r.uuid !== uuid);
    if (filtered.length === roadmaps.length) return false;

    mockStorage.set('roadmaps', filtered);
    return true;
  }

  // Nodes
  getNodes(roadmapUuid?: number): MockNode[] {
    const all = mockStorage.get<MockNode[]>('nodes') || [];
    return roadmapUuid ? all.filter((n) => n.roadmapUuid === roadmapUuid) : all;
  }

  getNode(uuid: number): MockNode | undefined {
    return this.getNodes().find((n) => n.uuid === uuid);
  }

  addNode(node: MockNode): void {
    const nodes = this.getNodes();
    nodes.push(node);
    mockStorage.set('nodes', nodes);

    // 부모 노드에 자식 추가
    if (node.parentUuid) {
      const parent = this.getNode(node.parentUuid);
      if (parent) {
        parent.childUuids.push(node.uuid);
        this.updateNode(parent.uuid, { childUuids: parent.childUuids });
      }
    }
  }

  updateNode(uuid: number, updates: Partial<MockNode>): MockNode | null {
    const nodes = this.getNodes();
    const index = nodes.findIndex((n) => n.uuid === uuid);
    if (index === -1) return null;

    nodes[index] = { ...nodes[index], ...updates, updatedAt: new Date().toISOString() };
    mockStorage.set('nodes', nodes);
    return nodes[index];
  }

  deleteNode(uuid: number): boolean {
    const nodes = this.getNodes();
    const filtered = nodes.filter((n) => n.uuid !== uuid);
    if (filtered.length === nodes.length) return false;

    mockStorage.set('nodes', filtered);
    return true;
  }

  // Problems
  getProblems(nodeUuid?: number): MockProblem[] {
    const all = mockStorage.get<MockProblem[]>('problems') || [];
    return nodeUuid ? all.filter((p) => p.nodeUuid === nodeUuid) : all;
  }

  getProblem(uuid: number): MockProblem | undefined {
    return this.getProblems().find((p) => p.uuid === uuid);
  }

  addProblem(problem: MockProblem): void {
    const problems = this.getProblems();
    problems.push(problem);
    mockStorage.set('problems', problems);
  }

  updateProblem(uuid: number, updates: Partial<MockProblem>): MockProblem | null {
    const problems = this.getProblems();
    const index = problems.findIndex((p) => p.uuid === uuid);
    if (index === -1) return null;

    problems[index] = { ...problems[index], ...updates, updatedAt: new Date().toISOString() };
    mockStorage.set('problems', problems);
    return problems[index];
  }

  // Teams
  getTeams(): MockTeam[] {
    return mockStorage.get<MockTeam[]>('teams') || [];
  }

  getTeam(uuid: number): MockTeam | undefined {
    return this.getTeams().find((t) => t.uuid === uuid);
  }

  addTeam(team: MockTeam): void {
    const teams = this.getTeams();
    teams.push(team);
    mockStorage.set('teams', teams);
  }

  updateTeam(uuid: number, updates: Partial<MockTeam>): MockTeam | null {
    const teams = this.getTeams();
    const index = teams.findIndex((t) => t.uuid === uuid);
    if (index === -1) return null;

    teams[index] = { ...teams[index], ...updates, updatedAt: new Date().toISOString() };
    mockStorage.set('teams', teams);
    return teams[index];
  }

  deleteTeam(uuid: number): boolean {
    const teams = this.getTeams();
    const filtered = teams.filter((t) => t.uuid !== uuid);
    if (filtered.length === teams.length) return false;

    mockStorage.set('teams', filtered);
    return true;
  }

  // Team Members
  getTeamMembers(teamUuid?: number): MockTeamMember[] {
    const all = mockStorage.get<MockTeamMember[]>('teamMembers') || [];
    return teamUuid ? all.filter((m) => m.teamUuid === teamUuid) : all;
  }

  addTeamMember(member: MockTeamMember): void {
    const members = this.getTeamMembers();
    members.push(member);
    mockStorage.set('teamMembers', members);

    // 팀의 memberUuids 업데이트
    const team = this.getTeam(member.teamUuid);
    if (team && !team.memberUuids.includes(member.userUuid)) {
      team.memberUuids.push(member.userUuid);
      this.updateTeam(team.uuid, { memberUuids: team.memberUuids });
    }
  }

  removeTeamMember(teamUuid: number, userUuid: number): boolean {
    const members = this.getTeamMembers();
    const filtered = members.filter((m) => !(m.teamUuid === teamUuid && m.userUuid === userUuid));
    if (filtered.length === members.length) return false;

    mockStorage.set('teamMembers', filtered);

    // 팀의 memberUuids 업데이트
    const team = this.getTeam(teamUuid);
    if (team) {
      team.memberUuids = team.memberUuids.filter((id) => id !== userUuid);
      this.updateTeam(team.uuid, { memberUuids: team.memberUuids });
    }

    return true;
  }

  // Team Applies
  getTeamApplies(teamUuid?: number): MockTeamApply[] {
    const all = mockStorage.get<MockTeamApply[]>('teamApplies') || [];
    return teamUuid ? all.filter((a) => a.teamUuid === teamUuid) : all;
  }

  getTeamApply(uuid: number): MockTeamApply | undefined {
    return this.getTeamApplies().find((a) => a.uuid === uuid);
  }

  addTeamApply(apply: MockTeamApply): void {
    const applies = this.getTeamApplies();
    applies.push(apply);
    mockStorage.set('teamApplies', applies);
  }

  updateTeamApply(uuid: number, updates: Partial<MockTeamApply>): MockTeamApply | null {
    const applies = this.getTeamApplies();
    const index = applies.findIndex((a) => a.uuid === uuid);
    if (index === -1) return null;

    applies[index] = { ...applies[index], ...updates };
    mockStorage.set('teamApplies', applies);
    return applies[index];
  }

  deleteTeamApply(uuid: number): boolean {
    const applies = this.getTeamApplies();
    const filtered = applies.filter((a) => a.uuid !== uuid);
    if (filtered.length === applies.length) return false;

    mockStorage.set('teamApplies', filtered);
    return true;
  }

  // Team Directories
  getTeamDirectories(teamId?: number): MockTeamDirectory[] {
    const all = mockStorage.get<MockTeamDirectory[]>('teamDirectories') || [];
    return teamId ? all.filter((d) => d.teamId === teamId) : all;
  }

  getTeamDirectory(uuid: number): MockTeamDirectory | undefined {
    return this.getTeamDirectories().find((d) => d.uuid === uuid);
  }

  addTeamDirectory(directory: MockTeamDirectory): void {
    const directories = this.getTeamDirectories();
    directories.push(directory);
    mockStorage.set('teamDirectories', directories);
  }

  updateTeamDirectory(uuid: number, updates: Partial<MockTeamDirectory>): MockTeamDirectory | null {
    const directories = this.getTeamDirectories();
    const index = directories.findIndex((d) => d.uuid === uuid);
    if (index === -1) return null;

    directories[index] = {
      ...directories[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    mockStorage.set('teamDirectories', directories);
    return directories[index];
  }

  deleteTeamDirectory(uuid: number): boolean {
    const directories = this.getTeamDirectories();
    const filtered = directories.filter((d) => d.uuid !== uuid);
    if (filtered.length === directories.length) return false;

    mockStorage.set('teamDirectories', filtered);
    return true;
  }

  // Team Roadmaps
  getTeamRoadmaps(teamId?: number): MockTeamRoadmap[] {
    const all = mockStorage.get<MockTeamRoadmap[]>('teamRoadmaps') || [];
    return teamId ? all.filter((r) => r.teamId === teamId) : all;
  }

  getTeamRoadmap(uuid: number): MockTeamRoadmap | undefined {
    return this.getTeamRoadmaps().find((r) => r.uuid === uuid);
  }

  addTeamRoadmap(roadmap: MockTeamRoadmap): void {
    const roadmaps = this.getTeamRoadmaps();
    roadmaps.push(roadmap);
    mockStorage.set('teamRoadmaps', roadmaps);
  }

  updateTeamRoadmap(uuid: number, updates: Partial<MockTeamRoadmap>): MockTeamRoadmap | null {
    const roadmaps = this.getTeamRoadmaps();
    const index = roadmaps.findIndex((r) => r.uuid === uuid);
    if (index === -1) return null;

    roadmaps[index] = {
      ...roadmaps[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    mockStorage.set('teamRoadmaps', roadmaps);
    return roadmaps[index];
  }

  deleteTeamRoadmap(uuid: number): boolean {
    const roadmaps = this.getTeamRoadmaps();
    const filtered = roadmaps.filter((r) => r.uuid !== uuid);
    if (filtered.length === roadmaps.length) return false;

    mockStorage.set('teamRoadmaps', filtered);
    return true;
  }

  // Schools
  getSchools(): MockSchool[] {
    return mockStorage.get<MockSchool[]>('schools') || [];
  }

  getSchool(uuid: number): MockSchool | undefined {
    return this.getSchools().find((s) => s.uuid === uuid);
  }

  // Education Nodes
  getEducationNodes(schoolUuid?: number): MockEducationNode[] {
    const all = mockStorage.get<MockEducationNode[]>('educationNodes') || [];
    return schoolUuid ? all.filter((n) => n.schoolUuid === schoolUuid) : all;
  }

  getEducationNode(uuid: number): MockEducationNode | undefined {
    return this.getEducationNodes().find((n) => n.uuid === uuid);
  }
}

export const mockDatabase = MockDatabase.getInstance();
