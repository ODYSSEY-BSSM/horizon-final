'use client';

import { Download, Plus, Save, Upload } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useStudioStore } from '../../stores/studioStore';
import type { NodeColor, StudioNode, StudioNodeType } from '../../types/node';

interface StudioToolbarProps {
  onSave?: () => void;
  isSaving?: boolean;
}

export const StudioToolbar: React.FC<StudioToolbarProps> = ({ onSave, isSaving = false }) => {
  const { nodes, addNode } = useStudioStore();
  const [_showAddMenu, setShowAddMenu] = useState(false);

  const handleAddNode = () => {
    // Create a new node at a position offset from existing nodes
    const newNode: StudioNode = {
      id: `node-${Date.now()}`,
      type: 'studio',
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      data: {
        id: 0, // Will be set by backend
        title: '새 노드',
        description: '',
        height: 150,
        width: 200,
        type: 'MIDDLE' as StudioNodeType,
        x: 0,
        y: 0,
        color: 'BLUE' as NodeColor,
        roadmapId: 0,
        parentNodeId: null,
        childNode: [],
        progress: 0,
        isEducation: false,
        subject: '',
      },
    };

    addNode(newNode);
    setShowAddMenu(false);
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
      {/* Node count badge */}
      <div className="bg-white px-3 py-2 rounded-lg shadow-md border border-gray-200">
        <span className="text-sm text-gray-600">
          노드: <span className="font-semibold text-gray-900">{nodes.length}</span>
        </span>
      </div>

      {/* Add node button */}
      <div className="relative">
        <button
          type="button"
          onClick={handleAddNode}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-colors"
          aria-label="노드 추가"
        >
          <Plus size={20} />
          <span className="font-medium">노드 추가</span>
        </button>
      </div>

      {/* Save button */}
      {onSave && (
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-colors"
          aria-label="저장"
        >
          <Save size={20} />
          <span className="font-medium">{isSaving ? '저장 중...' : '저장'}</span>
        </button>
      )}

      {/* Export button */}
      <button
        type="button"
        onClick={() => {
          // TODO: Implement export functionality
        }}
        className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg shadow-md border border-gray-200 transition-colors"
        aria-label="내보내기"
      >
        <Download size={20} />
      </button>

      {/* Import button */}
      <button
        type="button"
        onClick={() => {
          // TODO: Implement import functionality
        }}
        className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg shadow-md border border-gray-200 transition-colors"
        aria-label="가져오기"
      >
        <Upload size={20} />
      </button>
    </div>
  );
};
