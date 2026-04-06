export interface Type {
  id: number;
  category: 'release' | 'sample' | 'source';
  type: string;
  text: string;
}

export interface Release {
  id: number;
  title: string;
  artist: string | null;
  year: number | null;
  type_id: number | null;
  type_text: string | null;
  notes: string | null;
  track_count?: number;
  sample_count?: number;
  tracks?: Track[];
}

export interface Track {
  id: number;
  title: string;
  release_id: number | null;
  release_title: string | null;
  artist: string | null;
  notes: string | null;
  sample_count?: number;
  samples?: Sample[];
}

export interface Source {
  id: number;
  title: string;
  producer: string | null;
  year: number | null;
  type_id: number | null;
  type_text: string | null;
  notes: string | null;
  sample_count?: number;
  samples?: Sample[];
}

export interface Sample {
  id: number;
  name: string;
  source_id: number | null;
  source_title: string | null;
  producer: string | null;
  type_id: number | null;
  type_text: string | null;
  notes: string | null;
  tracks?: Track[];
}
