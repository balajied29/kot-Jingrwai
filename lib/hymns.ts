import { readFile } from 'fs/promises';
import path from 'path';
import type { Hymn, HymnsData } from '@/app/types';

let _cache: HymnsData | null = null;

async function getData(): Promise<HymnsData> {
  if (_cache) return _cache;
  const filePath = path.join(process.cwd(), 'data', 'hymns.json');
  const raw = await readFile(filePath, 'utf-8');
  _cache = JSON.parse(raw) as HymnsData;
  return _cache;
}

export async function getAllHymns(): Promise<Hymn[]> {
  const data = await getData();
  return data.hymns;
}

export async function getHymn(number: number): Promise<Hymn | undefined> {
  const data = await getData();
  return data.hymns.find(h => h.number === number);
}

export async function getAllKhorus(): Promise<Hymn[]> {
  const data = await getData();
  return data.khorus;
}

export async function getKhorus(number: number): Promise<Hymn | undefined> {
  const data = await getData();
  return data.khorus.find(k => k.number === number);
}

export async function getCreed() {
  const data = await getData();
  return data.creed;
}

export async function getCommandment() {
  const data = await getData();
  return data.commandment;
}

/** Unique categories sorted by frequency */
export async function getCategories(): Promise<{ name: string; count: number }[]> {
  const hymns = await getAllHymns();
  const map = new Map<string, number>();
  for (const h of hymns) {
    const cat = h.category || 'Other';
    map.set(cat, (map.get(cat) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
