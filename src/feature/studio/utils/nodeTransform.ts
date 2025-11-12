import type { StudioEdge, StudioNode, StudioNodeData } from '../types/node';

/**
 * Transform backend node data to React Flow node format
 */
export function transformToReactFlowNode(nodeData: StudioNodeData): StudioNode {
  return {
    id: `node-${nodeData.id}`,
    type: 'studio',
    position: {
      x: nodeData.x,
      y: nodeData.y,
    },
    data: nodeData,
  };
}

/**
 * Transform multiple backend nodes to React Flow nodes
 */
export function transformToReactFlowNodes(nodesData: StudioNodeData[]): StudioNode[] {
  return nodesData.map(transformToReactFlowNode);
}

/**
 * Build edges from node parent-child relationships
 */
export function buildEdgesFromNodes(nodesData: StudioNodeData[]): StudioEdge[] {
  const edges: StudioEdge[] = [];

  for (const node of nodesData) {
    if (node.parentNodeId) {
      edges.push({
        id: `edge-${node.parentNodeId}-${node.id}`,
        source: `node-${node.parentNodeId}`,
        target: `node-${node.id}`,
        type: 'smoothstep',
      });
    }

    // Also add edges for child nodes
    if (node.childNode && node.childNode.length > 0) {
      for (const child of node.childNode) {
        edges.push({
          id: `edge-${node.id}-${child.id}`,
          source: `node-${node.id}`,
          target: `node-${child.id}`,
          type: 'smoothstep',
        });
      }
    }
  }

  // Remove duplicates
  const uniqueEdges = edges.filter(
    (edge, index, self) => index === self.findIndex((e) => e.id === edge.id),
  );

  return uniqueEdges;
}

/**
 * Extract node ID from React Flow node ID (removes "node-" prefix)
 */
export function extractNodeId(reactFlowNodeId: string): number {
  const match = reactFlowNodeId.match(/^node-(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

/**
 * Transform React Flow node back to backend format
 */
export function transformToBackendNode(node: StudioNode): StudioNodeData {
  return {
    ...node.data,
    x: node.position.x,
    y: node.position.y,
  };
}

/**
 * Calculate optimal position for a new node
 */
export function calculateNewNodePosition(
  existingNodes: StudioNode[],
  parentNode?: StudioNode,
): { x: number; y: number } {
  if (parentNode) {
    // Place below parent node
    return {
      x: parentNode.position.x,
      y: parentNode.position.y + 200,
    };
  }

  if (existingNodes.length === 0) {
    // First node - center position
    return { x: 250, y: 100 };
  }

  // Find the rightmost node and place to the right
  const rightmostNode = existingNodes.reduce(
    (max, node) => (node.position.x > max.position.x ? node : max),
    existingNodes[0],
  );

  return {
    x: rightmostNode.position.x + 300,
    y: rightmostNode.position.y,
  };
}
