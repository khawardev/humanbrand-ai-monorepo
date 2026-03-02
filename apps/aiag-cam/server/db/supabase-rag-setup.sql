-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your documents
create table if not exists chunks (
  id uuid primary key default gen_random_uuid(),
  content text,
  url text,
  date_updated timestamp default now(),
  vector vector(1536) -- 1536 is the dimension for text-embedding-3-small
);

-- Create a function to search for documents
create or replace function get_relevant_chunks(
  query_vector vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  url text,
  date_updated timestamp,
  similarity float
)
language sql stable
as $$
  select
    chunks.id,
    chunks.content,
    chunks.url,
    chunks.date_updated,
    1 - (chunks.vector <=> query_vector) as similarity
  from chunks
  where 1 - (chunks.vector <=> query_vector) > match_threshold
  order by similarity desc
  limit match_count;
$$;
