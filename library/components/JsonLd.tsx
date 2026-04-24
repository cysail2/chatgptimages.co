import React from 'react';

interface JsonLdProps {
    data: any;
}

/**
 * 优雅地注入 JSON-LD 结构化数据
 */
export function JsonLd({ data }: JsonLdProps) {
    if (!data) return null;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
