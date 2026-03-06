-- Test user (regular user)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'user@test.com',
  crypt('password123', gen_salt('bf')),
  now(), now(), now()
);

-- Test admin user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'admin@test.com',
  crypt('password123', gen_salt('bf')),
  now(), now(), now()
);

-- Set admin role (trigger already created the profile rows)
UPDATE public.profiles SET role = 'admin' 
WHERE email = 'admin@test.com';