create table users (
  id bigserial primary key,
  email varchar(128) not null unique,
  password_hash varchar(256) not null,
  role varchar(16) not null
);

create table categories (
  id bigserial primary key,
  name varchar(64) not null unique,
  slug varchar(64) not null unique
);

create table apps (
  id bigserial primary key,
  name varchar(128) not null,
  description varchar(2048) not null,
  icon_url varchar(512),
  developer_name varchar(128) not null,
  installs_count bigint not null default 0,
  rating_avg double precision not null default 0,
  rating_count bigint not null default 0,
  created_at timestamptz not null default now()
);

create table app_categories (
  app_id bigint not null references apps(id) on delete cascade,
  category_id bigint not null references categories(id) on delete cascade,
  primary key (app_id, category_id)
);

create table reviews (
  id bigserial primary key,
  app_id bigint not null references apps(id) on delete cascade,
  user_id bigint not null references users(id) on delete cascade,
  rating int not null,
  comment varchar(1024),
  created_at timestamptz not null default now(),
  unique (app_id, user_id)
);

create index idx_apps_name on apps (name);
create index idx_apps_created_at on apps (created_at);
create index idx_categories_slug on categories (slug);
create index idx_app_categories_category_id on app_categories (category_id);
create index idx_reviews_app_id on reviews (app_id);
