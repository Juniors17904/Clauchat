-- Proyectos
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Chats dentro de proyectos
create table if not exists chats (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  title text not null default 'Nueva conversación',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Mensajes de cada chat
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- Índices
create index if not exists chats_project_id_idx on chats(project_id);
create index if not exists messages_chat_id_idx on messages(chat_id);

-- Acceso público (sin auth)
alter table projects enable row level security;
alter table chats enable row level security;
alter table messages enable row level security;

create policy "public_all_projects" on projects for all using (true) with check (true);
create policy "public_all_chats" on chats for all using (true) with check (true);
create policy "public_all_messages" on messages for all using (true) with check (true);
