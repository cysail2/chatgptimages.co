'use client';

import React from 'react';
import { ComponentNode } from '../../types/webpage';
import { ComponentRegistry } from './registry';

export interface PageRendererProps {
  node: ComponentNode;
  selectedNodeId?: string | null;
  /** 
   * Custom React components to inject into the page structure.
   * Keys match the `id` of nodes with type="slot".
   */
  slots?: Record<string, React.ReactNode>;
}

export const PageRenderer: React.FC<PageRendererProps> = ({ node, selectedNodeId, slots }) => {
  // If this node is a slot, render the injected component
  if (node.type === 'slot') {
    const slot = slots?.[node.id];
    if (slot) {
      if (React.isValidElement(slot)) {
        // Merge node into the slot's props so it can access its data
        return React.cloneElement(slot as React.ReactElement, { node } as any);
      }
      return <>{slot}</>;
    }
    return null; // Slot requested but not provided
  }

  const Component = ComponentRegistry[node.type];

  if (!Component) {
    console.warn(`Unknown component type: ${node.type}`);
    return null;
  }

  // 递归渲染子节点函数
  const renderChildren = (children?: ComponentNode['children']) => {
    if (!children) return null;

    let childNodes: ComponentNode[] = [];

    if (Array.isArray(children)) {
      childNodes = children;
    } else if (typeof children === 'object') {
      // Convert map to array, using keys as IDs
      childNodes = Object.entries(children).map(([key, node]) => ({
        ...node,
        id: node.id || key, // Use key as ID if ID is missing
      } as ComponentNode));
    }

    if (childNodes.length === 0) return null;

    return childNodes.map((child) => (
      <PageRenderer
        key={child.id}
        node={child}
        selectedNodeId={selectedNodeId}
        slots={slots} // Pass slots down recursively
      />
    ));
  };

  // Determine effective props by merging explicit props and root-level properties
  const { id, type, children, template, props: explicitProps, ...rootProps } = node;
  const mergedProps = { ...(explicitProps || {}), ...rootProps };

  // Create a new node object with merged props for the component to consume
  const componentNode: ComponentNode = {
    ...node,
    props: mergedProps
  };

  return <Component node={componentNode} renderChildren={renderChildren} selectedNodeId={selectedNodeId} />;
};
