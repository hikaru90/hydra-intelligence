import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$lib/pocketbase';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const page = url.searchParams.get('page') || '';
    const pageNum = parseInt(url.searchParams.get('pageNum') || '1');
    const pageSize = 5; // Set this to your desired page size
    
    const collection = 'comments';
    
    // PocketBase uses 0-based indexing, so subtract 1 from pageNum
    const pbPage = pageNum - 1;
    
    console.log('Backend - pageNum:', pageNum, 'pbPage:', pbPage, 'pageSize:', pageSize);
    console.log('Backend - filter:', `page="${page}"`);
    
    // Use PocketBase pagination correctly
    const records = await pb.collection(collection).getList(pageNum, pageSize, {
      sort: '-created'
      // filter: `page="${page}"` // Temporarily disabled to test pagination
    });
    
    console.log('Backend - records returned:', records.items.length);
    
    return json(records, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return json({ error: 'Failed to fetch comments' }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { username, message, page } = await request.json();
    
    if (!username || !message || !page) {
      return json({ error: 'Missing required fields' }, { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }
    
    const collection = 'comments';
    const record = await pb.collection(collection).create({
      username,
      message,
      page
    });
    
    return json(record, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return json({ error: 'Failed to create comment' }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
};

export const OPTIONS: RequestHandler = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}; 