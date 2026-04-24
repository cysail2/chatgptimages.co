import { notFound } from 'next/navigation';
import { PageSchema } from '@/types/webpage';
import { getFrontendPageData } from '../services/frontend-data.server';

// 服务端直接读取前端数据目录获取页面数据
export async function getPageDataServer(pageId: string): Promise<PageSchema | null> {
  try {
    const pageData = await getFrontendPageData(pageId);
    return pageData as PageSchema | null;
  } catch (error) {
    console.error('Error reading page data (server):', error);
    return null;
  }
}

/**
 * 获取页面数据，如果不存在则直接触发 404
 */
export async function getRequiredPageData(pageId: string): Promise<PageSchema> {
  const data = await getPageDataServer(pageId);
  if (!data) notFound();
  return data;
}
