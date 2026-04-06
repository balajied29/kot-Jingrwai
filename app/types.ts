export interface Verse {
  number: number | null;
  lines: string[];
  chorus?: string[];
}

export interface Hymn {
  number: number;
  old_number: number | null;
  tune: string | null;
  section_heading: string | null;
  sub_section: string | null;
  sub_title: string | null;
  verses: Verse[];
  author: string | null;
  type: 'hymn' | 'khorus';
  category: string | null;
  reference: string | null;
  kyrteng_shuwa: string | null;
  db_name: string | null;
}

export interface HymnsData {
  meta: {
    total_hymns: number;
    total_khorus: number;
    encoding_normalized: string;
    source: string;
  };
  hymns: Hymn[];
  khorus: Hymn[];
  creed: {
    type: string;
    title: string | null;
    items: { label: string | null; text: string }[];
    marquee: string[];
  };
  commandment: {
    type: string;
    title: string | null;
    items: { label: string | null; text: string }[];
    marquee: string[];
  };
}

export interface HymnIndexEntry {
  n: number;
  on?: number;
  t: string;
  fl: string;
  cat: string;
  sec: string;
}

export interface KhorusIndexEntry {
  n: number;
  sec: string;
  fl: string;
}

export interface HymnIndex {
  hymns: HymnIndexEntry[];
  khorus: KhorusIndexEntry[];
}
