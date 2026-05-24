-- ============================================================================
-- Seed data for hand_and_hand demo  (expanded — ≥13 records per table)
-- ============================================================================
-- Усі демо-юзери мають пароль: Demo1234!
--
-- Логіни:
--   admin@demo.local             (ADMIN)
--   org-rescue@demo.local        (ORGANIZATION, верифікована)  edrpou: 12345678
--   org-eco@demo.local           (ORGANIZATION, верифікована)  edrpou: 87654321
--   org-veterans@demo.local      (ORGANIZATION, верифікована)  edrpou: 11223344
--   org-med@demo.local           (ORGANIZATION, верифікована)  edrpou: 22334455
--   org-edu@demo.local           (ORGANIZATION, верифікована)  edrpou: 33445566
--   org-sport@demo.local         (ORGANIZATION, верифікована)  edrpou: 44556677
--   org-social@demo.local        (ORGANIZATION, верифікована)  edrpou: 55667788
--   org-kids@demo.local          (ORGANIZATION, верифікована)  edrpou: 66778899
--   org-food@demo.local          (ORGANIZATION, верифікована)  edrpou: 77889900
--   org-rebuild@demo.local       (ORGANIZATION, верифікована)  edrpou: 88990011
--   org-culture@demo.local       (ORGANIZATION, верифікована)  edrpou: 99001122
--   org-homeless@demo.local      (ORGANIZATION, верифікована)  edrpou: 10111213
--   org-idp@demo.local           (ORGANIZATION, верифікована)  edrpou: 11121314
--   vol-anna@demo.local          (VOLUNTEER, верифікована)
--   vol-petro@demo.local         (VOLUNTEER, верифікований)
--   vol-sofia@demo.local         (VOLUNTEER, верифікована)
--   vol-mykola@demo.local        (VOLUNTEER, верифікований)
--   vol-oksana@demo.local        (VOLUNTEER, верифікована)
--   vol-ivan@demo.local          (VOLUNTEER, верифікований)
--   vol-daryna@demo.local        (VOLUNTEER, верифікована)
--   vol-roman@demo.local         (VOLUNTEER, верифікований)
--   vol-yulia@demo.local         (VOLUNTEER, верифікована)
--   vol-bohdan@demo.local        (VOLUNTEER, верифікований)
--   vol-nastya@demo.local        (VOLUNTEER, верифікована)
--   vol-andriy@demo.local        (VOLUNTEER, верифікований)
--   vol-olga@demo.local          (VOLUNTEER, верифікована)
--   user@demo.local              (APP_USER)
--   user2@demo.local             (APP_USER)
--   user3@demo.local             (APP_USER)
--   user4@demo.local             (APP_USER)
-- ============================================================================

BEGIN;

TRUNCATE TABLE
  notification_organization,
  donation,
  fundraising_category,
  fundraising_campaign,
  task_category,
  task_assignment,
  task,
  ticket_category,
  ticket,
  project_category,
  project_registration,
  project,
  report,
  news_category,
  news,
  notification,
  organization_category,
  organization_membership_request,
  organization_profile,
  volunteer_profile,
  admin_profile,
  approval_request,
  password_reset_token,
  email_verification_token,
  refresh_token,
  reward_redemption,
  reward,
  points_transaction,
  warnings,
  audit_log,
  category,
  location,
  app_user
RESTART IDENTITY CASCADE;

-- ============================================================================
-- 1. LOCATIONS (13 міст)
-- ============================================================================
INSERT INTO location (id, lat, lng, address, region, city) VALUES
  (1,  49.839683, 24.029717, 'вул. Соборна, 1',           'Львівська область',           'Львів'),
  (2,  50.450100, 30.523400, 'вул. Хрещатик, 22',         'Київська область',            'Київ'),
  (3,  49.553517, 25.594767, 'вул. Руська, 10',           'Тернопільська область',       'Тернопіль'),
  (4,  46.482526, 30.723310, 'вул. Дерибасівська, 5',     'Одеська область',             'Одеса'),
  (5,  48.922633, 24.711117, 'вул. Незалежності, 3',      'Івано-Франківська область',   'Івано-Франківськ'),
  (6,  49.993499, 36.230383, 'вул. Сумська, 15',          'Харківська область',          'Харків'),
  (7,  48.464717, 35.046183, 'просп. Яворницького, 3',    'Дніпропетровська область',    'Дніпро'),
  (8,  47.838800, 35.143550, 'вул. Соборна, 22',          'Запорізька область',          'Запоріжжя'),
  (9,  49.232650, 28.468217, 'вул. Соборна, 59',          'Вінницька область',           'Вінниця'),
  (10, 49.588783, 34.551417, 'вул. Конституції, 2',       'Полтавська область',          'Полтава'),
  (11, 49.420233, 26.996900, 'вул. Проскурівська, 18',    'Хмельницька область',         'Хмельницький'),
  (12, 49.444300, 32.060317, 'вул. Хрещатик, 200',        'Черкаська область',           'Черкаси'),
  (13, 50.254650, 28.658433, 'вул. Михайлівська, 7',      'Житомирська область',         'Житомир');

SELECT setval('location_id_seq', (SELECT MAX(id) FROM location));

-- ============================================================================
-- 2. CATEGORIES (19 тегів)
-- ============================================================================
INSERT INTO category (id, name, slug) VALUES
  (1,  'Освіта',                 'education'),
  (2,  'Медицина',               'medicine'),
  (3,  'Екологія',               'ecology'),
  (4,  'Соціальна допомога',     'social'),
  (5,  'Культура',               'culture'),
  (6,  'Спорт',                  'sport'),
  (7,  'Відбудова',              'reconstruction'),
  (8,  'Волонтерство',           'volunteering'),
  (9,  'Армія та оборона',       'military'),
  (10, 'Гуманітарна допомога',   'humanitarian'),
  (11, 'Діти',                   'children'),
  (12, 'Тварини',                'animals'),
  (13, 'Інфраструктура',         'infrastructure'),
  (14, 'Громадські організації', 'ngo'),
  (15, 'Благодійні фонди',       'charity'),
  (16, 'Міжнародні організації', 'international'),
  (17, 'Оголошення',             'announcements'),
  (18, 'Звіти',                  'reports'),
  (19, 'Оновлення',              'updates');

SELECT setval('category_id_seq', (SELECT MAX(id) FROM category));

-- ============================================================================
-- 3. APP_USER  (1 admin + 13 org + 13 vol + 4 regular = 31 юзерів)
-- Хеш — argon2id для "Demo1234!"
-- ============================================================================
INSERT INTO app_user (id, email, password_hash, role, status, points, first_name, last_name, city, avatar_url, organization_id) VALUES
  -- ADMIN
  (1,  'admin@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ADMIN', 'ACTIVE', 0, 'Адмін', 'Демо', 'Київ',
       'https://i.pravatar.cc/300?img=14', NULL),
  -- ORG OWNERS
  (2,  'org-rescue@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Олена', 'Кравчук', 'Львів',
       'https://i.pravatar.cc/300?img=31', NULL),
  (3,  'org-eco@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Ігор', 'Шевченко', 'Київ',
       'https://i.pravatar.cc/300?img=4', NULL),
  (7,  'org-veterans@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Трохим', 'Загуменний', 'Харків',
       'https://i.pravatar.cc/300?img=11', NULL),
  (8,  'org-med@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Параска', 'Вернидуб', 'Дніпро',
       'https://i.pravatar.cc/300?img=41', NULL),
  (9,  'org-edu@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Пилип', 'Заболотний', 'Одеса',
       'https://i.pravatar.cc/300?img=13', NULL),
  (10, 'org-sport@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Калина', 'Синиця', 'Запоріжжя',
       'https://i.pravatar.cc/300?img=24', NULL),
  (11, 'org-social@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Фотій', 'Поривай', 'Вінниця',
       'https://i.pravatar.cc/300?img=55', NULL),
  (12, 'org-kids@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Марфа', 'Лугова', 'Полтава',
       'https://i.pravatar.cc/300?img=43', NULL),
  (13, 'org-food@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Архип', 'Недоля', 'Хмельницький',
       'https://i.pravatar.cc/300?img=13', NULL),
  (14, 'org-rebuild@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Горпина', 'Крутько', 'Черкаси',
       'https://i.pravatar.cc/300?img=36', NULL),
  (15, 'org-culture@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Сильвестр', 'Гримайло', 'Житомир',
       'https://i.pravatar.cc/300?img=67', NULL),
  (16, 'org-homeless@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Явдоха', 'Криволап', 'Харків',
       'https://i.pravatar.cc/300?img=19', NULL),
  (17, 'org-idp@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Митрофан', 'Зіньківський', 'Одеса',
       'https://i.pravatar.cc/300?img=59', NULL),
  -- VOLUNTEERS
  (4,  'vol-anna@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'VOLUNTEER', 'ACTIVE', 120, 'Анна', 'Шимчук', 'Львів',
       'https://i.pravatar.cc/300?img=47', NULL),
  (5,  'vol-petro@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'VOLUNTEER', 'ACTIVE', 80, 'Петро', 'Іваненко', 'Київ',
       'https://i.pravatar.cc/300?img=12', NULL),
  (18, 'vol-sofia@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'VOLUNTEER', 'ACTIVE', 50, 'Лада', 'Купрій', 'Харків',
       'https://i.pravatar.cc/300?img=5', NULL),
  (19, 'vol-mykola@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'VOLUNTEER', 'ACTIVE', 110, 'Харитон', 'Скляр', 'Дніпро',
       'https://i.pravatar.cc/300?img=15', NULL),
  (20, 'vol-oksana@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'VOLUNTEER', 'ACTIVE', 30, 'Лариса', 'Самусь', 'Одеса',
       'https://i.pravatar.cc/300?img=25', NULL),
  (21, 'vol-ivan@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'VOLUNTEER', 'ACTIVE', 100, 'Данило', 'Хмара', 'Запоріжжя',
       'https://i.pravatar.cc/300?img=33', NULL),
  (22, 'vol-daryna@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'VOLUNTEER', 'ACTIVE', 70, 'Пелагія', 'Рябець', 'Вінниця',
       'https://i.pravatar.cc/300?img=44', NULL),
  (23, 'vol-roman@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'VOLUNTEER', 'ACTIVE', 30, 'Нестір', 'Вишиванюк', 'Полтава',
       'https://i.pravatar.cc/300?img=52', NULL),
  (24, 'vol-yulia@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'VOLUNTEER', 'ACTIVE', 220, 'Улита', 'Дрофань', 'Хмельницький',
       'https://i.pravatar.cc/300?img=49', NULL),
  (25, 'vol-bohdan@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'VOLUNTEER', 'ACTIVE', 160, 'Тимур', 'Ластовецький', 'Черкаси',
       'https://i.pravatar.cc/300?img=62', NULL),
  (26, 'vol-nastya@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'VOLUNTEER', 'ACTIVE', 40, 'Христина', 'Буряк', 'Житомир',
       'https://i.pravatar.cc/300?img=26', NULL),
  (27, 'vol-andriy@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'VOLUNTEER', 'ACTIVE', 110, 'Кирило', 'Недоступ', 'Харків',
       'https://i.pravatar.cc/300?img=66', NULL),
  (28, 'vol-olga@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'VOLUNTEER', 'ACTIVE', 45, 'Надія', 'Чечіль', 'Одеса',
       'https://i.pravatar.cc/300?img=28', NULL),
  -- REGULAR USERS
  (6,  'user@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'APP_USER', 'ACTIVE', 0, 'Марія', 'Бойко', 'Тернопіль',
       'https://i.pravatar.cc/300?img=20', NULL),
  (29, 'user2@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'APP_USER', 'ACTIVE', 0, 'Феодосій', 'Полтавець', 'Харків',
       'https://i.pravatar.cc/300?img=53', NULL),
  (30, 'user3@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'APP_USER', 'ACTIVE', 0, 'Ганна', 'Жайворон', 'Дніпро',
       'https://i.pravatar.cc/300?img=29', NULL),
  (31, 'user4@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'APP_USER', 'ACTIVE', 0, 'Гліб', 'Оберемок', 'Одеса',
       'https://i.pravatar.cc/300?img=57', NULL);

SELECT setval('app_user_id_seq', (SELECT MAX(id) FROM app_user));

-- ============================================================================
-- 4. ADMIN_PROFILE
-- ============================================================================
INSERT INTO admin_profile (id, user_id, full_name, is_super_admin) VALUES
  (1, 1, 'Адмін Демо', TRUE);

SELECT setval('admin_profile_id_seq', (SELECT MAX(id) FROM admin_profile));

-- ============================================================================
-- 5. VOLUNTEER_PROFILE (13 волонтерів)
-- ============================================================================
INSERT INTO volunteer_profile (id, user_id, display_name, phone, bio, skills_text, rating, is_verified, avatar_url, docs_url) VALUES
  (1,  4,  'AnnaHelper',    '+380671234567',
       'Займаюся волонтерством з весни 2022 року, коли довелося координувати розселення людей на львівському вокзалі. Зараз тримаю зв''язок із трьома великими шелтерами міста. Маю власне авто (мінівен), тому закриваю питання логістики та великих вантажів.',
       'Координація складів, водіння, логістика, комунікація в кризових ситуаціях', 4.80, TRUE,
       'https://i.pravatar.cc/300?img=47',
       'https://picsum.photos/seed/vol-doc-1/400/565'),
  (2,  5,  'PetroDoer',     '+380677654321',
       'Коджу на Angular і NestJS вдень, а вечорами допомагаю автоматизувати процеси для громадських ініціатив. Створив кілька чат-ботів для шелтерів тварин та допомагаю адаптувати сайти під збори. Якщо треба щось налаштувати, підняти сервер чи пофіксити UI — це до мене.',
       'Web-розробка, автоматизація, адміністрування баз даних, техпідтримка', 4.50, TRUE,
       'https://i.pravatar.cc/300?img=12',
       'https://picsum.photos/seed/vol-doc-2/400/565'),
  (3,  18, 'SofiaHelps',    '+380501112233',
       'Психолог-волонтер. Надаю підтримку людям у стресових ситуаціях.',
       'Психологія, тренінги, групова робота', 4.70, TRUE,
       'https://i.pravatar.cc/300?img=5',
       'https://picsum.photos/seed/vol-doc-3/400/565'),
  (4,  19, 'MykolaBuilder', '+380632223344',
       'Будівельник з 10 роками досвіду. Волонтерю у відновленні житла.',
       'Будівництво, ремонт, сантехніка', 4.60, TRUE,
       'https://i.pravatar.cc/300?img=15',
       'https://picsum.photos/seed/vol-doc-4/400/565'),
  (5,  20, 'OksanaMedic',   '+380683334455',
       'Медсестра. Надаю першу медичну допомогу на заходах та акціях.',
       'Медицина, перша допомога, фармація', 4.90, TRUE,
       'https://i.pravatar.cc/300?img=25',
       'https://picsum.photos/seed/vol-doc-5/400/565'),
  (6,  21, 'IvanLegal',     '+380964445566',
       'Юрист. Безкоштовно консультую переселенців з правових питань.',
       'Юриспруденція, документи, права ВПО', 4.75, TRUE,
       'https://i.pravatar.cc/300?img=33',
       'https://picsum.photos/seed/vol-doc-6/400/565'),
  (7,  22, 'DarynaTeacher', '+380975556677',
       'Вчителька англійської. Веду безкоштовні курси для дорослих.',
       'Освіта, іноземні мови, менторство', 4.85, TRUE,
       'https://i.pravatar.cc/300?img=44',
       'https://picsum.photos/seed/vol-doc-7/400/565'),
  (8,  23, 'RomanLogist',   '+380636667788',
       'Логіст. Координую доставку гуманітарної допомоги по регіонах.',
       'Логістика, водіння категорії C, складська справа', 4.40, TRUE,
       'https://i.pravatar.cc/300?img=52',
       'https://picsum.photos/seed/vol-doc-8/400/565'),
  (9,  24, 'YuliaPhoto',    '+380507778899',
       'Фотограф і дизайнер. Документую волонтерські акції, роблю сайти НГО.',
       'Фотографія, графічний дизайн, SMM', 4.65, TRUE,
       'https://i.pravatar.cc/300?img=49',
       'https://picsum.photos/seed/vol-doc-9/400/565'),
  (10, 25, 'BohdanIT',      '+380668889900',
       'Full-stack розробник. Роблю сайти та ботів для благодійних організацій.',
       'IT, веб-розробка, автоматизація', 4.80, TRUE,
       'https://i.pravatar.cc/300?img=62',
       'https://picsum.photos/seed/vol-doc-10/400/565'),
  (11, 26, 'NastyaCoach',   '+380959990011',
       'Коуч і мотиваційний спікер. Проводжу тренінги для волонтерів.',
       'Коучинг, мотивація, командна робота', 4.55, TRUE,
       'https://i.pravatar.cc/300?img=26',
       'https://picsum.photos/seed/vol-doc-11/400/565'),
  (12, 27, 'AndriyDriver',  '+380730001122',
       'Водій-волонтер. Евакуація людей, перевезення гумдопомоги.',
       'Водіння B/C/D, евакуація, логістика', 4.70, TRUE,
       'https://i.pravatar.cc/300?img=66',
       'https://picsum.photos/seed/vol-doc-12/400/565'),
  (13, 28, 'OlgaTranslate', '+380661112233',
       'Перекладач (англ/нім/укр). Перекладаю документи для НГО та ВПО.',
       'Переклад, копірайтинг, редактура', 4.60, TRUE,
       'https://i.pravatar.cc/300?img=28',
       'https://picsum.photos/seed/vol-doc-13/400/565');

SELECT setval('volunteer_profile_id_seq', (SELECT MAX(id) FROM volunteer_profile));

-- ============================================================================
-- 6. ORGANIZATION_PROFILE (13 організацій)
-- ============================================================================
INSERT INTO organization_profile (id, user_id, name, edrpou, description, verification_status, official_docs_url, contact_phone, contact_email, city, logo_url, location_id, mission) VALUES
  (1,  2,  'Rescue Львів',       '12345678',
       'Офіційне об''єднання волонтерів-зоозахисників. Ми займаємося порятунком покинутих тварин із зони бойових дій, їхньою реабілітацією у нашому тимчасовому центрі у Львові та пошуком нових любячих родин. Маємо свою команду ветеринарів та кінологів.',
       'VERIFIED', 'https://picsum.photos/seed/org-doc-1/400/565',
       '+380322001122', 'contact@rescue.lviv.ua', 'Львів',
       'https://ui-avatars.com/api/?name=RL&background=e03131&color=fff&size=200&bold=true', 1,
       'Створення безпечного міського середовища та захист прав безпритульних тварин.'),
  (2,  3,  'EcoKyiv',            '87654321',
       'Громадська організація, що координує екологічні ініціативи у столиці. Ми проводимо масштабні суботники, сортувальні лекторії в школах, боремося зі стихійними звалищами та намагаємося ревіталізувати малі річки Києва, такі як Либідь та Почайна.',
       'VERIFIED', 'https://picsum.photos/seed/org-doc-2/400/565',
       '+380442002233', 'hello@ecokyiv.org.ua', 'Київ',
       'https://ui-avatars.com/api/?name=EK&background=2f9e44&color=fff&size=200&bold=true', 2,
       'Збереження екологічного балансу столиці та розвиток культури свідомого споживання.'),
  (3,  7,  'ВетеранUA',          '11223344',
       'Допомагаємо ветеранам та їхнім сім''ям адаптуватись до мирного життя.',
       'VERIFIED', 'https://picsum.photos/seed/org-doc-3/400/565',
       '+380572003344', 'info@veteranua.org.ua', 'Харків',
       'https://ui-avatars.com/api/?name=VA&background=4263eb&color=fff&size=200&bold=true', 6,
       'Ветеран — це герой. Наше завдання — дати йому майбутнє.'),
  (4,  8,  'МедДопомога',        '22334455',
       'Безкоштовна медична допомога для переселенців та малозабезпечених.',
       'VERIFIED', 'https://picsum.photos/seed/org-doc-4/400/565',
       '+380562004455', 'med@meddopomoga.org.ua', 'Дніпро',
       'https://ui-avatars.com/api/?name=MD&background=c92a2a&color=fff&size=200&bold=true', 7,
       'Здоров''я — право кожного, незалежно від статусу.'),
  (5,  9,  'ОсвітаПлюс',         '33445566',
       'Безкоштовні курси, тренінги та освітні програми для дорослих і дітей.',
       'VERIFIED', 'https://picsum.photos/seed/org-doc-5/400/565',
       '+380482005566', 'osvita@osvitaplus.org.ua', 'Одеса',
       'https://ui-avatars.com/api/?name=OP&background=1971c2&color=fff&size=200&bold=true', 4,
       'Знання змінюють світ.'),
  (6,  10, 'СпортДух',           '44556677',
       'Спортивні секції та реабілітація для дітей і молоді через спорт.',
       'VERIFIED', 'https://picsum.photos/seed/org-doc-6/400/565',
       '+380612006677', 'sport@sportdukh.org.ua', 'Запоріжжя',
       'https://ui-avatars.com/api/?name=SD&background=e67700&color=fff&size=200&bold=true', 8,
       'Спорт як шлях до єдності та відновлення.'),
  (7,  11, 'Рука Допомоги',      '55667788',
       'Розподіл гуманітарної допомоги, продуктових і гігієнічних наборів.',
       'VERIFIED', 'https://picsum.photos/seed/org-doc-7/400/565',
       '+380432007788', 'help@rukadop.org.ua', 'Вінниця',
       'https://ui-avatars.com/api/?name=RD&background=862e9c&color=fff&size=200&bold=true', 9,
       'Простягаємо руку тим, хто цього потребує.'),
  (8,  12, 'Дитяча Радість',     '66778899',
       'Організовуємо свята, майстер-класи та розвивальні програми для дітей ВПО.',
       'VERIFIED', 'https://picsum.photos/seed/org-doc-8/400/565',
       '+380532008899', 'joy@dytradist.org.ua', 'Полтава',
       'https://ui-avatars.com/api/?name=DR&background=d6336c&color=fff&size=200&bold=true', 10,
       'Дитяча усмішка — наша найкраща нагорода.'),
  (9,  13, 'Їжа та Турбота',     '77889900',
       'Гаряче харчування та продуктові набори для літніх людей і безхатніх.',
       'VERIFIED', 'https://picsum.photos/seed/org-doc-9/400/565',
       '+380382009900', 'food@izha.org.ua', 'Хмельницький',
       'https://ui-avatars.com/api/?name=IT&background=e67700&color=fff&size=200&bold=true', 11,
       'Ніхто не має лягати спати голодним.'),
  (10, 14, 'Відбудова Разом',    '88990011',
       'Відновлення та ремонт житла для ВПО і постраждалих родин.',
       'VERIFIED', 'https://picsum.photos/seed/org-doc-10/400/565',
       '+380472000011', 'rebuild@vidbud.org.ua', 'Черкаси',
       'https://ui-avatars.com/api/?name=VR&background=0c8599&color=fff&size=200&bold=true', 12,
       'Відновлюємо домівки — відновлюємо надію.'),
  (11, 15, 'Культурна ДНК',      '99001122',
       'Збереження та популяризація традиційної культури, музики і мистецтва.',
       'VERIFIED', 'https://picsum.photos/seed/org-doc-11/400/565',
       '+380412001122', 'dna@kultdna.org.ua', 'Житомир',
       'https://ui-avatars.com/api/?name=KD&background=5c7cfa&color=fff&size=200&bold=true', 13,
       'Культура — це пам''ять народу.'),
  (12, 16, 'Дах і Тепло',        '10111213',
       'Підтримка бездомних: нічліжка, одяг, їжа, соціальний супровід.',
       'VERIFIED', 'https://picsum.photos/seed/org-doc-12/400/565',
       '+380572002233', 'dakh@dakhteplo.org.ua', 'Харків',
       'https://ui-avatars.com/api/?name=DT&background=364fc7&color=fff&size=200&bold=true', 6,
       'Кожна людина заслуговує на дах над головою.'),
  (13, 17, 'Переселенці Разом',  '11121314',
       'Юридична допомога, соціальна підтримка та інтеграція ВПО.',
       'VERIFIED', 'https://picsum.photos/seed/org-doc-13/400/565',
       '+380482003344', 'idp@pereselentsi.org.ua', 'Одеса',
       'https://ui-avatars.com/api/?name=PR&background=087f5b&color=fff&size=200&bold=true', 4,
       'Разом знайдемо шлях додому.');

SELECT setval('organization_profile_id_seq', (SELECT MAX(id) FROM organization_profile));

-- Прив'язати членів організацій
UPDATE app_user SET organization_id = 2  WHERE id = 5;   -- Петро → EcoKyiv
UPDATE app_user SET organization_id = 10 WHERE id = 21;  -- Іван → Відбудова Разом

-- ============================================================================
-- 7. ORGANIZATION_CATEGORY (теги для організацій)
-- ============================================================================
INSERT INTO organization_category (organization_id, category_id) VALUES
  (1,  12), (1,   4),  -- Rescue Львів → Тварини, Соціальна допомога
  (2,   3), (2,   1),  -- EcoKyiv → Екологія, Освіта
  (3,   9), (3,   4),  -- ВетеранUA → Армія та оборона, Соціальна допомога
  (4,   2), (4,  10),  -- МедДопомога → Медицина, Гуманітарна допомога
  (5,   1), (5,  11),  -- ОсвітаПлюс → Освіта, Діти
  (6,   6), (6,  11),  -- СпортДух → Спорт, Діти
  (7,   4), (7,  10),  -- Рука Допомоги → Соціальна допомога, Гуманітарна допомога
  (8,  11), (8,  10),  -- Дитяча Радість → Діти, Гуманітарна допомога
  (9,   4), (9,  10),  -- Їжа та Турбота → Соціальна допомога, Гуманітарна допомога
  (10,  7), (10,  4),  -- Відбудова Разом → Відбудова, Соціальна допомога
  (11,  5), (11,  1),  -- Культурна ДНК → Культура, Освіта
  (12,  4),            -- Дах і Тепло → Соціальна допомога
  (13, 10), (13,  4);  -- Переселенці Разом → Гуманітарна допомога, Соціальна допомога

-- ============================================================================
-- 8. PROJECT (15 подій)
-- ============================================================================
INSERT INTO project (id, organization_profile_id, title, description, status, starts_at, ends_at, main_content, what_volunteers_will_do, why_its_important, time, application_deadline, location_id, category_id, partners, image_url, participants) VALUES
  (1, 1, 'Суботня прогулка з хвостиками з ЛКП «Лев»',
      'Збираємо команду небайдужих, щоб подарувати трохи радості собакам, які тижнями сидять у вольєрах.',
      'ACTIVE', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days 2 hours',
      'Привіт усім любителям тварин! Наш притулок зараз переповнений, працівники фізично не встигають приділити час кожному песику. Собаки через це дичавіють, сумують та перебувають у постійному стресі. Ми шукаємо 15 людей, які готові приїхати в суботу вранці, взяти пухнастика на повідець і просто погуляти з ним дві години по парку поруч. Це критично важливо для їхньої соціалізації, щоб вони не боялися людей і швидше знайшли нову домівку. Ми видаємо повідці, смаколики для собак та проведемо короткий інструктаж для початківців. Беріть зручне взуття, яке не шкода забруднити, та гарний настрій!',
      'Приїхати на локацію, отримати собаку відповідно до вашого досвіду, вигулювати її за визначеним маршрутом у парку, стежити за безпекою тварини, пригощати смаколиками за слухняність.',
      'Собаки в притулках сильно страждають від браку руху та людської уваги. Регулярні прогулянки знижують рівень агресії, покращують їхній психічний стан та роблять їх привабливішими для потенційних господарів.',
      'Субота, з 10:00 до 12:00', NOW() + INTERVAL '3 days', 1, 2,
      'ЛКП Лев, Хвіст-Hub',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600',
      15),

  (2, 1, 'Евакуаційний рейс: Допомога на складі зоотоварів',
      'Потрібні чоловіки та сильні дівчата для розвантаження великої фури з кормами, які прибули від європейських донорів.',
      'ACTIVE', NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days 5 hours',
      'Терміновий збір! На наш логістичний склад у Львові прибуває велика гуманітарна фура з Німеччини — привезли понад 5 тонн сухих кормів, ветеринарних консервів та теплих лежаків для тварин, яких ми евакуювали з прифронтових міст. Водій має обмежений час на розвантаження, а наших штатних волонтерів усього двоє дівчат. Дуже просимо відгукнутися тих, хто має кілька вільних годин у середу. Робота фізична, але з перервами на чай та печиво. Допоможіть нам забезпечити їжею сотні голодних хвостиків!',
      'Розвантаження мішків із кормом (по 10-15 кг), сортування коробок за категоріями (окремо ліки, окремо консерви), складання всього на палети, прибирання території складу після розвантаження.',
      'Цей корм — єдине джерело харчування для тварин у трьох наших найбільших шелтерах на наступний місяць. Якщо ми не розвантажимо фуру вчасно, фонд отримає штраф, а постачання наступних партій опиниться під загрозою.',
      'Середа, з 11:00 до 16:00', NOW() + INTERVAL '5 days', 1, 2,
      'БО Нова Жизнь, ЄвроКорм',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600',
      10),

  (3, 2, 'Велике прибирання берега річки Либідь',
      'Рятуємо легендарну столичну річку від пластикової катастрофи. Збираємося на еко-толоку!',
      'ACTIVE', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days 4 hours',
      'Друзі, стан нашої Либеді — це просто біль. Береги завалені пластиковими пляшками, пакетами, старими автомобільними шинами та іншим сміттям, яке люди просто скидають у воду. Ми в EcoKyiv організовуємо масштабну толоку. Ми забезпечимо всіх учасників міцними мішками, професійними рукавицями, граблями та навіть спеціальними забродами для тих, хто захоче дістати сміття безпосередньо з води. Після роботи на всіх чекає гарячий чай із термоса, піца та крутий фірмовий мерч нашої організації. Давайте покажемо, що Києву не байдуже на свої річки!',
      'Збір сміття вздовж берегової лінії, сортування відходів (скло, пластик та залізо збираємо в окремі мішки для подальшої переробки), навантаження мішків у комунальний сміттєвоз.',
      'Либідь впадає в Дніпро, і весь цей бруд отруює воду, яку п''ють мільйони людей. Очищення берегів зупиняє розповсюдження мікропластику та повертає річці її природний вигляд.',
      'Неділя, з 10:00 до 14:00', NOW() + INTERVAL '4 days', 2, 1,
      'Київзеленбуд, ВторРесурси',
      'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=600',
      40),

  (4, 2, 'Зелена школа: Висадка алеї кленів на Подолі',
      'Разом із випускниками та вчителями школи №125 створюємо новий зелений затишний куточок.',
      'ACTIVE', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days 4 hours',
      'Шукаємо волонтерів, які люблять роботу з рослинами! Школа №125 виділила пустир на своєму задньому подвір''ї, і ми вирішили перетворити його на круту зелену зону відпочинку. Наш фонд закупляє 30 крутих, підрощених саджанців гостролистого клена. Нам потрібні люди, які допоможуть розпланувати територію, правильно викопати лунки, посадити дерева та встановити опорні кілки. Школярі теж будуть допомагати, тож це буде крутий спільний сімейний захід. З нас — дерева, лопати, смачний обід та гарна музика!',
      'Підготовка ґрунту, копання ям правильної глибини, дбайливе висаджування саджанців із додаванням добрив, підв''язування дерев до дерев''яних опор, первинний рясний полив.',
      'Міста задихаються від бетону та вихлопних газів. Нова алея дерев не лише прикрасить шкільне подвір''я, але й захистить дітей від міського пилу та створить природну тінь для відпочинку під час перерв.',
      'П''ятниця, з 12:00 до 16:00', NOW() + INTERVAL '9 days', 2, 3,
      'Школа №125, Рада Подільського району',
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600',
      25),

  (5, 4, 'Курс тактичної медицини для цивільних',
      'Безкоштовний практичний інтенсив від сертифікованих інструкторів. Знання, які рятують життя.',
      'ACTIVE', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 6 hours',
      'В сучасних реаліях кожен українець повинен вміти правильно накладати турнікет та зупиняти критичну кровотечу. Наш фонд організовує великий одноденний тренінг. Програма повністю практична: мінімум сухої теорії, максимум відпрацювання на манекенах та один на одному. Ми розберемо алгоритм MARCH, навчимо тампонувати рани, користуватися ізраїльськими бандажами та перевіримо ваші особисті аптечки на профпридатність. Кількість місць обмежена через розмір зали, тому реєструйтеся завчасно!',
      'Участь у практичних симуляціях, відпрацювання навичок накладання джгутів на швидкість в умовах стресу, допомога інструкторам з підготовкою розхідних матеріалів (тренувальних бинтів тощо).',
      'При сильній кровотечі у людини є всього 2-3 хвилини. Вміння швидко зорієнтуватися та правильно накласти турнікет до приїзду медиків — це єдиний шанс врятувати життя під час обстрілу чи ДТП.',
      'Субота, з 10:00 до 16:00', NOW() + INTERVAL '2 days', 3, 4,
      'Центр такмеду Пульс, Нацгвардія (інструктори)',
      'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=600',
      30),

  (6, 1, 'Сортування теплого одягу для переселенців',
      'Потрібні люди в наш центральний хаб для розбору коробок із зимовими речами для родин із Бахмута та Херсона.',
      'ACTIVE', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 4 hours',
      'Дівчата й хлопці, дуже потрібні руки! До нас щодня приходять десятки сімей, які виїхали з зони бойових дій взагалі без речей. Нам привезли велику партію одягу (куртки, светри, дитячі речі, ковдри), але все це зараз лежить в купах серед залу. Треба все перебрати, перевірити, щоб речі були чистими, застібалися блискавки, і розкласти за розмірами на стелажі. Робота не важка, але вимагає уважності. Приходьте хоча б на годинку-дві, ваша допомога дуже потрібна!',
      'Перегляд одягу на наявність дефектів, сортування за статтю та розмірами (чоловічий, жіночий, дитячий), акуратне викладання речей на полиці, пакування несезонного одягу в мішки.',
      'Шелтери переповнені, людям холодно. Швидке сортування дозволяє родинам оперативно отримати потрібний розмір одягу без довгих черг та хаосу на складі.',
      'Понеділок, з 12:00 до 16:00', NOW() + INTERVAL '1 day', 1, 10,
      'БО Шелтер-Львів, Гуманітарний Рух',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
      12),

  (7, 4, 'Виїзний день здоров''я для літніх людей у селах',
      'Організовуємо мобільну медичну бригаду для безкоштовного огляду пенсіонерів у віддалених селах області.',
      'ACTIVE', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days 8 hours',
      'У багатьох селах Тернопільщини немає навіть аптеки, не те що профільних лікарів. Старенькі люди просто не можуть доїхати до обласної лікарні через здоров''я або брак транспорту. Ми збираємо команду волонтерів-медиків (кардіолог, терапевт, офтальмолог) та волонтерів без мед-освіти для допомоги з логістикою. Ми привеземо мобільні апарати УЗД, ЕКГ та безкоштовні базові ліки за рецептами. Потрібні волонтери, які допоможуть тримати чергу, розливати чай та просто підтримувати стареньких морально.',
      'Допомога в облаштуванні кабінетів у місцевому клубі/школі, реєстрація пацієнтів у списку, вимірювання тиску, видача безкоштовних окулярів та ліків під наглядом координатора.',
      'Рання діагностика серцево-судинних захворювань у літніх людей рятує від інсультів та інфарктів. Для багатьох самотніх пенсіонерів наш приїзд — це єдина можливість перевірити здоров''я за рік.',
      'Неділя, з 08:00 до 16:00', NOW() + INTERVAL '7 days', 3, 9,
      'Тернопільський Облздрав, ВолонтерМедик',
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600',
      20),

  (8, 2, 'Еко-пікнік: Як правильно сортувати сміття вдома',
      'Проводимо інтерактивний майстер-клас та лекторій на свіжому повітрі у парку Шевченка.',
      'ACTIVE', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days 3 hours',
      'Хочеш почати сортувати відходи, але кругом голова від усіх цих маркувань пластику (PET, HDPE, PP)? Не знаєш, куди здавати батарейки та старі люмінесцентні лампи? Приходь на наш еко-пікнік! Ми розкажемо все простими словами, покажемо реальні зразки вторсировини, пограємо в настільну еко-гру та круто проведемо час на траві. З нас — круті спікери, корисні гайди, смачні веганські бургери та лимонад у ваші багаторазові чашки. Реєструйтеся всією родиною!',
      'Допомога з монтажем банерів та звукового обладнання, роздача інформаційних буклетів, проведення дитячої зони з еко-іграми, фіксація заходу на камеру.',
      'Понад 95% сміття в Україні просто закопується в землю на полігонах. Популяризація домашнього сортування знижує навантаження на сміттєзвалища та розвиває культуру ресайклінгу.',
      'Субота, з 15:00 до 18:00', NOW() + INTERVAL '6 days', 2, 1,
      'Зелений Київ, Rethink Ukraine',
      'https://images.unsplash.com/photo-1532996122696-a991e35b621c?auto=format&fit=crop&q=80&w=600',
      15),

  (9, 1, 'Будівельна толока: Оновлення літніх вольєрів притулку',
      'Потрібні чоловіки з руками та інструментами (і дівчата для фарбування), щоб підлатати вольєри до початку дощів.',
      'ACTIVE', NOW() + INTERVAL '9 days', NOW() + INTERVAL '9 days 6 hours',
      'Привіт, команда! Старі дерев''яні будки в нашому центрі реабілітації вже зовсім прогнили, а сітка-рабиця на деяких вольєрах порвалася — активні собаки можуть травмуватися або втекти. Ми оголошуємо будівельну суботу. Нам дуже потрібні люди, які вміють тримати в руках молоток, пилку чи шуруповерт. Матеріали (дошки, саморізи, фарбу, пензлики) ми вже купили завдяки донатам. Потрібна лише ваша робоча сила. Роботи багато, але разом ми впораємося швидко! Смачний обід від шеф-кухаря притулку гарантуємо!',
      'Демонтаж старих гнилих дощок, заміна настилу в підлогах вольєрів, дрібний ремонт та утеплення будок пінопластом, фарбування металевих решіток захисним шаром від іржі.',
      'Якісні вольєри захищають тварин від сирості, протягів та хвороб під час осінніх злив. Це базова безпека та комфорт наших підопічних, які чекають на господарів.',
      'Субота, з 10:00 до 16:00', NOW() + INTERVAL '8 days', 1, 2,
      'ЛьвівБудМаркет, ЗооЗахист-Фонд',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
      18),

  (10, 4, 'Арт-терапія: Малювання для дітей, які бачили війну',
      'Шукаємо волонтерів-аніматорів та художників для проведення творчого вечора у дитячому шелтері.',
      'ACTIVE', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days 3 hours',
      'Діткам, які переїхали до нас із прифронтових міст, дуже важко адаптуватися, багато хто закрився в собі через пережитий стрес. Ми запускаємо проєкт психологічного розвантаження через мистецтво. Ми маємо професійного психолога, але нам потрібні помічники, які допомагатимуть дітям змішувати фарби, підбадьорюватимуть їх, роздаватимуть солодощі та створюватимуть атмосферу свята. Ніяких художніх супернавичок від волонтерів не вимагається — просто любов до дітей, терпіння та посмішка.',
      'Підготовка столів до малювання (розкладання ватманів, гуаші, стаканчиків з водою), допомога малечі у процесі малювання пальчиковими фарбами, роздача подарунків та соків під час перерви.',
      'Арт-терапія визнана провідними психологами як один із найкращих методів зниження рівня ПТСР та тривожності у дітей. Це допомагає їм висловити свої страхи на папері та повернутися до нормального дитинства.',
      'Четвер, з 16:00 до 19:00', NOW() + INTERVAL '3 days', 3, 8,
      'Благодійний Фонд Діти-ВПО, АртПсихологія',
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=600',
      30),

  (11, 11, 'Фестиваль традиційної музики',
      'Одноденний фестиваль автентичного фольклору та ремесел Полісся.',
      'ACTIVE', NOW() + INTERVAL '20 days', NOW() + INTERVAL '20 days 8 hours',
      'Культурна ДНК збирає народних виконавців, майстрів ремесел, кулінарів зі всієї Житомирщини. Вхід вільний.',
      'Допомагати на стендах, супроводжувати гостей, відповідати на запитання, знімати.',
      'Збереження автентичної культури — це відповідь на спробу стерти нашу ідентичність.',
      'Неділя, 10:00–18:00', NOW() + INTERVAL '18 days', 13, 7,
      'Житомирська ОДА, Укркультурфонд',
      'https://loremflickr.com/600/400/folk,music,festival?lock=11', 200),

  (12, 12, 'Підготовка нічліжки до зими',
      'Ремонт, прибирання, облаштування нових місць у нічліжці на 60 людей.',
      'ACTIVE', NOW() + INTERVAL '8 days', NOW() + INTERVAL '9 days',
      'До зими нічліжка «Дах і Тепло» потребує: побілки стін, заміни ліжок, утеплення вікон, облаштування душових. Все матеріали є.',
      'Малярні роботи, монтаж ліжок, прибирання, розкладання запасів одягу та білизни.',
      'Кожне місце в нічліжці — це врятоване життя в морози.',
      'Субота–Неділя, 9:00–17:00', NOW() + INTERVAL '6 days', 6, 15,
      'Харківська міська рада',
      'https://loremflickr.com/600/400/shelter,homeless?lock=12', 20),

  (13, 13, 'Юридичні консультації для ВПО',
      'Безкоштовні консультації юристів з питань житла, соцвиплат, документів.',
      'ACTIVE', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days 6 hours',
      'Щомісяця «Переселенці Разом» організовує день безкоштовних юридичних консультацій. В черзі зазвичай 50–70 людей. Потрібна підтримка.',
      'Реєстрація відвідувачів, виготовлення талонів, роз''яснення регламенту, підготовка документів.',
      'Правова безграмотність — одна з головних причин незахищеності ВПО.',
      'Субота, 9:00–15:00', NOW() + INTERVAL '3 days', 4, 10,
      'УВКБ ООН, Ukrainian Legal Aid',
      'https://loremflickr.com/600/400/lawyer,legal?lock=13', 60),

  (14, 2, 'Прибирання берегів Дніпра',
      'Масштабна акція — прибираємо 2 км берега Дніпра в Києві.',
      'ACTIVE', NOW() + INTERVAL '15 days', NOW() + INTERVAL '15 days 5 hours',
      'EcoKyiv щорічно організовує масштабне прибирання берегів. Цього разу — Труханів острів. Очікуємо 150+ учасників.',
      'Збирати сміття, сортувати на фракції, завантажувати у транспорт, встановлювати знаки.',
      'Чистий берег = здорова екосистема річки і комфорт для городян.',
      'Субота, 9:00–14:00', NOW() + INTERVAL '13 days', 2, 1,
      'КМДА, Plastic Free Ukraine, Keep Ukraine Tidy',
      'https://loremflickr.com/600/400/river,cleanup?lock=14', 150),

  (15, 1, 'Мобільна виставка-притулок у Тернополі',
      'Привозимо тварин з притулку — відповідальне всиновлення на місці.',
      'ACTIVE', NOW() + INTERVAL '11 days', NOW() + INTERVAL '11 days 6 hours',
      'Rescue Львів організовує виїзну виставку з 30+ тваринами, готовими до всиновлення. Всі ветеринарно перевірені, вакциновані.',
      'Транспортування тварин, облаштування стендів, консультація потенційних власників.',
      'Кожне всиновлення — це два врятованих. Тварина знаходить дім, і місце звільняється для іншої.',
      'Субота, 11:00–17:00', NOW() + INTERVAL '9 days', 3, 2,
      'Тернопільська міська рада, ZooTern',
      'https://loremflickr.com/600/400/pets,adoption?lock=15', 40);

SELECT setval('project_id_seq', (SELECT MAX(id) FROM project));

INSERT INTO project_category (project_id, category_id) VALUES
  (1,  12),            -- Прогулка з хвостиками → Тварини
  (2,  12),            -- Евакуаційний рейс зоотовари → Тварини
  (3,   3),            -- Прибирання берега Либідь → Екологія
  (4,   3), (4,  1),  -- Висадка алеї кленів → Екологія, Освіта
  (5,   2), (5,  9),  -- Курс тактичної медицини → Медицина, Армія та оборона
  (6,  10),            -- Сортування одягу для переселенців → Гуманітарна допомога
  (7,   2), (7,  4),  -- День здоров'я для літніх → Медицина, Соціальна допомога
  (8,   3),            -- Еко-пікнік сортування сміття → Екологія
  (9,  12),            -- Будівельна толока вольєри притулку → Тварини
  (10, 11),            -- Арт-терапія для дітей → Діти
  (11,  5),            -- Фестиваль традиційної музики → Культура
  (12,  4),            -- Підготовка нічліжки → Соціальна допомога
  (13, 10), (13, 4),  -- Юридичні консультації ВПО → Гуманітарна, Соціальна
  (14,  3), (14, 8),  -- Прибирання берегів Дніпра → Екологія, Волонтерство
  (15, 12);            -- Мобільна виставка-притулок → Тварини

-- ============================================================================
-- 9. PROJECT_REGISTRATION (15 записів на події)
-- ============================================================================
INSERT INTO project_registration (project_id, user_id, status, reviewed_at, reviewed_by) VALUES
  (1,  4,  'ACCEPTED', NOW() - INTERVAL '2 days',  2),
  (1,  5,  'PENDING',  NULL, NULL),
  (1,  6,  'PENDING',  NULL, NULL),
  (3,  4,  'ACCEPTED', NOW() - INTERVAL '1 day',   3),
  (3,  5,  'ACCEPTED', NOW() - INTERVAL '1 day',   3),
  (5,  18, 'ACCEPTED', NOW() - INTERVAL '1 day',   7),
  (5,  29, 'PENDING',  NULL, NULL),
  (6,  20, 'ACCEPTED', NOW() - INTERVAL '2 days',  8),
  (6,  30, 'PENDING',  NULL, NULL),
  (7,  22, 'ACCEPTED', NOW() - INTERVAL '1 day',   9),
  (8,  21, 'ACCEPTED', NOW() - INTERVAL '3 days',  11),
  (9,  22, 'PENDING',  NULL, NULL),
  (10, 19, 'ACCEPTED', NOW() - INTERVAL '2 days',  14),
  (11, 24, 'ACCEPTED', NOW() - INTERVAL '1 day',   15),
  (12, 27, 'ACCEPTED', NOW() - INTERVAL '1 day',   16);

-- ============================================================================
-- 10. TASK (13 мікрозавдань)
-- ============================================================================
INSERT INTO task (id, project_id, title, description, status, difficulty, points_reward_base, location_id, deadline) VALUES
  (1,  1,  'Привезти корм у притулок',
       'Забрати 5 мішків корму з магазину та довезти до притулку.',
       'OPEN', 'EASY', 10, 1, NOW() + INTERVAL '6 days'),
  (2,  3,  'Координація групи на прибиранні',
       'Інструктаж нових волонтерів, роздача інвентарю.',
       'OPEN', 'MEDIUM', 25, 2, NOW() + INTERVAL '10 days'),
  (3,  5,  'Реєстрація учасників тренінгу',
       'Зустрічати учасників на вході, видавати бейджі, вести список.',
       'OPEN', 'EASY', 10, 6, NOW() + INTERVAL '4 days'),
  (4,  6,  'Координація черг медогляду',
       'Стежити за чергами, направляти пацієнтів до потрібних кабінетів.',
       'OPEN', 'MEDIUM', 25, 7, NOW() + INTERVAL '8 days'),
  (5,  7,  'Підготовка матеріалів для курсу',
       'Роздрукувати та розкласти по столах навчальні матеріали.',
       'OPEN', 'EASY', 15, 4, NOW() + INTERVAL '2 days'),
  (6,  8,  'Сортування гуманітарних наборів',
       'Розфасувати продукти по пакетах згідно зі списком та стандартами.',
       'OPEN', 'EASY', 20, 9, NOW() + INTERVAL '3 days'),
  (7,  9,  'Підготовка матеріалів для майстер-класу',
       'Нарізати картон, розлити фарби, підготувати робочі місця для дітей.',
       'OPEN', 'EASY', 10, 10, NOW() + INTERVAL '5 days'),
  (8,  10, 'Допомога в ремонтних роботах',
       'Підносити матеріали, прибирати будівельне сміття, страхувати на висоті.',
       'OPEN', 'HARD', 50, 12, NOW() + INTERVAL '13 days'),
  (9,  11, 'Волонтер сцени на фестивалі',
       'Допомагати артистам і ведучим, стежити за технікою, підказувати гостям.',
       'OPEN', 'MEDIUM', 30, 13, NOW() + INTERVAL '19 days'),
  (10, 12, 'Розстановка ліжок та інвентарю',
       'Зібрати та розставити ліжка, тумбочки, шафи у кімнатах нічліжки.',
       'OPEN', 'MEDIUM', 25, 6, NOW() + INTERVAL '7 days'),
  (11, 13, 'Переклад юридичних документів',
       'Перекласти типові форми заяв на українську для підопічних НГО.',
       'OPEN', 'HARD', 40, 4, NOW() + INTERVAL '4 days'),
  (12, 14, 'Встановлення інформаційних стендів',
       'Розмістити стенди та банери вздовж берега до початку прибирання.',
       'OPEN', 'EASY', 15, 2, NOW() + INTERVAL '14 days'),
  (13, 15, 'Підготовка тварин до виставки',
       'Почесати, заспокоїти тварин перед виставкою, оформити клітки.',
       'OPEN', 'MEDIUM', 30, 3, NOW() + INTERVAL '10 days');

SELECT setval('task_id_seq', (SELECT MAX(id) FROM task));

INSERT INTO task_category (task_id, category_id) VALUES
  (1,  12), (1,   4),  -- Привезти корм у притулок → Тварини, Соціальна допомога
  (2,   3),            -- Координація групи на прибиранні → Екологія
  (3,   2), (3,   1),  -- Реєстрація учасників тренінгу (тактмед) → Медицина, Освіта
  (4,   2), (4,  10),  -- Координація черг медогляду → Медицина, Гуманітарна допомога
  (5,   2),            -- Підготовка матеріалів медичного курсу → Медицина
  (6,   4), (6,  10),  -- Сортування гуманітарних наборів → Соціальна, Гуманітарна
  (7,  12), (7,   7),  -- Підготовка матеріалів (майстер-клас притулок) → Тварини, Відбудова
  (8,  11), (8,   2),  -- Допомога в ремонтних роботах (арт-терапія дітей) → Діти, Медицина
  (9,   5),            -- Волонтер сцени на фестивалі → Культура
  (10,  4),            -- Розстановка ліжок (нічліжка) → Соціальна допомога
  (11, 10),            -- Переклад юридичних документів (ВПО) → Гуманітарна допомога
  (12,  3),            -- Встановлення інформаційних стендів (прибирання Дніпра) → Екологія
  (13, 12);            -- Підготовка тварин до виставки → Тварини

-- ============================================================================
-- 11. TASK_ASSIGNMENT (13 призначень)
-- ============================================================================
INSERT INTO task_assignment (id, task_id, volunteer_profile_id, status, assigned_at, accepted_at, completed_at, requester_confirmed) VALUES
  (1,  1,  1,  'COMPLETED', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 days', TRUE),
  (2,  2,  2,  'COMPLETED', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day',  TRUE),
  (3,  3,  3,  'ACCEPTED',  NOW() - INTERVAL '1 day',  NOW() - INTERVAL '1 day',  NULL, FALSE),
  (4,  4,  4,  'ACCEPTED',  NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NULL, FALSE),
  (5,  5,  5,  'ACCEPTED',  NOW() - INTERVAL '1 day',  NOW() - INTERVAL '1 day',  NULL, FALSE),
  (6,  6,  6,  'COMPLETED', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day',  TRUE),
  (7,  7,  7,  'ACCEPTED',  NOW() - INTERVAL '1 day',  NOW() - INTERVAL '1 day',  NULL, FALSE),
  (8,  8,  8,  'ASSIGNED',  NOW() - INTERVAL '1 day',  NULL, NULL, FALSE),
  (9,  9,  9,  'ACCEPTED',  NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NULL, FALSE),
  (10, 10, 10, 'ASSIGNED',  NOW() - INTERVAL '1 day',  NULL, NULL, FALSE),
  (11, 11, 11, 'ACCEPTED',  NOW() - INTERVAL '1 day',  NOW() - INTERVAL '1 day',  NULL, FALSE),
  (12, 12, 12, 'ACCEPTED',  NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NULL, FALSE),
  (13, 13, 13, 'ACCEPTED',  NOW() - INTERVAL '1 day',  NOW() - INTERVAL '1 day',  NULL, FALSE);

SELECT setval('task_assignment_id_seq', (SELECT MAX(id) FROM task_assignment));

-- ============================================================================
-- 12. NEWS (13 новин)
-- ============================================================================
INSERT INTO news (id, title, image_url, is_pinned, description, main_content, organization_id, status) VALUES
  (1,  'Річний звіт Rescue Львів за 2025 рік: Наші спільні перемоги!',
       'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600', TRUE,
       'Ми підбили підсумки важкого, але неймовірно продуктивного року. Дякуємо кожному донору та волонтеру!',
       '2025 рік став для нас роком справжньої єдності. Завдяки вашій фінансовій підтримці та роботі волонтерів нам вдалося врятувати та вилікувати 320 тварин із зони бойових дій. Понад 210 собак та котів знайшли нові домівки в Україні та за кордоном! Ми провели 510 безкоштовних операцій зі стерилізації вуличних тварин у Львові, що суттєво знизило навантаження на міські вулиці. Також наша мобільна бригада здійснила понад 150 складних виїздів для порятунку поранених чотирилапих. Це наш спільний результат! Ви — найкращі, рухаємося далі у 2026!',
       1, 'PUBLISHED'),
  (2,  'Зелений рекорд: 200 нових дерев прикрасили парки Києва',
       'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600', FALSE,
       'Ми завершили весняний марафон озеленення. Фотозвіт та геомітки нових насаджень вже на сайті.',
       'Цієї весни команда EcoKyiv разом із сотнями небайдужих киян провела чотири масштабні акції з висадки дерев. Спільними зусиллями ми висадили 200 чудових здорових саджанців дуба, липи, декоративної яблуні та клена в спальних районах столиці та на території шкіл. Особливість нашої акції в тому, що кожне дерево отримало унікальну GPS-мітку на нашій інтерактивній еко-карті. Тепер волонтери та місцеві мешканці зможуть доглядати за деревами, відзначати полив та стежити за тим, як вони приживаються. Київ має бути зеленим!',
       2, 'PUBLISHED'),
  (3,  'Шукаємо фронтендерів та дизайнерів: Долучайся до IT-волонтерства',
       'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600', FALSE,
       'Маєш досвід в Angular чи Figma? Твої знання можуть допомогти автоматизувати роботу притулків України.',
       'Ми в Rescue Львів запускаємо велику внутрішню реформу. Наразі весь облік тварин, ліків та історій хвороб ми ведемо вручну в Excel-таблицях, що сильно уповільнює процеси прилаштування. Нам потрібна допомога IT-спільноти для розробки нашої пропрієтарної бази даних PawsDB. Якщо ти розробник (Angular/NestJS) або UI/UX дизайнер і хочеш зробити крутий pro bono кейс у портфоліо — заповнюй анкету на сайті. Робота займе близько 2-3 годин на тиждень, а користь для тварин буде просто колосальною!',
       1, 'PUBLISHED'),
  (4,  'Ми виграли міжнародний грант на сучасний хірургічний блок!',
       'https://images.unsplash.com/photo-1584515933487-75982139b2a1?auto=format&fit=crop&q=80&w=600', FALSE,
       'Європейський фонд Four Paws виділив кошти на будівництво шпиталю для тварин у нашому центрі.',
       'Фантастичні новини, від яких навертаються сльози радості! Наша команда підписала офіційний договір про співпрацю з міжнародними партнерами. Нам виділили цільове фінансування, яке покриє закупівлю сучасного хірургічного обладнання, апаратів ШВЛ, цифрового рентгену та будівництво ізолятора на 20 боксів для інфекційних хворих тварин. Будівництво стартує вже цього місяця, і до кінця 2026 року ми матимемо ветеринарний комплекс європейського рівня! Грант покриває обладнання, але щоденні потреби в кормі та руках залишаються нашою спільною справою!',
       1, 'PUBLISHED'),
  (5,  'Проєкт «Чиста школа»: 50 еко-боксів встановлено у ліцеях столиці',
       'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600', FALSE,
       'EcoKyiv запустив масштабну освітню ініціативу роздільного збору відходів серед школярів.',
       'Сортування сміття має ставати звичкою з дитинства. Ми успішно завершили перший етап нашого освітнього проєкту. Завдяки підтримці меценатів ми закупили та безкоштовно встановили 50 крутих трисекційних баків для роздільного збору пластику, паперу та скла у 15 школах Києва. Наші волонтери провели еко-уроки для 3000 учнів, де наочно пояснили, як звичайна пластикова пляшка перетворюється на новий спортивний одяг. Діти в захваті, вчителі підтримують, школи змагаються за звання найбільш екологічної!',
       2, 'PUBLISHED'),
  (6,  'Гаряча лінія психологічної підтримки для ВПО працює 24/7',
       'https://images.unsplash.com/photo-1516534775068-ba3e84589d90?auto=format&fit=crop&q=80&w=600', FALSE,
       'Сертифіковані кризові психологи фонду МедДопомога готові вислухати та допомогти знайти опору.',
       'Внутрішні рани війни іноді болять значно сильніше за фізичні. Панічні атаки, тривожність, депресія через втрату дому чи синдром провини вцілілого — з цим не можна залишатися наодинці. Наш фонд офіційно запустив безкоштовну всеукраїнську гарячу лінію підтримки. Усі наші оператори — дипломовані кризові психологи з величезним досвідом роботи з ПТСР. Дзвінки абсолютно конфіденційні та безкоштовні з усіх мобільних операторів України. Якщо вам або вашим близьким важко — не мовчіть, зателефонуйте нам.',
       4, 'PUBLISHED'),
  (7,  'Мобільна амбулаторія вирушає у свій перший рейс',
       'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=600', FALSE,
       'Обладнаний ветеринарний мікроавтобус буде проводити безкоштовні огляди у деокупованих селищах.',
       'Завдяки закритому збору на монобанці ми нарешті переобладнали наш бус під справжню ветеринарну операційну на колесах! Мобільна амбулаторія Rescue Львів укомплектована всім необхідним для проведення стерилізацій, вакцинацій та дрібних хірургічних втручань прямо польових умовах. Графік виїздів на травень 2026 року вже затверджено, ми фокусуємося на селах, де через війну не залишилося жодного діючого лікаря. Слідкуйте за нашими звітами у соцмережах!',
       1, 'PUBLISHED'),
  (8,  'Підсумки очищення озера на Оболоні: Ми зробили це!',
       'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600', FALSE,
       'Понад 3 тонни побутового сміття було зібрано та вивезено волонтерами за одну суботу.',
       'Ми просто в шоці від активності киян! Минулої суботи на наш заклик очистити занедбане озеро відгукнулося понад 120 людей. Серед знахідок волонтерів: сотні кілограмів пластикового посуду, старі дивани, будівельні мішки та навіть іржавий холодильник. Спільними зусиллями ми повністю очистили берегову лінію та дзеркало води. Компанія-партнер ВторРесурси забрала весь пластик та скло на переробку, а решту вивезли на полігон. Тепер на березі стоять наші інформаційні таблички. Давайте берегти красу разом!',
       2, 'PUBLISHED'),
  (9,  'Гуманітарний конвой успішно доставив медикаменти в шелтери',
       'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600', FALSE,
       'Тонна дефіцитних ліків, інвалідні візки та дитяче харчування передані безпосередньо в руки потребуючим.',
       'Звіт від команди МедДопомога: наші волонтери повернулися з важкої поїздки віддаленими громадами. Завдяки закупівлям за ваші донати та допомозі європейських фармацевтичних компаній, ми розвезли дефіцитні інсуліни, серцеві препарати, антибіотики та засоби гігієни у 4 великі шелтери, де зараз проживають літні люди та мами з немовлятами. Також ми особисто передали 5 сучасних інвалідних візків для маломобільних пацієнтів. Дякуємо всім, хто тримає медичний фронт!',
       4, 'PUBLISHED'),
  (10, 'День відкритих дверей у притулку: 12 хвостиків знайшли родини!',
       'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&q=80&w=600', FALSE,
       'Неймовірні результати нашої недільної зустрічі. Дякуємо всім, хто взяв собаку чи кішку у свій дім.',
       'Це була найтепліша неділя цієї весни! До нашого реабілітаційного центру приїхало понад 200 гостей. Ми проводили екскурсії, пригощали домашнім печивом, а головне — люди активно спілкувалися з нашими підопічними. Як результат: 7 собак та 5 котиків поїхали жити у нові квартири підписавши офіційні договори відповідального утримання! Ми будемо ненав''язливо відстежувати їхню долю. Ті, хто не зміг взяти тваринку, привезли купу корисних подарунків: понад 400 кг якісного корму, пелюшки та ліки. Ви неймовірні!',
       1, 'PUBLISHED'),
  (11, 'Нічліжка «Дах і Тепло» готова до зими',
       'https://loremflickr.com/600/400/shelter,winter?lock=31', FALSE,
       'Завдяки волонтерам оновлено 60 спальних місць у нічліжці Харкова.',
       'Нові ліжка, утеплення вікон, поновлена система опалення. Запаси одягу та постільної білизни розраховані на 200 людей. Безкоштовне харчування двічі на день.',
       12, 'PUBLISHED'),
  (12, 'Безкоштовна правова допомога ВПО відновлена в Одесі',
       'https://loremflickr.com/600/400/lawyer,documents?lock=32', FALSE,
       'Переселенці Разом поновили щомісячні дні безкоштовних консультацій.',
       'Юристи консультують з питань: оформлення субсидії, реєстрації за новим місцем, захисту прав на роботі, відновлення втрачених документів. Черговий день — в першу суботу місяця.',
       13, 'PUBLISHED'),
  (13, 'Прибирання парку: 500 кг сміття за 4 години',
       'https://loremflickr.com/600/400/park,cleanup?lock=33', FALSE,
       'EcoKyiv підбила підсумки осіннього екосуботника.',
       'Понад 80 волонтерів зібрали і відсортували 500 кг сміття. Пластик та скло передані на переробку, решта — на звалище. Окремо вилучили 3 старі шини та холодильник.',
       2, 'PUBLISHED');

SELECT setval('news_id_seq', (SELECT MAX(id) FROM news));

INSERT INTO news_category (news_id, category_id) VALUES
  (1,  12),            -- Річний звіт Rescue → Тварини
  (2,   3),            -- 200 нових дерев → Екологія
  (3,   8), (3,  1),  -- IT-волонтерство фронтендери → Волонтерство, Освіта
  (4,   2),            -- Грант на хірургічний блок → Медицина
  (5,   3), (5,  1),  -- Еко-бокси у ліцеях → Екологія, Освіта
  (6,   2), (6,  4),  -- Гаряча лінія психологічної підтримки → Медицина, Соціальна допомога
  (7,   2),            -- Мобільна амбулаторія → Медицина
  (8,   3),            -- Очищення озера на Оболоні → Екологія
  (9,  10), (9,  2),  -- Гуманітарний конвой з медикаментами → Гуманітарна, Медицина
  (10, 12),            -- День відкритих дверей у притулку → Тварини
  (11,  4),            -- Нічліжка «Дах і Тепло» готова → Соціальна допомога
  (12, 10), (12,  4), -- Правова допомога ВПО → Гуманітарна, Соціальна допомога
  (13,  3);            -- Прибирання парку 500 кг → Екологія

-- ============================================================================
-- 13. FUNDRAISING_CAMPAIGN (13 зборів)
-- ============================================================================
INSERT INTO fundraising_campaign (id, organization_profile_id, volunteer_profile_id, title, description, main_content, goal_amount, current_amount, status, start_at, end_at, jar_link, image_url) VALUES
  (1,  1, NULL, 'Терміновий збір на ліки та спецкорм для притулку «Друг»',
       'Наші запаси лікувальних консервів для цуценят та протипаразитарних засобів повністю вичерпані.',
       'Друзі, ситуація критична. Через масову евакуацію тварин з півдня України наш притулок перевантажений вдвічі. Зараз у нас перебуває понад 80 собак, і половина з них потребує медичного догляду після травм та виснаження. Нам терміново потрібні кошти на: 1) 60 пачок ветеринарного сухого корму преміум-класу; 2) Спеціальні лікувальні консерви Gastrointestinal для малечі; 3) Комплексні вакцини та краплі від кліщів (сезон у розпалі!). Будь-які 20, 50 чи 100 гривень — це реальний ситий і безпечний день для покинутої тварини. Будь ласка, підтримайте хвостиків!',
       60000.00, 23450.00, 'ACTIVE', NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days',
       'https://send.monobank.ua/jar/demoRescueFood',
       'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600'),

  (2,  2, NULL, 'Закупівля інвентарю для міських еко-толок',
       'Збираємо на власний фонд якісних інструментів, щоб не переплачувати за оренду кожного разу.',
       'Ми проводимо прибирання парків та берегів річок двічі на місяць. Щоразу ми витрачаємо величезні суми донатів просто на оренду бензопил, грабель, міцних забродних костюмів та тачок для вивезення важкого сміття. Ми вирішили один раз зібрати гроші на власний якісний комплект інструментів, який служитиме роками. Завдяки цьому ми зможемо залучати більше волонтерів і проводити толоки абсолютно автономно в будь-якому куточку Києва. Звіт про кожну куплену лопату чи рукавиці гарантуємо!',
       25000.00, 15000.00, 'ACTIVE', NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days',
       'https://send.monobank.ua/jar/demoEcoTools',
       'https://images.unsplash.com/photo-1621460241979-e798e114c285?auto=format&fit=crop&q=80&w=600'),

  (3,  NULL, 2, 'Ноутбуки для дітей-переселенців (Особистий збір Петра)',
       'Шукаємо кошти або справну б/в техніку для школярів, які проживають у гуртожитку ВПО на Поділлі.',
       'Привіт усім! Я волонтер Петро. Нещодавно я завітав до одного з шелтерів, де зараз мешкають родини, що втекли від обстрілів зі сходу. Там є 10 чудових діток шкільного віку, які банально не можуть нормально вчитися онлайн. Вони змушені ділити один старенький смартфон мами на трьох, щоб підключитися до Zoom-уроків! Це не освіта. Моя мета — зібрати 40 000 грн, купити 10 повністю справних, надійних вживаних ноутбуків із Європи, самостійно обслужити їх, встановити Windows, офісні програми й передати дітям особисто в руки. Твоя кава чи донат — це квиток у нормальне майбутнє для дитини.',
       40000.00, 18200.00, 'ACTIVE', NOW() - INTERVAL '3 days', NOW() + INTERVAL '30 days',
       'https://send.monobank.ua/jar/demoLaptops',
       'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=600'),

  (4,  1, NULL, 'Порятунок тварин із прифронтових районів',
       'Збір на пальне для евакуаційних бусів та оплату складних операцій (остеосинтез) для поранених собак.',
       'Цей збір присвячений тим, хто під обстрілами не може покликати на допомогу самостійно. Наша команда щотижня виїжджає у прифронтові зони, щоб забирати покинутих, поранених та контужених тварин. Витрати на пальне зараз колосальні, а ветеринарна клініка працює цілодобово. Багато тварин прибувають із множинними осколковими пораненнями кінцівок — потрібні дорогі спиці, титанові пластини для остеосинтезу та тижні інтенсивної терапії в кисневих боксах. Не залишайте їх помирати в муках на дорогах війни, кожна гривня важлива!',
       35000.00, 12300.00, 'ACTIVE', NOW() - INTERVAL '8 days', NOW() + INTERVAL '22 days',
       'https://send.monobank.ua/jar/demoFrontlineAnimals',
       'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=600'),

  (5,  2, NULL, 'Очищення та порятунок річки Либідь',
       'Збір на оренду важкої техніки та підйом великогабаритного сміття з русла легендарної річки.',
       'Ми запускаємо наймасштабніший етап ревіталізації Либеді. Ручними граблями берег ми вже почистили, але в самому руслі річки лежать бетонні блоки, старі автомобільні кузови, сотні замулених шин, які повністю перекривають течію води і створюють болото. Нам потрібні гроші на оплату роботи невеликого екскаватора-маніпулятора на два дні, а також на купівлю 500 надміцних мішків та оплату утилізації специфічного сміття. Повернемо життя Либеді разом, це наша історія та екологія міста!',
       80000.00, 35500.00, 'ACTIVE', NOW() - INTERVAL '2 days', NOW() + INTERVAL '58 days',
       'https://send.monobank.ua/jar/demoRiverClean',
       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600'),

  (6,  NULL, 1, 'Дитяче харчування та памперси для немовлят ВПО (Збір Анни)',
       'Забезпечуємо найменших переселенців у гуртожитку на Подолі базовими засобами гігієни.',
       'Всім привіт, на зв''язку Анна! У нашому підшефному шелтері зараз критична ситуація — заселилися 8 молодих матусь із немовлятами до року. Вони виїхали поспіхом, виплати від держави ще на стадії оформлення, а годувати малечу та міняти підгузки треба вже сьогодні! Гроші збираю на: 1) Гіпоалергенні суміші (Nutrilon, Hipp); 2) Підгузки розмірів 1-4; 3) Дитячі креми та вологі серветки. Я особисто купую все на оптових складах за максимально низькими цінами та везу матусям. Повні чеки та фотозвіти викладаю в коментарях.',
       20000.00, 8500.00, 'ACTIVE', NOW() - INTERVAL '4 days', NOW() + INTERVAL '15 days',
       'https://send.monobank.ua/jar/demoBabySupplies',
       'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=600'),

  (7,  1, NULL, 'Тепло у вольєри: Збір на утеплення притулку «Друг» до морозів',
       'Ремонтуємо дахи, що протікають, закупляємо солому для будок та інфрачервоні обігрівачі для цуценят.',
       'Холод та сирість — найстрашніший ворог для безпритульних собак у вольєрах. Зима та осінні зливи близько, а у нас 15 вольєрів мають дірявий дах, через що солома всередині миттєво мокне і гниє. Старі песики починають сильно хворіти на артрит, а малі цуценята просто не виживуть без додаткового тепла. Ми відкриваємо збір на закупівлю 100 великих тюків свіжої соломи, мінеральної вати для утеплення стін та 4 потужних безпечних інфрачервоних обігрівачів для секції «Ясла». Зробимо притулок теплим разом!',
       45000.00, 13200.00, 'ACTIVE', NOW() - INTERVAL '1 day', NOW() + INTERVAL '44 days',
       'https://send.monobank.ua/jar/demoShelterHeat',
       'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=600'),

  (8,  2, NULL, 'Створення шкільного еко-гуртка «Юні натуралісти»',
       'Закупівля мікроскопа, визначників рослин та лабораторних наборів для кабінету біології школи №98.',
       'Майбутнє нашої планети залежить від екологічної освіти наших дітей. Ми хочемо перетворити нудну теорію з біології на захоплюючі дослідження! EcoKyiv збирає кошти на відкриття сучасного шкільного екогуртка. Нам потрібні гроші на покупку цифрового мікроскопа (який можна підключати до великого екрана), спеціальних валізок для експрес-аналізу чистоти повітря та води, а також насіння рідкісних рослин для шкільної міні-оранжереї. Давайте закохаємо дітей в науку разом!',
       30000.00, 18750.00, 'ACTIVE', NOW() - INTERVAL '12 days', NOW() + INTERVAL '18 days',
       'https://send.monobank.ua/jar/demoScienceClub',
       'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'),

  (9,  NULL, 2, 'Цифрова соціалізація: Смартфони для ветеранів на реабілітації',
       'Особистий збір Петра: Купуємо 20 надійних смартфонів базового рівня для хлопців у госпіталі.',
       'Привіт, друзі. Багато військових після важких поранень повертаються до цивільного життя взагалі без особистих речей та техніки — все залишається на полі бою. Смартфон сьогодні — це не розкіш, це зв''язок із рідними, доступ до застосунків «Резерв+», «Дія», електронної черги до лікарів та телемедицини. Я планую назбирати грошей, купити 20 надійних смартфонів із гарними акумуляторами та особисто привезти їх хлопцям у госпіталь. Також допоможу кожному все налаштувати та розібратися з програмами. Підтримайте наших захисників!',
       50000.00, 22000.00, 'ACTIVE', NOW() - INTERVAL '1 day', NOW() + INTERVAL '59 days',
       'https://send.monobank.ua/jar/demoVeteranPhones',
       'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600'),

  (10, 4, NULL, 'Тактична медицина для евакуаційних медичних бригад',
       'Терміновий збір фонду МедДопомога на сертифіковані турнікети CAT та оклюзійні пов''язки.',
       'Наша мобільна медична бригада регулярно виїжджає на деокуповані території для надання допомоги місцевим та евакуації маломобільних пацієнтів. Аптечки розходяться з шаленою швидкістю. Нам життєво необхідно поповнити запаси якісних розхідників. Ми не купуємо дешеву китайську кашу, яка ламається в руках! Збір відкриваємо суто на оригінальні турнікети CAT Gen 7, гемостатичні бинти Celox та оклюзійні наліпки Halo. Кожен ваш внесок — це реальне врятоване життя людини під час обстрілу. Будь ласка, долучайтеся!',
       100000.00, 45000.00, 'ACTIVE', NOW() - INTERVAL '6 days', NOW() + INTERVAL '24 days',
       'https://send.monobank.ua/jar/demoTacticalMed',
       'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=600'),

  (11, 4, NULL, 'Мобільна медкімната для прифронтових сіл',
       'Обладнуємо мікроавтобус як пересувний медичний кабінет.',
       'МедДопомога планує щотижня виїжджати в 3–4 прифронтових села для первинної медичної допомоги. Потрібен спеціальний мікроавтобус.',
       120000.00, 34500.00, 'ACTIVE', NOW() - INTERVAL '10 days', NOW() + INTERVAL '50 days',
       'https://send.monobank.ua/jar/demoMedBus',
       'https://loremflickr.com/600/400/ambulance,medical?lock=51'),

  (12, 12, NULL, 'Ліжка та постільна білизна для нічліжки',
       'Збір на 20 нових односпальних ліжок і комплекти постільної білизни.',
       'Нічліжка «Дах і Тепло» розширюється — відкриваємо нове крило на 20 місць. Потрібні ліжка, матраси, подушки, ковдри і білизна.',
       28000.00, 9100.00, 'ACTIVE', NOW() - INTERVAL '6 days', NOW() + INTERVAL '24 days',
       'https://send.monobank.ua/jar/demoBeds',
       'https://loremflickr.com/600/400/shelter,beds?lock=52'),

  (13, 7, NULL, 'Продуктові набори для 100 родин на зиму',
       'Збір на зимові продуктові набори для найбільш вразливих родин у Вінниці.',
       'Перед зимою «Рука Допомоги» планує передати 100 родинам набори на 2 місяці. Крупи, консерви, олія, цукор, дитяче харчування.',
       85000.00, 12400.00, 'ACTIVE', NOW() - INTERVAL '3 days', NOW() + INTERVAL '37 days',
       'https://send.monobank.ua/jar/demoWinterFood',
       'https://loremflickr.com/600/400/food,packages?lock=53');

SELECT setval('fundraising_campaign_id_seq', (SELECT MAX(id) FROM fundraising_campaign));

INSERT INTO fundraising_category (campaign_id, category_id) VALUES
  (1,  12),            -- Ліки та корм для притулку → Тварини
  (2,   3),            -- Інвентар для еко-толок → Екологія
  (3,  11), (3,  1),  -- Ноутбуки для дітей-переселенців → Діти, Освіта
  (4,  12),            -- Порятунок тварин з прифронту → Тварини
  (5,   3),            -- Очищення річки Либідь → Екологія
  (6,  11), (6, 10),  -- Дитяче харчування для немовлят ВПО → Діти, Гуманітарна
  (7,  12),            -- Утеплення притулку «Друг» → Тварини
  (8,   1), (8,  3),  -- Шкільний еко-гурток → Освіта, Екологія
  (9,   9), (9,  4),  -- Смартфони для ветеранів → Армія, Соціальна допомога
  (10,  2), (10,  9), -- Тактична медицина → Медицина, Армія та оборона
  (11,  2), (11, 10), -- Мобільна медкімната → Медицина, Гуманітарна допомога
  (12,  4),            -- Ліжка для нічліжки → Соціальна допомога
  (13,  4), (13, 10); -- Продуктові набори → Соціальна допомога, Гуманітарна допомога

-- ============================================================================
-- 14. DONATION (15 донатів)
-- ============================================================================
INSERT INTO donation (campaign_id, amount, donor_name, message, user_id) VALUES
  (1,  500.00,   'З. Чобіт',                 'Тримайтесь, ви молодці!',    4),
  (1,  1000.00,  'Хома В.',                  'За мою колишню собаку',     NULL),
  (1,  250.00,   'Анонім',                   NULL,                        NULL),
  (1,  200.00,   'Тамара К.',                'Скільки можу',               6),
  (1,  21500.00, 'Великий донор',            NULL,                        NULL),
  (2,  5000.00,  'Партнерська компанія',     'На добру справу',           NULL),
  (2,  20000.00, 'Анонімний жертводавець',   NULL,                        NULL),
  (3,  1000.00,  'Колишній колега Панаса',   'Тримай, друже',             NULL),
  (3,  7200.00,  'З. Чобіт',                 'Передай дітям привіт',       4),
  (10, 2000.00,  'Ф. Полтавець',             'Для наших захисників',       29),
  (10, 5800.00,  'Анонім',                   NULL,                        NULL),
  (11, 3000.00,  'Г. Жайворон',              'Важлива справа',             30),
  (12, 1500.00,  'Г. Оберемок',              'Бажаю успіху',               31),
  (13, 7500.00,  'Благодійний фонд «Разом»', NULL,                        NULL),
  (13, 500.00,   'З. Чобіт',                 'Від серця',                  4);

-- ============================================================================
-- 15. REWARD (13 нагород)
-- ============================================================================
INSERT INTO reward (id, title, description, cost_points, stock, is_active) VALUES
  (1,  'Стікерпак Hand&Hand',      'Набір з 5 вініл-стікерів',                         50,  100, TRUE),
  (2,  'Футболка Hand&Hand',       'Бавовняна футболка унісекс, розміри S–XL',        200,  30,  TRUE),
  (3,  'Кружка Hand&Hand',         'Керамічна кружка 330 мл',                         100,  50,  TRUE),
  (4,  'Сертифікат подяки',        'Іменний PDF-сертифікат за волонтерську активність', 20, 999, TRUE),
  (5,  'Брендовий рюкзак',         'Рюкзак Hand&Hand з відображувальними елементами',  300,  20,  TRUE),
  (6,  'Квиток на благодійний захід','Запрошення на щорічний гала-вечір Hand&Hand',    150,  50,  TRUE),
  (7,  'Подарунковий набір волонтера','Блокнот, ручка, термочашка в подарунковій коробці',180, 40, TRUE),
  (8,  'Знижка 20% у партнерів',   'Промокод у магазинах-партнерах проекту',           80, 200, TRUE),
  (9,  'Ексклюзивний значок',      'Металевий пін Hand&Hand у колекційній упаковці',   30,  300, TRUE),
  (10, 'Онлайн-курс безкоштовно',  'Доступ до будь-якого курсу з каталогу партнерів', 200,  60,  TRUE),
  (11, 'Менторська сесія 1:1',     'Годинна розмова з досвідченим волонтером або НГО-лідером', 400, 15, TRUE),
  (12, 'VIP-запрошення на захід',  'VIP-місце на закритій вечірці партнерів',          250,  25,  TRUE),
  (13, 'Фірмова кепка Hand&Hand',  'Вишита кепка з логотипом',                        120,  80,  TRUE);

SELECT setval('reward_id_seq', (SELECT MAX(id) FROM reward));

-- ============================================================================
-- 16. REWARD_REDEMPTION (13 викупів нагород)
-- ============================================================================
INSERT INTO reward_redemption (reward_id, user_id) VALUES
  (4,  4),   -- Анна → Сертифікат
  (1,  5),   -- Петро → Стікерпак
  (9,  18),  -- Софія → Значок
  (3,  19),  -- Микола → Кружка
  (4,  20),  -- Оксана → Сертифікат
  (8,  21),  -- Іван → Знижка
  (1,  22),  -- Дарина → Стікерпак
  (4,  23),  -- Роман → Сертифікат
  (2,  24),  -- Юлія → Футболка
  (6,  25),  -- Богдан → Квиток
  (4,  26),  -- Анастасія → Сертифікат
  (3,  27),  -- Андрій → Кружка
  (9,  28);  -- Ольга → Значок

-- ============================================================================
-- 17. POINTS_TRANSACTION (15 операцій)
-- ============================================================================
INSERT INTO points_transaction (user_id, task_assignment_id, amount, type, reason) VALUES
  (4,  1, 10,  'EARN',  'Завершено task #1: привіз корм у притулок'),
  (5,  2, 25,  'EARN',  'Завершено task #2: координація прибирання'),
  (21, 6, 20,  'EARN',  'Завершено task #6: сортування гуманітарних наборів'),
  (4,  NULL, 70, 'EARN',  'Участь у проекті #3: прибирання Голосіївського парку'),
  (5,  NULL, 30, 'EARN',  'Реєстрація на проект #1: прогулянка з собаками'),
  (5,  NULL, 25, 'EARN',  'Участь у проекті #3: прибирання парку'),
  (18, NULL, 50, 'EARN',  'Участь у проекті #5: тренінг для ветеранів'),
  (19, NULL, 60, 'EARN',  'Участь у проекті #10: ремонт дахів'),
  (20, NULL, 30, 'EARN',  'Участь у проекті #6: медогляд ВПО'),
  (22, NULL, 50, 'EARN',  'Участь у проекті #7: курси англійської'),
  (23, NULL, 30, 'EARN',  'Реєстрація та підготовка до проекту #9'),
  (24, NULL, 75, 'EARN',  'Фотодокументація проекту #11: фестиваль'),
  (25, NULL, 60, 'EARN',  'IT-підтримка організації під час проекту #5'),
  (26, NULL, 40, 'EARN',  'Тренінг для волонтерів перед проектом #12'),
  (27, NULL, 55, 'EARN',  'Водіння під час проекту #8: розподіл гумдопомоги');

-- ============================================================================
-- 18. APPROVAL_REQUEST (заявки на модерацію)
-- ============================================================================
-- Організації та волонтери — вже VERIFIED в таблицях, тут фіксуємо для журналу
INSERT INTO approval_request (type, status, entity_id, submitted_by, reviewed_by, reviewed_at) VALUES
  -- ORGANIZATION
  ('ORGANIZATION', 'APPROVED', 1,  2,  1, NOW() - INTERVAL '90 days'),
  ('ORGANIZATION', 'APPROVED', 2,  3,  1, NOW() - INTERVAL '90 days'),
  ('ORGANIZATION', 'APPROVED', 3,  7,  1, NOW() - INTERVAL '60 days'),
  ('ORGANIZATION', 'APPROVED', 4,  8,  1, NOW() - INTERVAL '55 days'),
  ('ORGANIZATION', 'APPROVED', 5,  9,  1, NOW() - INTERVAL '50 days'),
  ('ORGANIZATION', 'APPROVED', 6,  10, 1, NOW() - INTERVAL '45 days'),
  ('ORGANIZATION', 'APPROVED', 7,  11, 1, NOW() - INTERVAL '40 days'),
  ('ORGANIZATION', 'APPROVED', 8,  12, 1, NOW() - INTERVAL '35 days'),
  ('ORGANIZATION', 'APPROVED', 9,  13, 1, NOW() - INTERVAL '30 days'),
  ('ORGANIZATION', 'APPROVED', 10, 14, 1, NOW() - INTERVAL '25 days'),
  ('ORGANIZATION', 'APPROVED', 11, 15, 1, NOW() - INTERVAL '20 days'),
  ('ORGANIZATION', 'APPROVED', 12, 16, 1, NOW() - INTERVAL '15 days'),
  ('ORGANIZATION', 'APPROVED', 13, 17, 1, NOW() - INTERVAL '10 days'),
  -- VOLUNTEER
  ('VOLUNTEER', 'APPROVED', 1,  4,  1, NOW() - INTERVAL '80 days'),
  ('VOLUNTEER', 'APPROVED', 2,  5,  1, NOW() - INTERVAL '75 days'),
  ('VOLUNTEER', 'APPROVED', 3,  18, 1, NOW() - INTERVAL '30 days'),
  ('VOLUNTEER', 'APPROVED', 4,  19, 1, NOW() - INTERVAL '28 days'),
  ('VOLUNTEER', 'APPROVED', 5,  20, 1, NOW() - INTERVAL '25 days'),
  ('VOLUNTEER', 'APPROVED', 6,  21, 1, NOW() - INTERVAL '22 days'),
  ('VOLUNTEER', 'APPROVED', 7,  22, 1, NOW() - INTERVAL '20 days'),
  ('VOLUNTEER', 'APPROVED', 8,  23, 1, NOW() - INTERVAL '18 days'),
  ('VOLUNTEER', 'APPROVED', 9,  24, 1, NOW() - INTERVAL '15 days'),
  ('VOLUNTEER', 'APPROVED', 10, 25, 1, NOW() - INTERVAL '12 days'),
  ('VOLUNTEER', 'APPROVED', 11, 26, 1, NOW() - INTERVAL '10 days'),
  ('VOLUNTEER', 'APPROVED', 12, 27, 1, NOW() - INTERVAL '8 days'),
  ('VOLUNTEER', 'APPROVED', 13, 28, 1, NOW() - INTERVAL '5 days'),
  -- PROJECT
  ('PROJECT', 'APPROVED', 1,  2,  1, NOW() - INTERVAL '6 days'),
  ('PROJECT', 'APPROVED', 2,  2,  1, NOW() - INTERVAL '6 days'),
  ('PROJECT', 'APPROVED', 3,  3,  1, NOW() - INTERVAL '6 days'),
  ('PROJECT', 'PENDING',  4,  3,  NULL, NULL),
  ('PROJECT', 'APPROVED', 5,  7,  1, NOW() - INTERVAL '5 days'),
  ('PROJECT', 'APPROVED', 6,  8,  1, NOW() - INTERVAL '4 days'),
  ('PROJECT', 'APPROVED', 7,  9,  1, NOW() - INTERVAL '3 days'),
  ('PROJECT', 'APPROVED', 8,  11, 1, NOW() - INTERVAL '4 days'),
  ('PROJECT', 'APPROVED', 9,  12, 1, NOW() - INTERVAL '3 days'),
  ('PROJECT', 'APPROVED', 10, 14, 1, NOW() - INTERVAL '5 days'),
  ('PROJECT', 'APPROVED', 11, 15, 1, NOW() - INTERVAL '4 days'),
  ('PROJECT', 'APPROVED', 12, 16, 1, NOW() - INTERVAL '3 days'),
  ('PROJECT', 'APPROVED', 13, 17, 1, NOW() - INTERVAL '4 days'),
  ('PROJECT', 'APPROVED', 14, 3,  1, NOW() - INTERVAL '5 days'),
  ('PROJECT', 'APPROVED', 15, 2,  1, NOW() - INTERVAL '4 days'),
  -- NEWS
  ('NEWS', 'APPROVED', 1,  2,  1, NOW() - INTERVAL '30 days'),
  ('NEWS', 'APPROVED', 2,  3,  1, NOW() - INTERVAL '15 days'),
  ('NEWS', 'APPROVED', 3,  2,  1, NOW() - INTERVAL '3 days'),
  ('NEWS', 'APPROVED', 4,  7,  1, NOW() - INTERVAL '5 days'),
  ('NEWS', 'APPROVED', 5,  8,  1, NOW() - INTERVAL '4 days'),
  ('NEWS', 'APPROVED', 6,  9,  1, NOW() - INTERVAL '3 days'),
  ('NEWS', 'APPROVED', 7,  11, 1, NOW() - INTERVAL '4 days'),
  ('NEWS', 'APPROVED', 8,  12, 1, NOW() - INTERVAL '3 days'),
  ('NEWS', 'APPROVED', 9,  14, 1, NOW() - INTERVAL '5 days'),
  ('NEWS', 'APPROVED', 10, 15, 1, NOW() - INTERVAL '3 days'),
  ('NEWS', 'APPROVED', 11, 16, 1, NOW() - INTERVAL '2 days'),
  ('NEWS', 'APPROVED', 12, 17, 1, NOW() - INTERVAL '2 days'),
  ('NEWS', 'APPROVED', 13, 3,  1, NOW() - INTERVAL '1 day'),
  -- FUNDRAISING
  ('FUNDRAISING', 'APPROVED', 1,  2,  1, NOW() - INTERVAL '5 days'),
  ('FUNDRAISING', 'APPROVED', 2,  3,  1, NOW() - INTERVAL '60 days'),
  ('FUNDRAISING', 'APPROVED', 3,  5,  1, NOW() - INTERVAL '3 days'),
  ('FUNDRAISING', 'APPROVED', 4,  2,  1, NOW() - INTERVAL '8 days'),
  ('FUNDRAISING', 'APPROVED', 5,  3,  1, NOW() - INTERVAL '2 days'),
  ('FUNDRAISING', 'APPROVED', 6,  4,  1, NOW() - INTERVAL '45 days'),
  ('FUNDRAISING', 'APPROVED', 7,  2,  1, NOW() - INTERVAL '1 day'),
  ('FUNDRAISING', 'APPROVED', 8,  3,  1, NOW() - INTERVAL '12 days'),
  ('FUNDRAISING', 'APPROVED', 9,  5,  1, NOW() - INTERVAL '1 day'),
  ('FUNDRAISING', 'APPROVED', 10, 7,  1, NOW() - INTERVAL '4 days'),
  ('FUNDRAISING', 'APPROVED', 11, 8,  1, NOW() - INTERVAL '10 days'),
  ('FUNDRAISING', 'APPROVED', 12, 16, 1, NOW() - INTERVAL '6 days'),
  ('FUNDRAISING', 'APPROVED', 13, 11, 1, NOW() - INTERVAL '3 days');

-- ============================================================================
-- 19. ORGANIZATION_MEMBERSHIP_REQUEST (13 запитів)
-- ============================================================================
INSERT INTO organization_membership_request (organization_id, user_id, direction, status) VALUES
  (1,  6,  'REQUEST', 'PENDING'),   -- Марія → Rescue Львів
  (2,  4,  'INVITE',  'PENDING'),   -- EcoKyiv → Анна
  (3,  29, 'REQUEST', 'PENDING'),   -- Василь → ВетеранUA
  (4,  30, 'REQUEST', 'PENDING'),   -- Тетяна → МедДопомога
  (5,  31, 'REQUEST', 'PENDING'),   -- Сергій → ОсвітаПлюс
  (6,  18, 'INVITE',  'PENDING'),   -- СпортДух → Софія
  (7,  19, 'REQUEST', 'PENDING'),   -- Микола → Рука Допомоги
  (8,  22, 'INVITE',  'PENDING'),   -- Дитяча Радість → Дарина
  (9,  30, 'REQUEST', 'PENDING'),   -- Тетяна → Їжа та Турбота
  (10, 21, 'REQUEST', 'ACCEPTED'),  -- Іван → Відбудова Разом (прийнято)
  (11, 24, 'INVITE',  'PENDING'),   -- Культурна ДНК → Юлія
  (12, 27, 'REQUEST', 'PENDING'),   -- Андрій → Дах і Тепло
  (13, 28, 'REQUEST', 'PENDING');   -- Ольга → Переселенці Разом

-- ============================================================================
-- 20. TICKET (13 звернень)
-- ============================================================================
INSERT INTO ticket (id, user_id, title, description, status, priority, location_id, volunteer_profile_id) VALUES
  (1,  6,  'Кішка з кошенятами закрита у підвалі будинку',
       'Добрий день! У нас у дворі на Дерибасівській якісь нелюди забили дошками вікно в підвал, а там залишилася дика кішка з трьома маленькими кошенятами, вони пищать уже другий день. Сусіди скандалять, відкривати відмовляються. Потрібна допомога волонтерів, щоб витягнути бідних малюків та знайти їм перетримку, бо вони там просто задихнуться або помруть з голоду!',
       'IN_REVIEW', 'HIGH', 4, NULL),
  (2,  6,  'Гора автомобільних шин прямо на березі біля Гідропарку',
       'Хтось посеред ночі викинув кілька десятків старих лисих шин від вантажівок прямо біля води, неподалік дитячого пляжу. Жахливий сморід на сонці, та й діти можуть травмуватися, якщо почнуть на них лізти. Може ми організуємо якусь міні-толоку з хлопцями чи машиною, щоб вивезти це на утилізацію, поки ніхто не підпалив?',
       'IN_REVIEW', 'MEDIUM', 2, NULL),
  (3,  4,  'Потрібні ліки та продукти для самотньої бабусі (пані Марія, 82 роки)',
       'Пані Марія живе сама в будинку на Соборній, майже не ходить через хворі суглоби. Соцпрацівник до неї приходить раз на два тижні, цього зовсім не вистачає. Гроші на ліки вона назбирала, список є, але треба людина, яка зможе зайти в аптеку, забрати специфічні серцеві препарати і купити свіжого хліба та молока. Хто поруч, відгукніться!',
       'IN_REVIEW', 'MEDIUM', 1, NULL),
  (4,  4,  'Коробка з цуценятами біля смітника, пищать на весь двір',
       'Якісь «господарі» просто викинули в закритій картонній коробці п''ятьох крихітних цуценят, вони ще навіть очі повністю не відкрили! Лежать прямо біля баків, мерзнуть під дощем. Я забрала їх тимчасово в тамбур, але у мене в самої дві великі собаки, тримати не можу взагалі. Терміново потрібна суміш для вигодовування та перетримка, будь ласка!',
       'IN_REVIEW', 'HIGH', 3, NULL),
  (5,  5,  'Величезна суха гілка тополі нависла над дитячим майданчиком садочка',
       'У дворі дитячого садка №15 після останнього сильного буревію сильно надламалася стара гілка. Вона тримається буквально на чесному слові і висить прямо над гойдалками. Завідуюча каже, що ЖЕК обіцяв приїхати через місяць, але це ж небезпечно для дітей! Потрібні волонтери зі своїми пилами або арбористи, щоб акуратно її зрізати.',
       'IN_REVIEW', 'LOW', 5, NULL),
  (6,  6,  'Шукаємо теплу куртку та взуття для хлопчика 6 років (родина ВПО)',
       'Мама з дитиною щоправда приїхали з Херсона, заселилися в кімнатку гуртожитку. Виїхали літом, теплі речі з собою не взяли. Зараз хлопчик сидить в приміщенні, бо банально немає в чому вийти на вулицю — потрібна куртка на зріст 116-122 см та осінні черевички 29-30 розміру. Може у когось лежать речі ваших дітей, з яких вони виросли? Будемо дуже вдячні!',
       'IN_REVIEW', 'MEDIUM', 1, NULL),
  (7,  6,  'Злив якихось маслянистих відходів в озеро на Оболоні',
       'Сьогодні вранці під час прогулянки помітив на поверхні озера велику райдужну плівку і характерний хімічний запах солярки чи мастила. Схоже, якась автомайстерня поруч зливає відходи прямо в дощову каналізацію, яка веде у водойму. Качки всі брудні, треба терміново викликати еко-інспекцію і подумати, як очистити воду!',
       'IN_REVIEW', 'HIGH', 2, NULL),
  (8,  4,  'Допомога з транспортом для ветерана на реабілітацію',
       'Нашому захиснику Олександру (після важкого поранення ніг) потрібно тричі на тиждень їздити з передмістя в реабілітаційний центр у Києві. Громадським транспортом на кріслі колісному туди дістатися фізично нереально, таксі коштує космічних грошей. Шукаємо волонтерів на машині, готових підстрахувати з поїздками хоча б по вівторках.',
       'IN_REVIEW', 'HIGH', 2, NULL),
  (9,  5,  'Брак кормів у приватному міні-притулку пенсіонерки',
       'Пані Валентина самотужки утримує у своїй старій хаті 15 котів, яких підібрала на вулиці. Жінка витрачає всю свою крихітну пенсію на ветеринарів, але зараз їй зовсім немає за що купити їжу для них. Коти сидять на самій каші. Потрібно хоча б кілька мішків звичайного сухого корму, щоб старенька могла прогодувати своїх пухнастиків.',
       'IN_REVIEW', 'MEDIUM', 3, NULL),
  (10, 6,  'Хочемо зробити суботник і облаштувати клумбу біля під''їзду',
       'Ми з сусідками вирішили прибрати наш занедбаний двір, вивезти старе листя та посадити квіти. Саджанці ми купимо самі, але у нас у будинку живуть одні жінки й літні люди — нам критично потрібні 2-3 міцних хлопці на пару годин, щоб скопати тверду землю під клумбу та допомогти вивезти важке каміння. Чай і пиріжки гарантуємо!',
       'IN_REVIEW', 'LOW', 1, NULL),
  (11, 4,  'Поранена собака лежить на узбіччі траси під Львовом',
       'Терміново! Їхала по об''їзній, побачила великого пса, лежить у траві біля заправки, не може підвестися на задні лапи, явно збила машина. Собака плаче, але близько до себе не підпускає — гарчить від болю й страху. Я сама на маленькій машині без переноски, підняти його не зможу. Потрібні люди з досвідом відлову та великим авто, щоб відвезти його в клініку!',
       'IN_REVIEW', 'HIGH', 1, NULL),
  (12, 4,  'Пошкоджене дерево загрожує безпеці',
       'Велика стара верба нахилена після вітру над дитячим майданчиком. Потрібне термінове спилювання.',
       'OPEN', 'MEDIUM', 1, NULL),
  (13, 29, 'Допомога з документами для переселенців',
       'Сусід-переселенець не може отримати статус ВПО через бюрократичні складнощі. Потрібен юрист.',
       'OPEN', 'HIGH', 6, NULL);

SELECT setval('ticket_id_seq', (SELECT MAX(id) FROM ticket));

INSERT INTO ticket_category (ticket_id, category_id) VALUES
  (1,  12), (1,   4),  -- Кішка у підвалі → Тварини, Соціальна допомога
  (2,   3),            -- Шини на березі → Екологія
  (3,   4), (3,  10),  -- Ліки для бабусі → Соціальна допомога, Гуманітарна
  (4,  12),            -- Цуценята → Тварини
  (5,   3),            -- Суха гілка → Екологія
  (6,  10),            -- Куртка для ВПО-дитини → Гуманітарна допомога
  (7,   3),            -- Злив відходів → Екологія
  (8,   9),            -- Транспорт для ветерана → Армія та оборона
  (9,  12),            -- Корми для притулку → Тварини
  (10,  3),            -- Суботник-клумба → Екологія
  (11, 12),            -- Поранена собака → Тварини
  (12,  3), (12, 13),  -- Пошкоджене дерево → Екологія, Інфраструктура
  (13, 10), (13,  4);  -- Документи ВПО → Гуманітарна, Соціальна допомога

-- ============================================================================
-- 21. NOTIFICATION (15 повідомлень)
-- ============================================================================
INSERT INTO notification (user_id, message, is_read, type) VALUES
  (4,  'Ваш запит на проект «Прогулянка з собаками» прийнято.',           FALSE, 'PROJECT'),
  (4,  'EcoKyiv запросив вас до організації.',                            FALSE, 'GENERAL'),
  (5,  'Ваш запит на проект «Прогулянка з собаками» очікує розгляду.',    TRUE,  'PROJECT'),
  (6,  'Дякуємо за реєстрацію в Hand&Hand!',                             TRUE,  'GENERAL'),
  (6,  'Ваше звернення №1 прийняте на розгляд.',                         FALSE, 'TICKET'),
  (18, 'Ваш запит на проект «Цифрові навички для ветеранів» прийнято.',   FALSE, 'PROJECT'),
  (19, 'Вас призначено на завдання #4: координація медогляду.',            FALSE, 'TASK'),
  (20, 'Ваш запит на участь у медогляді для ВПО прийнято.',               FALSE, 'PROJECT'),
  (21, 'Ви стали членом організації «Відбудова Разом».',                  FALSE, 'GENERAL'),
  (22, 'Ваш запит на проект «Безкоштовна англійська» прийнято.',          TRUE,  'PROJECT'),
  (24, 'Новий збір від «Культурна ДНК» потребує вашої підтримки.',        FALSE, 'GENERAL'),
  (25, 'Завдання #10 призначено вам: розстановка ліжок.',                 FALSE, 'TASK'),
  (29, 'Дякуємо за реєстрацію в Hand&Hand! Долучайтесь до проектів.',     TRUE,  'GENERAL'),
  (30, 'Ваше звернення №9 прийняте на розгляд.',                         FALSE, 'TICKET'),
  (4,  'Ви отримали 10 балів за виконання завдання «Привезти корм».',      FALSE, 'REWARD');

-- ============================================================================
-- ДОПОВНЕННЯ: повне покриття всіх 15 категорій
-- ============================================================================

-- 3 нові app_user (IDs 32–34) для нових організацій
INSERT INTO app_user (id, email, password_hash, role, status, points, first_name, last_name, city, avatar_url, organization_id) VALUES
  (32, 'org-military@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Галина', 'Мачуха', 'Київ',
       'https://i.pravatar.cc/300?img=30', NULL),
  (33, 'org-disabled@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Юхим', 'Клименко', 'Львів',
       'https://i.pravatar.cc/300?img=65', NULL),
  (34, 'org-mental@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Євдокія', 'Яремченко', 'Харків',
       'https://i.pravatar.cc/300?img=48', NULL);

SELECT setval('app_user_id_seq', (SELECT MAX(id) FROM app_user));

-- 3 нові organization_profile (IDs 14–16)
INSERT INTO organization_profile (id, user_id, name, edrpou, description, verification_status, official_docs_url, contact_phone, contact_email, city, logo_url, location_id, mission) VALUES
  (14, 32, 'Армія Змін', '12131415',
       'Волонтерська організація, що збирає і відправляє допомогу діючим підрозділам ЗСУ: маскувальні сітки, медикаменти, засоби зв''язку, теплі речі. Підтримуємо родини військових та організовуємо листи й посилки на передову.',
       'VERIFIED', 'https://picsum.photos/seed/org-doc-14/400/565',
       '+380442101010', 'info@armyazmin.org.ua', 'Київ',
       'https://ui-avatars.com/api/?name=AZ&background=2c3e50&color=fff&size=200&bold=true', 2,
       'Кожен захисник має знати, що вдома на нього чекають і піклуються про нього.'),
  (15, 33, 'Без Бар''єрів', '13141516',
       'Громадська організація з інклюзії та доступності для людей з інвалідністю: встановлення пандусів і підйомників, безкоштовні курси жестової мови, правова допомога, адвокація доступного середовища у містах.',
       'VERIFIED', 'https://picsum.photos/seed/org-doc-15/400/565',
       '+380322202020', 'access@bezbaryeriv.org.ua', 'Львів',
       'https://ui-avatars.com/api/?name=BB&background=7048e8&color=fff&size=200&bold=true', 1,
       'Рівні можливості — не привілей, а невід''ємне право кожної людини.'),
  (16, 34, 'Простір Підтримки', '14151617',
       'Психологічна служба для ветеранів, переселенців та родин загиблих. Надаємо безкоштовні індивідуальні консультації, проводимо групову терапію, арт-терапію та тренінги зі стресостійкості. Всі спеціалісти — сертифіковані психологи.',
       'VERIFIED', 'https://picsum.photos/seed/org-doc-16/400/565',
       '+380572303030', 'help@prostirpidtrymky.org.ua', 'Харків',
       'https://ui-avatars.com/api/?name=PP&background=e64980&color=fff&size=200&bold=true', 6,
       'Психічне здоров''я — основа відновлення людини і країни.');

SELECT setval('organization_profile_id_seq', (SELECT MAX(id) FROM organization_profile));

-- organization_category для нових організацій
INSERT INTO organization_category (organization_id, category_id) VALUES
  (14,  9), (14,  8),  -- Армія Змін → Армія та оборона, Волонтерство
  (15, 13), (15,  4),  -- Без Бар'єрів → Інфраструктура, Соціальна допомога
  (16,  2), (16,  4);  -- Простір Підтримки → Медицина, Соціальна допомога

-- 14 нових проектів (IDs 16–29) — по 2 на кожну категорію без покриття
INSERT INTO project (id, organization_profile_id, title, description, status, starts_at, ends_at, main_content, what_volunteers_will_do, why_its_important, time, application_deadline, location_id, category_id, partners, image_url, participants) VALUES

  -- Армія (5) -----------------------------------------------------------------
  (16, 14, 'Плетіння маскувальних сіток для ЗСУ',
      'Щотижневі сесії плетіння маскувальних сіток 3×6 м — для підрозділів ЗСУ на Харківському напрямку.',
      'ACTIVE', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 5 hours',
      'Підрозділи ЗСУ постійно потребують маскувальних сіток для укриття техніки, позицій та особового складу. Одна сітка 3×6 м займає 4–6 годин роботи або 2–3 години командою з трьох осіб. Армія Змін організовує щосуботні сесії у Києві та мережу домашніх майстрів по всій Україні. Готові сітки передаються напряму до підрозділів через перевірених кур''єрів. Приєднатись може кожен — навчимо з нуля за 20 хвилин.',
      'Плести сітки на металевих рамах (навчимо з нуля), нарізати та прикріплювати смуги тканини, перевіряти якість готових виробів, пакувати і маркувати для відправки на передову.',
      'Маскування рятує техніку та людські життя. Один танк без сітки видно з FPV-дрона за кілька кілометрів. Сітка вартістю 300 грн матеріалів може вберегти техніку та екіпаж на мільйони. Кожна година вашої роботи — це реальний захист наших бійців.',
      'Субота, 10:00–15:00', NOW() + INTERVAL '2 days', 2, 5,
      'Волонтерський центр «Серце», Мінветеранів',
      'https://loremflickr.com/600/400/military,camouflage?lock=16', 20),

  (17, 14, 'Листи та посилки підтримки для захисників',
      'Збираємо листи, малюнки і невеликі посилки з солодощами й корисними речами для бійців на передовій.',
      'ACTIVE', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days 4 hours',
      'Навіть простий лист від незнайомої людини дає бійцю відчуття, що вдома про нього пам''ятають. Армія Змін збирає листи від школярів, дорослих і організацій, сортує їх та передає у підрозділи разом із практичними посилками — теплі шкарпетки, батончики, батарейки, освіжувачі рота. Щомісяця відправляємо 5–8 ящиків. Жодного воїна без листа.',
      'Писати листи та листівки підтримки, малювати малюнки (для школярів), допомагати сортувати і пакувати посилки, вести облік вантажу, відносити ящики на відправлення.',
      'Воїни стоять місяцями без ротації. Знати, що суспільство їх підтримує — критично для бойового духу та психічного стану. Це найдешевший і найдієвіший спосіб показати вдячність людям, що захищають нас кожного дня.',
      'Неділя, 11:00–15:00', NOW() + INTERVAL '8 days', 2, 5,
      'Мережа шкіл Києва, Укрпошта Volunteer',
      'https://loremflickr.com/600/400/letter,support,military?lock=17', 50),

  -- Люди з інвалідністю (12) --------------------------------------------------
  (18, 15, 'Встановлення пандусів у громадських будівлях Львова',
      'Будуємо та монтуємо пандуси, поручні та тактильну плитку — робимо місто доступним для всіх.',
      'ACTIVE', NOW() + INTERVAL '5 days', NOW() + INTERVAL '7 days',
      'Близько 30% будівель у центрі Львова досі недоступні для людей на кріслах-колясках. «Без Бар''єрів» разом із волонтерами-будівельниками встановлює пандуси, поручні та тактильну плитку в аптеках, школах, лікарнях і бібліотеках. Кожен об''єкт проходить попередній аудит доступності. Матеріали закупляє організація, волонтери — руки та час.',
      'Монтаж збірних пандусів, встановлення поручнів, укладка тактильної плитки при вході, прибирання будівельного сміття після монтажу, фотофіксація до і після.',
      'Людина на кріслі-колясці, що не може зайти до лікарні — позбавлена права на медицину. Людина з вадами зору, що не має тактильного орієнтира — ризикує впасти. Доступне середовище — це не опція, а конституційне право кожного громадянина.',
      'Субота–Неділя, 9:00–16:00', NOW() + INTERVAL '3 days', 1, 12,
      'Львівська міська рада, Rotary Club Lviv',
      'https://loremflickr.com/600/400/wheelchair,ramp,accessible?lock=18', 15),

  (19, 15, 'Безкоштовні курси жестової мови — базовий рівень',
      'Вивчаємо Ukrainian Sign Language разом — 100 ключових жестів для чуючих за один воркшоп.',
      'ACTIVE', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days 3 hours',
      'В Україні понад 36 000 людей з глухотою. Більшість чуючих не знають жодного жесту — це веде до ізоляції глухих у медицині, освіті та роботі. «Без Бар''єрів» проводить щомісячні воркшопи з базового USL: 100 найважливіших жестів за 3 години. Викладає сама людина з глухотою. Участь безкоштовна для всіх, включно з людьми з інвалідністю.',
      'Допомагати учасникам із запитаннями, вести відеозапис уроків для YouTube-каналу організації, допомагати з технічним забезпеченням залу, реєструвати учасників на вході.',
      'Знання 100 базових жестів дозволяє чуючій людині допомогти глухій у лікарні чи магазині. Це знімає бар''єр і рятує від почуття безпорадності з обох боків. Кожен, хто вивчив USL, стає агентом інклюзії у своєму середовищі.',
      'Субота, 11:00–14:00', NOW() + INTERVAL '6 days', 1, 12,
      'Федерація глухих України, British Council',
      'https://loremflickr.com/600/400/sign,language,deaf?lock=19', 30),

  -- Психологічна підтримка (14) -----------------------------------------------
  (20, 16, 'Безкоштовні психологічні консультації для ветеранів',
      'Записуємо ветеранів на індивідуальні сесії з сертифікованими психологами — онлайн та офлайн у Харкові.',
      'ACTIVE', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days 6 hours',
      'ПТСР, депресія, розлади сну, труднощі з поверненням до цивільного життя — реальні проблеми більшості ветеранів після бойового досвіду. «Простір Підтримки» пропонує 10 безкоштовних сесій з психологом кожному ветерану. Запис ведеться через застосунок або телефон і займає до 48 годин. Доступні і Zoom-формат, і особиста зустріч у кабінеті на пр. Науки.',
      'Вести реєстрацію та координацію запису, нагадувати клієнтам про сесії телефоном або SMS, допомагати з технічними питаннями під час онлайн-зустрічей, підтримувати порядок у зоні очікування.',
      'Нелікований ПТСР веде до алкоголізму, агресії та суїциду. Раннє втручання у 80% випадків дає позитивний ефект за 10–12 сесій. Ветеран, що отримав допомогу, повертається до родини і суспільства — і стає прикладом для інших.',
      'Пн/Ср/Пт, 9:00–18:00', NOW() + INTERVAL '2 days', 6, 14,
      'Мінветеранів, Фонд «Повернись живим» (психпрограми)',
      'https://loremflickr.com/600/400/psychologist,therapy?lock=20', 40),

  (21, 16, 'Групова арт-терапія для переселенців і ветеранів',
      'Щотижневі групи арт-терапії: малювання, ліплення, письмо — безпечний простір для опрацювання травми.',
      'ACTIVE', NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days 3 hours',
      'Арт-терапія не вимагає художнього таланту — вона дає вихід емоціям через творчість. Групи по 8–10 осіб проводяться щовівторка, веде сертифікований арт-терапевт. Матеріали надаємо безкоштовно. Є дитячі та дорослі групи. Особлива програма для тих, хто пережив втрату близьких або бойову травму.',
      'Допомагати арт-терапевту готувати матеріали (розкладати фарби, готувати глину), організовувати простір, фотодокументувати заходи виключно з дозволу учасників, прибирати після сесій.',
      'Творчість активує ділянки мозку, що відповідають за переробку травматичного досвіду. Арт-терапія знижує рівень кортизолу на 30–40% вже після першої сесії та допомагає людині знайти нові сенси після важких подій.',
      'Вівторок, 16:00–18:00', NOW() + INTERVAL '4 days', 6, 14,
      'ЮНІСЕФ, Фонд ООН у галузі народонаселення',
      'https://loremflickr.com/600/400/art,therapy,healing?lock=21', 16),

  -- Спорт (13) ----------------------------------------------------------------
  (22, 6, 'Безкоштовна секція футболу для дітей ВПО',
      'Тренування двічі на тиждень у Запоріжжі для дітей 7–14 років — форма, м''яч і тренер надаються.',
      'ACTIVE', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 2 hours',
      'Спорт для дітей — це не розвага, а соціалізація, здоров''я і ментальна стійкість. Для дітей переселенців — це ще й шанс знайти нових друзів у незнайомому місті. СпортДух відкриває безкоштовну секцію в ДЮСШ №3: 2 тренування на тиждень, форма та м''яч надаються. Тренер — Василь Лахман, майстер спорту з футболу, 12 років тренерського досвіду.',
      'Допомагати тренеру збирати дітей на майданчику, вести облік відвідуваності, надавати першу допомогу за потреби, супроводжувати дітей від зупинки до стадіону та назад.',
      'Діти, що грають у команді, рідше мають депресію та агресію. Для ВПО-дітей секція — це якір стабільності в нестабільному світі. Командна гра вчить довіряти, комунікувати і перемагати разом.',
      'Вт/Чт, 16:00–17:30', NOW() + INTERVAL '1 day', 8, 13,
      'ДЮСШ №3 Запоріжжя, UEFA Grassroots',
      'https://loremflickr.com/600/400/kids,football,sport?lock=22', 30),

  (23, 6, 'Адаптивний спорт для людей з інвалідністю',
      'Заняття з адаптивного баскетболу та настільного тенісу для осіб на кріслах-колясках і з вадами зору.',
      'ACTIVE', NOW() + INTERVAL '12 days', NOW() + INTERVAL '12 days 3 hours',
      'СпортДух разом із «Без Бар''єрів» відкриває перший у Запоріжжі клуб адаптивного спорту. Заняття проходять у доступному спортзалі з широкими дверима та спеціальним покриттям. Планується участь у всеукраїнських змаганнях з адаптивного тенісу вже наступного сезону. Інвентар і транспортування для учасників — безкоштовно.',
      'Допомагати учасникам з пересуванням у спортзалі, підготовка та прибирання інвентарю, ведення обліку відвідуваності, відеозйомка для соціальних мереж організації.',
      'Адаптивний спорт повертає впевненість у собі людям, що пережили ампутацію чи набули інвалідність. Це ефективніший шлях реабілітації, ніж медичні процедури окремо — бо повертає людину до спільноти.',
      'Субота, 11:00–13:00', NOW() + INTERVAL '10 days', 8, 13,
      'Паралімпійський комітет України, Без Бар''єрів',
      'https://loremflickr.com/600/400/adaptive,sport,wheelchair?lock=23', 20),

  -- Літні люди (9) ------------------------------------------------------------
  (24, 9, 'Доставка продуктів та ліків самотнім пенсіонерам',
      'Щотижнева волонтерська доставка продуктових наборів і рецептурних ліків до дверей самотніх літніх людей.',
      'ACTIVE', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 4 hours',
      'У Хмельницькому понад 2 400 самотніх пенсіонерів, що через стан здоров''я або відсутність рідних не можуть самостійно купувати продукти та ліки. «Їжа та Турбота» організовує системну доставку: волонтери отримують список адрес і маршрут, відвідують 5–8 людей за один виїзд. Попутно перевіряють загальний стан підопічного та сигналізують соціальним службам у разі потреби.',
      'Отримати список адрес та маршрут, закупити або забрати готові пакети зі складу, доставити по адресах, зателефонувати кожному підопічному наступного дня для зворотного зв''язку.',
      'Самотній пенсіонер без допомоги може провести дні без їжі та ліків. Крім матеріальної допомоги, регулярний контакт із волонтером знижує ризик депресії та суїциду серед літніх людей на 60% — підтверджено дослідженнями WHO.',
      'Субота, 9:00–14:00', NOW() + INTERVAL '2 days', 11, 9,
      'Хмельницька міська рада, Укрпошта (соц. тариф)',
      'https://loremflickr.com/600/400/elderly,volunteer,delivery?lock=24', 15),

  (25, 5, 'Цифрова грамотність для пенсіонерів: Дія і онлайн-запис до лікаря',
      'Навчаємо людей 65+ користуватись смартфоном, застосунком «Дія» та онлайн-записом до лікаря.',
      'ACTIVE', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days 3 hours',
      'Цифровий розрив між поколіннями особливо помітний серед людей 65+. Водночас держава переводить дедалі більше послуг онлайн. ОсвітаПлюс проводить 3-годинний практичний воркшоп: кожен учасник приходить зі своїм смартфоном і виходить з встановленою Дією, записом до лікаря та умінням відеодзвонити родичам. Темп повільний, пояснення зрозумілі, жодних знущань — лише терпіння і повага.',
      'Сидіти поруч з учасником і особисто допомагати виконувати кроки на смартфоні, терпляче пояснювати повторно стільки разів, скільки потрібно, допомагати виправити помилки, записувати найпоширеніші запитання для наступного заняття.',
      'Пенсіонер, що вміє користуватись Дією, може самостійно оформити субсидію, записатись до лікаря і не стояти годинами в чергах. Це повертає самостійність і людську гідність — а не лише економить час.',
      'Неділя, 11:00–14:00', NOW() + INTERVAL '5 days', 4, 9,
      'Укртелеком, Нова пошта (оплачує оренду залу)',
      'https://loremflickr.com/600/400/elderly,smartphone,digital?lock=25', 20),

  -- Культура (7) --------------------------------------------------------------
  (26, 11, 'Майстер-клас з традиційного писанкарства Полісся',
      'Навчаємо розписувати писанки у традиційній поліській техніці — для дітей і дорослих, матеріали надаємо.',
      'ACTIVE', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days 4 hours',
      'Писанкарство — один із найдавніших видів українського декоративного мистецтва. Кожен регіон має свій стиль, кольори і символи. Культурна ДНК проводить майстер-клас з традиційними поліськими орнаментами за старовинними зразками, зібраними у фондах Житомирського краєзнавчого музею. Матеріали — яйця, писачки, натуральний віск, рослинні фарби — надаємо. Учасники забирають свої писанки додому.',
      'Допомагати учасникам у технічних питаннях (розплавлення воску, рівномірне фарбування), слідкувати за безпечним використанням свічок, розповідати про символіку орнаментів, організовувати простір та прибирати після заходу.',
      'Власноруч виготовлена писанка за 300-річним орнаментом — це живий зв''язок з предками. Коли людина знає, що означає кожен символ, вона відчуває себе частиною неперервної культурної традиції, яку неможливо стерти.',
      'Субота, 11:00–15:00', NOW() + INTERVAL '12 days', 13, 7,
      'Житомирський обласний краєзнавчий музей',
      'https://loremflickr.com/600/400/ukrainian,pysanka,art?lock=26', 40),

  -- Ветерани (11) -------------------------------------------------------------
  (27, 3, 'Група психологічної підтримки для ветеранів ЗСУ',
      'Щотижнева закрита група взаємопідтримки для ветеранів — з психологом, без осуду і без тиску.',
      'ACTIVE', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days 2 hours',
      'Повернутись з війни і говорити про це — важко. Закрита група взаємопідтримки — це простір, де ветерани слухають і чують одне одного. Зустрічі відбуваються щовівторка у центрі ВетеранUA, веде психолог з досвідом роботи з бойовою травмою. Учасники можуть говорити або просто слухати — жодного тиску. Конфіденційність гарантована.',
      'Допомагати організатору з логістикою і підготовкою приміщення, зустрічати учасників, забезпечувати каву і чай, вести облік відвідувань (знеособлено), за потреби супроводжувати до транспорту.',
      'Соціальна ізоляція після повернення з фронту — одна з головних причин ПТСР та суїцидальних думок. Регулярна група зменшує ризик важких наслідків і допомагає ветерану усвідомити: він не один, і те, що він відчуває — нормальна реакція на ненормальні події.',
      'Вівторок, 18:00–20:00', NOW() + INTERVAL '3 days', 6, 11,
      'ВетеранUA, Простір Підтримки',
      'https://loremflickr.com/600/400/veterans,group,support?lock=27', 12),

  -- Безхатьки (15) ------------------------------------------------------------
  (28, 12, 'Мобільний пункт допомоги безхатнім: їжа та одяг',
      'Щотижневий виїзний пункт біля вокзалу Харкова: гарячий суп, хліб, одяг і адреси нічліжок.',
      'ACTIVE', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days 4 hours',
      'Взимку температура в Харкові опускається до -20°C, і для безхатніх кожна ніч — боротьба за виживання. «Дах і Тепло» організовує щотижневий мобільний пункт: гарячий суп, хліб, термобілизна, перев''язувальні матеріали, список найближчих нічліжок і соціальних служб. Команда — 4–6 волонтерів із мікроавтобусом. Маршрут: залізничний вокзал → центральний ринок → три підземні переходи.',
      'Допомагати завантажувати і видавати їжу та одяг, консультувати людей щодо нічліжок і соціальних служб міста, вести облік виданого, слідкувати за безпекою команди, фіксувати критичні медичні випадки для передачі до медслужб.',
      'Мороз вбиває безхатніх людей. Одна чашка гарячого супу може врятувати від переохолодження. Крім матеріального, особистий контакт із волонтером часто стає першим кроком до повернення людини до суспільства — ми бачили це неодноразово.',
      'Четвер, 12:00–15:00', NOW() + INTERVAL '2 days', 6, 15,
      'Харківська міська рада (дозвіл), МедВолонтер Харків',
      'https://loremflickr.com/600/400/homeless,food,volunteer?lock=28', 8),

  -- Медицина (4) ---------------------------------------------------------------
  (29, 4, 'Виїзна вакцинація у прифронтових селах Дніпропетровщини',
      'Мобільна бригада лікарів виїжджає у 5 сіл для вакцинації та первинного огляду мешканців.',
      'ACTIVE', NOW() + INTERVAL '9 days', NOW() + INTERVAL '10 days',
      'Сільські амбулаторії в прифронтових районах часто зачинені або не мають запасів вакцин. МедДопомога організовує виїзні бригади по 3–4 лікарі: вакцинація від грипу, правця, гепатиту B, а також первинний огляд для виявлення хронічних захворювань. За один дворазовий виїзд охоплюємо 80–120 осіб з 5 сіл. Всіх виявлених хворих направляємо далі безкоштовно.',
      'Допомагати реєструвати пацієнтів і вести картки, готувати матеріали для лікарів, допомагати з транспортуванням медичного обладнання, слідкувати за чергою і заспокоювати тривожних пацієнтів.',
      'Без щеплень навіть незначна епідемія грипу може знищити ціле село, яке й так перебуває в стресі через бойові дії. Виїзна вакцинація — єдиний спосіб забезпечити захист людям, що не можуть добратись до міста самостійно.',
      'Пн–Вт, 8:00–17:00', NOW() + INTERVAL '7 days', 7, 4,
      'МОЗ України, ВООЗ, Pfizer Ukraine',
      'https://loremflickr.com/600/400/vaccination,medical,rural?lock=29', 0);

SELECT setval('project_id_seq', (SELECT MAX(id) FROM project));

INSERT INTO project_category (project_id, category_id) VALUES
  (16,  9), (16,  8),          -- Маскувальні сітки ЗСУ → Армія, Волонтерство
  (17,  9), (17,  8),          -- Листи та посилки захисникам → Армія, Волонтерство
  (18, 13), (18,  4),          -- Встановлення пандусів → Інфраструктура, Соціальна допомога
  (19,  4), (19,  1),          -- Курс жестової мови → Соціальна допомога, Освіта
  (20,  2), (20,  9),          -- Психологічні консультації ветеранів → Медицина, Армія
  (21,  2), (21, 10),          -- Групова арт-терапія → Медицина, Гуманітарна допомога
  (22,  6), (22, 11), (22, 10), -- Футбол для дітей ВПО → Спорт, Діти, Гуманітарна
  (23,  6), (23,  4),          -- Адаптивний спорт → Спорт, Соціальна допомога
  (24,  4), (24, 10),          -- Доставка продуктів пенсіонерам → Соціальна, Гуманітарна
  (25,  4), (25,  1),          -- Цифрова грамотність пенсіонерів → Соціальна, Освіта
  (26,  5),                    -- Майстер-клас писанкарство → Культура
  (27,  9), (27,  2),          -- Група підтримки ветеранів → Армія, Медицина
  (28,  4), (28, 10),          -- Мобільний пункт для безхатніх → Соціальна, Гуманітарна
  (29,  2), (29, 10);          -- Виїзна вакцинація → Медицина, Гуманітарна допомога

-- 14 нових новин (IDs 14–27) — по 2 на кожну неохоплену категорію
INSERT INTO news (id, title, image_url, is_pinned, description, main_content, organization_id, status) VALUES

  -- Армія (5) -----------------------------------------------------------------
  (14, 'Передали 200 маскувальних сіток підрозділам ЗСУ на Харківщині',
       'https://loremflickr.com/600/400/military,camouflage,ukraine?lock=34', TRUE,
       'Армія Змін завершила місячний збір і відправила на передову рекордну партію — 200 сіток 3×6 м.',
       'Упродовж чотирьох тижнів 85 волонтерів щоп''ятниці і щосуботи збирались у волонтерському хабі на Подолі. Результат: 200 маскувальних сіток — 3 600 кв. м маскування. Конвой із трьох мікроавтобусів доставив вантаж у три підрозділи 92-ї бригади. Матеріали — переважно джут і поліестер — закупили на зібрані кошти. Командир підрозділу написав листа: «Ми думали, що нас забули — виявилось, пам''ятають. Дякуємо кожному, хто плів».',
       14, 'PUBLISHED'),

  (15, 'День подяки захисникам: волонтери відвідали військовий шпиталь у Києві',
       'https://loremflickr.com/600/400/hospital,volunteers,ukraine?lock=35', FALSE,
       'Армія Змін організувала виїзд до військового шпиталю — листи, концерт і подарунки для поранених бійців.',
       'Понад 60 волонтерів та учнів трьох київських шкіл відвідали Центральний військовий госпіталь: принесли 400 листів від школярів, виступили з коротким концертом, роздали набори гігієни та солодощі. Лікарі відзначили, що після таких візитів пацієнти активніше йдуть на реабілітацію. Двоє бійців попросили контакти волонтерів — хочуть приєднатись до організації після одужання та виписки.',
       14, 'PUBLISHED'),

  -- Люди з інвалідністю (12) --------------------------------------------------
  (16, 'У Львові встановили 25 пандусів — аптеки, школи, поліклініки стали доступні',
       'https://loremflickr.com/600/400/ramp,accessibility,wheelchair?lock=36', FALSE,
       'Без Бар''єрів завершила перший етап програми доступності в центральній частині міста.',
       '«Без Бар''єрів» разом із 40 волонтерами-будівельниками за два місяці встановила 25 пандусів у найбільш відвідуваних будівлях: 8 аптек, 5 шкіл, 4 поліклініки, 3 бібліотеки, 5 адміністративних будівель. Кожен пандус відповідає ДБН В.2.2-17. Паралельно нанесено тактильну плитку перед 12 входами. Проведено аудит ще 40 будівель — вони у наступному плані. Мета на рік: 100 доступних об''єктів у Львові.',
       15, 'PUBLISHED'),

  (17, 'Курс жестової мови: 120 чуючих опанували базовий USL за місяць',
       'https://loremflickr.com/600/400/sign,language,deaf,hands?lock=37', FALSE,
       'Без Бар''єрів планувала 60 учасників — прийшли 120. Довелось відкрити додаткові групи.',
       'Реєстрація відкрилась у понеділок, а в середу вже закрилась: всі місця розібрали. Серед учасників — медики, педагоги, поліцейські та просто небайдужі люди. Лектор — Оксана Дем''яненко, сама людина з глухотою. Після курсу: 89% учасників впевнено вітаються жестами, 60% можуть провести базовий діалог. Наступний потік відкрито — записатись можна на сайті організації.',
       15, 'PUBLISHED'),

  -- Психологічна підтримка (14) -----------------------------------------------
  (18, 'Простір Підтримки провів 500 безкоштовних сесій психолога за перший рік роботи',
       'https://loremflickr.com/600/400/psychologist,mental,health?lock=38', TRUE,
       'Психологічна служба підбила річні підсумки: 500 сесій, 87 ветеранів, 134 переселенці, 7 фахівців.',
       'За перший рік «Простір Підтримки» провів 500 індивідуальних і 80 групових сесій. 87 ветеранів пройшли повний курс (10 сесій): 73% оцінили покращення стану як значне за шкалою PHQ-9. 134 переселенці пройшли від 1 до 5 сесій. Середній час очікування запису скоротився з 14 до 3 днів після долучення 4 нових волонтерів-психологів. Ми розширюємось: зараз відкрито набір до команди для ще двох фахівців.',
       16, 'PUBLISHED'),

  (19, 'Арт-терапія в Харкові: учасники говорять, як творчість допомогла після важкого досвіду',
       'https://loremflickr.com/600/400/art,therapy,paint?lock=39', FALSE,
       'Учасники груп арт-терапії «Простору Підтримки» діляться своїми історіями після 8 тижнів роботи.',
       'Щотижнева група арт-терапії зараз налічує 24 постійних учасники: ветерани, переселенці та їхні діти. Після 8 тижнів арт-терапевт Ольга Євтушенко зафіксувала зниження симптомів тривоги у 70% учасників за шкалою GAD-7. «Я не вміла малювати ніколи. А сьогодні намалювала маму. Вперше за рік відчула щось добре», — ділиться учасниця Галина, 54 роки, переселенка з Херсона. Нова група відкрита для запису.',
       16, 'PUBLISHED'),

  -- Спорт (13) ----------------------------------------------------------------
  (20, 'Безкоштовна секція футболу для дітей ВПО: 90 заявок за перший тиждень',
       'https://loremflickr.com/600/400/kids,football,soccer?lock=40', FALSE,
       'СпортДух оголосив набір — і черга на запис за тиждень перевищила місткість утричі.',
       'Безкоштовна секція футболу для дітей 7–14 років у Запоріжжі зібрала 90 заявок за 7 днів при місткості 30 осіб. Тренер Василь Лахман: «Батьки приводять дітей і плачуть. Одна мама каже: ''Він не виходив з кімнати два місяці, а тут вийшов одразу''». СпортДух відкриває другу групу та шукає волонтера-тренера. Форма та м''яч — надаємо безкоштовно.',
       6, 'PUBLISHED'),

  (21, 'Перший адаптивний турнір з настільного тенісу зібрав 15 учасників на кріслах-колясках',
       'https://loremflickr.com/600/400/table,tennis,adaptive,sport?lock=41', FALSE,
       'СпортДух та Без Бар''єрів провели перший у Запоріжжі турнір з адаптивного настільного тенісу.',
       '15 учасників змагались у трьох вікових категоріях. Майданчик у ДЮСШ №3 адаптували заздалегідь: прибрали пороги, розширили прохід між столами, встановили поручні. Переможці отримали медалі та сертифікати. Наймолодшому учаснику — 12 років, найстаршому — 67. «Я вперше виграв медаль у своєму житті», — розповів Олег, 34 роки, після ампутації ноги на фронті. Наступний турнір — за два місяці.',
       6, 'PUBLISHED'),

  -- Літні люди (9) ------------------------------------------------------------
  (22, 'Волонтери доставили продукти 150 самотнім пенсіонерам у Хмельницькому',
       'https://loremflickr.com/600/400/elderly,food,delivery?lock=42', FALSE,
       'Їжа та Турбота провела місячний марафон допомоги — шість бригад щосуботи охоплюють нові адреси.',
       'Упродовж місяця 28 волонтерів у складі шести бригад щосуботи розвозили продуктові набори по 150 адресах самотніх пенсіонерів. Середній вік підопічних — 79 років. Кожен набір: 3 кг крупи, масло, консерви, цукор, хліб та аптечний мінімум. Кілька пенсіонерів плакали від несподіванки. Каже волонтерка Надія: «Вони вже не очікували, що хтось прийде. Це найважча і найважливіша робота, яку я робила».',
       9, 'PUBLISHED'),

  (23, 'Пенсіонери Хмельницького опанували Дію: 60 осіб самостійно записались до лікаря онлайн',
       'https://loremflickr.com/600/400/elderly,smartphone,app?lock=43', FALSE,
       'ОсвітаПлюс провела три воркшопи цифрової грамотності спеціально для людей 65+ у Хмельницькому.',
       'Три неділі по 20 пенсіонерів приходили до районного будинку культури зі своїми смартфонами і виходили з встановленою Дією та умінням записатись до лікаря онлайн. Найактивніший учасник — Петро Вознюк, 78 років: за день опанував відеодзвінки і того ж вечора вперше побачив онлайн онука з Польщі. «Ви повернули мені зв''язок з сім''єю», — написав він у подяку організації.',
       5, 'PUBLISHED'),

  -- Культура (7) --------------------------------------------------------------
  (24, 'Майстер-клас з писанкарства: 200 учасників із 6 областей зібрались у Житомирі',
       'https://loremflickr.com/600/400/ukrainian,pysanka,easter,art?lock=44', FALSE,
       'Культурна ДНК провела одноденний майстер-клас — реєстрація закрилась за чотири дні.',
       'Планували прийняти 150 учасників — зареєструвалось 200. Прийшли сім''ї з дітьми, вчителі, троє учасників із діаспори — Польща та Чехія. Майстриня Ганна Харченко навчала традиційній поліській техніці: гарячий віск, натуральні рослинні фарби, геометричні символи родючості та захисту. Кожен учасник поїхав додому з власноруч розписаною писанкою та буклетом про символіку орнаментів.',
       11, 'PUBLISHED'),

  -- Ветерани (11) -------------------------------------------------------------
  (25, 'Перший місяць групи підтримки ветеранів: «Тут не соромно говорити»',
       'https://loremflickr.com/600/400/veterans,group,meeting?lock=45', FALSE,
       'ВетеранUA запустила закриту групу взаємопідтримки — 12 ветеранів зустрічаються щовівторка у Харкові.',
       'Перші чотири зустрічі показали: ветерани говорять про те, про що мовчать вдома. Теми — безсоння, відчуження від родини, страх здатись слабким. Психолог Романа Дяченко, що веде групу: «Через місяць двоє учасників вперше поговорили з дружинами про те, що пережили. Це і є результат». Двоє бійців, що мали суїцидальні думки, зараз у стабільному стані та продовжують індивідуальну терапію. Група відкрита для нових учасників.',
       3, 'PUBLISHED'),

  -- Безхатьки (15) ------------------------------------------------------------
  (26, 'Мобільний пункт «Дах і Тепло»: 400 порцій супу щотижня для безхатніх Харкова',
       'https://loremflickr.com/600/400/homeless,soup,volunteer?lock=46', FALSE,
       'Щочетверговий виїзний пункт допомоги працює вже три місяці — і черга щоразу стає довшою.',
       'Мобільна команда з 6 волонтерів та мікроавтобуса щочетверга виїжджає до вокзалу, ринку та трьох підземних переходів. За три місяці: 4 800 порцій гарячого супу, 620 комплектів одягу, 180 довідок про нічліжки та соціальні служби. Двох людей вдалось направити до реабілітаційного центру. «Деякі обличчя ми вже знаємо на ім''я. Вони чекають на нас щочетверга. Це і є мотивація», — каже координатор Явдоха.',
       12, 'PUBLISHED'),

  -- Медицина (4) ---------------------------------------------------------------
  (27, 'МедДопомога вакцинувала 600 мешканців 5 прифронтових сіл Дніпропетровщини',
       'https://loremflickr.com/600/400/vaccine,medical,rural?lock=47', FALSE,
       'Виїзна бригада провела дводенний марафон вакцинації та первинного огляду в районах поруч з фронтом.',
       'П''ять сіл Нікопольського району, де амбулаторії або закриті, або без запасів вакцин. За два дні бригада з 4 лікарів та 6 волонтерів щепила 600 осіб від грипу, 140 — від правця, виявила 23 випадки, що потребують подальшого лікування. Всіх направили до районної лікарні з листами. «Я 4 роки не була у лікаря. Дякую, що приїхали самі», — сказала мешканка 82 років з Попасного.',
       4, 'PUBLISHED');

SELECT setval('news_id_seq', (SELECT MAX(id) FROM news));

INSERT INTO news_category (news_id, category_id) VALUES
  (14,  9), (14,  8),  -- 200 маскувальних сіток ЗСУ → Армія, Волонтерство
  (15,  9), (15,  8),  -- День подяки захисникам у шпиталі → Армія, Волонтерство
  (16, 13), (16,  4),  -- 25 пандусів у Львові → Інфраструктура, Соціальна допомога
  (17,  4), (17,  1),  -- Курс жестової мови 120 чуючих → Соціальна допомога, Освіта
  (18,  2), (18,  4),  -- 500 сесій психолога Простір Підтримки → Медицина, Соціальна допомога
  (19,  2), (19, 10),  -- Арт-терапія в Харкові → Медицина, Гуманітарна допомога
  (20,  6), (20, 11),  -- Футбол для дітей ВПО 90 заявок → Спорт, Діти
  (21,  6), (21,  4),  -- Адаптивний турнір → Спорт, Соціальна допомога
  (22,  4), (22, 10),  -- Продукти 150 пенсіонерам → Соціальна допомога, Гуманітарна
  (23,  4), (23,  1),  -- Пенсіонери опанували Дію → Соціальна допомога, Освіта
  (24,  5),            -- Майстер-клас з писанкарства → Культура
  (25,  9), (25,  2),  -- Перший місяць груп підтримки ветеранів → Армія, Медицина
  (26,  4), (26, 10),  -- 400 порцій супу для безхатніх → Соціальна допомога, Гуманітарна
  (27,  2), (27, 10);  -- Вакцинація 600 мешканців сіл → Медицина, Гуманітарна допомога

-- approval_request для нових entities
INSERT INTO approval_request (type, status, entity_id, submitted_by, reviewed_by, reviewed_at) VALUES
  ('ORGANIZATION', 'APPROVED', 14, 32, 1, NOW() - INTERVAL '5 days'),
  ('ORGANIZATION', 'APPROVED', 15, 33, 1, NOW() - INTERVAL '4 days'),
  ('ORGANIZATION', 'APPROVED', 16, 34, 1, NOW() - INTERVAL '3 days'),
  ('PROJECT', 'APPROVED', 16, 32, 1, NOW() - INTERVAL '4 days'),
  ('PROJECT', 'APPROVED', 17, 32, 1, NOW() - INTERVAL '3 days'),
  ('PROJECT', 'APPROVED', 18, 33, 1, NOW() - INTERVAL '4 days'),
  ('PROJECT', 'APPROVED', 19, 33, 1, NOW() - INTERVAL '3 days'),
  ('PROJECT', 'APPROVED', 20, 34, 1, NOW() - INTERVAL '3 days'),
  ('PROJECT', 'APPROVED', 21, 34, 1, NOW() - INTERVAL '2 days'),
  ('PROJECT', 'APPROVED', 22, 10, 1, NOW() - INTERVAL '3 days'),
  ('PROJECT', 'APPROVED', 23, 10, 1, NOW() - INTERVAL '2 days'),
  ('PROJECT', 'APPROVED', 24, 13, 1, NOW() - INTERVAL '3 days'),
  ('PROJECT', 'APPROVED', 25, 9,  1, NOW() - INTERVAL '2 days'),
  ('PROJECT', 'APPROVED', 26, 15, 1, NOW() - INTERVAL '2 days'),
  ('PROJECT', 'APPROVED', 27, 7,  1, NOW() - INTERVAL '1 day'),
  ('PROJECT', 'APPROVED', 28, 16, 1, NOW() - INTERVAL '1 day'),
  ('PROJECT', 'APPROVED', 29, 8,  1, NOW() - INTERVAL '1 day'),
  ('NEWS', 'APPROVED', 14, 32, 1, NOW() - INTERVAL '4 days'),
  ('NEWS', 'APPROVED', 15, 32, 1, NOW() - INTERVAL '3 days'),
  ('NEWS', 'APPROVED', 16, 33, 1, NOW() - INTERVAL '3 days'),
  ('NEWS', 'APPROVED', 17, 33, 1, NOW() - INTERVAL '2 days'),
  ('NEWS', 'APPROVED', 18, 34, 1, NOW() - INTERVAL '2 days'),
  ('NEWS', 'APPROVED', 19, 34, 1, NOW() - INTERVAL '1 day'),
  ('NEWS', 'APPROVED', 20, 10, 1, NOW() - INTERVAL '2 days'),
  ('NEWS', 'APPROVED', 21, 10, 1, NOW() - INTERVAL '1 day'),
  ('NEWS', 'APPROVED', 22, 13, 1, NOW() - INTERVAL '2 days'),
  ('NEWS', 'APPROVED', 23, 9,  1, NOW() - INTERVAL '1 day'),
  ('NEWS', 'APPROVED', 24, 15, 1, NOW() - INTERVAL '1 day'),
  ('NEWS', 'APPROVED', 25, 7,  1, NOW() - INTERVAL '1 day'),
  ('NEWS', 'APPROVED', 26, 16, 1, NOW() - INTERVAL '1 day'),
  ('NEWS', 'APPROVED', 27, 8,  1, NOW() - INTERVAL '1 day');

-- UPDATE: розширення тексту в найкоротших існуючих записах
UPDATE project SET
  main_content = 'Притулок «Друг» у Львові тримає понад 80 собак різного віку та розміру. Більшість із них надовго застрягли в клітках через брак місця у потенційних власників. Соціалізація — щотижнева прогулянка з волонтером — критично важлива для поведінки та здоров''я тварини. Тварина, що регулярно бачить людей і гуляє, набагато швидше знаходить дім. Приходь у суботу — і ти стаєш частиною рятувального ланцюга.',
  what_volunteers_will_do = 'Отримати собаку від доглядача, вигуляти 1–2 собак протягом 60 хвилин у парку поруч із притулком, погратися, дати воду, зафіксувати поведінку у листі для потенційних власників.',
  why_its_important = 'Собака, що місяцями сидить у клітці без контакту з людьми, розвиває фобії та агресію. Кожна прогулянка підвищує шанси тварини на всиновлення. Ти буквально рятуєш собаці майбутнє — витративши 2 години суботнього ранку.'
WHERE id = 1;

UPDATE project SET
  main_content = 'Програма OSK (Відловити-Стерилізувати-Повернути) — єдиний гуманний і ефективний метод контролю популяції вуличних котів. Без неї популяція подвоюється кожні 6 місяців. Цикл одного дня: ранній відлов у пастки → переїзд до ветклініки «Лапа» → операція → відновлення → повернення на місце. Rescue Львів вже провів понад 800 стерилізацій у Львові та передмістях.',
  what_volunteers_will_do = 'Розставляти пастки ввечері напередодні, зранку збирати котів і перевозити їх у переносках до клініки, допомагати ветеринарам з документацією, ввечері повертати котів на місця.',
  why_its_important = 'Одна нестерилізована кішка може дати 180 кошенят за три роки — і це все потенційні страждання вулиці. OSK — це єдиний підхід без жорстокості, визнаний WHO та міжнародними зоозахисними організаціями.'
WHERE id = 2;

UPDATE project SET
  main_content = 'Голосіївський парк — найбільший парк Києва і легені міста. Щосезону тут накопичуються тонни сміття від пікніків, пластикові пляшки та цигарки. Раз на сезон EcoKyiv проводить масштабний екосуботник: 50+ волонтерів прибирають 4 зони парку, сортують відходи на фракції та передають на переробку. Усі учасники отримують мерч та гарячий чай.',
  what_volunteers_will_do = 'Отримати мішки та інвентар, прибрати закріплену зону парку, сортувати відходи на пластик, скло, папір та змішані відходи, завантажити мішки у транспорт, зробити фото до і після для звіту.',
  why_its_important = 'Прибраний парк — це не лише краса, але і безпека для дітей та тварин. Пластик у парку потрапляє у ґрунтові води і річки. Один суботник позбавляє парк від 1–2 тонн сміття і надихає тисячі людей берегти те, що вже чисте.'
WHERE id = 3;

UPDATE news SET
  main_content = 'У 2025 році команда Rescue Львів рятувала тварин цілодобово і без вихідних. Загальна статистика за рік: 320 тварин знайшли постійний дім, 510 пройшли стерилізацію в рамках програми OSK, 12 ветклінік стали постійними партнерами, 85 нових волонтерів приєднались до команди. Найскладнішим місяцем став лютий — евакуація тварин із прифронтових районів Харківщини. Найрадіснішим — липень, коли за один тиждень всиновили 18 собак. Дякуємо кожному, хто донатив, волонтерив або просто репостив. Разом ми сильніші.'
WHERE id = 1;

UPDATE news SET
  main_content = 'У квітні EcoKyiv провела 4 акції з озеленення у чотирьох районах Києва. Усього висаджено 200 саджанців: дуб черешчатий, клен польовий, липа серцелиста, береза повисла. Кожне дерево отримало GPS-координати та унікальний ID — волонтери моніторитимуть приживаність щоквартально. Долучились 63 волонтери та учні 5 шкіл. Школа №78 висадила власну алею з 20 лип і вже взяла її «під опіку». За п''ять років ці дерева почнуть поглинати CO₂ і давати тінь — і це справа рук конкретних людей.'
WHERE id = 2;

-- ============================================================================
-- РОЗШИРЕННЯ ТЕКСТІВ: проекти 4–15
-- ============================================================================

UPDATE project SET
  description         = 'Разом із учнями школи №125 висаджуємо 50 саджанців у шкільному дворі — клени, липи, дуби, берези. EcoKyiv доставляє рослини, волонтери та діти — разом садять і прив''язують до дерев іменні таблички.',
  main_content        = 'Школа №125 у Голосіївському районі Києва виділила 400 кв. м під шкільний міні-гай. EcoKyiv задонорив 50 саджанців місцевих порід: 15 дубів, 15 лип, 10 кленів, 10 беріз. Кожне дерево отримає іменну табличку від класу, що його висадив — і тепер це їхня відповідальність на роки вперед. Лісівник-консультант проведе 15-хвилинний майстер-клас для учнів про правильну посадку. Волонтери допомагають копати ями, встановлювати захисні кілочки та поливати після посадки. Після завершення — спільне фото і сертифікати «Садівника EcoKyiv» для кожного учасника.',
  what_volunteers_will_do = 'Копати ями глибиною 50 см за позначками лісівника, обережно висаджувати саджанці зберігаючи кореневий ком, встановлювати захисні кілочки і прив''язувати стовбур, поливати кожне дерево 10–15 літрами, прикріплювати іменні таблички від класів.',
  why_its_important   = 'Дерево, яке дитина посадила власними руками, вона ніколи не зламає — це доведено психологами. За 20 років ці 50 дерев поглинуть понад 500 кг CO₂, дадуть тінь на шкільному подвір''ї та стануть живою пам''яткою доброї справи. Кожне посаджене дерево — маленька перемога природи над асфальтом.'
WHERE id = 4;

UPDATE project SET
  description         = 'Практичний 4-годинний тренінг для демобілізованих: смартфон, «Дія», запис до лікаря онлайн, відеодзвінки, держпослуги — все без лекцій, тільки практика на своєму телефоні.',
  main_content        = 'Багато ветеранів провели роки без смартфону або з мінімальним його використанням. Повернувшись до цивільного, вони стикаються зі стресом: держпослуги, «Дія», запис до лікаря — все вимагає цифрових навичок. ВетеранUA розробила практичний тренінг без нудних лекцій — тільки живі дії на своєму телефоні. Програма: встановлення та верифікація «Дії», запис до лікаря онлайн, відеодзвінок у Viber/Telegram, пошук роботи на ДІЯ.бізнес. Кожному учаснику — роздрукована покрокова шпаргалка та можливість поставити запитання після тренінгу. Навчили вже 180 ветеранів — 96% оцінили як «корисно» або «дуже корисно».',
  what_volunteers_will_do = 'Сидіти поруч з учасником і особисто допомагати виконувати кожен крок на смартфоні, реєструвати учасників та видавати бейджі, вирішувати технічні проблеми зі старими смартфонами, після тренінгу збирати відгуки та заповнювати анкету.',
  why_its_important   = 'Ветеран, що не вміє користуватись «Дією», стоїть у чергах і відчуває себе виключеним із сучасного суспільства. Цифрова грамотність — це незалежність і самоповага. Кожна освоєна онлайн-послуга економить годину часу і знімає зайвий стрес з людини, якій і так непросто.'
WHERE id = 5;

UPDATE project SET
  description         = 'День безкоштовної медицини для переселенців: терапевт, педіатр, гінеколог, стоматолог-консультант і лаборант — в одному місці, без черг, без страхового поліса і без реєстрації.',
  main_content        = 'Переселенці місяцями відкладають похід до лікаря — немає грошей, немає направлення, немає часу стояти в чергах. МедДопомога щомісяця організовує «День відкритих дверей» у лікарні №4 Дніпра: 8 кабінетів, 12 лікарів-волонтерів, прийом без страхового поліса. Додатково працює пункт забору крові для базових аналізів — результати надходять на телефон через 3 дні. Попередній запис бажаний, але не обов''язковий. За останній рік оглянуто 2 600+ людей, виявлено 280 випадків, що потребували термінового лікування.',
  what_volunteers_will_do = 'Реєструвати пацієнтів і видавати талони з часом прийому, координувати черги між кабінетами, допомагати заповнювати анкети тим, хто має труднощі з письмом, перекладати для пацієнтів з мовним бар''єром, перевіряти, що кожен отримав направлення або результат.',
  why_its_important   = 'У 34 з 210 учасників останнього огляду виявили стани, що потребували термінового втручання. Без цього заходу ці люди не знали б про свій стан. Доступна медицина — не благодійність, а відновлення базового права людини на здоров''я.'
WHERE id = 6;

UPDATE project SET
  description         = 'Щосуботній розмовний клуб і базовий курс англійської мови для охочих — три рівні, досвідчені волонтери-викладачі, зручний центр Одеси, і жодної оплати.',
  main_content        = 'ОсвітаПлюс у співпраці з Британською радою запустила модель щосуботніх занять: три рівні (A1, A2, B1), шість груп по 8–10 людей, 12 викладачів-волонтерів — більшість носіїв або люди з досвідом проживання за кордоном. Заняття: 40 хвилин граматики + 40 хвилин розмову. Матеріали надаємо безкоштовно. Курс розрахований на 3 місяці (12 занять). За минулий рік 340 осіб пройшли хоча б один рівень, 80 — всі три.',
  what_volunteers_will_do = 'Підготувати та роздрукувати матеріали для свого рівня, вести облік присутніх, проводити 3-хвилинне welcome-опитування для нових учасників, модерувати розмовну частину в парах і невеликих групах.',
  why_its_important   = 'Знання англійської відкриває доступ до роботи в міжнародних організаціях, закордонного навчання та дистанційної роботи. Для переселенців — це ще й можливість спілкуватись у приймаючих країнах. Для всіх — відчуття прогресу і нова спільнота.'
WHERE id = 7;

UPDATE project SET
  description         = 'Щомісячна операція розфасовки та видачі 500+ продуктових наборів для родин ВПО у трьох точках Вінниці — за один день силами 30 волонтерів.',
  main_content        = '«Рука Допомоги» щомісяця отримує вантажівку продуктів від міжнародних партнерів — УВКБ ООН та Caritas Ukraine. Завдання команди: за один день розфасувати весь вантаж у стандартні набори і роздати на трьох пунктах видачі. Стандартний набір: 3 кг гречки або рису, 1 л олії, тушонка ×3, цукор 1 кг, сіль, мило, серветки. Для родин з дітьми до 3 років — окремий набір з кашею та пюре. Загальна вага операції — 3,5–4 тонни щомісяця.',
  what_volunteers_will_do = 'Сортувати і розважувати продукти на лінії пакування, заповнювати стандартні пакети за специфікацією, переносити готові набори до пунктів видачі, вести реєстр отримувачів, перевіряти документи (повідомлення ВПО).',
  why_its_important   = 'Родина з 4 осіб без регулярного доходу витрачає увесь час на пошук їжі та грошей. Гуманітарний набір на 2 тижні дозволяє зосередитись на пошуку роботи, лікуванні і нормалізації життя. Це не подачка — це міст до самостійності.'
WHERE id = 8;

UPDATE project SET
  description         = 'Повний день арт-терапії для дітей переселенців від 4 до 12 років: малювання, ліплення, аплікація, казковий театр — у безпечному і радісному просторі під наглядом фахівців.',
  main_content        = 'Діти переселенців часто переживають травму переїзду, втрати звичного середовища, страху за батьків. Арт-терапія через творчість — доведений метод допомоги дитині відновити відчуття безпеки та радості. «Дитяча Радість» організовує цілоденний захід: 5 майстерень одночасно (малювання, ліплення, аплікація, оригамі, тіньовий театр), кожна дитина відвідує 3 за день за власним вибором. Додатково — фотозона та «дерево побажань». В кінці кожна дитина отримує «диплом юного митця».',
  what_volunteers_will_do = 'Проводити майстер-клас у своїй майстерні або асистувати досвідченому аніматору, допомагати дітям з матеріалами та інструментами, стежити за безпекою, після кожного блоку прибирати та готувати місце для наступної групи.',
  why_its_important   = 'Малювання «будинку, де тобі добре» або ліплення «того, чого хочеш» — це не просто гра, а діагностичний та терапевтичний інструмент. Дитина, що провела день в радості, спить краще, менше плаче і легше адаптується до нової школи.'
WHERE id = 9;

UPDATE project SET
  description         = 'Двотижнева будівельна вахта: команда волонтерів-будівельників замінює дах у гуртожитку, де живуть 40 родин переселенців — до першого морозу.',
  main_content        = 'Гуртожиток у Черкасах прийняв 40 родин ВПО ще навесні 2022 року. Після двох зим покрівля дала серйозні протікання — у 6 кімнатах підтікає при дощі. «Відбудова Разом» провела технічний огляд і підготувала кошторис. Матеріали (рулонний бітум, балки, кріплення) вже закуплені на кошти ПРООН. Потрібна бригада з 15 осіб на два робочих дні. Людей з досвідом покрівельних робіт — вітаємо особливо, але навчимо і без досвіду.',
  what_volunteers_will_do = 'Демонтувати старе покриття та розподілити будівельне сміття, підносити матеріали на дах (по черзі — безпечно), укладати новий рулонний бітум під керівництвом прораба, герметизувати стики та примикання, прибирати після роботи.',
  why_its_important   = 'Без цього ремонту 6 кімнат будуть непридатні для проживання вже першої зими. Кожна родина, що зберігає своє житло — це одна менша черга у переповнених тимчасових центрах. «Відбудова» — це буквально відновлення нормального життя.'
WHERE id = 10;

UPDATE project SET
  description         = 'Одноденний фестиваль автентичного фольклору Полісся: 20 колективів, майстер-класи з ткацтва та гончарства, виставка вишиванок, традиційна кухня — і все безкоштовно.',
  main_content        = '«Культурна ДНК» збирає народних виконавців, майстрів ремесел і кулінарів зі всієї Житомирщини на одноденне свято автентики. Програма: сцена з 20 фольклорними колективами (пісня, танець, інструментальна музика), 4 майстерень (ткацтво, гончарство, витинанка, бісероплетіння), виставка традиційного одягу з 5 районів, куточок традиційних страв (сало, борщ, вареники, пампушки). Очікується 2 000+ відвідувачів. Вхід вільний. Захід отримав підтримку Укркультурфонду.',
  what_volunteers_will_do = 'Зустрічати гостей і орієнтувати по локаціях фестивалю, допомагати майстрам на майстер-класах готувати матеріали та чергувати учасників, супроводжувати виконавців від паркінгу до сцени, знімати контент для соціальних мереж організації.',
  why_its_important   = 'Традиційна культура — не музей. Це жива ідентичність. Кожна людина, що навчилась ткати або почула живу коломийку, стає носієм культурного коду, який намагаються знищити. Фестиваль — це відповідь народу: ми є, ми живі, ми пам''ятаємо.'
WHERE id = 11;

UPDATE project SET
  description         = 'Дводенна волонтерська вахта для підготовки нічліжки на 60 місць до зими: побілка, монтаж ліжок, утеплення вікон, облаштування душових — до першого снігу.',
  main_content        = 'Нічліжка «Дах і Тепло» у Харкові приймає безхатніх цілий рік, але до зими потребує щорічного перезапуску: оновлення ліжок, побілка стін, заміна вікон у 3 кімнатах, ремонт душових та встановлення додаткових обігрівачів. Цього року розширюємо до 60 місць — додаємо 10 нових ліжок. Усі матеріали закуплені. Потрібна команда 20 людей на 2 дні. Жодних спеціальних навичок не потрібно — розподілимо за вміннями.',
  what_volunteers_will_do = 'Малярні роботи (побілка/фарбування стін), збирання та розстановка ліжок і тумбочок, монтаж утеплення на вікнах, встановлення обігрівачів та перевірка електрики (з електриком), прибирання та сортування одягу і постільної білизни.',
  why_its_important   = 'Одне ліжко в теплому приміщенні в мороз — це врятоване людське життя. Близько 30 людей на рік гинуть від переохолодження у Харкові. Кожне місце в нічліжці — це пряма протидія цій статистиці. Два дні вашої роботи = 60 людей у теплі всю зиму.'
WHERE id = 12;

UPDATE project SET
  description         = 'Щомісячний день безкоштовних юридичних консультацій для переселенців: субсидія, реєстрація, права на роботі, відновлення документів — юристи-волонтери відповідають на всі питання.',
  main_content        = '«Переселенці Разом» проводить «Юридичну суботу» в першу суботу кожного місяця. Приймають 6 юристів-волонтерів одночасно: кожна консультація — 20–30 хвилин. Теми: оформлення субсидії та допомоги ВПО, реєстрація за новим місцем проживання, трудові права та звільнення, відновлення паспорта та інших документів, питання нерухомості в зоні конфлікту. В черзі зазвичай 50–70 людей — реєстрація з 8:30.',
  what_volunteers_will_do = 'Реєструвати відвідувачів у чергу, видавати талони та пояснювати регламент, готувати юристам папір і воду, допомагати відвідувачам, що прийшли з дітьми, зберігати конфіденційність — не обговорювати чужі справи.',
  why_its_important   = 'Незнання закону позбавляє людей тисяч гривень субсидій і соціальних виплат щороку. ВПО особливо вразливі: вони не знають місцевих правил, бояться помилитись. Одна правильна консультація може змінити фінансову ситуацію родини на місяці вперед.'
WHERE id = 13;

UPDATE project SET
  description         = 'Масштабне прибирання 2 км берега Дніпра на Труханівому острові в Києві: сортуємо відходи, встановлюємо знаки, фотографуємо результат — чекаємо 150+ учасників.',
  main_content        = 'EcoKyiv щорічно проводить велике прибирання берегів Дніпра. Цього сезону — Труханів острів, найнебезпечніший з точки зору забруднення: туди регулярно привозять і залишають побутові та будівельні відходи. Минулого року зібрали 1,2 тонни сміття. Цього разу беремо ще один кілометр і очікуємо 150+ учасників. Сортувальні станції на 4 фракції, транспорт для вивезення — КМДА забезпечує.',
  what_volunteers_will_do = 'Збирати сміття в закріпленій зоні берега, сортувати на фракції (пластик, скло, метал, змішане), завантажувати заповнені мішки у вказані контейнери, встановлювати інформаційні знаки про правила поведінки на березі, фотографувати зону до і після для звіту.',
  why_its_important   = 'Дніпро — джерело питної води для мільйонів. Пластик у воді руйнує екосистему, отруює рибу і потрапляє у воду, яку п''ємо. Один суботник не вирішить проблему, але показує: люди дбають. І поступово таких людей стає більше.'
WHERE id = 14;

UPDATE project SET
  description         = 'Rescue Львів привозить 30+ тварин з притулку до Тернополя: кожен може зустріти майбутнього улюбленця, поспілкуватись з ним і одразу оформити відповідальне всиновлення.',
  main_content        = 'Rescue Львів організовує виїзні виставки адопції раз на два місяці — в різних містах Львівщини та сусідніх областей. Цього разу — Тернопіль, де ще немає аналогічної ініціативи. Привеземо 30+ тварин: собаки, коти, кілька кроликів. Всі ветеринарно перевірені, вакциновані, стерилізовані/кастровані, мікрочіповані. На місці — консультант з адопції, ветеринар та юрист для оформлення договору всиновлення.',
  what_volunteers_will_do = 'Транспортувати тварин у переносках від притулку до місця виставки, облаштовувати стенди та огорожі, консультувати потенційних власників про характер і потреби конкретної тварини, допомагати оформлювати документи всиновлення, доглядати за тваринами протягом дня.',
  why_its_important   = 'Кожне всиновлення рятує двох: тварина знаходить дім і звільняє місце для іншої. Притулок переповнений на 140% — кожен переїзд критичний. Виїзна виставка — найефективніший спосіб знайти власників поза Львовом і розширити географію адопції.'
WHERE id = 15;

-- ============================================================================
-- РОЗШИРЕННЯ ТЕКСТІВ: новини 3–13
-- ============================================================================

UPDATE news SET
  description  = 'Rescue Львів шукає frontend і backend розробників, UI/UX дизайнера та DevOps-інженера для pro bono проекту — єдиної системи обліку тварин у притулку.',
  main_content = 'Притулок «Друг» досі веде облік тварин у таблицях Excel — це незручно, призводить до помилок і займає по 2 години щодня. Rescue Львів вирішила змінити це раз і назавжди. Шукаємо команду для розробки веб-застосунку: картка тварини, статуси (в притулку / всиновлено / на лікуванні), фільтри за видом/породою/віком, публічна сторінка для потенційних власників. Стек: Angular + NestJS + PostgreSQL. Терміни — 2 місяці, пн/ср/пт по 2–3 години онлайн. Всі учасники отримують сертифікат волонтера та подяку в соцмережах. Якщо ти розробник — це твій шанс зробити реальну різницю, а не тестовий проект у портфоліо.'
WHERE id = 3;

UPDATE news SET
  description  = 'ВетеранUA відкрила перший у Харкові багатопрофільний центр для демобілізованих та їхніх родин — з психологами, юристами, консультантами з працевлаштування і курсами цифрових навичок.',
  main_content = 'Центр ВетеранUA розташований на вул. Сумській, 15 — у повністю відремонтованому приміщенні з доступом для людей з інвалідністю. Щодня Пн–Пт з 9:00 до 18:00 тут працюють: 2 психологи (запис необов''язковий), 1 юрист (консультації з пільг, документів, трудових прав), консультант з працевлаштування (резюме, співбесіди, вакансії) і волонтер-викладач цифрових навичок (смартфон, «Дія», онлайн-сервіси). Щотижнева група підтримки — вівторки о 18:00. За перший місяць роботи — 143 звернення. Вхід безкоштовний, без запису.'
WHERE id = 4;

UPDATE news SET
  description  = 'МедДопомога провела наймасштабнішу акцію за рік — за один день 12 лікарів-волонтерів прийняли 210 переселенців і виявили 34 серйозних випадки.',
  main_content = 'У неділю, 15 жовтня, у лікарні №4 Дніпра від 9:00 до 17:00 безперервно працювали 8 медичних кабінетів. Черга розпочалась о 7:30 — люди приходили з усіх районів та сусідніх міст. Найбільший запит: терапевт (87 прийомів), педіатр (54), гінеколог (41), стоматолог-консультант (28). Пункт забору крові обробив 96 зразків. З 210 прийнятих пацієнтів: у 34 виявлено стани, що потребують термінового лікування — їх направили до профільних лікарів безкоштовно через партнерську мережу. Наступна акція — 19 листопада, реєстрація відкрита.'
WHERE id = 5;

UPDATE news SET
  description  = 'ОсвітаПлюс набрала 80 слухачів на весняний семестр безкоштовних курсів англійської — три рівні, дванадцять волонтерів-викладачів, заняття тричі на тиждень.',
  main_content = 'Весняний семестр стартував 3 лютого і триватиме до 3 травня. Відкрито три рівні: A1 (26 осіб), A2 (32 особи), B1 (22 особи). Кожен рівень — 2 групи по 13–16 осіб, заняття у вівторок, четвер і суботу (по 90 хвилин). Серед 12 викладачів-волонтерів — 4 людини, що жили або навчались за кордоном, 3 вчителі-пенсіонери і 5 студентів філологічного факультету. Навчальні матеріали — адаптований Oxford English File плюс власні розробки під реалії переселенців. Відвідуваність за перший місяць: 88%. Записатись на літній семестр можна вже зараз — місця обмежені.'
WHERE id = 6;

UPDATE news SET
  description  = 'Рука Допомоги розподілила в Вінниці черговий вантаж — 150 родин отримали продуктові набори вагою по 23 кг кожен.',
  main_content = 'У вівторок вранці о 6:00 на склад «Руки Допомоги» прибула вантажівка з Польщі — 3,5 тонни продуктів від Caritas Ukraine та польської організації PKC. До 8:00 30 волонтерів розвантажили і почали фасування. Стандартний набір: гречка 2 кг, рис 2 кг, макарони 1 кг, тушонка ×3, олія 1 л, цукор 1 кг, сіль, мило ×2. Для родин з дітьми до 5 років — окремий дитячий набір (каша, пюре, сік). Три точки видачі працювали з 12:00 до 18:00. Черга — без очікування більше 20 хвилин. Всі 150 родин отримали набори до закриття.'
WHERE id = 7;

UPDATE news SET
  description  = 'Дитяча Радість зібрала 120 дітей переселенців на однодення свято у Полтаві — аніматори, майстер-класи, театр, солодкий стіл і рюкзачки з канцелярією.',
  main_content = 'У неділю у Полтавському будинку культури відбулось свято, яке діти згадуватимуть довго. Від 10:00 до 15:00 одночасно працювали: 3 майстер-класи (малювання, ліплення з тіста, оригамі), казковий тіньовий театр (дві вистави), фотозона «Україна моя», ігрова зона та солодкий стіл. 12 аніматорів і 8 волонтерів опікувались 120 дітьми від 3 до 12 років. Кожна дитина отримала рюкзачок: зошити, олівці, лінійка, гумка, точилка — все для першого дня у новій школі. Декілька мам плакали від вдячності прямо в залі.'
WHERE id = 8;

UPDATE news SET
  description  = 'Відбудова Разом завершила трьохмісячний ремонт першого гуртожитку ВПО в Черкасах — нова покрівля, 12 відремонтованих кімнат, оновлені санвузли, 38 родин у теплі.',
  main_content = 'У вересні 2023 команда «Відбудови Разом» вперше зайшла на об''єкт — гуртожиток 1972 року будівництва, де протікала покрівля в 6 місцях. Три місяці, 28 волонтерів-будівельників (по 8–10 за зміну), матеріали від ПРООН Україна. Результат: повністю замінена покрівля (380 кв. м рулонного бітуму), відремонтовані 12 кімнат (шпаклівка, фарба, нові двері), оновлені 4 санвузли (сантехніка, плитка, вентиляція), встановлені нові вікна у 8 приміщеннях. Зараз тут мешкають 38 родин — 97 людей. «Ми перший раз за рік не боїмось дощу», — каже мешканка Оксана з Маріуполя.'
WHERE id = 9;

UPDATE news SET
  description  = 'Культурна ДНК оголошує дату і програму фестивалю: 20 фольклорних колективів, майстер-класи ткацтва і гончарства, виставка старовинного одягу, традиційна кухня і вільний вхід.',
  main_content = 'Фестиваль традиційної музики «Поліська Душа» відбудеться 14 вересня у Центральному парку Житомира. Сцена працюватиме з 10:00 до 18:00: 20 колективів із 8 районів Житомирщини виконуватимуть автентичні пісні, танці та інструментальну музику — без сучасних обробок. Паралельно: 4 майстерні (ткацтво, гончарство, витинанка, бісероплетіння), виставка старовинного одягу зі збірки Житомирського краєзнавчого музею, куточок традиційних страв від 6 господинь. Очікується 3 000+ відвідувачів. Підтримка — Укркультурфонд та Житомирська ОДА. Волонтери — потрібні, реєстрація відкрита.'
WHERE id = 10;

UPDATE news SET
  description  = 'Завдяки 40 волонтерам «Дах і Тепло» оновила 60 спальних місць, утеплила вікна і відновила систему опалення — нічліжка готова прийняти людей до першого морозу.',
  main_content = 'Підготовка до зимового сезону зайняла два вихідних. 40 волонтерів за суботу і неділю зробили: розібрали та зібрали 60 ліжок (20 нових + 40 перезібраних), побілили всі приміщення, встановили утеплювач на 18 вікнах, полагодили систему опалення разом із слюсарем-волонтером, розклали запаси зимового одягу та постільної білизни (на 200 людей). Нічліжка відкрита щодня з 20:00 до 8:00, безкоштовне харчування двічі на день. Якщо ти знаєш когось, кому ніде ночувати — адреса: вул. Сумська, 15а.'
WHERE id = 11;

UPDATE news SET
  description  = 'Переселенці Разом відновила безкоштовні юридичні консультації в Одесі: перша субота місяця, 6 юристів одночасно, без запису — допомога з субсидіями, документами і трудовими правами.',
  main_content = 'Після двомісячної перерви через ремонт приміщення «Переселенці Разом» повертається з оновленим форматом: 6 юристів одночасно (замість 4), попередній запис скасований — приходьте з 8:30, черга живе. Консультують по темах: оформлення виплат ВПО (50+ 000 грн роками недоотримують через помилки в документах), реєстрація нового місця проживання, відновлення паспорта та свідоцтв, трудові спори при звільненні, питання нерухомості в зоні бойових дій. Середня тривалість консультації — 25 хвилин. Безкоштовно. Конфіденційно. Адреса: вул. Дерибасівська, 5.'
WHERE id = 12;

UPDATE news SET
  description  = 'EcoKyiv підбила підсумки осіннього екосуботника в Голосіївському парку: 80 волонтерів, 500 кг сміття за 4 години, 3 старі шини, 1 холодильник і 40 мішків відсортованого пластику.',
  main_content = 'Осінній суботник зібрав 83 учасники — від школярів до пенсіонерів, від студентів до корпоративних команд (прийшли три компанії з колегами). Прибирали 4 зони парку одночасно: берег озера, центральна алея, ліс за дитячим майданчиком і зона пікніків біля входу. Результат 4 годин роботи: 500 кг сміття, з яких 120 кг пластику відсортовано і передано на переробку, 80 кг скла — аналогічно. Окремо: 3 старі шини, холодильник, два матраци. Все крупногабаритне вивіз комунальний транспорт. Після прибирання — кава і чай від спонсорів та командне фото.'
WHERE id = 13;

-- ============================================================================
-- РОЗШИРЕННЯ ТЕКСТІВ: збори 1–13
-- ============================================================================

UPDATE fundraising_campaign SET
  description  = 'Щомісячний збір на корм та ветпрепарати для 80 собак притулку «Друг» у Львові — стабільне фінансування, яке дозволяє нам рятувати, а не виживати.',
  main_content = 'Притулок «Друг» — некомерційна організація повністю на волонтерській базі. Жодного державного фінансування. Щомісяця нам потрібно: ~45 000 грн на корм (сухий + вологий), ~15 000 грн на ветеринарні препарати (вакцини, антипаразитарні, антибіотики за потреби), ~5 000 грн на засоби гігієни і дезінфекції. Без цього збору ми не зможемо годувати тварин регулярно. Будь-яка сума допомагає — навіть 50 грн годує одного собаку три дні. Якщо можеш — відтворюй цей донат щомісяця: це найцінніше, що ти можеш зробити для притулку.'
WHERE id = 1;

UPDATE fundraising_campaign SET
  description  = 'Зібрали і закрили: придбали мішки, рукавиці, граблі та лопати для 5 наступних екосуботників EcoKyiv — дякуємо всім, хто долучився!',
  main_content = 'Цей збір вже завершено — і завдяки вам успішно! За 50 днів 134 донори зібрали 25 000 грн на повний комплект інвентарю для 5 великих суботників: 500 великих мішків для сміття, 100 пар рукавиць, 20 граблів, 10 лопат, 15 пар щипців для підбору сміття і 4 рулони сортувального скотчу. Цей інвентар вже використовувався на 3 суботниках у Голосіївському парку та на Труханівому острові. Зібрано і вивезено 1,7 тонни відходів. Дякуємо кожному донору — ви буквально тримали мішок разом з нами!'
WHERE id = 2;

UPDATE fundraising_campaign SET
  description  = 'Особистий збір Панаса Гнилиці: купуємо 10 вживаних ноутбуків для дітей шкільного віку, що живуть у гуртожитку ВПО в Києві та не мають можливості вчитись онлайн.',
  main_content = 'У гуртожитку на Оболоні мешкають 10 дітей від 8 до 15 років. Школа — онлайн або гібридна. Ноутбука немає жодного. Деякі вчаться на батьківських телефонах по черзі — і це впливає на оцінки та самооцінку. Я, Панас, вирішив зібрати на 10 вживаних, але справних ноутбуків з OLX (бюджет 3 500–4 500 грн за штуку). Кожен — перевірений, з Windows, зарядкою і мінімум 4 ГБ RAM. Вже є продавці, домовлений огляд. Якщо зберемо більше — куплю 11-й і віддам дітям з наступного гуртожитку. Всі чеки — публічно у звіті.'
WHERE id = 3;

UPDATE fundraising_campaign SET
  description  = 'Rescue Львів рятує поранених тварин, евакуйованих з прифронтових районів — щомісяця 15–20 тварин потребують операцій, ліків і тривалого лікування.',
  main_content = 'З початку повномасштабного вторгнення до нас надійшло понад 300 тварин із зон бойових дій — поранених, хворих, виснажених. Більшість потребують операцій (від 3 000 до 15 000 грн), антибіотикотерапії (700–2 000 грн курс), спеціального харчування в реабілітаційний період. Держава не фінансує цього — все тримається на зборах. Цей конкретний збір покриє лікування 8–10 тварин, що надійдуть у найближчі 3 тижні. Серед них — кіт Рафаель з Херсона (перелом лапи), собака Шрам із Запоріжжя (опіки). Допоможи їм вижити.'
WHERE id = 4;

UPDATE fundraising_campaign SET
  description  = 'EcoKyiv збирає на масштабне очищення берегів річки Либідь у Києві: три суботники по 100+ учасників, спецтехніка для великогабаритного сміття і кошти на аналіз якості води.',
  main_content = 'Річка Либідь — притока Дніпра, що протікає через Деміївку, Голосіїв і Теремки. Роками береги перетворювались на стихійні звалища. Минулого літа волонтери провели попередній аналіз: виявлено 4 точки скидання відходів, включно з хімічними ємностями. EcoKyiv планує три суботники протягом сезону (квітень, травень, червень) по 100+ учасників кожен. Кошти потрібні на: оренду спецтехніки для вивезення великогабаритних відходів (28 000 грн), аналіз якості води в 5 точках до і після (18 000 грн), інвентар та інформаційні стенди (34 000 грн). Якщо зберемо більше — фінансуємо четвертий суботник восени.'
WHERE id = 5;

UPDATE fundraising_campaign SET
  description  = 'Збір Зореслави Чобіт закрито — всі кошти зібрані та витрачені! 8 родин ВПО з немовлятами у гуртожитку на Подолі отримали памперси, молочні суміші та засоби гігієни на два місяці.',
  main_content = 'Цей збір вже завершено. Зореслава, волонтер «Hand&Hand», особисто передала кошти на забезпечення 8 родин з немовлятами (до 2 років) у гуртожитку на Подолі. Що куплено на 20 000 грн: памперси розмір 2–4 (6 пачок на кожну дитину), молочна суміш NAN та Humana (по 4 банки), вологі серветки, крем під памперс, пустушки, прорізувачі. Доставка — особисто Зореслава разом із ще одним волонтером. Одна мама: «Я вже два тижні не могла купити памперсів. Дякую від усього серця».'
WHERE id = 6;

UPDATE fundraising_campaign SET
  description  = 'Зібраємо на утеплення і обігрів вольєрів для 80 собак притулку «Друг» — до морозів ще є час, але потрібно діяти зараз, щоб все встигнути.',
  main_content = 'Взимку температура у відкритих вольєрах притулку «Друг» опускається до -5°C і нижче. Для дрібних порід і хворих тварин це критично. Нам потрібні: 12 керамічних обігрівачів (по 1 800 грн = 21 600 грн), мінеральна вата для утеплення 6 будок (4 800 грн), монтажна піна та герметик для щілин (1 200 грн), заміна прогнилої частини даху над зовнішнім вольєром (17 400 грн). Всього 45 000 грн. Без обігріву 4–5 собак ризикують не пережити зиму. Допоможи нам зустріти зиму готовими — кожна гривня іде прямо на тварин.'
WHERE id = 7;

UPDATE fundraising_campaign SET
  description  = 'Школа №98 відкриває еколабораторію — збираємо на мікроскоп, набори для аналізу ґрунту та води, і польовий інвентар для учнів 5–9 класів.',
  main_content = 'Школа №98 у Голосіївському районі Києва за підтримки EcoKyiv запускає перший шкільний екогурток із справжньою лабораторією. Що плануємо закупити: мікроскоп Levenhuk (7 500 грн) для дослідження мікроорганізмів у воді та ґрунті, 4 набори для аналізу рН ґрунту і кислотності води (по 800 грн = 3 200 грн), 5 ботанічних визначників рослин Київщини (по 450 грн = 2 250 грн), 10 польових блокнотів і компасів для спостережень у парку (3 000 грн), захисні рукавички та окуляри для лабораторних занять (1 200 грн). Перший гурток — 24 учасники. Якщо зберемо більше — відкриємо другу групу.'
WHERE id = 8;

UPDATE fundraising_campaign SET
  description  = 'Особистий збір Панаса на 20 бюджетних смартфонів для ветеранів після демобілізації — щоб підтримувати зв''язок з родиною, знаходити роботу і користуватись держпослугами.',
  main_content = 'Я, Панас, волонтерю в ВетеранUA і бачу одну проблему знову й знову: ветеран повертається — а в нього немає смартфона. Або є старий кнопковий. Без смартфона немає «Дії», немає відеозв''язку з рідними, немає пошуку роботи, немає запису до лікаря. Планую закупити 20 бюджетних Android-смартфонів (1 500–2 000 грн за штуку) та провести одноденний курс: встановлення «Дії», Viber, Telegram, Дія.бізнес і базового пошуку вакансій. Вже домовлено з 18 ветеранами. Чеки і звіт — публічно. Допоможіть зробити цих людей «видимими» для держави і суспільства знову.'
WHERE id = 9;

UPDATE fundraising_campaign SET
  description  = 'ВетеранUA збирає на антидепресанти, знеболюючі та реабілітаційні препарати для ветеранів — ліки, яких немає за держпрограмою, але які критично потрібні щодня.',
  main_content = 'Центр ВетеранUA щомісяця приймає 40–50 ветеранів. Більше половини з них потребують медикаментозної підтримки: антидепресанти (СІЗЗС: від 300 до 900 грн/міс), знеболюючі при хронічному болю в кінцівках або хребті, препарати для нормалізації сну (не класифіковані як наркотики, але не входять до держпільг), вітамінно-мінеральні комплекси при реабілітації. Держпрограма покриває лише 20% потреб. Цей збір — на 3 місяці медикаментозної підтримки для 15 ветеранів. Всі призначення — лікарські, всі витрати — задокументовані.'
WHERE id = 10;

UPDATE fundraising_campaign SET
  description  = 'МедДопомога обладнує мікроавтобус як пересувний медичний кабінет — щотижня виїжджатимемо у 3–4 прифронтових села, де амбулаторії закриті або порожні.',
  main_content = 'У Нікопольському районі Дніпропетровської області 14 сіл, де медичної допомоги практично немає: амбулаторії або закриті після обстрілів, або не мають лікарів і ліків. Ми орендуємо мікроавтобус і перетворюємо його на мобільний медкабінет: оглядовий стіл, холодильник для вакцин, апарат ЕКГ і базова аптека. Щотижня — виїзд у 3–4 села, 1–2 лікарі та 3–4 волонтери-асистенти. Потрібно: адаптація мікроавтобуса (45 000 грн), медичне обладнання (38 000 грн), ліки на перший квартал (37 000 грн). Разом: 120 000 грн. За рік плануємо охопити 5 000 мешканців без доступу до медицини.'
WHERE id = 11;

UPDATE fundraising_campaign SET
  description  = '«Дах і Тепло» розширює нічліжку до 80 місць — збираємо на 20 нових ліжок, матраси, подушки, ковдри та постільну білизну для нового крила.',
  main_content = 'Нічліжка «Дах і Тепло» у Харкові 3 роки поспіль працює на 60 місць — і щозими ми змушені відмовляти людям, бо немає місця. Цього року зробили ремонт у сусідньому приміщенні — воно готове до людей. Залишилось облаштувати 20 нових спальних місць: 20 металевих ліжок (по 620 грн = 12 400 грн), 20 ортопедичних матрасів (по 350 грн = 7 000 грн), 20 подушок і 20 ковдр (4 000 грн), 40 комплектів постільної білизни (по 120 грн = 4 800 грн). Всього 28 000 грн. Кожна гривня — це буквально ліжко для конкретної людини в мороз.'
WHERE id = 12;

UPDATE fundraising_campaign SET
  description  = '«Рука Допомоги» збирає на 100 продуктових наборів для найбільш вразливих родин Вінниці перед зимою — по 2 місяці запасу, включно з дитячим харчуванням.',
  main_content = 'Перед зимою «Рука Допомоги» робить щорічний «зимовий розподіл» — великий набір для родин, що не мають доходу або мають дуже малий. Цього року плануємо 100 наборів. Кожен набір розрахований на 2 місяці для родини з 3–4 осіб: крупи 10 кг (гречка, рис, пшоно), консерви ×8, олія 3 л, цукор 2 кг, борошно 2 кг, сіль і спеції, чай, сухарі. Для родин з дітьми до 10 років — додатково: каші, соки, печиво. Вартість одного набору: 850 грн. 100 наборів = 85 000 грн. Зараз зібрано 14,6%. Кожний донат — конкретна родина з їжею на зиму.'
WHERE id = 13;

-- ============================================================================
-- ADMIN DEMO: контент на підтвердження / у черзі модерації
-- ============================================================================

-- 9 нових app_user (IDs 35–43)
INSERT INTO app_user (id, email, password_hash, role, status, points, first_name, last_name, city, avatar_url, organization_id) VALUES
  -- Нові орг-власники (їхні орг. профілі — на верифікацію або відхилені)
  (35, 'org-molhub@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Ростислав', 'Приймак', 'Харків',
       'https://i.pravatar.cc/300?img=58', NULL),
  (36, 'org-ecograd@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Тетяна', 'Гордієнко', 'Одеса',
       'https://i.pravatar.cc/300?img=21', NULL),
  (37, 'org-babykids@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Вадим', 'Стецюк', 'Суми',
       'https://i.pravatar.cc/300?img=61', NULL),
  -- Нові волонтери (профіль на верифікацію або відхилений)
  (38, 'vol-zoia@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'VOLUNTEER', 'ACTIVE', 0, 'Зоя', 'Науменко', 'Харків',
       'https://i.pravatar.cc/300?img=9', NULL),
  (39, 'vol-oleksiy@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'VOLUNTEER', 'ACTIVE', 0, 'Олексій', 'Лещенко', 'Одеса',
       'https://i.pravatar.cc/300?img=51', NULL),
  (40, 'vol-katya@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'VOLUNTEER', 'ACTIVE', 0, 'Катерина', 'Сало', 'Дніпро',
       'https://i.pravatar.cc/300?img=35', NULL),
  -- Заблокований користувач
  (41, 'user-blocked@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'APP_USER', 'BLOCKED', 0, 'Роман', 'Кривоніс', 'Запоріжжя',
       'https://i.pravatar.cc/300?img=63', NULL),
  -- PENDING — нові реєстрації без підтвердження пошти
  (42, 'user-pending@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'APP_USER', 'PENDING', 0, 'Людмила', 'Острик', 'Миколаїв',
       'https://i.pravatar.cc/300?img=38', NULL),
  (43, 'user-pending2@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'APP_USER', 'PENDING', 0, 'Станіслав', 'Моргун', 'Суми',
       'https://i.pravatar.cc/300?img=68', NULL);

SELECT setval('app_user_id_seq', (SELECT MAX(id) FROM app_user));

-- 3 нові organization_profile (IDs 17–19): PENDING×2, REJECTED×1
INSERT INTO organization_profile (id, user_id, name, edrpou, description, verification_status, official_docs_url, contact_phone, contact_email, city, logo_url, location_id, mission) VALUES
  (17, 35, 'Молодіжний Хаб Харків', '23456789',
       'Простір для молоді від 16 до 30 років: IT-курси, волонтерство, дебати, проекти. Організовуємо безкоштовні воркшопи, стажування та освітні табори. Співпрацюємо з 15 університетами та ліцеями Харківщини.',
       'PENDING', 'https://picsum.photos/seed/org-doc-17/400/565',
       '+380577001122', 'hello@molhub.kh.ua', 'Харків',
       'https://ui-avatars.com/api/?name=MH&background=7950f2&color=fff&size=200&bold=true', 6,
       'Кожен молодий українець має можливості для самореалізації — тут і зараз, а не після перемоги.'),
  (18, 36, 'ЕкоГрад Одеса', '34567890',
       'Захист екосистеми Чорноморського узбережжя: очищення пляжів, контроль за стихійними звалищами, освіта населення про роздільний збір сміття. Партнерська організація Global Ocean Watch.',
       'PENDING', 'https://picsum.photos/seed/org-doc-18/400/565',
       '+380487002233', 'eco@ekograd.od.ua', 'Одеса',
       'https://ui-avatars.com/api/?name=EO&background=12b886&color=fff&size=200&bold=true', 4,
       'Чисте море — право кожного жителя Одеси та туриста.'),
  (19, 37, 'Малюки у Безпеці', '45678901',
       'Навчання дітей і батьків правилам безпеки та евакуації. Розробка ігрових програм для шкіл з питань цивільного захисту.',
       'REJECTED', 'https://picsum.photos/seed/org-doc-19/400/565',
       '+380542003344', 'safe@maluku.sumy.ua', 'Суми',
       'https://ui-avatars.com/api/?name=MB&background=f76707&color=fff&size=200&bold=true', NULL,
       'Кожна дитина знає, що робити в кризовій ситуації.');

SELECT setval('organization_profile_id_seq', (SELECT MAX(id) FROM organization_profile));

-- 3 нові volunteer_profile (IDs 14–16): is_verified=FALSE
INSERT INTO volunteer_profile (id, user_id, display_name, phone, bio, skills_text, rating, is_verified, avatar_url, docs_url) VALUES
  (14, 38, 'ZoiaRescuer',    '+380660001122',
       'Зооволонтер з 2023 року — рятую котів і собак з вулиці. Маю досвід перетримки до 10 тварин одночасно та базові навички надання допомоги пораненим тваринам.',
       'Порятунок тварин, перетримка, соціалізація', NULL, FALSE,
       'https://i.pravatar.cc/300?img=9',
       'https://picsum.photos/seed/vol-doc-14/400/565'),
  (15, 39, 'OleksiyBuilder', '+380730004455',
       'Будівельник-волонтер. Беру участь у відбудові пошкоджених будівель і встановленні пандусів для людей з обмеженими можливостями.',
       'Будівництво, зварювання, монтаж, ремонт', NULL, FALSE,
       'https://i.pravatar.cc/300?img=51',
       'https://picsum.photos/seed/vol-doc-15/400/565'),
  (16, 40, 'KatyaTeacher',   '+380507006677',
       'Вчителька початкових класів. Хочу організовувати заняття для дітей-переселенців та арт-терапевтичні сесії.',
       'Педагогіка, арт-терапія, діти, психологія', NULL, FALSE,
       'https://i.pravatar.cc/300?img=35',
       'https://picsum.photos/seed/vol-doc-16/400/565');

SELECT setval('volunteer_profile_id_seq', (SELECT MAX(id) FROM volunteer_profile));

-- 3 нові проекти (IDs 30–32): DRAFT — 2 очікують підтвердження, 1 відхилений
INSERT INTO project (id, organization_profile_id, title, description, status, starts_at, ends_at,
  main_content, what_volunteers_will_do, why_its_important, time, application_deadline,
  location_id, category_id, partners, image_url, participants)
VALUES
  (30, 1, 'Нічний патруль для безпритульних тварин',
      'Організовуємо нічні рейди по місту — шукаємо поранених і хворих тварин на вулицях Львова.',
      'DRAFT', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days 4 hours',
      'Rescue Львів запускає пілотний проект нічних патрулів. Вночі на вулицях з''являються тварини, яких вдень не видно — вони ховаються, бояться людей. Ми збираємо команду з 3–4 осіб, що їздять двома машинами та перевіряють відомі місця скупчення безпритульних котів і псів. При виявленні пораненої тварини — відразу везем до цілодобової ветклініки «Доктор Айболить».',
      'Їхати в одній із машин-патрулів, допомагати виявляти тварин, при необхідності утримувати та транспортувати поранену тварину, вести журнал спостережень і фіксувати геоточки на карті.',
      'Поранені тварини вночі залишаються без допомоги. Цей проект вперше у Львові організовує систематичний нічний моніторинг — ми хочемо знати, скільки тварин потребують допомоги щоночі.',
      'Щонеділі, 22:00–02:00', NOW() + INTERVAL '12 days', 1, 2,
      'ВетКліника Доктор Айболить',
      'https://images.unsplash.com/photo-1559070169-a3077159ee16?auto=format&fit=crop&q=80&w=600',
      8),
  (31, 2, 'Посадка квіткових клумб у дворах ветеранів',
      'EcoKyiv разом з ОСББ облаштовує квіткові клумби у дворах, де мешкають ветерани та їхні родини.',
      'DRAFT', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days 3 hours',
      'Багато ветеранів та їхніх сімей живуть у будинках із занедбаними дворами. EcoKyiv пропонує просте і водночас символічне рішення — зробити ці двори квітучими. Ми закупляємо 500 цибулинних квітів (тюльпани, нарциси, крокуси), надаємо інвентар та супровід ландшафтного дизайнера. Ветерани самі обирають, де і що садити. Результат буде видно вже навесні.',
      'Допомагати розкопувати землю та садити цибулини за схемою, розставляти декоративні камінці та бордюри, фотографувати процес для звіту та соціальних мереж.',
      'Красивий двір — знак поваги до людей, які захищають нашу землю. Цей проект поєднує добробут ветеранів та озеленення міста.',
      'Субота, 10:00–14:00', NOW() + INTERVAL '8 days', 2, 1,
      'КМДА, Асоціація ОСББ Києва',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600',
      20),
  (32, 7, 'Школа підприємництва для ветеранів',
      'Безкоштовний двотижневий курс для демобілізованих: від ідеї бізнесу до першого продажу.',
      'DRAFT', NOW() + INTERVAL '21 days', NOW() + INTERVAL '35 days',
      'ВетеранUA спільно з бізнес-школою Restart запускає перший безкоштовний підприємницький буткемп для демобілізованих. 10 днів інтенсивної підготовки: маркетинг, фінанси, юридичне оформлення ФОП, пошук перших клієнтів. Наставники — успішні підприємці, багато з яких самі ветерани АТО та ООС.',
      'Допомагати з реєстрацією учасників, підготовкою роздаткових матеріалів, організацією кейтерингу, зйомкою та документуванням заходів.',
      'Після служби знайти себе в цивільному — головний виклик для ветеранів. Власний бізнес дає незалежність та відчуття контролю над своїм життям.',
      'Пн–Пт, 10:00–18:00 (двотижневий інтенсив)', NOW() + INTERVAL '19 days', 6, 11,
      'Бізнес-школа Restart, Мінветеранів',
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=600',
      25);

-- PROJECT.category_id CORRECTIONS (old category IDs → new)
UPDATE project SET category_id =  12 WHERE id IN (1, 2, 9, 15, 30);
UPDATE project SET category_id =   3 WHERE id IN (3, 4, 8, 14);
UPDATE project SET category_id =   2 WHERE id IN (5, 7, 20, 21, 27, 29);
UPDATE project SET category_id =  10 WHERE id IN (6, 13);
UPDATE project SET category_id =  11 WHERE id = 10;
UPDATE project SET category_id =   5 WHERE id IN (11, 26);
UPDATE project SET category_id =   4 WHERE id IN (12, 24, 25, 28);
UPDATE project SET category_id =   9 WHERE id IN (16, 17, 31, 32);
UPDATE project SET category_id =  13 WHERE id = 18;
UPDATE project SET category_id =   1 WHERE id = 19;
UPDATE project SET category_id =   6 WHERE id IN (22, 23);

SELECT setval('project_id_seq', (SELECT MAX(id) FROM project));

INSERT INTO project_category (project_id, category_id) VALUES
  (30, 12),            -- Нічний патруль безпритульних тварин → Тварини
  (31,  3), (31,  9), -- Посадка клумб у дворах ветеранів → Екологія, Армія
  (32,  9), (32,  1); -- Школа підприємництва для ветеранів → Армія, Освіта

-- 3 нові новини (IDs 28–30): status=PENDING — 2 очікують модерації, 1 відхилена
INSERT INTO news (id, title, image_url, is_pinned, description, main_content, organization_id, status) VALUES
  (28, 'Rescue Львів: оновлення правил взяття тварин на перетримку',
      'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?auto=format&fit=crop&q=80&w=600',
      FALSE,
      'З 1 червня вводяться нові вимоги до волонтерів-перетримників: анкетування, home check та обов''язковий вступний тренінг.',
      'Рятуємо більше тварин — але не за рахунок їхнього добробуту на перетримці. Після серії інцидентів 2024–2025 рр., коли тварини потрапляли в умови, що не відповідали нашим стандартам, ми вирішили суттєво переглянути правила. Нові вимоги: заповнення деталізованої анкети (умови проживання, досвід з тваринами, режим), проведення home check волонтером-куратором, обов''язкове проходження 2-годинного онлайн-тренінгу на нашому порталі. Це не бюрократія — це відповідальність за кожну пухнасту душу, яку ми вам довіряємо.',
      1, 'PENDING'),
  (29, 'МедДопомога: звіт мобільної амбулаторії за квітень',
      'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=600',
      FALSE,
      'За квітень мобільна амбулаторія відвідала 9 прифронтових сіл Дніпропетровщини: прийнято 847 пацієнтів, проведено 312 ЕКГ, видано медикаменти на 156 000 грн.',
      'Мобільна амбулаторія МедДопомоги — Ford Transit, обладнаний оглядовим столом, холодильником для вакцин, апаратом ЕКГ і базовою аптекою — в квітні здійснила 12 виїздів у Нікопольський та Криворізький райони. Статистика місяця: 9 сіл охоплено, 847 пацієнтів прийнято (з них 214 вперше за рік), 312 ЕКГ виконано, 23 критичних стани виявлено та скеровано до лікарень, медикаменти на суму 156 000 грн видано безкоштовно. Найпоширеніші діагнози: гіпертонічна хвороба (38%), цукровий діабет 2 типу (22%), захворювання суглобів (19%). Дякуємо 47 волонтерам, які їздили разом із нами.',
      4, 'PENDING'),
  (30, 'ВетеранUA: набір на осінній цикл психологічних груп',
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600',
      FALSE,
      'Відкрито реєстрацію на груповий курс психологічної підтримки для ветеранів та членів їхніх сімей. 8 зустрічей, сертифікований психолог, безкоштовно.',
      'ВетеранUA оголошує набір до осіннього циклу груп психологічної підтримки. Формат: закрита група 6–8 осіб, 8 щотижневих зустрічей по 90 хвилин, ведучий — сертифікований психолог Тетяна Яворська (15 років практики, спеціалізація — ПТСР та адаптація після бойових дій). Три паралельні групи: тільки для ветеранів, тільки для подружжів ветеранів, змішана. Реєстрація за тел. +38 (057) 300-33-44 або через сайт. Усі заняття безкоштовні.',
      7, 'PENDING');

SELECT setval('news_id_seq', (SELECT MAX(id) FROM news));

INSERT INTO news_category (news_id, category_id) VALUES
  (28, 12),            -- Rescue оновлення правил перетримки → Тварини
  (29,  2), (29, 10), -- МедДопомога звіт амбулаторії квітень → Медицина, Гуманітарна
  (30,  9), (30,  2); -- ВетеранUA набір на психологічні групи → Армія, Медицина

-- 3 нові збори (IDs 14–16): DRAFT — 2 очікують підтвердження, 1 відхилений
INSERT INTO fundraising_campaign (id, organization_profile_id, volunteer_profile_id, title, description,
  main_content, goal_amount, current_amount, status, start_at, end_at, bank_link, image_url)
VALUES
  (14, 1, NULL,
      'Рефрижератор для транспортування вакцин і кормів',
      'Rescue Львів збирає на рефрижераторний фургон для перевезення ветеринарних вакцин та кормів без ризику псування.',
      'Зараз ми возимо вакцини та вологі корми у звичайній вантажівці. Влітку при +35°C частина вакцин псується ще в дорозі — це щомісяця 8–12 тис. грн збитків і ризик для тварин. Рефрижератор розв''яже цю проблему раз і назавжди. Плани: вакцинаційні рейди по 6 районах Львівщини, доставка великих партій кормів від партнерів, евакуація тварин із прифронтових районів. Кошторис: б/у рефрижератор до 3.5 т — 85 000 грн, технічна перевірка та страховка — 12 000 грн, реєстрація та переобладнання — 8 000 грн. Разом: 105 000 грн.',
      105000.00, 13300.00, 'DRAFT',
      NOW() + INTERVAL '5 days', NOW() + INTERVAL '65 days',
      NULL,
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=600'),
  (15, 4, NULL,
      'Портативні кардіографи для мобільної амбулаторії',
      'МедДопомога розширює парк обладнання — потрібно 3 портативних апарати ЕКГ для одночасного прийому в трьох точках одного села.',
      'Зараз у нас є лише 1 апарат ЕКГ, і щомісяця ми відмовляємо понад 150 пацієнтам через брак обладнання. Три нових портативних кардіографи дозволять одночасно вести прийом у 3 точках, скоротять час очікування вдвічі і дадуть змогу фіксувати дані в єдиній медичній базі. Ціна одного портативного ЕКГ (Mindray BE-D1): 28 500 грн. Три апарати: 85 500 грн. Витратні матеріали на рік: 14 500 грн. Навчання персоналу: 5 000 грн. Разом: 105 000 грн.',
      105000.00, 18500.00, 'DRAFT',
      NOW() + INTERVAL '3 days', NOW() + INTERVAL '60 days',
      NULL,
      'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=600'),
  (16, 17, NULL,
      'Обладнання першого молодіжного хабу Харківщини',
      'Молодіжний Хаб Харків збирає на меблі, техніку та ремонт першого молодіжного простору в Холодногірському районі.',
      'Ми орендували приміщення 120 кв. м в Холодногірському районі — одному з найбільш постраждалих від обстрілів районів Харкова. Потрібно перетворити голі стіни на функціональний простір: зала для воркшопів на 40 осіб (столи, стільці, проектор), зона коворкінгу (10 робочих місць), кухня-їдальня, ігрова зона. Кошторис: меблі — 65 000 грн, техніка — 42 000 грн, ремонт та декор — 33 000 грн. Разом: 140 000 грн.',
      140000.00, 0.00, 'DRAFT',
      NOW() + INTERVAL '7 days', NOW() + INTERVAL '67 days',
      NULL,
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600');

SELECT setval('fundraising_campaign_id_seq', (SELECT MAX(id) FROM fundraising_campaign));

INSERT INTO fundraising_category (campaign_id, category_id) VALUES
  (14, 12),            -- Рефрижератор для Rescue (тварини) → Тварини
  (15,  2), (15, 10), -- Портативні кардіографи МедДопомоги → Медицина, Гуманітарна
  (16,  1), (16, 11); -- Обладнання молодіжного хабу → Освіта, Діти

-- APPROVAL_REQUEST: PENDING (10 записів) + REJECTED (5 записів із причиною)
INSERT INTO approval_request (type, status, entity_id, submitted_by, reviewed_by, rejection_reason, reviewed_at) VALUES
  -- Організації на верифікацію
  ('ORGANIZATION', 'PENDING',  17, 35, NULL, NULL, NULL),
  ('ORGANIZATION', 'PENDING',  18, 36, NULL, NULL, NULL),
  ('ORGANIZATION', 'REJECTED', 19, 37, 1,
      'Надані документи не підтверджують реальну діяльність організації: статут містить шаблонні формулювання без конкретизації напрямів роботи, акт реєстрації відсутній. Надайте витяг з ЄДР давністю не більше 30 днів та підтвердження фактичної адреси.',
      NOW() - INTERVAL '18 hours'),
  -- Волонтерські профілі на верифікацію
  ('VOLUNTEER', 'PENDING',  14, 38, NULL, NULL, NULL),
  ('VOLUNTEER', 'PENDING',  15, 39, NULL, NULL, NULL),
  ('VOLUNTEER', 'REJECTED', 16, 40, 1,
      'Прикріплені документи не відповідають вимогам: фото паспорту нечитабельне, документ про освіту не завантажено. Перезавантажте документи у форматі PDF або JPEG не менш як 300 DPI.',
      NOW() - INTERVAL '6 hours'),
  -- Проекти на модерацію
  ('PROJECT', 'PENDING',  30, 2,  NULL, NULL, NULL),
  ('PROJECT', 'PENDING',  31, 3,  NULL, NULL, NULL),
  ('PROJECT', 'REJECTED', 32, 7,  1,
      'Опис проекту «Школа підприємництва для ветеранів» містить рекламні матеріали стороннього комерційного закладу без зазначення характеру партнерства. Уточніть умови співпраці з бізнес-школою та підтвердіть безкоштовність для учасників. Перегляньте розділ «Партнери» відповідно до правил платформи.',
      NOW() - INTERVAL '2 hours'),
  -- Новини на модерацію
  ('NEWS', 'PENDING',  28, 2,  NULL, NULL, NULL),
  ('NEWS', 'PENDING',  29, 8,  NULL, NULL, NULL),
  ('NEWS', 'REJECTED', 30, 7,  1,
      'Текст новини містить прямий контактний номер телефону зовнішньої організації. Відповідно до Правил використання (п. 4.2), розміщення контактів третіх осіб заборонено. Замініть номер на посилання на профіль партнера або загальний email вашої організації.',
      NOW() - INTERVAL '30 minutes'),
  -- Збори на модерацію
  ('FUNDRAISING', 'PENDING',  14, 2,  NULL, NULL, NULL),
  ('FUNDRAISING', 'PENDING',  15, 8,  NULL, NULL, NULL),
  ('FUNDRAISING', 'REJECTED', 16, 35, 1,
      'Збір прив''язаний до організації зі статусом PENDING (верифікацію не завершено). Розміщення зборів дозволяється лише для верифікованих організацій. Дочекайтеся підтвердження верифікації та повторно подайте збір на розгляд.',
      NOW() - INTERVAL '1 hour');

-- WARNINGS (попередження від адміна)
INSERT INTO warnings (user_id, created_by, reason, description, status, severity, issued_at, expires_at) VALUES
  (41, 1,
      'Спам та маніпулятивна поведінка',
      'Користувач неодноразово надсилав масові повідомлення іншим учасникам із проханням «лайкати» та «ділитися» сторонніми посиланнями. Після двох усних попереджень модераторів поведінка не змінилась. Обліковий запис заблоковано до завершення перевірки.',
      'ACTIVE', 'HIGH',
      NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days'),
  (29, 1,
      'Неповага до волонтерів',
      'Під час проекту «Еко-пікнік» (09.04.2025) користувач грубо коментував роботу координатора та відмовлявся виконувати прохання організаторів. Зафіксовано скарги від 3 учасників. Перше офіційне попередження.',
      'ACTIVE', 'MEDIUM',
      NOW() - INTERVAL '7 days', NOW() + INTERVAL '23 days'),
  (30, 1,
      'Підозра у зловживанні системою нагород',
      'Виявлено аномальну активність: реєстрація на 7 проектів протягом 2 годин з наступним скасуванням після нарахування балів. Відкрито внутрішню перевірку. Нарахування балів тимчасово призупинено.',
      'ACTIVE', 'LOW',
      NOW() - INTERVAL '2 days', NULL);

-- DONATIONS: доповнення до кампаній 4–9, 14–15
INSERT INTO donation (campaign_id, amount, donor_name, message, user_id) VALUES
  (4,  300.00,   'Р. Приймак',             'Хай щастить!',                  35),
  (4,  1200.00,  'Анонім',                 NULL,                            NULL),
  (5,  800.00,   'Ф. Полтавець',           'Для ветеранів від серця',        29),
  (5,  2500.00,  'Корпоративний донат',    NULL,                            NULL),
  (6,  450.00,   'Г. Жайворон',            'Важлива ініціатива',             30),
  (7,  3000.00,  'Меценат Харкова',        NULL,                            NULL),
  (7,  750.00,   'Г. Оберемок',            'На добро',                       31),
  (8,  1800.00,  'Анонім',                 NULL,                            NULL),
  (9,  500.00,   'Л. Острик',              'Мале, але від душі',             42),
  (9,  2200.00,  'Партнер ЗСУ',            NULL,                            NULL),
  (14, 5000.00,  'Меценат Ростислав',      'Тримайтесь',                     35),
  (14, 8300.00,  'Анонімний жертводавець', NULL,                            NULL),
  (15, 18500.00, 'Фонд «Твоє здоров''я»', 'На обладнання',                 NULL);

-- AUDIT_LOG: дії адміна — для відображення в журналі
INSERT INTO audit_log (user_id, action, entity_type, entity_id, payload, ip, user_agent) VALUES
  (1, 'APPROVE_ORGANIZATION', 'organization_profile', 1,
      '{"organization_id": 1, "name": "Rescue Львів", "status_before": "PENDING", "status_after": "VERIFIED"}',
      '192.168.1.10', 'Mozilla/5.0 Admin-Panel/1.0'),
  (1, 'APPROVE_VOLUNTEER', 'volunteer_profile', 1,
      '{"volunteer_id": 1, "display_name": "AnnaHelper", "is_verified_after": true}',
      '192.168.1.10', 'Mozilla/5.0 Admin-Panel/1.0'),
  (1, 'REJECT_ORGANIZATION', 'organization_profile', 19,
      '{"organization_id": 19, "name": "Малюки у Безпеці", "reason": "Документи не відповідають вимогам"}',
      '192.168.1.10', 'Mozilla/5.0 Admin-Panel/1.0'),
  (1, 'BLOCK_USER', 'app_user', 41,
      '{"user_id": 41, "email": "user-blocked@demo.local", "reason": "Спам та маніпулятивна поведінка"}',
      '192.168.1.10', 'Mozilla/5.0 Admin-Panel/1.0'),
  (1, 'REJECT_NEWS', 'news', 30,
      '{"news_id": 30, "title": "ВетеранUA: набір на осінній цикл психологічних груп", "reason": "Порушення правил п. 4.2"}',
      '192.168.1.10', 'Mozilla/5.0 Admin-Panel/1.0'),
  (1, 'ISSUE_WARNING', 'app_user', 29,
      '{"user_id": 29, "severity": "MEDIUM", "reason": "Неповага до волонтерів"}',
      '192.168.1.10', 'Mozilla/5.0 Admin-Panel/1.0'),
  (1, 'REJECT_VOLUNTEER', 'volunteer_profile', 16,
      '{"volunteer_id": 16, "display_name": "KatyaTeacher", "reason": "Нечитабельні документи"}',
      '192.168.1.10', 'Mozilla/5.0 Admin-Panel/1.0'),
  (2, 'SUBMIT_PROJECT', 'project', 30,
      '{"project_id": 30, "title": "Нічний патруль для безпритульних тварин", "org_id": 1}',
      '10.0.0.5', 'Mozilla/5.0 Firefox/124.0'),
  (3, 'SUBMIT_NEWS', 'news', 29,
      '{"news_id": 29, "title": "МедДопомога: звіт мобільної амбулаторії за квітень"}',
      '10.0.0.8', 'Mozilla/5.0 Chrome/124.0');

-- Виправлення news 30: approval rejected → встановити news.status = REJECTED
UPDATE news SET status = 'REJECTED' WHERE id = 30;

-- organization_category для нових org 17–19
INSERT INTO organization_category (organization_id, category_id) VALUES
  (17,  1), (17, 11),  -- Молодіжний Хаб → Освіта, Діти
  (18,  3),            -- ЕкоГрад Одеса → Екологія
  (19, 11), (19,  4);  -- Малюки у Безпеці → Діти, Соціальна допомога

-- ============================================================================
-- ДОПОВНЕННЯ: organization_membership_request (повне покриття статусів)
-- ============================================================================
INSERT INTO organization_membership_request
  (organization_id, user_id, direction, status, reviewed_at, attempt_count) VALUES
  -- ACCEPTED: пояснюють поточний organization_id у app_user
  (1,  4,  'REQUEST', 'ACCEPTED', NOW() - INTERVAL '70 days', 1),
  (2,  5,  'REQUEST', 'ACCEPTED', NOW() - INTERVAL '65 days', 1),
  (3,  18, 'INVITE',  'ACCEPTED', NOW() - INTERVAL '40 days', 1),
  (5,  19, 'INVITE',  'ACCEPTED', NOW() - INTERVAL '35 days', 1),
  (7,  20, 'REQUEST', 'ACCEPTED', NOW() - INTERVAL '28 days', 1),
  (10, 25, 'INVITE',  'ACCEPTED', NOW() - INTERVAL '20 days', 1),
  (11, 26, 'REQUEST', 'ACCEPTED', NOW() - INTERVAL '18 days', 1),
  (14, 25, 'INVITE',  'ACCEPTED', NOW() - INTERVAL '10 days', 1),
  (16, 24, 'REQUEST', 'ACCEPTED', NOW() - INTERVAL '8 days',  1),
  -- REJECTED
  (3,  30, 'REQUEST', 'REJECTED', NOW() - INTERVAL '15 days', 1),
  (6,  22, 'REQUEST', 'REJECTED', NOW() - INTERVAL '12 days', 1),
  (12, 29, 'REQUEST', 'REJECTED', NOW() - INTERVAL '5 days',  2),
  -- LEAVE
  (2,  21, 'LEAVE',   'PENDING',  NULL,                       1),
  (9,  18, 'LEAVE',   'ACCEPTED', NOW() - INTERVAL '3 days',  1),
  -- PENDING нові
  (14, 28, 'REQUEST', 'PENDING',  NULL,                       1),
  (15, 23, 'INVITE',  'PENDING',  NULL,                       1);

-- Оновлення організаційного членства (app_user.organization_id)
UPDATE app_user SET organization_id = 1  WHERE id = 4;
UPDATE app_user SET organization_id = 3  WHERE id = 18;
UPDATE app_user SET organization_id = 5  WHERE id = 19;
UPDATE app_user SET organization_id = 7  WHERE id = 20;
UPDATE app_user SET organization_id = 10 WHERE id = 25;
UPDATE app_user SET organization_id = 11 WHERE id = 26;
UPDATE app_user SET organization_id = 16 WHERE id = 24;

-- ============================================================================
-- NOTIFICATION_ORGANIZATION (15 сповіщень для організацій)
-- ============================================================================
INSERT INTO notification_organization
  (organization_id, message, is_read, type, entity_id, actor_id, project_id, expires_at)
VALUES
  -- REGISTRATION: нові заявки волонтерів на участь у проектах
  (1, 'Анна Шимчук подала заявку на проект «Суботня прогулка з хвостиками»',
      TRUE,  'REGISTRATION', 1, 4, 1, NOW() + INTERVAL '4 days'),
  (1, 'Петро Іваненко подав заявку на проект «Суботня прогулка з хвостиками»',
      FALSE, 'REGISTRATION', 2, 5, 1, NOW() + INTERVAL '4 days'),
  (1, 'Марія Бойко подала заявку на проект «Суботня прогулка з хвостиками»',
      FALSE, 'REGISTRATION', 3, 6, 1, NOW() + INTERVAL '4 days'),
  (2, 'Анна Шимчук подала заявку на проект «Велике прибирання берега річки Либідь»',
      TRUE,  'REGISTRATION', 4, 4, 3, NULL),
  (4, 'Лада Купрій подала заявку на проект «Курс тактичної медицини»',
      TRUE,  'REGISTRATION', 6, 18, 5, NOW() + INTERVAL '3 days'),
  (4, 'Феодосій Полтавець подав заявку на проект «Курс тактичної медицини»',
      FALSE, 'REGISTRATION', 7, 29, 5, NOW() + INTERVAL '3 days'),
  -- JOININGORG: запити на вступ до організації
  (1, 'Марія Бойко надіслала запит на вступ до організації',
      FALSE, 'JOININGORG', NULL, 6, NULL, NULL),
  (3, 'Феодосій Полтавець надіслав запит на вступ до організації ВетеранUA',
      FALSE, 'JOININGORG', NULL, 29, NULL, NULL),
  (5, 'Гліб Оберемок надіслав запит на вступ до організації ОсвітаПлюс',
      TRUE,  'JOININGORG', NULL, 31, NULL, NULL),
  -- LEAVE_REQUEST: запит на вихід
  (2, 'Данило Хмара надіслав запит на вихід з EcoKyiv',
      FALSE, 'LEAVE_REQUEST', NULL, 21, NULL, NULL),
  -- GENERAL: загальні оголошення та новини
  (1, 'Партнер ЛКП «Лев» підтвердив участь у суботній акції 25 травня',
      TRUE,  'GENERAL', NULL, NULL, NULL, NULL),
  (2, 'Нова партія саджанців від «Зелений Київ» готова до отримання',
      FALSE, 'GENERAL', NULL, NULL, NULL, NULL),
  (14, 'Нова партія зеленої сітки від партнерів з Польщі прибула на склад',
      TRUE,  'GENERAL', NULL, NULL, NULL, NULL),
  -- TASK: нові завдання в проектах
  (11, 'Нове завдання «Волонтер сцени на фестивалі» очікує виконавця',
      TRUE,  'TASK', NULL, NULL, 11, NULL),
  -- WARNING: системне попередження від адміна
  (1, 'Увага адміністратора: обліковий запис Романа Кривоноса заблоковано за порушення правил',
      FALSE, 'WARNING', NULL, 41, NULL, NULL);

-- ============================================================================
-- REPORT (10 звітів організацій)
-- ============================================================================
INSERT INTO report (id, organization_profile_id, project_id, title, type, file_url, published_at, description) VALUES
  (1,  1, NULL,
      'Rescue Львів — Фінансовий звіт за 2025 рік',
      'FINANCIAL', 'https://picsum.photos/seed/report-1/400/565',
      NOW() - INTERVAL '60 days',
      'Загальний бюджет: 847 200 грн. Джерела: донати (68%), гранти (24%), партнери (8%). Витрати: ветеринарні послуги 42%, корм та витратні матеріали 31%, логістика 15%, адміністрування 12%.'),
  (2,  1,  1,
      'Звіт проекту «Суботня прогулка з хвостиками» (Q1 2025)',
      'RESULT', 'https://picsum.photos/seed/report-2/400/565',
      NOW() - INTERVAL '45 days',
      'Проведено 12 прогулянок, залучено 47 волонтерів, соціалізовано 89 собак. 14 тварин після прогулянок знайшли домівку протягом 30 днів.'),
  (3,  2, NULL,
      'EcoKyiv — Звіт діяльності за квітень 2025',
      'ACTIVITY', 'https://picsum.photos/seed/report-3/400/565',
      NOW() - INTERVAL '22 days',
      'Квітень: 4 еко-суботники, 63 волонтери, зібрано 2.4 тонни сміття, висаджено 200 саджанців, проведено 8 еко-уроків у школах (1200 учнів).'),
  (4,  2,  3,
      'Звіт прибирання берегів Дніпра (весна 2025)',
      'RESULT', 'https://picsum.photos/seed/report-4/400/565',
      NOW() - INTERVAL '15 days',
      'Очищено 3.2 км берегової лінії, вилучено 860 кг сміття (з них 64% пластик, 18% скло), залучено 38 волонтерів, 4 організації-партнери.'),
  (5,  3, NULL,
      'ВетеранUA — Фінансовий звіт за 2024 рік',
      'FINANCIAL', 'https://picsum.photos/seed/report-5/400/565',
      NOW() - INTERVAL '90 days',
      'Видатки 2024: реабілітація 35%, психологічна підтримка 28%, навчання та перекваліфікація 22%, адміністрування 15%. Охоплено 412 ветеранів та членів їхніх сімей.'),
  (6,  4,  5,
      'Звіт курсу тактичної медицини (1-й потік, лютий 2025)',
      'RESULT', 'https://picsum.photos/seed/report-6/400/565',
      NOW() - INTERVAL '20 days',
      'Пройшли підготовку 28 цивільних (з 30 записаних). Рівень засвоєння MARCH-алгоритму: 94%. 100% учасників самостійно наклали турнікет за < 30 сек. Партнери: Центр такмеду Пульс, Нацгвардія.'),
  (7,  14, 16,
      'Звіт акції з плетіння маскувальних сіток (квітень 2025)',
      'ACTIVITY', 'https://picsum.photos/seed/report-7/400/565',
      NOW() - INTERVAL '10 days',
      'Виготовлено 47 сіток 3×6 м, задіяно 62 волонтери на 6 сесіях. Все передано підрозділам ЗСУ на Харківському напрямку через офіційні канали.'),
  (8,  16, 20,
      'Звіт безкоштовних психологічних консультацій (Q1 2025)',
      'RESULT', 'https://picsum.photos/seed/report-8/400/565',
      NOW() - INTERVAL '14 days',
      'Проведено 148 індивідуальних консультацій. Клієнти: ветерани 58%, переселенці 27%, члени сімей 15%. Середня оцінка сесії: 4.8/5.'),
  (9,  1, NULL,
      'Rescue Львів — Підсумковий звіт програми ОSK за 2024 рік',
      'OTHER', 'https://picsum.photos/seed/report-9/400/565',
      NOW() - INTERVAL '120 days',
      'Програма «Відловити-Стерилізувати-Повернути»: стерилізовано 510 котів у 8 районах Львова, рецидивів після повернення 0%. Рекомендація ВООЗ підтверджена практикою.'),
  (10, 11, 26,
      'Звіт майстер-класу з писанкарства Полісся (лютий 2025)',
      'ACTIVITY', 'https://picsum.photos/seed/report-10/400/565',
      NOW() - INTERVAL '5 days',
      'Учасників: 34. Вік: 8–72 роки. Виготовлено 120 писанок, 3 майстри народного мистецтва провели майстер-клас. Партнер: Житомирська ОДА.');

SELECT setval('report_id_seq', (SELECT MAX(id) FROM report));

-- ============================================================================
-- TASK: завдання для проектів 16–29
-- ============================================================================
INSERT INTO task (id, project_id, title, description, status, difficulty, points_reward_base, location_id, deadline) VALUES
  (14, 16, 'Підготовка матеріалів для плетіння сіток',
       'Розкрити рулони джуту, нарізати смуги, розкласти по столах перед сесією.',
       'OPEN', 'EASY', 15, 6, NOW() + INTERVAL '2 days'),
  (15, 17, 'Написання листів підтримки захисникам',
       'Написати від руки щирі листи підтримки — по 2–3 листи на учасника.',
       'OPEN', 'EASY', 10, 6, NOW() + INTERVAL '3 days'),
  (16, 18, 'Підготовка будівельного інструменту та матеріалів',
       'Перевірити, рознести по точках встановлення перфоратори, анкери, рейки для пандусів.',
       'OPEN', 'MEDIUM', 20, 1, NOW() + INTERVAL '5 days'),
  (17, 19, 'Розробка роздаткових матеріалів для курсу жестової мови',
       'Надрукувати та сортувати картки зі знаками, підготувати QR-коди для відеоуроків.',
       'OPEN', 'EASY', 15, 1, NOW() + INTERVAL '3 days'),
  (18, 20, 'Координація черги на психологічну консультацію',
       'Зустрічати клієнтів, реєструвати в системі, координувати очікування та конфіденційність.',
       'OPEN', 'MEDIUM', 25, 6, NOW() + INTERVAL '6 days'),
  (19, 21, 'Підготовка арт-матеріалів для груп переселенців',
       'Розкласти фарби, папір, пензлі по столах; прибрати після сесії арт-терапії.',
       'OPEN', 'EASY', 10, 6, NOW() + INTERVAL '4 days'),
  (20, 22, 'Реєстрація дітей на безкоштовну секцію футболу',
       'Заповнювати анкети на дітей, видавати форму, пояснювати розклад батькам.',
       'OPEN', 'EASY', 10, 8, NOW() + INTERVAL '7 days'),
  (21, 23, 'Допомога тренеру адаптивного спорту',
       'Асистувати тренеру з людьми з інвалідністю: страхування, допомога з обладнанням.',
       'OPEN', 'HARD', 40, 8, NOW() + INTERVAL '5 days'),
  (22, 24, 'Формування та доставка продуктових наборів',
       'Зібрати набори за списком, завантажити у машину, доставити самотнім пенсіонерам.',
       'OPEN', 'MEDIUM', 30, 9, NOW() + INTERVAL '4 days'),
  (23, 25, 'Технічна підтримка учасників курсу Дія',
       'Допомагати пенсіонерам встановлювати додатки на смартфони та проходити верифікацію.',
       'OPEN', 'EASY', 15, 5, NOW() + INTERVAL '2 days'),
  (24, 26, 'Підготовка воску та писанкового реманенту',
       'Зарядити електрокистиї, натопити воск, розкласти по столах писанки-болванки.',
       'OPEN', 'EASY', 10, 13, NOW() + INTERVAL '8 days'),
  (25, 27, 'Ведення журналу відвідуваності груп підтримки',
       'Реєструвати учасників на вході, заповнювати анонімний журнал, нагадувати про конфіденційність.',
       'OPEN', 'MEDIUM', 25, 6, NOW() + INTERVAL '6 days'),
  (26, 28, 'Розвантаження та сортування гуманітарних наборів для безхатніх',
       'Прийняти одяг та їжу від донорів, відсортувати за категоріями, розкласти на видачу.',
       'OPEN', 'MEDIUM', 20, 6, NOW() + INTERVAL '3 days'),
  (27, 29, 'Реєстрація пацієнтів виїзної вакцинаційної бригади',
       'Заповнювати форми вакцинації, перевіряти документи, пояснювати пацієнтам протоколи.',
       'OPEN', 'MEDIUM', 30, 7, NOW() + INTERVAL '5 days');

SELECT setval('task_id_seq', (SELECT MAX(id) FROM task));

INSERT INTO task_category (task_id, category_id) VALUES
  (14,  9), (14,  8),  -- Підготовка матеріалів для плетіння сіток → Армія, Волонтерство
  (15,  9), (15,  8),  -- Написання листів захисникам → Армія, Волонтерство
  (16, 13), (16,  4),  -- Підготовка будівельного інструменту (пандуси) → Інфраструктура, Соціальна
  (17,  4), (17,  1),  -- Розробка матеріалів курс жестової мови → Соціальна допомога, Освіта
  (18,  2), (18,  4),  -- Координація черги на психологічну консультацію → Медицина, Соціальна
  (19,  2), (19, 10),  -- Підготовка арт-матеріалів для груп переселенців → Медицина, Гуманітарна
  (20,  6), (20, 11),  -- Реєстрація дітей на футбольну секцію → Спорт, Діти
  (21,  6), (21,  4),  -- Допомога тренеру адаптивного спорту → Спорт, Соціальна допомога
  (22,  4), (22, 10),  -- Формування та доставка продуктових наборів → Соціальна, Гуманітарна
  (23,  4), (23,  1),  -- Технічна підтримка учасників курсу Дія → Соціальна допомога, Освіта
  (24,  5),            -- Підготовка воску та писанкового реманенту → Культура
  (25,  9), (25,  2),  -- Ведення журналу груп підтримки ветеранів → Армія, Медицина
  (26,  4), (26, 10),  -- Розвантаження гуманітарних наборів безхатнім → Соціальна, Гуманітарна
  (27,  2), (27, 10);  -- Реєстрація пацієнтів виїзної вакцинації → Медицина, Гуманітарна

-- ============================================================================
-- TASK_ASSIGNMENT: нові призначення для tasks 14–27
-- ============================================================================
INSERT INTO task_assignment (id, task_id, volunteer_profile_id, status, assigned_at, accepted_at, completed_at, requester_confirmed) VALUES
  (14, 14, 8,  'COMPLETED', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day', TRUE),
  (15, 15, 11, 'COMPLETED', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', TRUE),
  (16, 16, 12, 'ACCEPTED',  NOW() - INTERVAL '1 day',  NOW() - INTERVAL '1 day',  NULL, FALSE),
  (17, 17, 7,  'ACCEPTED',  NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NULL, FALSE),
  (18, 18, 5,  'ACCEPTED',  NOW() - INTERVAL '1 day',  NOW() - INTERVAL '1 day',  NULL, FALSE),
  (19, 19, 6,  'ACCEPTED',  NOW() - INTERVAL '1 day',  NOW() - INTERVAL '1 day',  NULL, FALSE),
  (20, 20, 3,  'ASSIGNED',  NOW() - INTERVAL '12 hours', NULL, NULL, FALSE),
  (21, 21, 4,  'ASSIGNED',  NOW() - INTERVAL '8 hours',  NULL, NULL, FALSE),
  (22, 22, 6,  'COMPLETED', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days', TRUE),
  (23, 23, 10, 'COMPLETED', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day', TRUE),
  (24, 24, 7,  'ACCEPTED',  NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NULL, FALSE),
  (25, 25, 6,  'ACCEPTED',  NOW() - INTERVAL '1 day',  NOW() - INTERVAL '1 day',  NULL, FALSE),
  (26, 26, 13, 'ACCEPTED',  NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NULL, FALSE),
  (27, 27, 5,  'ACCEPTED',  NOW() - INTERVAL '1 day',  NOW() - INTERVAL '1 day',  NULL, FALSE),
  (28, 14, 14, 'CANCELLED', NOW() - INTERVAL '5 days', NULL, NULL, FALSE);

SELECT setval('task_assignment_id_seq', (SELECT MAX(id) FROM task_assignment));

-- ============================================================================
-- PROJECT_REGISTRATION: реєстрації для projects 2, 4, 13–29
-- ============================================================================
INSERT INTO project_registration (project_id, user_id, status, reviewed_at, reviewed_by) VALUES
  -- Project 2
  (2,  18, 'ACCEPTED', NOW() - INTERVAL '4 days', 2),
  (2,  4,  'ACCEPTED', NOW() - INTERVAL '4 days', 2),
  (2,  29, 'PENDING',  NULL, NULL),
  -- Project 4
  (4,  5,  'ACCEPTED', NOW() - INTERVAL '3 days', 3),
  (4,  31, 'PENDING',  NULL, NULL),
  -- Project 13
  (13, 28, 'ACCEPTED', NOW() - INTERVAL '2 days', 17),
  (13, 6,  'PENDING',  NULL, NULL),
  -- Project 14
  (14, 21, 'ACCEPTED', NOW() - INTERVAL '3 days', 3),
  (14, 19, 'PENDING',  NULL, NULL),
  -- Project 15
  (15, 4,  'ACCEPTED', NOW() - INTERVAL '2 days', 2),
  (15, 22, 'ACCEPTED', NOW() - INTERVAL '2 days', 2),
  -- Project 16
  (16, 29, 'ACCEPTED', NOW() - INTERVAL '1 day',  32),
  (16, 30, 'ACCEPTED', NOW() - INTERVAL '1 day',  32),
  (16, 31, 'PENDING',  NULL, NULL),
  -- Project 17
  (17, 42, 'ACCEPTED', NOW() - INTERVAL '1 day',  32),
  (17, 43, 'PENDING',  NULL, NULL),
  -- Project 18
  (18, 27, 'ACCEPTED', NOW() - INTERVAL '2 days', 33),
  (18, 29, 'PENDING',  NULL, NULL),
  -- Project 19
  (19, 22, 'ACCEPTED', NOW() - INTERVAL '1 day',  33),
  (19, 30, 'PENDING',  NULL, NULL),
  -- Project 20
  (20, 18, 'ACCEPTED', NOW() - INTERVAL '2 days', 34),
  (20, 23, 'ACCEPTED', NOW() - INTERVAL '2 days', 34),
  -- Project 21
  (21, 22, 'ACCEPTED', NOW() - INTERVAL '1 day',  34),
  (21, 6,  'REJECTED', NOW() - INTERVAL '1 day',  34),
  -- Project 22
  (22, 29, 'ACCEPTED', NOW() - INTERVAL '3 days', 10),
  (22, 30, 'ACCEPTED', NOW() - INTERVAL '3 days', 10),
  (22, 31, 'PENDING',  NULL, NULL),
  -- Project 23
  (23, 18, 'ACCEPTED', NOW() - INTERVAL '2 days', 10),
  (23, 6,  'PENDING',  NULL, NULL),
  -- Project 24
  (24, 27, 'ACCEPTED', NOW() - INTERVAL '3 days', 13),
  (24, 28, 'ACCEPTED', NOW() - INTERVAL '2 days', 13),
  -- Project 25
  (25, 25, 'ACCEPTED', NOW() - INTERVAL '2 days', 9),
  (25, 26, 'PENDING',  NULL, NULL),
  -- Project 26
  (26, 6,  'ACCEPTED', NOW() - INTERVAL '1 day',  15),
  (26, 29, 'PENDING',  NULL, NULL),
  -- Project 27
  (27, 29, 'ACCEPTED', NOW() - INTERVAL '1 day',  7),
  (27, 30, 'ACCEPTED', NOW() - INTERVAL '1 day',  7),
  -- Project 28
  (28, 25, 'ACCEPTED', NOW() - INTERVAL '2 days', 16),
  (28, 31, 'PENDING',  NULL, NULL),
  -- Project 29
  (29, 18, 'ACCEPTED', NOW() - INTERVAL '1 day',  8),
  (29, 20, 'ACCEPTED', NOW() - INTERVAL '1 day',  8),
  (29, 29, 'PENDING',  NULL, NULL);

SELECT setval('project_registration_id_seq', (SELECT MAX(id) FROM project_registration));

-- ============================================================================
-- POINTS_TRANSACTION: нові SPEND / BONUS / PENALTY / EARN
-- ============================================================================
INSERT INTO points_transaction (user_id, task_assignment_id, amount, type, reason) VALUES
  -- EARN за нові завершені assignments
  (21, 14, 15, 'EARN', 'Завершено task #14: підготовка матеріалів для плетіння сіток'),
  (26, 15, 10, 'EARN', 'Завершено task #15: написання листів підтримки захисникам'),
  (21, 22, 30, 'EARN', 'Завершено task #22: доставка продуктів та ліків пенсіонерам'),
  (25, 23, 15, 'EARN', 'Завершено task #23: технічна підтримка на курсі Дія'),
  -- SPEND: обмін балів на нагороди
  (4,  NULL, -50,  'SPEND', 'Обмін балів на Стікерпак Hand&Hand (reward #1)'),
  (5,  NULL, -20,  'SPEND', 'Обмін балів на Сертифікат подяки (reward #4)'),
  (25, NULL, -200, 'SPEND', 'Обмін балів на Футболку Hand&Hand (reward #2)'),
  (24, NULL, -100, 'SPEND', 'Обмін балів на Кружку Hand&Hand (reward #3)'),
  -- BONUS: адмін додає бонусні бали
  (4,  NULL, 50, 'BONUS',  'Адмін-бонус: виключна організаційна робота на 5 проектах поспіль'),
  (18, NULL, 30, 'BONUS',  'Адмін-бонус: найкращий волонтер місяця (квітень 2025)'),
  (25, NULL, 40, 'BONUS',  'Адмін-бонус: технічна підтримка платформи (міграція БД)'),
  -- PENALTY: адмін знімає бали
  (29, NULL, -20, 'PENALTY', 'Штраф: відмова від проекту менш ніж за 24 год (project #3)'),
  (30, NULL, -10, 'PENALTY', 'Штраф: скасування реєстрації двічі поспіль без пояснення'),
  -- ADJUSTMENT: коригування помилки
  (5,  NULL, 5, 'ADJUSTMENT', 'Корекція помилкового нарахування від 2025-03-15');

-- Синхронізація points відповідно до нових транзакцій
UPDATE app_user SET points = points + 50 WHERE id = 4;
UPDATE app_user SET points = points + 30 WHERE id = 18;
UPDATE app_user SET points = points + 40 WHERE id = 25;
UPDATE app_user SET points = points - 20 WHERE id = 29;
UPDATE app_user SET points = points - 10 WHERE id = 30;

-- ============================================================================
-- NOTIFICATION: нові сповіщення для користувачів
-- ============================================================================
INSERT INTO notification (user_id, message, is_read, type) VALUES
  -- Нові учасники проектів
  (18, 'Вашу заявку на проект «Курс тактичної медицини» прийнято!',          FALSE, 'PROJECT'),
  (27, 'Вас прийнято до проекту «Юридичні консультації для ВПО».',            FALSE, 'PROJECT'),
  (22, 'Вашу заявку на проект «Безкоштовна секція футболу» прийнято!',        TRUE,  'PROJECT'),
  -- Задачі
  (21, 'Завдання #14 «Підготовка матеріалів» позначено як виконане. +15 балів.', FALSE, 'TASK'),
  (26, 'Завдання #15 «Листи підтримки» позначено як виконане. +10 балів.',    FALSE, 'TASK'),
  (25, 'Завдання #23 «Технічна підтримка» позначено як виконане. +15 балів.', FALSE, 'TASK'),
  -- Нагороди / Бали
  (4,  'Ви отримали 50 бонусних балів від адміна. Перегляньте нагороди!',     FALSE, 'REWARD'),
  (18, 'Ви отримали 30 бонусних балів — «Кращий волонтер квітня 2025»!',      FALSE, 'REWARD'),
  (25, 'Ви успішно обміняли 200 балів на Футболку Hand&Hand.',                TRUE,  'REWARD'),
  -- Попередження
  (29, 'Ви отримали попередження за скасування участі у проекті менш ніж за 24 год.', FALSE, 'WARNING'),
  (30, 'На ваш обліковий запис видано попередження. Перегляньте деталі.',     FALSE, 'WARNING'),
  (41, 'Ваш обліковий запис заблоковано. Зверніться до підтримки.',           FALSE, 'WARNING'),
  -- Вступ до організації
  (4,  'Вас прийнято до організації «Rescue Львів». Ласкаво просимо до команди!', FALSE, 'GENERAL'),
  (18, 'Вас прийнято до організації «ВетеранUA». Ласкаво просимо!',           FALSE, 'GENERAL'),
  (19, 'ОсвітаПлюс запрошує вас стати членом організації.',                   TRUE,  'GENERAL'),
  (20, 'Вашу заявку до організації «Рука Допомоги» прийнято.',                FALSE, 'GENERAL'),
  -- Нові реєстрації
  (42, 'Дякуємо за реєстрацію в Hand&Hand! Підтвердіть email для активації.', FALSE, 'GENERAL');

-- ============================================================================
-- TICKET: оновлення статусів — RESOLVED та CLOSED
-- ============================================================================
UPDATE ticket SET
  status = 'RESOLVED',
  updated_at = NOW() - INTERVAL '1 day',
  closed_at  = NOW() - INTERVAL '1 day'
WHERE id IN (3, 6, 9);

UPDATE ticket SET
  status = 'CLOSED',
  updated_at = NOW() - INTERVAL '3 days',
  closed_at  = NOW() - INTERVAL '3 days'
WHERE id IN (2, 5);

UPDATE ticket SET status = 'CANCELLED' WHERE id = 10;

-- ============================================================================
-- Підсумок: seed.sql повністю заповнений демо-даними
-- ============================================================================
-- project_registration: ~57  |  notification: ~32  |  notification_organization: 15
-- report: 10  |  task: 27  |  task_assignment: 28
-- organization_membership_request: ~29  |  points_transaction: ~29  |  ticket: 13
-- ============================================================================

COMMIT;

-- ============================================================================
-- Швидкі перевірки після сідингу
-- ============================================================================
-- SELECT tablename, n_live_tup FROM pg_stat_user_tables WHERE schemaname = 'public' ORDER BY n_live_tup DESC;
-- SELECT id, title, status FROM project;                                    -- 32
-- SELECT id, display_name, is_verified FROM volunteer_profile;              -- 16
-- SELECT id, name, verification_status FROM organization_profile;           -- 19
-- SELECT id, title, current_amount, goal_amount FROM fundraising_campaign;  -- 16
-- SELECT COUNT(*) FROM app_user;                                            -- 43
-- SELECT type, status, COUNT(*) FROM approval_request GROUP BY 1,2;        -- PENDING×10, REJECTED×5, APPROVED×many
-- SELECT user_id, severity, reason FROM warnings;                           -- 3
-- SELECT action, COUNT(*) FROM audit_log GROUP BY 1;
