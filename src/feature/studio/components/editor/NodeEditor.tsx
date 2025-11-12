'use client';

import { Trash2, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useId, useState } from 'react';
import { useStudioStore } from '../../stores/studioStore';
import type { NodeColor, StudioNodeType } from '../../types/node';
import { getProgressColor, NODE_COLORS } from '../../types/node';

export const NodeEditor: React.FC = () => {
  const { nodes, selectedNodeId, updateNode, deleteNode, setSelectedNodeId } = useStudioStore();

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  // Generate unique IDs for form fields
  const titleId = useId();
  const descriptionId = useId();
  const progressId = useId();
  const nodeTypeId = useId();
  const colorLabelId = useId();
  const subjectId = useId();
  const educationId = useId();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [nodeType, setNodeType] = useState<StudioNodeType>('MIDDLE');
  const [color, setColor] = useState<NodeColor>('BLUE');
  const [subject, setSubject] = useState('');
  const [isEducation, setIsEducation] = useState(false);

  // Update local state when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setTitle(selectedNode.data.title);
      setDescription(selectedNode.data.description);
      setProgress(selectedNode.data.progress);
      setNodeType(selectedNode.data.type);
      setColor(selectedNode.data.color);
      setSubject(selectedNode.data.subject);
      setIsEducation(selectedNode.data.isEducation);
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (!selectedNodeId || !selectedNode) {
      return;
    }

    updateNode(selectedNodeId, {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        title,
        description,
        progress,
        type: nodeType,
        color,
        subject,
        isEducation,
      },
    });
  };

  const handleDelete = () => {
    if (!selectedNodeId) {
      return;
    }
    if (confirm('이 노드를 삭제하시겠습니까?')) {
      deleteNode(selectedNodeId);
    }
  };

  if (!selectedNode) {
    return null;
  }

  const progressColor = getProgressColor(progress);

  return (
    <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-xl border-l border-gray-200 z-20 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">노드 편집</h2>
        <button
          type="button"
          onClick={() => setSelectedNodeId(null)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="편집기 닫기"
        >
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Title */}
        <div>
          <label htmlFor={titleId} className="block text-sm font-medium text-gray-700 mb-1">
            제목
          </label>
          <input
            id={titleId}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="노드 제목"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor={descriptionId} className="block text-sm font-medium text-gray-700 mb-1">
            설명
          </label>
          <textarea
            id={descriptionId}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleSave}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="노드 설명"
          />
        </div>

        {/* Progress */}
        <div>
          <label htmlFor={progressId} className="block text-sm font-medium text-gray-700 mb-1">
            진도율: <span style={{ color: progressColor, fontWeight: 600 }}>{progress}%</span>
          </label>
          <input
            id={progressId}
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            onMouseUp={handleSave}
            onTouchEnd={handleSave}
            className="w-full"
            style={{
              accentColor: progressColor,
            }}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label="진도율"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>33%</span>
            <span>66%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Node Type */}
        <div>
          <label htmlFor={nodeTypeId} className="block text-sm font-medium text-gray-700 mb-1">
            노드 타입
          </label>
          <select
            id={nodeTypeId}
            value={nodeType}
            onChange={(e) => {
              setNodeType(e.target.value as StudioNodeType);
              handleSave();
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="TOP">TOP (최상위)</option>
            <option value="MIDDLE">MIDDLE (중간)</option>
            <option value="BOTTOM">BOTTOM (최하위)</option>
          </select>
        </div>

        {/* Color */}
        <div>
          <span id={colorLabelId} className="block text-sm font-medium text-gray-700 mb-2">
            색상
          </span>
          <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby={colorLabelId}>
            {Object.entries(NODE_COLORS).map(([colorName, colorValue]) => (
              <button
                key={colorName}
                type="button"
                onClick={() => {
                  setColor(colorName as NodeColor);
                  handleSave();
                }}
                className={`h-10 rounded-lg border-2 transition-all ${
                  color === colorName ? 'border-gray-900 scale-105' : 'border-gray-300'
                }`}
                style={{ backgroundColor: colorValue }}
                aria-label={`${colorName} 색상 선택`}
                aria-pressed={color === colorName}
              />
            ))}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor={subjectId} className="block text-sm font-medium text-gray-700 mb-1">
            과목
          </label>
          <input
            id={subjectId}
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onBlur={handleSave}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="예: 수학, 과학, 영어"
          />
        </div>

        {/* Is Education */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id={educationId}
            checked={isEducation}
            onChange={(e) => {
              setIsEducation(e.target.checked);
              handleSave();
            }}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor={educationId} className="ml-2 text-sm font-medium text-gray-700">
            교육 콘텐츠
          </label>
        </div>

        {/* Delete Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleDelete}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 size={18} />
            <span>노드 삭제</span>
          </button>
        </div>
      </div>
    </div>
  );
};
