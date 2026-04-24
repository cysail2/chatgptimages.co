
import React from 'react';
import { ComponentProps } from '../registry';
import { useDataSource } from '@/library/page-builder/DataSourceContext';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export const MarkdownBlock: React.FC<ComponentProps> = ({ node }) => {
    const { content, className, dataSource } = node.props || {};
    const dataSources = useDataSource();

    let markdownContent = content;

    // Data Binding Logic
    if (dataSource && dataSource.type === 'model' && dataSource.modelId && dataSource.recordId) {
        const modelData = dataSources[dataSource.modelId];
        if (modelData && Array.isArray(modelData)) {
            const record = modelData.find((item: any) => item.id === dataSource.recordId);
            if (record && record.content) {
                markdownContent = record.content;
            }
        }
    }

    if (!markdownContent) return null;

    return (
        <MarkdownRenderer
            content={markdownContent}
            className={className}
            featuredStyles={true}
        />
    );
};
