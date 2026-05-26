-- ============================================================================
-- Seed data for hand_and_hand demo  (expanded — ≥13 records per table)
-- ============================================================================
-- Усі демо-користувачі мають пароль: Demo1234!
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
-- 3. APP_USER  (1 admin + 13 org + 13 vol + 4 regular = 31 запис)
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
       'ORGANIZATION', 'ACTIVE', 0, 'Денис', 'Гнатюк', 'Харків',
       'https://i.pravatar.cc/300?img=11', NULL),
  (8,  'org-med@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Марина', 'Савченко', 'Дніпро',
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
       'ORGANIZATION', 'ACTIVE', 0, 'Сергій', 'Коваль', 'Вінниця',
       'https://i.pravatar.cc/300?img=55', NULL),
  (12, 'org-kids@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Марфа', 'Лугова', 'Полтава',
       'https://i.pravatar.cc/300?img=43', NULL),
  (13, 'org-food@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Олег', 'Романюк', 'Хмельницький',
       'https://i.pravatar.cc/300?img=50', NULL),
  (14, 'org-rebuild@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Наталія', 'Сидоренко', 'Черкаси',
       'https://i.pravatar.cc/300?img=36', NULL),
  (15, 'org-culture@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Тарас', 'Литвин', 'Житомир',
       'https://i.pravatar.cc/300?img=67', NULL),
  (16, 'org-homeless@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Світлана', 'Мороз', 'Харків',
       'https://i.pravatar.cc/300?img=19', NULL),
  (17, 'org-idp@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'ORGANIZATION', 'ACTIVE', 0, 'Дмитро', 'Остапенко', 'Одеса',
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
       'VOLUNTEER', 'ACTIVE', 110, 'Микола', 'Скляр', 'Дніпро',
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
       'VOLUNTEER', 'ACTIVE', 70, 'Дарина', 'Рябець', 'Вінниця',
       'https://i.pravatar.cc/300?img=44', NULL),
  (23, 'vol-roman@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'VOLUNTEER', 'ACTIVE', 30, 'Роман', 'Вишиванюк', 'Полтава',
       'https://i.pravatar.cc/300?img=52', NULL),
  (24, 'vol-yulia@demo.local',
       '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
       'VOLUNTEER', 'ACTIVE', 220, 'Юлія', 'Дрофань', 'Хмельницький',
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
       'VOLUNTEER', 'ACTIVE', 110, 'Андрій', 'Марченко', 'Харків',
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
       'APP_USER', 'ACTIVE', 0, 'Василь', 'Полтавець', 'Харків',
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
  (1,  4,  'Анна Шимчук',   '+380671234567',
       'Займаюся волонтерством з весни 2022 року, коли довелося координувати розселення людей на львівському вокзалі. Зараз тримаю зв''язок із трьома великими центрами розміщення міста. Маю власне авто (мінівен), тому закриваю питання логістики та великих вантажів.',
       'Координація складів, водіння, логістика, комунікація в кризових ситуаціях', 4.80, TRUE,
       'https://i.pravatar.cc/300?img=47',
       'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448895/hand-and-hand/documents/reports/seed-report-01.pdf'),
  (2,  5,  'Петро Іваненко', '+380677654321',
       'Допомагаю громадським організаціям із веб-сервісами, автоматизацією процесів та технічною підтримкою. Маю досвід налаштування сайтів, внутрішніх форм обліку та простих інтеграцій для волонтерських команд.',
       'Веб-розробка, автоматизація, адміністрування баз даних, технічна підтримка', 4.50, TRUE,
       'https://i.pravatar.cc/300?img=12',
       'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448896/hand-and-hand/documents/reports/seed-report-02.pdf'),
  (3,  18, 'Софія Купрій',  '+380501112233',
       'Психологиня-волонтерка, проводить індивідуальні консультації та групові заняття для людей у кризових обставинах.',
       'Психологія, тренінги, групова робота', 4.70, TRUE,
       'https://i.pravatar.cc/300?img=5',
       'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448897/hand-and-hand/documents/reports/seed-report-03.pdf'),
  (4,  19, 'Микола Скляр', '+380632223344',
       'Фахівець з ремонтних робіт, бере участь у відновленні житла та облаштуванні доступних просторів.',
       'Будівництво, ремонт, монтаж, технічна підтримка', 4.60, TRUE,
       'https://i.pravatar.cc/300?img=15',
       'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448898/hand-and-hand/documents/reports/seed-report-04.pdf'),
  (5,  20, 'Оксана Самусь', '+380683334455',
       'Медична сестра, підтримує виїзні прийоми, навчання з домедичної допомоги та координацію пацієнтів.',
       'Медицина, домедична допомога, реєстрація пацієнтів', 4.90, TRUE,
       'https://i.pravatar.cc/300?img=25',
       'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448899/hand-and-hand/documents/reports/seed-report-05.pdf'),
  (6,  21, 'Іван Хмара',    '+380964445566',
       'Юрист-волонтер, консультує ВПО та ветеранські родини щодо документів, соціальних виплат і трудових прав.',
       'Юридичні консультації, документи, права ВПО', 4.75, TRUE,
       'https://i.pravatar.cc/300?img=33',
       'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448900/hand-and-hand/documents/reports/seed-report-06.pdf'),
  (7,  22, 'Дарина Рябець', '+380975556677',
       'Викладачка англійської, допомагає з освітніми програмами для дітей і дорослих.',
       'Освіта, іноземні мови, менторство', 4.85, TRUE,
       'https://i.pravatar.cc/300?img=44',
       'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448901/hand-and-hand/documents/reports/seed-report-07.pdf'),
  (8,  23, 'Роман Вишиванюк', '+380636667788',
       'Логіст, координує доставку гуманітарних вантажів та роботу з партнерами у регіонах.',
       'Логістика, водіння, маршрутне планування', 4.40, TRUE,
       'https://i.pravatar.cc/300?img=52',
       'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448902/hand-and-hand/documents/reports/seed-report-08.pdf'),
  (9,  24, 'Юлія Дрофань',  '+380507778899',
       'Фотографиня та дизайнерка, документує волонтерські події, готує матеріали для звітів і комунікацій.',
       'Фотографія, графічний дизайн, SMM', 4.65, TRUE,
       'https://i.pravatar.cc/300?img=49',
       'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448902/hand-and-hand/documents/reports/seed-report-09.pdf'),
  (10, 25, 'Богдан Ластовецький', '+380668889900',
       'Розробник повного циклу, підтримує цифрові сервіси благодійних організацій.',
       'IT, веб-розробка, автоматизація', 4.80, TRUE,
       'https://i.pravatar.cc/300?img=62',
       'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448904/hand-and-hand/documents/reports/seed-report-10.pdf'),
  (11, 26, 'Анастасія Буряк', '+380959990011',
       'Коуч і мотиваційний спікер. Проводжу тренінги для волонтерів.',
       'Коучинг, мотивація, командна робота', 4.55, TRUE,
       'https://i.pravatar.cc/300?img=26',
       'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448895/hand-and-hand/documents/reports/seed-report-01.pdf'),
  (12, 27, 'Андрій Марченко', '+380730001122',
       'Водій-волонтер. Евакуація людей, перевезення гумдопомоги.',
       'Водіння B/C/D, евакуація, логістика', 4.70, TRUE,
       'https://i.pravatar.cc/300?img=66',
       'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448896/hand-and-hand/documents/reports/seed-report-02.pdf'),
  (13, 28, 'Ольга Чечіль',  '+380661112233',
       'Перекладачка і редакторка, готує українські, англійські та німецькі матеріали для громадських організацій і ВПО.',
       'Переклад, копірайтинг, редактура', 4.60, TRUE,
       'https://i.pravatar.cc/300?img=28',
       'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448897/hand-and-hand/documents/reports/seed-report-03.pdf');

SELECT setval('volunteer_profile_id_seq', (SELECT MAX(id) FROM volunteer_profile));

-- ============================================================================
-- 6. ORGANIZATION_PROFILE (13 організацій)
-- ============================================================================
INSERT INTO organization_profile (id, user_id, name, edrpou, description, verification_status, official_docs_url, contact_phone, contact_email, city, logo_url, location_id, mission) VALUES
  (1,  2,  'Rescue Львів',       '12345678',
       'Офіційне об''єднання волонтерів-зоозахисників. Допомагаємо безпритульним і евакуйованим тваринам: лікування, перетримка, адопція та просвітницькі події. Маємо команду ветеринарів і кінологів.',
       'VERIFIED', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448895/hand-and-hand/documents/reports/seed-report-01.pdf',
       '+380322001122', 'contact@rescue.lviv.ua', 'Львів',
       'https://ui-avatars.com/api/?name=RL&background=e03131&color=fff&size=200&bold=true', 1,
       'Створення безпечного міського середовища та захист прав безпритульних тварин.'),
  (2,  3,  'EcoKyiv',            '87654321',
       'Громадська організація, що координує екологічні ініціативи у столиці: прибирання громадських просторів, сортувальні заняття у школах, моніторинг стихійних звалищ і відновлення малих річок Києва.',
       'VERIFIED', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448896/hand-and-hand/documents/reports/seed-report-02.pdf',
       '+380442002233', 'hello@ecokyiv.org.ua', 'Київ',
       'https://ui-avatars.com/api/?name=EK&background=2f9e44&color=fff&size=200&bold=true', 2,
       'Збереження екологічного балансу столиці та розвиток культури свідомого споживання.'),
  (3,  7,  'ВетеранUA',          '11223344',
       'Допомагаємо ветеранам та їхнім сім''ям адаптуватись до мирного життя.',
       'VERIFIED', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448897/hand-and-hand/documents/reports/seed-report-03.pdf',
       '+380572003344', 'info@veteranua.org.ua', 'Харків',
       'https://ui-avatars.com/api/?name=VA&background=4263eb&color=fff&size=200&bold=true', 6,
        'Допомагаємо ветеранам і їхнім родинам отримувати підтримку, послуги та можливості для цивільного життя.'),
  (4,  8,  'МедДопомога',        '22334455',
       'Безкоштовна медична допомога для переселенців та малозабезпечених.',
       'VERIFIED', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448898/hand-and-hand/documents/reports/seed-report-04.pdf',
       '+380562004455', 'med@meddopomoga.org.ua', 'Дніпро',
       'https://ui-avatars.com/api/?name=MD&background=c92a2a&color=fff&size=200&bold=true', 7,
       'Здоров''я — право кожного, незалежно від статусу.'),
  (5,  9,  'ОсвітаПлюс',         '33445566',
       'Безкоштовні курси, тренінги та освітні програми для дорослих і дітей.',
       'VERIFIED', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448899/hand-and-hand/documents/reports/seed-report-05.pdf',
       '+380482005566', 'osvita@osvitaplus.org.ua', 'Одеса',
       'https://ui-avatars.com/api/?name=OP&background=1971c2&color=fff&size=200&bold=true', 4,
       'Знання змінюють світ.'),
  (6,  10, 'СпортДух',           '44556677',
       'Спортивні секції та реабілітація для дітей і молоді через спорт.',
       'VERIFIED', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448900/hand-and-hand/documents/reports/seed-report-06.pdf',
       '+380612006677', 'sport@sportdukh.org.ua', 'Запоріжжя',
       'https://ui-avatars.com/api/?name=SD&background=e67700&color=fff&size=200&bold=true', 8,
       'Спорт як шлях до єдності та відновлення.'),
  (7,  11, 'Рука Допомоги',      '55667788',
       'Розподіл гуманітарної допомоги, продуктових і гігієнічних наборів.',
       'VERIFIED', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448901/hand-and-hand/documents/reports/seed-report-07.pdf',
       '+380432007788', 'help@rukadop.org.ua', 'Вінниця',
       'https://ui-avatars.com/api/?name=RD&background=862e9c&color=fff&size=200&bold=true', 9,
       'Простягаємо руку тим, хто цього потребує.'),
  (8,  12, 'Дитяча Радість',     '66778899',
       'Організовуємо свята, майстер-класи та розвивальні програми для дітей ВПО.',
       'VERIFIED', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448902/hand-and-hand/documents/reports/seed-report-08.pdf',
       '+380532008899', 'joy@dytradist.org.ua', 'Полтава',
       'https://ui-avatars.com/api/?name=DR&background=d6336c&color=fff&size=200&bold=true', 10,
       'Дитяча усмішка — наша найкраща нагорода.'),
  (9,  13, 'Їжа та Турбота',     '77889900',
       'Гаряче харчування та продуктові набори для літніх людей і безхатніх.',
       'VERIFIED', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448902/hand-and-hand/documents/reports/seed-report-09.pdf',
       '+380382009900', 'food@izha.org.ua', 'Хмельницький',
       'https://ui-avatars.com/api/?name=IT&background=e67700&color=fff&size=200&bold=true', 11,
       'Ніхто не має лягати спати голодним.'),
  (10, 14, 'Відбудова Разом',    '88990011',
       'Відновлення та ремонт житла для ВПО і постраждалих родин.',
       'VERIFIED', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448904/hand-and-hand/documents/reports/seed-report-10.pdf',
       '+380472000011', 'rebuild@vidbud.org.ua', 'Черкаси',
       'https://ui-avatars.com/api/?name=VR&background=0c8599&color=fff&size=200&bold=true', 12,
       'Відновлюємо домівки — відновлюємо надію.'),
  (11, 15, 'Культурна ДНК',      '99001122',
       'Збереження та популяризація традиційної культури, музики і мистецтва.',
       'VERIFIED', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448895/hand-and-hand/documents/reports/seed-report-01.pdf',
       '+380412001122', 'dna@kultdna.org.ua', 'Житомир',
       'https://ui-avatars.com/api/?name=KD&background=5c7cfa&color=fff&size=200&bold=true', 13,
       'Культура — це пам''ять народу.'),
  (12, 16, 'Дах і Тепло',        '10111213',
       'Підтримка бездомних: нічліжка, одяг, їжа, соціальний супровід.',
       'VERIFIED', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448896/hand-and-hand/documents/reports/seed-report-02.pdf',
       '+380572002233', 'dakh@dakhteplo.org.ua', 'Харків',
       'https://ui-avatars.com/api/?name=DT&background=364fc7&color=fff&size=200&bold=true', 6,
       'Кожна людина заслуговує на дах над головою.'),
  (13, 17, 'Переселенці Разом',  '11121314',
       'Юридична допомога, соціальна підтримка та інтеграція ВПО.',
       'VERIFIED', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448897/hand-and-hand/documents/reports/seed-report-03.pdf',
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
  (1, 1, 'Вигул собак у центрі адопції Львова',
      'Потрібні волонтери для регулярного вигулу собак і допомоги працівникам центру адопції.',
      'ACTIVE', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days 2 hours',
      'Центр адопції планує суботню зміну для соціалізації собак. Волонтери отримають інструктаж, маршрут прогулянки та контакт координатора. Завдання підходить для учасників, які готові відповідально працювати з тваринами й дотримуватися правил безпеки.',
      'Приїхати на локацію, отримати інструктаж, вигулювати собаку за визначеним маршрутом, стежити за безпекою тварини та повідомляти координатора про спостереження.',
      'Регулярні прогулянки знижують стрес тварин, підтримують їхню соціалізацію та підвищують шанси на відповідальну адопцію.',
      'Субота, з 10:00 до 12:00', NOW() + INTERVAL '3 days', 1, 2,
      'ЛКП Лев, Хвіст-Hub',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600',
      15),

  (2, 1, 'Сортування гуманітарного вантажу для центру адопції',
      'Потрібна команда для прийому, сортування та обліку кормів, лежаків і ветеринарних матеріалів.',
      'ACTIVE', NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days 5 hours',
      'На склад прибуває гуманітарний вантаж для тварин, евакуйованих із прифронтових громад. Завдання поділені на зони прийому, перевірки, маркування та розміщення.',
      'Розвантажувати коробки, перевіряти маркування, вести облік, складати товари за категоріями.',
      'Швидке сортування дозволяє центру без затримок передати корм і матеріали тваринам на перетримці.',
      'Середа, з 11:00 до 16:00', NOW() + INTERVAL '5 days', 1, 2,
      'Європейські донори, локальні перевізники',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600',
      10),

  (3, 2, 'Велике прибирання берега річки Либідь',
      'Організовуємо прибирання столичної річки та сортування зібраних відходів.',
      'ACTIVE', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days 4 hours',
      'EcoKyiv проводить планове прибирання ділянки річки Либідь із подальшим сортуванням відходів і передачею пластику, скла та металу на переробку. Учасники отримають рукавиці, мішки, інструктаж із безпеки та працюватимуть у невеликих групах під супроводом координаторів.',
      'Збирати відходи вздовж берегової лінії, сортувати фракції, допомагати з логістикою мішків і фотофіксацією результатів.',
      'Регулярне очищення берегів зменшує потрапляння сміття у воду та формує сталі екологічні практики.',
      'Неділя, з 10:00 до 14:00', NOW() + INTERVAL '4 days', 2, 1,
      'Київзеленбуд, ВторРесурси',
      'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=600',
      40),

  (4, 2, 'Зелена школа: Висадка алеї кленів на Подолі',
      'Висаджуємо дерева та облаштовуємо навчальну зелену зону на шкільному подвір''ї.',
      'ACTIVE', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days 4 hours',
      'Школа №125 облаштовує навчальну зелену зону на подвір''ї. Команда висадить дерева, підготує ґрунт, встановить опори та передасть школі короткий план догляду за насадженнями. Волонтери працюватимуть разом із координатором і представниками школи.',
      'Готувати лунки, висаджувати дерева, встановлювати кілки, прибирати територію після робіт.',
      'Зелена зона покращить мікроклімат подвір''я і стане практичним майданчиком для екологічної освіти.',
      'П''ятниця, з 12:00 до 16:00', NOW() + INTERVAL '9 days', 2, 3,
      'Школа №125, Рада Подільського району',
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600',
      25),

  (5, 4, 'Тренінг з домедичної допомоги для цивільних',
      'Безкоштовне практичне навчання з базових дій до прибуття медиків.',
      'ACTIVE', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 6 hours',
      'МедДопомога організовує практичне навчання для мешканців громади: зупинка кровотечі, стабільне положення, виклик допомоги та безпечна комунікація. Учасники працюватимуть під наглядом сертифікованих інструкторів.',
      'Допомагати інструкторам, готувати матеріали, реєструвати учасників і підтримувати порядок у навчальній зоні.',
      'Базові навички домедичної допомоги підвищують шанси людини дочекатися професійної медичної допомоги.',
      'Субота, з 10:00 до 16:00', NOW() + INTERVAL '2 days', 3, 4,
      'Центр такмеду Пульс, медичні інструктори',
      'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=600',
      30),

  (6, 1, 'Сортування теплого одягу для переселенців',
      'Потрібні волонтери для перевірки, маркування та розміщення теплого одягу на складі.',
      'ACTIVE', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 4 hours',
      'На склад прибуває велика партія теплого одягу для родин ВПО. Потрібно перевірити стан речей, відсортувати їх за розмірами та сезоном, промаркувати коробки і підготувати набори до видачі.',
      'Перегляд одягу на наявність дефектів, сортування за статтю та розмірами (чоловічий, жіночий, дитячий), акуратне викладання речей на полиці, пакування несезонного одягу в мішки.',
      'Добре організований склад допомагає родинам швидко отримувати потрібні речі без черг і втрат.',
      'Понеділок, з 12:00 до 16:00', NOW() + INTERVAL '1 day', 1, 10,
      'Міський гуманітарний штаб',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
      12),

  (7, 4, 'Виїзний день здоров''я для літніх людей у селах',
      'Команда медиків і волонтерів проведе базові консультації у селах із обмеженим доступом до лікарів.',
      'ACTIVE', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days 8 hours',
      'Плануються огляди терапевта, вимірювання тиску, ЕКГ за показами та консультації щодо подальшого лікування.',
      'Реєструвати пацієнтів, координувати чергу, допомагати з анкетами, супроводжувати людей до кабінетів.',
      'Виїзні прийоми дозволяють виявити ризики для здоров''я у людей, які рідко можуть доїхати до лікарні.',
      'Неділя, з 08:00 до 16:00', NOW() + INTERVAL '7 days', 3, 9,
      'Місцеві амбулаторії, сімейні лікарі',
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600',
      20),

  (8, 2, 'Еко-пікнік: Як правильно сортувати сміття вдома',
      'Проводимо інтерактивний майстер-клас та лекторій на свіжому повітрі у парку Шевченка.',
      'ACTIVE', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days 3 hours',
      'Запрошуємо мешканців на практичну зустріч про сортування відходів. Команда пояснить маркування пластику, правила збору батарейок і ламп, покаже зразки вторсировини та передасть короткі гайди для домашнього використання.',
      'Допомога з монтажем банерів та звукового обладнання, роздача інформаційних буклетів, проведення дитячої зони з еко-іграми, фіксація заходу на камеру.',
      'Понад 95% сміття в Україні просто закопується в землю на полігонах. Популяризація домашнього сортування знижує навантаження на сміттєзвалища та розвиває культуру ресайклінгу.',
      'Субота, з 15:00 до 18:00', NOW() + INTERVAL '6 days', 2, 1,
      'Зелений Київ, Rethink Ukraine',
      'https://images.pexels.com/photos/3735212/pexels-photo-3735212.jpeg?auto=compress&cs=tinysrgb&w=600',
      15),

  (9, 1, 'Ремонт вольєрів у центрі тимчасової перетримки',
      'Оновлюємо покриття, дверцята та дренаж у вольєрах перед сезоном дощів.',
      'ACTIVE', NOW() + INTERVAL '9 days', NOW() + INTERVAL '9 days 6 hours',
      'Команда проведе технічний огляд вольєрів, дрібний ремонт, заміну пошкоджених елементів і прибирання території. Матеріали закуплені за попереднім кошторисом.',
      'Допомагати майстрам, переносити матеріали, фарбувати, прибирати будівельні залишки.',
      'Безпечні вольєри зменшують ризик травм і хвороб у тварин, які очікують на адопцію.',
      'Субота, з 10:00 до 16:00', NOW() + INTERVAL '8 days', 1, 2,
      'ЛьвівБудМаркет, ЗооЗахист-Фонд',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
      18),

  (10, 4, 'Арттерапевтична програма для дітей ВПО',
      'Проводимо заняття з творчої підтримки для дітей, які пережили вимушений переїзд.',
      'ACTIVE', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days 3 hours',
      'Програма допомагає дітям ВПО адаптуватися через творчі заняття під супроводом психолога. Волонтери готуватимуть матеріали, допомагатимуть дітям під час роботи з фарбами та підтримуватимуть спокійний безпечний простір.',
      'Готувати матеріали, допомагати дітям під час занять, підтримувати порядок і працювати за інструкціями психолога.',
      'Творчі заняття допомагають дітям безпечно виражати емоції і поступово адаптуватися до нового середовища.',
      'Четвер, з 16:00 до 19:00', NOW() + INTERVAL '3 days', 3, 8,
      'Дитячі психологи, освітній центр',
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=600',
      30),

  (11, 11, 'Фестиваль традиційної музики',
      'Одноденний фестиваль автентичного фольклору та ремесел Полісся.',
      'ACTIVE', NOW() + INTERVAL '20 days', NOW() + INTERVAL '20 days 8 hours',
      'Культурна ДНК проводить фестиваль для громади з фокусом на традиційні інструменти, спів і ремесла. На локації працюватимуть тематичні стенди, майстер-класи та сцена для локальних колективів.',
      'Допомагати майстрам облаштовувати та прибирати стенди, скеровувати гостей між майданчиками, вести запис охочих на майстер-класи, стежити за порядком у зоні дитячої програми та допомагати з монтажем і демонтажем сцени.',
      'Культурні події підтримують локальну ідентичність і залучають громаду до збереження спадщини.',
      'Неділя, 10:00–18:00', NOW() + INTERVAL '18 days', 13, 7,
      'Обласний центр народної творчості',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600', 200),

  (12, 12, 'Підготовка нічліжки до зими',
      'Ремонт, прибирання, облаштування нових місць у нічліжці на 60 людей.',
      'ACTIVE', NOW() + INTERVAL '8 days', NOW() + INTERVAL '9 days',
      'Дах і Тепло готує приміщення до збільшеного зимового навантаження: ліжка, постіль, теплий одяг і графік чергувань.',
      'Сортувати речі, розставляти меблі, маркувати набори, допомагати координатору з обліком.',
      'Підготовлена нічліжка забезпечує людям без житла тепле і безпечне місце у холодний період.',
      'Субота–Неділя, 9:00–17:00', NOW() + INTERVAL '6 days', 6, 15,
      'Харківська міська рада',
      'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=600', 20),

  (13, 13, 'Юридичні консультації для ВПО',
      'Безкоштовні консультації юристів з питань житла, соцвиплат, документів.',
      'ACTIVE', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days 6 hours',
      'Організація «Переселенці Разом» щомісяця проводить безкоштовний день юридичних консультацій для внутрішньо переміщених осіб. Досвідчені юристи та адвокати-волонтери консультують із широкого кола питань: оформлення статусу ВПО та державних виплат, реєстрація за новою адресою, захист трудових прав при звільненні, відновлення втрачених або залишених в окупації документів. Щомісяця на прийом приходять від 50 до 70 людей. Нам потрібна координаційна підтримка в день консультацій.',
      'Зустрічати відвідувачів і реєструвати їх, видавати порядкові талони, пояснювати регламент очікування, підготовляти пакети документів за попередньо зібраними анкетами, допомагати юристам із технічними завданнями — друком, копіюванням, пошуком офіційних форм.',
      'Правова підтримка допомагає ВПО швидше отримувати послуги, виплати та відновлювати документи.',
      'Субота, 9:00–15:00', NOW() + INTERVAL '3 days', 4, 10,
      'Центр безоплатної правової допомоги',
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600', 60),

  (14, 2, 'Прибирання берегової зони Дніпра',
      'Планова екологічна акція на Трухановому острові з сортуванням і вивезенням відходів.',
      'ACTIVE', NOW() + INTERVAL '15 days', NOW() + INTERVAL '15 days 5 hours',
      'Команди працюватимуть на кількох ділянках берегової лінії, збиратимуть відходи і передаватимуть вторсировину на переробку.',
      'Збирати відходи, сортувати фракції, допомагати координаторам бригад, дотримуватися техніки безпеки.',
      'Чисті береги зменшують забруднення води і роблять рекреаційні зони безпечнішими для громади.',
      'Субота, 9:00–14:00', NOW() + INTERVAL '13 days', 2, 1,
      'КП Плесо, переробні компанії',
      'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=600', 150),

  (15, 1, 'Виїзний день адопції у Тернополі',
      'Rescue Львів проводить зустріч із тваринами, готовими до адопції, та консультації для майбутніх опікунів.',
      'ACTIVE', NOW() + INTERVAL '11 days', NOW() + INTERVAL '11 days 6 hours',
      'Команда привезе вакцинованих тварин, проведе консультації щодо догляду і оформить заявки на відповідальну адопцію.',
      'Допомагати з навігацією гостей, доглядом за тваринами, анкетами та консультаційною зоною.',
      'Виїзні події допомагають тваринам знайти сім''ї поза межами одного міста.',
      'Субота, 11:00–17:00', NOW() + INTERVAL '9 days', 3, 2,
      'Тернопільський центр адопції',
      'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?auto=format&fit=crop&q=80&w=600', 40);

SELECT setval('project_id_seq', (SELECT MAX(id) FROM project));

INSERT INTO project_category (project_id, category_id) VALUES
  (1,  12),            -- Вигул собак у центрі адопції → Тварини
  (2,  12),            -- Евакуаційний рейс зоотовари → Тварини
  (3,   3),            -- Прибирання берега Либідь → Екологія
  (4,   3), (4,  1),  -- Висадка алеї кленів → Екологія, Освіта
  (5,   2), (5,  9),  -- Тренінг з домедичної допомоги → Медицина, Армія та оборона
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
       'Перекласти типові форми заяв на українську для отримувачів допомоги громадської організації.',
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
  (1,  'Річний звіт Rescue Львів за 2025 рік',
       'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600', TRUE,
       'Організація підбила підсумки лікування, перетримки та адопції тварин за рік.',
       'За 2025 рік команда Rescue Львів надала допомогу 320 тваринам, організувала 210 адопцій і провела 510 стерилізацій. Окремий розділ звіту присвячений витратам на лікування, корм і логістику.',
       1, 'PUBLISHED'),
  (2,  'Зелений рекорд: 200 нових дерев прикрасили парки Києва',
       'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600', FALSE,
       'Ми завершили весняний марафон озеленення. Фотозвіт та геомітки нових насаджень вже на сайті.',
       'Цієї весни команда EcoKyiv разом із сотнями небайдужих киян провела чотири масштабні акції з висадки дерев. Спільними зусиллями ми висадили 200 здорових саджанців дуба, липи, декоративної яблуні та клена в житлових районах столиці та на території шкіл. Кожне дерево отримало GPS-мітку на інтерактивній еко-карті, щоб волонтери та місцеві мешканці могли доглядати за насадженнями й відстежувати їхній стан.',
       2, 'PUBLISHED'),
  (3,  'Rescue Львів шукає IT-волонтерів для системи обліку',
       'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600', FALSE,
       'Фахівці з Angular, Figma та веб-розробки можуть допомогти автоматизувати роботу притулків України.',
       'Rescue Львів оновлює внутрішній облік тварин, лікування та адопцій. Команді потрібні волонтери для веб-сервісу з картками тварин, статусами лікування, фільтрами для адопції та журналом догляду. Орієнтовне навантаження — 2-3 години на тиждень.',
       1, 'PUBLISHED'),
  (4,  'Rescue Львів отримав грант на хірургічний блок',
       'https://images.unsplash.com/photo-1770836037793-95bdbf190f71?auto=format&fit=crop&q=80&w=600', FALSE,
       'Партнерський фонд профінансує обладнання для ветеринарного блоку в центрі перетримки.',
       'Організація підписала договір про цільове фінансування закупівлі хірургічного обладнання, цифрового рентгену та облаштування ізолятора для інфекційних випадків. Грант покриває обладнання, а поточні потреби в кормі та догляді фінансуються окремими зборами.',
       1, 'PUBLISHED'),
  (5,  'Проєкт «Чиста школа»: 50 еко-боксів встановлено у ліцеях столиці',
       'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600', FALSE,
       'EcoKyiv запустив масштабну освітню ініціативу роздільного збору відходів серед школярів.',
       'Сортування сміття має ставати звичкою з дитинства. Ми завершили перший етап освітнього проєкту: закупили та встановили 50 трисекційних баків для роздільного збору пластику, паперу та скла у 15 школах Києва. Волонтери провели екоуроки для 3000 учнів і передали школам методичні матеріали.',
       2, 'PUBLISHED'),
  (6,  'Гаряча лінія психологічної підтримки для ВПО працює 24/7',
       'https://images.unsplash.com/photo-1758273240373-370993d0275d?auto=format&fit=crop&q=80&w=600', FALSE,
       'Сертифіковані кризові психологи фонду МедДопомога готові вислухати та допомогти знайти опору.',
       'Фонд запустив безкоштовну всеукраїнську гарячу лінію психологічної підтримки. Консультації надають дипломовані кризові психологи з досвідом роботи з тривожними станами, наслідками втрати дому та адаптацією після травматичних подій. Дзвінки конфіденційні та безкоштовні з мобільних операторів України.',
       4, 'PUBLISHED'),
  (7,  'Мобільна амбулаторія вирушає у свій перший рейс',
       'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=600', FALSE,
       'Обладнаний ветеринарний мікроавтобус буде проводити безкоштовні огляди у деокупованих селищах.',
       'Мобільна ветеринарна амбулаторія Rescue Львів отримала обладнання для стерилізацій, вакцинацій та базових хірургічних втручань у громадах, де немає постійного доступу до ветеринарних послуг. Графік виїздів на травень 2026 року затверджено, а короткі звіти будуть опубліковані після кожного рейсу.',
       1, 'PUBLISHED'),
  (8,  'Підсумки очищення озера на Оболоні',
       'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600', FALSE,
       'Понад 3 тонни побутового сміття було зібрано та вивезено волонтерами за одну суботу.',
       'Під час акції понад 120 учасників очистили берегову лінію та прилеглу територію. Пластик і скло передано на переробку, великогабаритні відходи вивезено через комунального підрядника. На локації встановлено інформаційні таблички щодо відповідального поводження з відходами.',
       2, 'PUBLISHED'),
  (9,  'МедДопомога доставила медикаменти у центри розміщення',
       'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600', FALSE,
       'Ліки, крісла колісні та дитяче харчування передані через координаторів центрів розміщення.',
       'Команда МедДопомога доставила інсуліни, серцеві препарати, антибіотики та засоби гігієни у 4 центри розміщення. Також передано 5 крісел колісних для маломобільних пацієнтів. Закупівлі та передачі внесено до внутрішнього звіту.',
       4, 'PUBLISHED'),
  (10, 'День відкритих дверей у центрі адопції: підсумки події',
       'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&q=80&w=600', FALSE,
       'Центр підбив результати недільної зустрічі з майбутніми опікунами тварин.',
       'Центр адопції відвідали понад 200 гостей. Команда провела екскурсії, консультації щодо відповідального утримання та прийняла 18 анкет на адопцію. Усі заявки проходять стандартну перевірку умов проживання і подальший супровід.',
       1, 'PUBLISHED'),
  (11, 'Нічліжка «Дах і Тепло» готова до зими',
       'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=600', FALSE,
       'Завдяки місяцю волонтерської праці 60 спальних місць у харківській нічліжці оновлено: нові ліжка, утеплені вікна, відремонтоване опалення та запаси одягу на зиму.',
       'Більше місяця команда волонтерів щосуботи приїжджала на харківський нічліжний центр «Дах і Тепло» та готувала його до зими. Результат вартий кожної витраченої години: замінено 20 зношених ліжок на нові, стіни трьох спальних кімнат побілено, вікна проклеєно утеплюючою стрічкою, відремонтовано котел і замінено старі батареї у двох кімнатах. Завдяки благодійним коштам закуплено запаси постільної білизни, рушників та теплого одягу — розраховані на 200 осіб одночасно. З листопада нічліжка надає безкоштовне гаряче харчування двічі на день. Запис для соціальних служб Харкова вже відкрито — перший заїзд очікується вже цього тижня.',
       12, 'PUBLISHED'),
  (12, 'Безкоштовна правова допомога ВПО відновлена в Одесі',
       'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600', FALSE,
       'Організація «Переселенці Разом» відновила щомісячні дні безкоштовних правових консультацій для ВПО в Одесі після тримісячної перерви — перший прийом зібрав 68 заявок.',
       'Після тримісячної організаційної перерви юридичний волонтерський центр «Переселенці Разом» поновив роботу в Одесі. Щомісяця в першу суботу місяця адвокати-волонтери проводять безкоштовні консультації для внутрішньо переміщених осіб. Теми прийому: оформлення державної допомоги, реєстрація за новою адресою, трудові права, відновлення паспортів і свідоцтв. На перший прийом записалося 68 людей.',
       13, 'PUBLISHED'),
  (13, 'Прибирання парку: 500 кг сміття за 4 години',
       'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=600', FALSE,
       'EcoKyiv підбила підсумки осіннього екосуботника в парку Перемоги: понад 80 волонтерів зібрали та відсортували 500 кг сміття лише за чотири ранкових години.',
       'Минулої суботи понад 80 волонтерів EcoKyiv зібрались у парку Перемоги о дев''ятій ранку — і вже об першій вивезли останній мішок. Результат чотиригодинної роботи: 500 кг відходів прибрано та відсортовано на чотири фракції. Пластик і ПЕТ-пляшки (180 кг) та скло (70 кг) передано у пункти прийому вторсировини, металобрухт (45 кг) відвезено на переробний завод, решта — на міський полігон. Окремо вилучили три старих автомобільних шини та іржавий холодильник, що пролежали під кущами роками. Компанія-партнер ВторРесурси забрала весь відсортований матеріал безкоштовно. На прибраних ділянках встановлено еко-таблички з нагадуванням про відповідальне ставлення до природи.',
       2, 'PUBLISHED');

SELECT setval('news_id_seq', (SELECT MAX(id) FROM news));

INSERT INTO news_category (news_id, category_id) VALUES
  (1,  12),            -- Річний звіт Rescue → Тварини
  (2,   3),            -- 200 нових дерев → Екологія
  (3,   8), (3,  1),  -- IT-волонтерство → Волонтерство, Освіта
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
  (1,  1, NULL, 'Ліки та лікувальне харчування для притулку «Друг»',
       'Наші запаси лікувальних консервів для цуценят та протипаразитарних засобів повністю вичерпані.',
       'Кошти будуть спрямовані на закупівлю лікувального корму, вакцин, протипаразитарних засобів і матеріалів для щоденного догляду. Організація опублікує чеки та короткий звіт після закупівлі.',
       60000.00, 23450.00, 'ACTIVE', NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days',
       'https://send.monobank.ua/',
       'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600'),

  (2,  2, NULL, 'Закупівля інвентарю для міських еко-толок',
       'Збираємо кошти на власний комплект інструментів для регулярних міських прибирань.',
       'Ми проводимо прибирання парків та берегів річок двічі на місяць. Збір потрібен для закупівлі власного комплекту інструментів: рукавиць, мішків, граблів, щипців, лопат і контейнерних наліпок для сортування. Це зменшить витрати на оренду та дозволить проводити толоки регулярніше. Після закупівлі опублікуємо фінансовий звіт.',
       25000.00, 15000.00, 'ACTIVE', NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days',
       'https://send.monobank.ua/',
       'https://images.pexels.com/photos/36713457/pexels-photo-36713457.jpeg?auto=compress&cs=tinysrgb&w=600'),

  (3,  NULL, 2, 'Ноутбуки для дітей з родин ВПО',
       'Шукаємо кошти або справну вживану техніку для школярів, які навчаються дистанційно.',
       'Мета збору — придбати 10 справних вживаних ноутбуків для школярів із родин ВПО, які навчаються дистанційно. Техніка буде перевірена, налаштована і передана через координаторів центру розміщення з актами отримання.',
       40000.00, 18200.00, 'ACTIVE', NOW() - INTERVAL '3 days', NOW() + INTERVAL '30 days',
       'https://send.monobank.ua/',
       'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=600'),

  (4,  1, NULL, 'Евакуаційні рейси та ветеринарна допомога тваринам',
       'Збір на пальне, транспортування та ветеринарне лікування тварин з громад у зоні підвищеного ризику.',
       'Команда щотижня виїжджає у прифронтові громади, щоб евакуювати покинутих і поранених тварин. Кошти потрібні на пальне, транспортування, невідкладне лікування, хірургічні матеріали та перебування у ветеринарній клініці. Витрати буде розділено на логістику, лікування та матеріали догляду.',
       35000.00, 12300.00, 'ACTIVE', NOW() - INTERVAL '8 days', NOW() + INTERVAL '22 days',
       'https://send.monobank.ua/',
       'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=600'),

  (5,  2, NULL, 'Очищення русла річки Либідь',
       'Збір на оренду техніки та підйом великогабаритного сміття з русла річки.',
       'Проєкт доповнює регулярні толоки EcoKyiv і стосується ділянок, де ручного прибирання недостатньо. Кошти потрібні на оренду техніки, вивезення великогабаритних відходів, мішки підвищеної міцності та утилізацію. Після робіт буде опубліковано екологічний та фінансовий звіт.',
       80000.00, 35500.00, 'ACTIVE', NOW() - INTERVAL '2 days', NOW() + INTERVAL '58 days',
       'https://send.monobank.ua/',
       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600'),

  (6,  NULL, 1, 'Дитяче харчування та підгузки для немовлят ВПО',
       'Забезпечуємо найменших переселенців у гуртожитку на Подолі базовими засобами гігієни.',
       'Збір забезпечить базові потреби немовлят у центрі розміщення родин ВПО. План закупівлі: гіпоалергенні суміші, підгузки різних розмірів, дитячі креми та вологі серветки. Набори передаватимуться через координатора центру з фіксацією кількості отримувачів і фінансовим звітом після закупівлі.',
       20000.00, 8500.00, 'ACTIVE', NOW() - INTERVAL '4 days', NOW() + INTERVAL '15 days',
       'https://send.monobank.ua/',
       'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=600'),

  (7,  1, NULL, 'Утеплення центру тимчасової перетримки тварин',
       'Ремонтуємо дахи, що протікають, закупляємо солому для будок та інфрачервоні обігрівачі для цуценят.',
       'Збір покриває ремонт покрівлі, утеплення вольєрів, свіжу підстилку та безпечні обігрівачі для секцій із тваринами, які потребують особливого догляду. Після закупівель організація опублікує фінансовий звіт.',
       45000.00, 13200.00, 'ACTIVE', NOW() - INTERVAL '1 day', NOW() + INTERVAL '44 days',
       'https://send.monobank.ua/',
       'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=600'),

  (8,  2, NULL, 'Створення шкільного еко-гуртка «Юні натуралісти»',
       'Закупівля мікроскопа, визначників рослин та лабораторних наборів для кабінету біології школи №98.',
       'EcoKyiv збирає кошти на відкриття шкільного еко-гуртка. План закупівлі включає цифровий мікроскоп, набори для експрес-аналізу води та повітря, навчальні матеріали і насіння для шкільної міні-оранжереї. Після закупівлі організація проведе відкритий урок і передасть школі інструкції з використання обладнання.',
       30000.00, 18750.00, 'ACTIVE', NOW() - INTERVAL '12 days', NOW() + INTERVAL '18 days',
       'https://send.monobank.ua/',
       'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'),

  (9,  NULL, 2, 'Цифрова соціалізація: Смартфони для ветеранів на реабілітації',
       'Особистий збір Петра на 20 базових смартфонів для ветеранів, які проходять лікування або реабілітацію.',
       'Смартфони допоможуть ветеранам підтримувати зв''язок із родиною, користуватися державними сервісами, записуватися до лікарів та отримувати консультації онлайн. Перед передачею пристрої буде перевірено, налаштовано і передано за списком координаторів медичного закладу.',
       50000.00, 22000.00, 'ACTIVE', NOW() - INTERVAL '1 day', NOW() + INTERVAL '59 days',
       'https://send.monobank.ua/',
       'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600'),

  (10, 4, NULL, 'Аптечки для евакуаційних медичних бригад',
       'Збір фонду МедДопомога на сертифіковані турнікети, оклюзійні пов''язки та перев''язувальні матеріали.',
       'Мобільна медична бригада регулярно виїжджає у громади з обмеженим доступом до медичної допомоги. Потрібно поповнити запаси сертифікованих турнікетів, гемостатичних бинтів, оклюзійних наліпок та перев''язувальних матеріалів. Усі позиції купуватимуться у перевірених постачальників, а використання коштів буде підтверджено звітом.',
       100000.00, 45000.00, 'ACTIVE', NOW() - INTERVAL '6 days', NOW() + INTERVAL '24 days',
       'https://send.monobank.ua/',
       'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=600'),

  (11, 4, NULL, 'Переобладнання мобільного медичного кабінету',
       'МедДопомога збирає кошти на переобладнання мікроавтобуса під пересувний медичний кабінет для щотижневих виїздів у громади з обмеженим доступом до лікарів.',
       'Кошти потрібні на оглядовий стіл, холодильник для вакцин, портативний ЕКГ-апарат і витратні матеріали. Після запуску бригада працюватиме за погодженим графіком у громадах з обмеженим доступом до медичної допомоги. Використання коштів буде підтверджено звітом.',
       120000.00, 34500.00, 'ACTIVE', NOW() - INTERVAL '10 days', NOW() + INTERVAL '50 days',
       'https://send.monobank.ua/',
       'https://images.pexels.com/photos/8413206/pexels-photo-8413206.jpeg?auto=compress&cs=tinysrgb&w=600'),

  (12, 12, NULL, 'Ліжка та постільна білизна для нічліжки',
       'Нічліжка «Дах і Тепло» у Харкові відкриває нове крило на 20 місць — збираємо на ліжка, матраси та постільну білизну, щоб цієї зими більше людей мали тепле місце для сну.',
       'Організація «Дах і Тепло» завершує ремонт додаткового приміщення для зимового розміщення. Збір покриває металеві ліжка, матраци, подушки, ковдри і комплекти постільної білизни. Після закупівлі команда опублікує фото готового приміщення та короткий фінансовий звіт.',
       28000.00, 9100.00, 'ACTIVE', NOW() - INTERVAL '6 days', NOW() + INTERVAL '24 days',
       'https://send.monobank.ua/',
       'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=600'),

  (13, 7, NULL, 'Продуктові набори для 100 родин на зиму',
       'Організація «Рука Допомоги» у Вінниці збирає на зимові продуктові набори для 100 найвразливіших родин: переселенців, самотніх пенсіонерів та багатодітних сімей без постійного доходу.',
       'Ціль збору — 100 продуктових наборів для родин, яким потрібна підтримка в холодний сезон. Кожен набір розрахований на 2 місяці та включає: крупи, олію, консерви, цукор, сіль, соду і борошно. Для родин із дітьми до трьох років додається дитяче харчування. Закупівлі відбуваються оптом через перевірених постачальників. Фінансовий звіт із чеками буде опубліковано після завершення розподілу. Передача наборів відбувається адресно, щоб уникнути черг.',
       85000.00, 12400.00, 'ACTIVE', NOW() - INTERVAL '3 days', NOW() + INTERVAL '37 days',
       'https://send.monobank.ua/',
       'https://images.pexels.com/photos/6590914/pexels-photo-6590914.jpeg?auto=compress&cs=tinysrgb&w=600');

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
  (1,  500.00,   'А. Шимчук',                'Підтримую вашу роботу.',     4),
  (1,  1000.00,  'Хома В.',                  'За мою колишню собаку',     NULL),
  (1,  250.00,   'Анонім',                   NULL,                        NULL),
  (1,  200.00,   'М. Бойко',                 'Скільки можу',               6),
  (1,  21500.00, 'Великий донор',            NULL,                        NULL),
  (2,  5000.00,  'Партнерська компанія',     'На добру справу',           NULL),
  (2,  20000.00, 'Анонімний жертводавець',   NULL,                        NULL),
  (3,  1000.00,  'Анонімний донор',          'Підтримую ініціативу',      NULL),
  (3,  7200.00,  'А. Шимчук',                'Передай дітям привіт',       4),
  (10, 2000.00,  'В. Полтавець',             'Для наших захисників',       29),
  (10, 5800.00,  'Анонім',                   NULL,                        NULL),
  (11, 3000.00,  'Т. Жайворон',              'Важлива справа',             30),
  (12, 1500.00,  'С. Оберемок',              'Бажаю успіху',               31),
  (13, 7500.00,  'Благодійний фонд «Разом»', NULL,                        NULL),
  (13, 500.00,   'А. Шимчук',                'Від серця',                  4);

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
  (8,  'Знижка 20% у партнерів',   'Промокод у магазинах-партнерах проєкту',           80, 200, TRUE),
  (9,  'Ексклюзивний значок',      'Металевий пін Hand&Hand у колекційній упаковці',   30,  300, TRUE),
  (10, 'Онлайн-курс безкоштовно',  'Доступ до будь-якого курсу з каталогу партнерів', 200,  60,  TRUE),
  (11, 'Менторська сесія 1:1',     'Годинна розмова з досвідченим волонтером або лідером громадської організації', 400, 15, TRUE),
  (12, 'Участь у тренінгу координаторів', 'Місце на практичному тренінгу з організації волонтерських подій', 250,  25,  TRUE),
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
  (4,  NULL, 70, 'EARN',  'Участь у проєкті #3: прибирання Голосіївського парку'),
  (5,  NULL, 30, 'EARN',  'Реєстрація на проєкт #1: прогулянка з собаками'),
  (5,  NULL, 25, 'EARN',  'Участь у проєкті #3: прибирання парку'),
  (18, NULL, 50, 'EARN',  'Участь у проєкті #5: тренінг для ветеранів'),
  (19, NULL, 60, 'EARN',  'Участь у проєкті #10: ремонт дахів'),
  (20, NULL, 30, 'EARN',  'Участь у проєкті #6: медогляд ВПО'),
  (22, NULL, 50, 'EARN',  'Участь у проєкті #7: курси англійської'),
  (23, NULL, 30, 'EARN',  'Реєстрація та підготовка до проєкту #9'),
  (24, NULL, 75, 'EARN',  'Фотодокументація проєкту #11: фестиваль'),
  (25, NULL, 60, 'EARN',  'IT-підтримка організації під час проєкту #5'),
  (26, NULL, 40, 'EARN',  'Тренінг для волонтерів перед проєктом #12'),
  (27, NULL, 55, 'EARN',  'Водіння під час проєкту #8: розподіл гумдопомоги');

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
  ('PROJECT', 'APPROVED', 4,  3,  1, NOW() - INTERVAL '6 days'),
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
-- 19. ORGANIZATION_MEMBERSHIP_REQUEST (12 запитів)
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
  (11, 24, 'INVITE',  'PENDING'),   -- Культурна ДНК → Юлія
  (12, 27, 'REQUEST', 'PENDING'),   -- Андрій → Дах і Тепло
  (13, 28, 'REQUEST', 'PENDING');   -- Ольга → Переселенці Разом

-- ============================================================================
-- 20. TICKET (13 звернень)
-- ============================================================================
INSERT INTO ticket (id, user_id, title, description, status, priority, location_id, volunteer_profile_id) VALUES
  (1,  6,  'Кішка з кошенятами закрита у підвалі будинку',
       'У підвалі житлового будинку залишилася кішка з кошенятами. Потрібна допомога волонтерів для безпечного доступу, огляду тварин і пошуку тимчасової перетримки.',
       'IN_REVIEW', 'HIGH', 4, NULL),
  (2,  6,  'Гора автомобільних шин прямо на березі біля Гідропарку',
       'Біля берегової зони виявлено кілька десятків старих шин від вантажівок. Потрібна оцінка обсягу робіт, координація вивезення та передача шин на утилізацію через відповідального підрядника.',
       'IN_REVIEW', 'MEDIUM', 2, NULL),
  (3,  4,  'Доставка ліків для літньої мешканки',
       'Літня мешканка потребує доставки серцевих препаратів і базових продуктів. Є список ліків і контакт для погодження часу передачі.',
       'IN_REVIEW', 'MEDIUM', 1, NULL),
  (4,  4,  'Тимчасова перетримка цуценят',
       'Знайдено п''ятьох цуценят, яким потрібні суміш для вигодовування, ветеринарний огляд і короткострокова перетримка.',
       'IN_REVIEW', 'HIGH', 3, NULL),
  (5,  5,  'Величезна суха гілка тополі нависла над дитячим майданчиком садочка',
       'На території дитячого садка після негоди пошкоджена гілка нависає над ігровою зоною. Потрібні фахівці або волонтери з відповідним інструментом.',
       'IN_REVIEW', 'LOW', 5, NULL),
  (6,  6,  'Шукаємо теплу куртку та взуття для хлопчика 6 років (родина ВПО)',
       'Родина ВПО шукає куртку на зріст 116-122 см та осіннє взуття 29-30 розміру для дитини. Передача можлива через координатора.',
       'IN_REVIEW', 'MEDIUM', 1, NULL),
  (7,  6,  'Злив якихось маслянистих відходів в озеро на Оболоні',
       'На поверхні озера помічено маслянисту плівку та запах пального. Потрібна фіксація звернення, контакт з екоінспекцією і допомога з подальшими діями.',
       'IN_REVIEW', 'HIGH', 2, NULL),
  (8,  4,  'Допомога з транспортом для ветерана на реабілітацію',
       'Ветерану потрібні регулярні поїздки до реабілітаційного центру. Шукаємо волонтера з авто для погодженого графіка перевезень.',
       'IN_REVIEW', 'HIGH', 2, NULL),
  (9,  5,  'Брак кормів у приватному міні-притулку пенсіонерки',
       'Приватний міні-притулок потребує кількох мішків сухого корму та координації доставки. Кількість тварин і адреса підтверджуються координатором.',
       'IN_REVIEW', 'MEDIUM', 3, NULL),
  (10, 6,  'Хочемо зробити суботник і облаштувати клумбу біля під''їзду',
       'Мешканці будинку планують прибрати двір і облаштувати клумбу. Потрібна допомога з інструментом, підготовкою ґрунту та вивезенням важких матеріалів.',
       'IN_REVIEW', 'LOW', 1, NULL),
  (11, 4,  'Транспортування травмованого собаки до клініки',
       'На узбіччі траси виявлено травмованого собаку. Потрібні волонтери з досвідом безпечного відлову і транспортом до ветеринарної клініки.',
       'IN_REVIEW', 'HIGH', 1, NULL),
  (12, 4,  'Пошкоджене дерево загрожує безпеці',
       'Велика стара верба нахилена після вітру над дитячим майданчиком. Потрібен безпечний огляд і спилювання аварійних гілок.',
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
  (4,  'Ваш запит на проєкт «Прогулянка з собаками» прийнято.',           FALSE, 'PROJECT'),
  (4,  'EcoKyiv запросив вас до організації.',                            FALSE, 'GENERAL'),
  (5,  'Ваш запит на проєкт «Прогулянка з собаками» очікує розгляду.',    TRUE,  'PROJECT'),
  (6,  'Дякуємо за реєстрацію в Hand&Hand.',                             TRUE,  'GENERAL'),
  (6,  'Ваше звернення №1 прийняте на розгляд.',                         FALSE, 'TICKET'),
  (18, 'Ваш запит на проєкт «Цифрові навички для ветеранів» прийнято.',   FALSE, 'PROJECT'),
  (19, 'Вас призначено на завдання #4: координація медогляду.',            FALSE, 'TASK'),
  (20, 'Ваш запит на участь у медогляді для ВПО прийнято.',               FALSE, 'PROJECT'),
  (21, 'Ви стали членом організації «Відбудова Разом».',                  FALSE, 'GENERAL'),
  (22, 'Ваш запит на проєкт «Безкоштовна англійська» прийнято.',          TRUE,  'PROJECT'),
  (24, 'Новий збір від «Культурна ДНК» потребує вашої підтримки.',        FALSE, 'GENERAL'),
  (25, 'Завдання #10 призначено вам: розстановка ліжок.',                 FALSE, 'TASK'),
  (29, 'Дякуємо за реєстрацію в Hand&Hand. Долучайтеся до подій.',        TRUE,  'GENERAL'),
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
       'VERIFIED', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448898/hand-and-hand/documents/reports/seed-report-04.pdf',
       '+380442101010', 'info@armyazmin.org.ua', 'Київ',
       'https://ui-avatars.com/api/?name=AZ&background=2c3e50&color=fff&size=200&bold=true', 2,
       'Кожен захисник має знати, що вдома на нього чекають і піклуються про нього.'),
  (15, 33, 'Без Бар''єрів', '13141516',
       'Громадська організація з інклюзії та доступності для людей з інвалідністю: встановлення пандусів і підйомників, безкоштовні курси жестової мови, правова допомога, адвокація доступного середовища у містах.',
       'VERIFIED', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448899/hand-and-hand/documents/reports/seed-report-05.pdf',
       '+380322202020', 'access@bezbaryeriv.org.ua', 'Львів',
       'https://ui-avatars.com/api/?name=BB&background=7048e8&color=fff&size=200&bold=true', 1,
       'Рівні можливості — не привілей, а невід''ємне право кожної людини.'),
  (16, 34, 'Простір Підтримки', '14151617',
       'Психологічна служба для ветеранів, переселенців та родин загиблих. Надаємо безкоштовні індивідуальні консультації, проводимо групову терапію, арт-терапію та тренінги зі стресостійкості. Всі спеціалісти — сертифіковані психологи.',
       'VERIFIED', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448900/hand-and-hand/documents/reports/seed-report-06.pdf',
       '+380572303030', 'help@prostirpidtrymky.org.ua', 'Харків',
       'https://ui-avatars.com/api/?name=PP&background=e64980&color=fff&size=200&bold=true', 6,
       'Психічне здоров''я — основа відновлення людини і країни.');

SELECT setval('organization_profile_id_seq', (SELECT MAX(id) FROM organization_profile));

-- organization_category для нових організацій
INSERT INTO organization_category (organization_id, category_id) VALUES
  (14,  9), (14,  8),  -- Армія Змін → Армія та оборона, Волонтерство
  (15, 13), (15,  4),  -- Без Бар'єрів → Інфраструктура, Соціальна допомога
  (16,  2), (16,  4);  -- Простір Підтримки → Медицина, Соціальна допомога

-- 14 нових проєктів (IDs 16–29) — по 2 на кожну категорію без покриття
INSERT INTO project (id, organization_profile_id, title, description, status, starts_at, ends_at, main_content, what_volunteers_will_do, why_its_important, time, application_deadline, location_id, category_id, partners, image_url, participants) VALUES

  -- Армія (5) -----------------------------------------------------------------
  (16, 14, 'Плетіння маскувальних сіток для ЗСУ',
      'Щотижневі сесії плетіння маскувальних сіток 3×6 м — для підрозділів ЗСУ на Харківському напрямку.',
      'ACTIVE', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 5 hours',
      'Підрозділи ЗСУ регулярно потребують маскувальних сіток для укриття техніки, позицій та робочих зон. Одна сітка 3×6 м займає 4–6 годин індивідуальної роботи або 2–3 години командою з трьох осіб. Армія Змін організовує щосуботні сесії у Києві та мережу домашніх майстрів по всій Україні. Готові сітки передаються підрозділам через перевірених координаторів.',
      'Плести сітки на металевих рамах, нарізати та прикріплювати смуги тканини, перевіряти якість готових виробів, пакувати і маркувати для передачі координаторам.',
      'Маскувальні сітки допомагають підрозділам краще облаштовувати позиції та зменшувати ризики під час роботи. Волонтерська участь дозволяє швидше закривати регулярні запити.',
      'Субота, 10:00–15:00', NOW() + INTERVAL '2 days', 2, 5,
      'Волонтерський центр «Серце», Мінветеранів',
      'https://images.pexels.com/photos/11496282/pexels-photo-11496282.jpeg?auto=compress&cs=tinysrgb&w=600', 20),

  (17, 14, 'Листи та посилки підтримки для захисників',
      'Збираємо листи, малюнки і невеликі посилки з солодощами й корисними речами для військових у підрозділах.',
      'ACTIVE', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days 4 hours',
      'Листи та невеликі посилки підтримки допомагають підтримувати зв''язок між громадами і військовими. Армія Змін збирає листи від школярів, дорослих і організацій, сортує їх та передає у підрозділи разом із практичними речами: теплими шкарпетками, батончиками, батарейками та засобами гігієни. Щомісяця команда відправляє 5–8 ящиків.',
      'Писати листи та листівки підтримки, малювати малюнки (для школярів), допомагати сортувати і пакувати посилки, вести облік вантажу, відносити ящики на відправлення.',
      'Такі відправлення є простим способом передати підтримку та подяку військовим. Впорядкований збір також допомагає громадам долучатися до допомоги у зрозумілому форматі.',
      'Неділя, 11:00–15:00', NOW() + INTERVAL '8 days', 2, 5,
      'Мережа шкіл Києва, Укрпошта Volunteer',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600', 50),

  -- Люди з інвалідністю (12) --------------------------------------------------
  (18, 15, 'Встановлення пандусів у громадських будівлях Львова',
      'Будуємо та монтуємо пандуси, поручні та тактильну плитку — робимо місто доступним для всіх.',
      'ACTIVE', NOW() + INTERVAL '5 days', NOW() + INTERVAL '7 days',
      'Близько 30% будівель у центрі Львова досі недоступні для людей на кріслах-колясках. «Без Бар''єрів» разом із волонтерами-будівельниками встановлює пандуси, поручні та тактильну плитку в аптеках, школах, лікарнях і бібліотеках. Кожен об''єкт проходить попередній аудит доступності. Матеріали закупляє організація, волонтери — руки та час.',
      'Монтаж збірних пандусів, встановлення поручнів, укладка тактильної плитки при вході, прибирання будівельного сміття після монтажу, фотофіксація до і після.',
      'Доступні входи, поручні та тактильні елементи допомагають людям з інвалідністю користуватися громадськими послугами самостійніше і безпечніше.',
      'Субота–Неділя, 9:00–16:00', NOW() + INTERVAL '3 days', 1, 12,
      'Львівська міська рада, Rotary Club Lviv',
      'https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&q=80&w=600', 15),

  (19, 15, 'Безкоштовні курси жестової мови — базовий рівень',
      'Вивчаємо українську жестову мову разом — 100 ключових жестів за один воркшоп.',
      'ACTIVE', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days 3 hours',
      'Базове знання української жестової мови допомагає людям краще взаємодіяти у громадських просторах, сервісах та навчанні. «Без Бар''єрів» проводить щомісячні воркшопи з базового рівня УЖМ: ключові жести для щоденного спілкування, знайомства та допомоги в типових ситуаціях. Викладає сертифікований тренер із досвідом роботи з інклюзивними групами.',
      'Допомагати учасникам із запитаннями, вести відеозапис уроків для YouTube-каналу організації, допомагати з технічним забезпеченням залу, реєструвати учасників на вході.',
      'Навіть базові навички жестової мови зменшують комунікаційні бар''єри та роблять повсякденні послуги доступнішими для більшої кількості людей.',
      'Субота, 11:00–14:00', NOW() + INTERVAL '6 days', 1, 12,
      'Федерація глухих України, British Council',
      'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=600', 30),

  -- Психологічна підтримка (14) -----------------------------------------------
  (20, 16, 'Безкоштовні психологічні консультації для ветеранів',
      'Записуємо ветеранів на індивідуальні сесії з сертифікованими психологами — онлайн та офлайн у Харкові.',
      'ACTIVE', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days 6 hours',
      'Повернення до цивільного життя може супроводжуватися психологічними труднощами та потребою у фаховій підтримці. «Простір Підтримки» пропонує до 10 безкоштовних консультацій з психологом для ветеранів. Запис ведеться через застосунок або телефон, доступні онлайн-зустрічі та особистий прийом у кабінеті на пр. Науки.',
      'Вести реєстрацію та координацію запису, нагадувати клієнтам про сесії телефоном або SMS, допомагати з технічними питаннями під час онлайн-зустрічей, підтримувати порядок у зоні очікування.',
      'Своєчасна психологічна підтримка знижує ризик ізоляції, кризових станів і погіршення якості життя після складного досвіду. Регулярні консультації допомагають ветеранам стабілізувати повсякденні справи, підтримувати контакт із родиною та планувати подальші кроки.',
      'Пн/Ср/Пт, 9:00–18:00', NOW() + INTERVAL '2 days', 6, 14,
      'Мінветеранів, Фонд «Повернись живим» (психпрограми)',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600', 40),

  (21, 16, 'Творчі групові заняття для переселенців і ветеранів',
      'Щотижневі групові заняття: малювання, ліплення, письмо та спокійна робота з творчими матеріалами.',
      'ACTIVE', NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days 3 hours',
      'Групи по 8–10 осіб проводяться щовівторка під супроводом фахівця. Матеріали надаються безкоштовно. Є окремі дитячі та дорослі групи, а також формат для людей, які потребують спокійного простору після складних подій.',
      'Допомагати арт-терапевту готувати матеріали (розкладати фарби, готувати глину), організовувати простір, фотодокументувати заходи виключно з дозволу учасників, прибирати після сесій.',
      'Творчі заняття допомагають учасникам безпечно структурувати емоції, підтримувати контакт із групою та поступово повертатися до звичних справ.',
      'Вівторок, 16:00–18:00', NOW() + INTERVAL '4 days', 6, 14,
      'ЮНІСЕФ, Фонд ООН у галузі народонаселення',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600', 16),

  -- Спорт (13) ----------------------------------------------------------------
  (22, 6, 'Безкоштовна секція футболу для дітей ВПО',
      'Тренування двічі на тиждень у Запоріжжі для дітей 7–14 років — форма, м''яч і тренер надаються.',
      'ACTIVE', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 2 hours',
      'Спорт допомагає дітям підтримувати фізичну активність, знайомитися з ровесниками та адаптуватися в новому місті. СпортДух відкриває безкоштовну секцію в ДЮСШ №3: 2 тренування на тиждень, форма та м''яч надаються. Тренер — Василь Лахман, майстер спорту з футболу, 12 років тренерського досвіду.',
      'Допомагати тренеру збирати дітей на майданчику, вести облік відвідуваності, надавати першу допомогу за потреби, супроводжувати дітей від зупинки до стадіону та назад.',
      'Регулярні командні тренування дають дітям стабільний розклад, безпечне коло спілкування та підтримку дорослих наставників.',
      'Вт/Чт, 16:00–17:30', NOW() + INTERVAL '1 day', 8, 13,
      'ДЮСШ №3 Запоріжжя, UEFA Grassroots',
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=600', 30),

  (23, 6, 'Адаптивний спорт для людей з інвалідністю',
      'Заняття з адаптивного баскетболу та настільного тенісу для осіб на кріслах-колясках і з вадами зору.',
      'ACTIVE', NOW() + INTERVAL '12 days', NOW() + INTERVAL '12 days 3 hours',
      'СпортДух разом із «Без Бар''єрів» відкриває перший у Запоріжжі клуб адаптивного спорту. Заняття проходять у доступному спортзалі з широкими дверима та спеціальним покриттям. Планується участь у всеукраїнських змаганнях з адаптивного тенісу вже наступного сезону. Інвентар і транспортування для учасників — безкоштовно.',
      'Допомагати учасникам з пересуванням у спортзалі, підготовка та прибирання інвентарю, ведення обліку відвідуваності, відеозйомка для соціальних мереж організації.',
      'Адаптивний спорт підтримує фізичну активність, соціалізацію та впевненість учасників. Заняття проходять у доступному просторі та доповнюють інші формати реабілітації.',
      'Субота, 11:00–13:00', NOW() + INTERVAL '10 days', 8, 13,
      'Паралімпійський комітет України, Без Бар''єрів',
      'https://images.unsplash.com/photo-1770189993553-9537c0846d05?auto=format&fit=crop&q=80&w=600', 20),

  -- Літні люди (9) ------------------------------------------------------------
  (24, 9, 'Доставка продуктів та ліків самотнім пенсіонерам',
      'Щотижнева волонтерська доставка продуктових наборів і рецептурних ліків до дверей самотніх літніх людей.',
      'ACTIVE', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 4 hours',
      'У Хмельницькому понад 2 400 самотніх пенсіонерів, що через стан здоров''я або відсутність рідних не можуть самостійно купувати продукти та ліки. «Їжа та Турбота» організовує системну доставку: волонтери отримують список адрес і маршрут, відвідують 5–8 людей за один виїзд. За потреби команда передає соціальним службам інформацію про додаткові запити отримувачів.',
      'Отримати список адрес та маршрут, закупити або забрати готові пакети зі складу, доставити за адресами, зателефонувати отримувачам наступного дня для зворотного зв''язку.',
      'Регулярна доставка продуктів і ліків допомагає людям із низькою мобільністю залишатися вдома без ризику перерв у лікуванні чи харчуванні. Для соціальних служб це також спосіб підтримувати стабільний контакт з отримувачами допомоги.',
      'Субота, 9:00–14:00', NOW() + INTERVAL '2 days', 11, 9,
      'Хмельницька міська рада, Укрпошта (соц. тариф)',
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600', 15),

  (25, 5, 'Цифрова грамотність для пенсіонерів: Дія і онлайн-запис до лікаря',
      'Навчаємо людей 65+ користуватись смартфоном, застосунком «Дія» та онлайн-записом до лікаря.',
      'ACTIVE', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days 3 hours',
      'Цифровий розрив між поколіннями особливо помітний серед людей 65+. Водночас дедалі більше послуг доступні онлайн. ОсвітаПлюс проводить 3-годинний практичний воркшоп: кожен учасник приходить зі своїм смартфоном і отримує допомогу з Дією, онлайн-записом до лікаря та відеозв''язком із родичами. Темп повільний, пояснення зрозумілі, формат без осуду.',
      'Сидіти поруч з учасником і особисто допомагати виконувати кроки на смартфоні, терпляче пояснювати повторно стільки разів, скільки потрібно, допомагати виправити помилки, записувати найпоширеніші запитання для наступного заняття.',
      'Цифрові навички допомагають літнім людям самостійно записуватися до лікаря, користуватися державними сервісами та підтримувати зв''язок із родиною.',
      'Неділя, 11:00–14:00', NOW() + INTERVAL '5 days', 4, 9,
      'Укртелеком, Нова пошта (оплачує оренду залу)',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600', 20),

  -- Культура (7) --------------------------------------------------------------
  (26, 11, 'Майстер-клас з традиційного писанкарства Полісся',
      'Навчаємо розписувати писанки у традиційній поліській техніці — для дітей і дорослих, матеріали надаємо.',
      'ACTIVE', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days 4 hours',
      'Писанкарство — один із найдавніших видів українського декоративного мистецтва. Кожен регіон має свій стиль, кольори і символи. Культурна ДНК проводить майстер-клас з традиційними поліськими орнаментами за старовинними зразками, зібраними у фондах Житомирського краєзнавчого музею. Матеріали — яйця, писачки, натуральний віск, рослинні фарби — надаємо. Учасники забирають свої писанки додому.',
      'Допомагати учасникам у технічних питаннях (розплавлення воску, рівномірне фарбування), слідкувати за безпечним використанням свічок, розповідати про символіку орнаментів, організовувати простір та прибирати після заходу.',
      'Майстер-клас допомагає учасникам дізнатися про локальні орнаменти, техніки та символіку, а також зберігати традиційні ремесла через практичний досвід.',
      'Субота, 11:00–15:00', NOW() + INTERVAL '12 days', 13, 7,
      'Житомирський обласний краєзнавчий музей',
      'https://images.pexels.com/photos/6999307/pexels-photo-6999307.jpeg?auto=compress&cs=tinysrgb&w=600', 40),

  -- Ветерани (11) -------------------------------------------------------------
  (27, 3, 'Група психологічної підтримки для ветеранів ЗСУ',
      'Щотижнева закрита група взаємопідтримки для ветеранів — з психологом, без осуду і без тиску.',
      'ACTIVE', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days 2 hours',
      'Закрита група взаємопідтримки — це простір, де ветерани можуть спілкуватися у безпечному форматі та отримувати супровід фахівця. Зустрічі відбуваються щовівторка у центрі ВетеранUA, групу веде психолог з досвідом роботи з ветеранською спільнотою. Учасники можуть говорити або просто слухати, конфіденційність гарантована.',
      'Допомагати організатору з логістикою і підготовкою приміщення, зустрічати учасників, забезпечувати каву і чай, вести облік відвідувань (знеособлено), за потреби супроводжувати до транспорту.',
      'Регулярні групи підтримки допомагають зменшувати ізоляцію, підтримувати контакт із людьми з подібним досвідом і вчасно звертатися по фахову допомогу.',
      'Вівторок, 18:00–20:00', NOW() + INTERVAL '3 days', 6, 11,
      'ВетеранUA, Простір Підтримки',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600', 12),

  -- Безхатьки (15) ------------------------------------------------------------
  (28, 12, 'Мобільний пункт допомоги безхатнім: їжа та одяг',
      'Щотижневий виїзний пункт біля вокзалу Харкова: гарячий суп, хліб, одяг і адреси нічліжок.',
      'ACTIVE', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days 4 hours',
      'У холодний сезон «Дах і Тепло» організовує щотижневий мобільний пункт біля місць, де найчастіше перебувають бездомні люди. Команда надає гаряче харчування, теплий одяг, базові засоби догляду, перев''язувальні матеріали та інформацію про найближчі нічліжки і соціальні служби. Команда — 4–6 волонтерів із мікроавтобусом.',
      'Допомагати завантажувати і видавати їжу та одяг, консультувати людей щодо нічліжок і соціальних служб міста, вести облік виданого, слідкувати за безпекою команди, фіксувати критичні медичні випадки для передачі до медслужб.',
      'Регулярна виїзна допомога зменшує ризики для людей без постійного житла та допомагає передавати контакти соціальних служб тим, хто готовий звернутися по подальшу підтримку.',
      'Четвер, 12:00–15:00', NOW() + INTERVAL '2 days', 6, 15,
      'Харківська міська рада (дозвіл), МедВолонтер Харків',
      'https://images.pexels.com/photos/36763234/pexels-photo-36763234.jpeg?auto=compress&cs=tinysrgb&w=600', 8),

  -- Медицина (4) ---------------------------------------------------------------
  (29, 4, 'Виїзна вакцинація у прифронтових селах Дніпропетровщини',
      'Мобільна бригада лікарів виїжджає у 5 сіл для вакцинації та первинного огляду мешканців.',
      'ACTIVE', NOW() + INTERVAL '9 days', NOW() + INTERVAL '10 days',
      'У частині громад доступ до регулярних медичних послуг обмежений. МедДопомога організовує виїзні бригади по 3–4 лікарі: вакцинація від грипу, правця, гепатиту B, а також первинний огляд для виявлення хронічних захворювань. За один дворазовий виїзд команда планує охопити 80–120 осіб із 5 сіл. Пацієнтів, які потребують додаткового огляду, скеровують до партнерських медичних закладів.',
      'Допомагати реєструвати пацієнтів і вести картки, готувати матеріали для лікарів, допомагати з транспортуванням медичного обладнання, слідкувати за чергою і заспокоювати тривожних пацієнтів.',
      'Виїзний формат допомагає мешканцям громад з обмеженим транспортним сполученням отримати консультацію, вакцинацію та подальше скерування без поїздки до міста.',
      'Пн–Вт, 8:00–17:00', NOW() + INTERVAL '7 days', 7, 4,
      'МОЗ України, ВООЗ, Pfizer Ukraine',
      'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=600', 18);

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
       'https://images.pexels.com/photos/11496282/pexels-photo-11496282.jpeg?auto=compress&cs=tinysrgb&w=600', TRUE,
       'Армія Змін завершила місячний збір і передала підрозділам 200 сіток 3×6 м.',
       'Упродовж чотирьох тижнів 85 волонтерів щоп''ятниці і щосуботи збирались у волонтерському хабі на Подолі. Результат: 200 маскувальних сіток — 3 600 кв. м маскування. Три мікроавтобуси доставили вантаж координаторам підрозділів. Матеріали — переважно джут і поліестер — закупили на зібрані кошти.',
       14, 'PUBLISHED'),

  (15, 'День подяки захисникам: волонтери відвідали військовий шпиталь у Києві',
       'https://images.pexels.com/photos/8460083/pexels-photo-8460083.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE,
       'Армія Змін організувала виїзд до військового шпиталю: листи, короткий концерт і набори підтримки для пацієнтів.',
       'Понад 60 волонтерів та учнів трьох київських шкіл відвідали Центральний військовий госпіталь: принесли 400 листів від школярів, виступили з коротким концертом, роздали набори гігієни та солодощі. Команда передала матеріали через адміністрацію шпиталю та погодила формат наступних візитів.',
       14, 'PUBLISHED'),

  -- Люди з інвалідністю (12) --------------------------------------------------
  (16, 'У Львові встановили 25 пандусів — аптеки, школи, поліклініки стали доступні',
       'https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&q=80&w=600', FALSE,
       'Без Бар''єрів завершила перший етап програми доступності в центральній частині міста.',
       '«Без Бар''єрів» разом із 40 волонтерами-будівельниками за два місяці встановила 25 пандусів у найбільш відвідуваних будівлях: 8 аптек, 5 шкіл, 4 поліклініки, 3 бібліотеки, 5 адміністративних будівель. Кожен пандус відповідає ДБН В.2.2-17. Паралельно нанесено тактильну плитку перед 12 входами. Проведено аудит ще 40 будівель — вони у наступному плані. Мета на рік: 100 доступних об''єктів у Львові.',
       15, 'PUBLISHED'),

  (17, 'Курс жестової мови: 120 чуючих опанували базовий USL за місяць',
       'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=600', FALSE,
       'Без Бар''єрів планувала 60 учасників — прийшли 120. Довелось відкрити додаткові групи.',
       'Реєстрація відкрилась у понеділок, а в середу вже закрилась: всі місця розібрали. Серед учасників — медики, педагоги, поліцейські та просто небайдужі люди. Лектор — Оксана Дем''яненко, сама людина з глухотою. Після курсу: 89% учасників впевнено вітаються жестами, 60% можуть провести базовий діалог. Наступний потік відкрито — записатись можна на сайті організації.',
       15, 'PUBLISHED'),

  -- Психологічна підтримка (14) -----------------------------------------------
  (18, 'Простір Підтримки провів 500 безкоштовних сесій психолога за перший рік роботи',
       'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600', TRUE,
       'Психологічна служба підбила річні підсумки: 500 сесій, 87 ветеранів, 134 переселенці, 7 фахівців.',
       'За перший рік «Простір Підтримки» провів 500 індивідуальних і 80 групових сесій. 87 ветеранів пройшли повний курс (10 сесій): 73% оцінили покращення стану як значне за шкалою PHQ-9. 134 переселенці пройшли від 1 до 5 сесій. Середній час очікування запису скоротився з 14 до 3 днів після долучення 4 нових волонтерів-психологів. Ми розширюємось: зараз відкрито набір до команди для ще двох фахівців.',
       16, 'PUBLISHED'),

  (19, 'Арт-терапія в Харкові: учасники говорять, як творчість допомогла після важкого досвіду',
       'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600', FALSE,
       'Учасники груп арт-терапії «Простору Підтримки» діляться своїми історіями після 8 тижнів роботи.',
       'Щотижнева група творчої підтримки зараз налічує 24 постійних учасники: ветеранів, переселенців та їхніх дітей. Після 8 тижнів команда зібрала анонімні відгуки учасників і оновила програму занять відповідно до потреб групи. Нова група відкрита для запису.',
       16, 'PUBLISHED'),

  -- Спорт (13) ----------------------------------------------------------------
  (20, 'Безкоштовна секція футболу для дітей ВПО: 90 заявок за перший тиждень',
       'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=600', FALSE,
       'СпортДух оголосив набір — і черга на запис за тиждень перевищила місткість утричі.',
       'Безкоштовна секція футболу для дітей 7–14 років у Запоріжжі зібрала 90 заявок за 7 днів при місткості 30 осіб. СпортДух відкриває другу групу та шукає волонтера-тренера. Форма та м''яч надаються безкоштовно, графік тренувань узгоджується з батьками.',
       6, 'PUBLISHED'),

  (21, 'Перший адаптивний турнір з настільного тенісу зібрав 15 учасників на кріслах-колясках',
       'https://images.unsplash.com/photo-1770189993553-9537c0846d05?auto=format&fit=crop&q=80&w=600', FALSE,
       'СпортДух та Без Бар''єрів провели перший у Запоріжжі турнір з адаптивного настільного тенісу.',
       '15 учасників змагались у трьох вікових категоріях. Майданчик у ДЮСШ №3 адаптували заздалегідь: прибрали пороги, розширили прохід між столами, встановили поручні. Переможці отримали медалі та сертифікати. Наймолодшому учаснику — 12 років, найстаршому — 67. Наступний турнір заплановано за два місяці.',
       6, 'PUBLISHED'),

  -- Літні люди (9) ------------------------------------------------------------
  (22, 'Волонтери доставили продукти 150 самотнім пенсіонерам у Хмельницькому',
       'https://images.pexels.com/photos/6995221/pexels-photo-6995221.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE,
       'Їжа та Турбота провела місячну програму доставки — шість бригад щосуботи охоплювали нові адреси.',
       'Упродовж місяця 28 волонтерів у складі шести бригад щосуботи розвозили продуктові набори по 150 адресах самотніх пенсіонерів. Середній вік отримувачів — 79 років. Кожен набір містив крупу, масло, консерви, цукор, хліб та базові аптечні позиції. Команда також передала соціальним службам оновлений перелік адрес, де потрібен регулярний контакт.',
       9, 'PUBLISHED'),

  (23, 'Пенсіонери Хмельницького опанували Дію: 60 осіб самостійно записались до лікаря онлайн',
       'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600', FALSE,
       'ОсвітаПлюс провела три воркшопи цифрової грамотності спеціально для людей 65+ у Хмельницькому.',
       'Три неділі по 20 пенсіонерів приходили до районного будинку культури зі своїми смартфонами та навчалися встановлювати Дію, записуватись до лікаря онлайн і користуватися відеодзвінками. Після занять учасники отримали друковані інструкції та контакти координатора для додаткових запитань.',
       5, 'PUBLISHED'),

  -- Культура (7) --------------------------------------------------------------
  (24, 'Майстер-клас з писанкарства: 200 учасників із 6 областей зібрались у Житомирі',
       'https://images.pexels.com/photos/6619782/pexels-photo-6619782.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE,
       'Культурна ДНК провела одноденний майстер-клас — реєстрація закрилась за чотири дні.',
       'Планували прийняти 150 учасників — зареєструвалось 200. Прийшли сім''ї з дітьми, вчителі, троє учасників із діаспори — Польща та Чехія. Майстриня Ганна Харченко навчала традиційній поліській техніці: гарячий віск, натуральні рослинні фарби, геометричні символи родючості та захисту. Кожен учасник поїхав додому з власноруч розписаною писанкою та буклетом про символіку орнаментів.',
       11, 'PUBLISHED'),

  -- Ветерани (11) -------------------------------------------------------------
  (25, 'Перший місяць групи підтримки ветеранів: підсумки регулярних зустрічей',
       'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600', FALSE,
       'ВетеранUA запустила закриту групу взаємопідтримки — 12 ветеранів зустрічаються щовівторка у Харкові.',
       'Перші чотири зустрічі були присвячені адаптації, комунікації з родиною, поверненню до роботи та підтримці повсякденного розкладу. Психологиня Романа Дяченко веде групу за правилами конфіденційності та безпечної комунікації. Група відкрита для нових учасників після короткої співбесіди з координатором.',
       3, 'PUBLISHED'),

  -- Безхатьки (15) ------------------------------------------------------------
  (26, 'Мобільний пункт «Дах і Тепло»: 400 порцій супу щотижня для безхатніх Харкова',
       'https://images.pexels.com/photos/6646923/pexels-photo-6646923.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE,
       'Щочетверговий виїзний пункт допомоги працює вже три місяці за стабільним маршрутом.',
       'Мобільна команда з 6 волонтерів та мікроавтобуса щочетверга виїжджає до вокзалу, ринку та трьох підземних переходів. За три місяці: 4 800 порцій гарячого харчування, 620 комплектів одягу, 180 довідок про нічліжки та соціальні служби. Двох людей вдалось направити до реабілітаційного центру. Координаторка Світлана Мороз зазначає, що регулярний маршрут допомагає підтримувати контакт із людьми, які рідко звертаються до стаціонарних центрів.',
       12, 'PUBLISHED'),

  -- Медицина (4) ---------------------------------------------------------------
  (27, 'МедДопомога вакцинувала 600 мешканців громад Дніпропетровщини',
       'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=600', FALSE,
       'Виїзна бригада провела дводенну програму вакцинації та первинного огляду у громадах з обмеженим доступом до амбулаторій.',
       'За два дні бригада з 4 лікарів та 6 волонтерів щепила 600 осіб від грипу, 140 — від правця, а також провела первинні консультації. Пацієнтів, яким потрібне подальше лікування, скерували до районної лікарні з відповідними документами.',
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
  main_content = 'Притулок «Друг» у Львові опікується понад 80 собаками різного віку та розміру. Регулярні прогулянки з волонтерами допомагають тваринам підтримувати активність, звикати до людей і краще адаптуватися перед адопцією.',
  what_volunteers_will_do = 'Отримати собаку від доглядача, вигуляти 1–2 собак протягом 60 хвилин у парку поруч із притулком, погратися, дати воду, зафіксувати поведінку у листі для потенційних власників.',
  why_its_important = 'Соціалізація знижує стрес тварин, допомагає команді краще знати їхню поведінку і підвищує шанси на відповідальну адопцію.'
WHERE id = 1;

UPDATE project SET
  main_content = 'Програма OSK (Відловити-Стерилізувати-Повернути) допомагає гуманно контролювати популяцію вуличних котів. Цикл одного дня: ранній відлов у пастки, переїзд до ветклініки «Лапа», операція, відновлення та повернення на місце. Rescue Львів вже провів понад 800 стерилізацій у Львові та передмістях.',
  what_volunteers_will_do = 'Розставляти пастки ввечері напередодні, зранку збирати котів і перевозити їх у переносках до клініки, допомагати ветеринарам з документацією, ввечері повертати котів на місця.',
  why_its_important = 'Планова стерилізація допомагає гуманно зменшувати кількість безпритульних тварин і навантаження на міські служби. Програма поєднує відлов, ветеринарний огляд, стерилізацію, вакцинацію та повернення тварин у знайоме середовище.'
WHERE id = 2;

UPDATE project SET
  main_content = 'Голосіївський парк потребує регулярного догляду після сезонного відпочинку містян. Раз на сезон EcoKyiv проводить прибирання: понад 50 волонтерів працюють у 4 зонах парку, сортують відходи на фракції та передають їх на переробку. Учасники отримують інвентар, інструктаж і гарячий чай.',
  what_volunteers_will_do = 'Отримати мішки та інвентар, прибрати закріплену зону парку, сортувати відходи на пластик, скло, папір та змішані відходи, завантажити мішки у транспорт, зробити фото до і після для звіту.',
  why_its_important = 'Регулярні прибирання зменшують кількість відходів у зелених зонах, підтримують безпечний простір для відпочинку та привчають відвідувачів до сортування.'
WHERE id = 3;

UPDATE news SET
  main_content = 'У 2025 році команда Rescue Львів надала допомогу тваринам у кількох напрямах: адопція, стерилізація, лікування та евакуація з прифронтових громад. Загальна статистика за рік: 320 тварин знайшли постійний дім, 510 пройшли стерилізацію в рамках програми OSK, 12 ветеринарних клінік стали постійними партнерами, 85 нових волонтерів приєднались до команди. Повний фінансовий розділ опубліковано окремо.'
WHERE id = 1;

UPDATE news SET
  main_content = 'У квітні EcoKyiv провела 4 акції з озеленення у чотирьох районах Києва. Усього висаджено 200 саджанців: дуб черешчатий, клен польовий, липа серцелиста, береза повисла. Кожне дерево отримало GPS-координати та унікальний ID — волонтери моніторитимуть приживаність щоквартально. Долучились 63 волонтери та учні 5 шкіл. Школа №78 висадила власну алею з 20 лип і вже взяла її «під опіку». За п''ять років ці дерева почнуть поглинати CO₂ і давати тінь — і це справа рук конкретних людей.'
WHERE id = 2;

-- ============================================================================
-- РОЗШИРЕННЯ ТЕКСТІВ: проєкти 4–15
-- ============================================================================

UPDATE project SET
  description         = 'Разом із учнями школи №125 висаджуємо 50 саджанців у шкільному дворі: клени, липи, дуби та берези.',
  main_content        = 'Школа №125 у Голосіївському районі Києва виділила 400 кв. м під шкільний мінігай. EcoKyiv надає 50 саджанців місцевих порід: 15 дубів, 15 лип, 10 кленів і 10 беріз. Лісівник-консультант проведе короткий інструктаж для учнів про правильну посадку. Волонтери допомагають копати ями, встановлювати захисні кілочки, поливати після посадки та маркувати саджанці.',
  what_volunteers_will_do = 'Копати ями глибиною 50 см за позначками лісівника, обережно висаджувати саджанці зберігаючи кореневий ком, встановлювати захисні кілочки і прив''язувати стовбур, поливати кожне дерево 10–15 літрами, прикріплювати іменні таблички від класів.',
  why_its_important   = 'Шкільне озеленення створює тінь, покращує мікроклімат подвір''я та дає учням практичний досвід догляду за деревами.'
WHERE id = 4;

UPDATE project SET
  description         = 'Практичний 4-годинний тренінг для демобілізованих: смартфон, «Дія», запис до лікаря онлайн, відеодзвінки та державні послуги.',
  main_content        = 'ВетеранUA розробила практичний тренінг із цифрових сервісів для ветеранів. Програма включає встановлення та верифікацію «Дії», запис до лікаря онлайн, відеодзвінок у Viber або Telegram, пошук роботи на ДІЯ.Бізнес і базові налаштування безпеки смартфона. Кожен учасник отримує покрокову інструкцію та можливість поставити запитання після тренінгу.',
  what_volunteers_will_do = 'Сидіти поруч з учасником і особисто допомагати виконувати кожен крок на смартфоні, реєструвати учасників та видавати бейджі, вирішувати технічні проблеми зі старими смартфонами, після тренінгу збирати відгуки та заповнювати анкету.',
  why_its_important   = 'Цифрові навички допомагають ветеранам самостійно користуватися державними сервісами, записуватися до лікаря, підтримувати зв''язок із родиною та шукати можливості працевлаштування.'
WHERE id = 5;

UPDATE project SET
  description         = 'День безкоштовних медичних консультацій для переселенців: терапевт, педіатр, гінеколог, стоматолог-консультант і базові аналізи.',
  main_content        = 'МедДопомога щомісяця організовує день медичних консультацій у лікарні №4 Дніпра: працюють 8 кабінетів і 12 лікарів-волонтерів. Додатково доступний пункт забору крові для базових аналізів, результати надходять на телефон через 3 дні. Попередній запис бажаний, але не обов''язковий. За останній рік оглянуто понад 2 600 людей, частину пацієнтів скеровано до профільних лікарів.',
  what_volunteers_will_do = 'Реєструвати пацієнтів і видавати талони з часом прийому, координувати черги між кабінетами, допомагати заповнювати анкети тим, хто має труднощі з письмом, перекладати для пацієнтів з мовним бар''єром, перевіряти, що кожен отримав направлення або результат.',
  why_its_important   = 'Регулярні консультаційні дні допомагають людям отримати первинний огляд, базові аналізи та подальше скерування без складної логістики.'
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
  why_its_important   = 'Гуманітарний набір на 2 тижні допомагає родинам закрити базові потреби та зосередитися на пошуку роботи, лікуванні й облаштуванні побуту.'
WHERE id = 8;

UPDATE project SET
  description         = 'Повний день творчих занять для дітей переселенців від 4 до 12 років: малювання, ліплення, аплікація та казковий театр.',
  main_content        = '«Дитяча Радість» організовує цілоденний творчий захід для дітей ВПО: 5 майстерень одночасно (малювання, ліплення, аплікація, оригамі, тіньовий театр), кожна дитина відвідує 3 за день за власним вибором. Заняття проходять у малих групах під супроводом фахівців і волонтерів.',
  what_volunteers_will_do = 'Проводити майстер-клас у своїй майстерні або асистувати досвідченому аніматору, допомагати дітям з матеріалами та інструментами, стежити за безпекою, після кожного блоку прибирати та готувати місце для наступної групи.',
  why_its_important   = 'Творчі заняття допомагають дітям безпечно взаємодіяти з однолітками, пробувати нові активності та мати передбачуваний день у підтримувальному середовищі.'
WHERE id = 9;

UPDATE project SET
  description         = 'Дводенна волонтерська допомога з ремонтом покрівлі у гуртожитку, де проживають 40 родин ВПО.',
  main_content        = 'Гуртожиток у Черкасах прийняв 40 родин ВПО. Після технічного огляду «Відбудова Разом» підготувала кошторис і закупила матеріали: рулонний бітум, балки та кріплення. Потрібна бригада з 15 осіб на два робочих дні. Волонтерів з досвідом покрівельних робіт залучать до складніших завдань, інших учасників проінструктують на місці.',
  what_volunteers_will_do = 'Демонтувати старе покриття та розподілити будівельне сміття, підносити матеріали на дах (по черзі — безпечно), укладати новий рулонний бітум під керівництвом прораба, герметизувати стики та примикання, прибирати після роботи.',
  why_its_important   = 'Ремонт покрівлі допоможе зберегти житлові кімнати сухими та придатними для проживання родин, які вже облаштувалися у гуртожитку.'
WHERE id = 10;

UPDATE project SET
  description         = 'Одноденний фестиваль фольклору Полісся: виступи колективів, майстер-класи з ремесел, виставка традиційного одягу та кухня регіону.',
  main_content        = '«Культурна ДНК» збирає народних виконавців, майстрів ремесел і кулінарів із Житомирщини на одноденну культурну подію. Програма: сцена з фольклорними колективами, 4 майстерні (ткацтво, гончарство, витинанка, бісероплетіння), виставка традиційного одягу з 5 районів і куточок регіональних страв. Очікується понад 2 000 відвідувачів. Вхід вільний.',
  what_volunteers_will_do = 'Зустрічати гостей і орієнтувати по локаціях фестивалю, допомагати майстрам на майстер-класах готувати матеріали та чергувати учасників, супроводжувати виконавців від паркінгу до сцени, знімати контент для соціальних мереж організації.',
  why_its_important   = 'Фестиваль допомагає показати локальні традиції у відкритому форматі та залучити містян до практичного знайомства з ремеслами, музикою і кухнею регіону.'
WHERE id = 11;

UPDATE project SET
  description         = 'Дводенна волонтерська вахта для підготовки нічліжки на 60 місць до зими: побілка, монтаж ліжок, утеплення вікон, облаштування душових — до першого снігу.',
  main_content        = 'Нічліжка «Дах і Тепло» у Харкові приймає безхатніх цілий рік, але до зими потребує щорічного перезапуску: оновлення ліжок, побілка стін, заміна вікон у 3 кімнатах, ремонт душових та встановлення додаткових обігрівачів. Цього року розширюємо до 60 місць — додаємо 10 нових ліжок. Усі матеріали закуплені. Потрібна команда 20 людей на 2 дні. Жодних спеціальних навичок не потрібно — розподілимо за вміннями.',
  what_volunteers_will_do = 'Малярні роботи (побілка/фарбування стін), збирання та розстановка ліжок і тумбочок, монтаж утеплення на вікнах, встановлення обігрівачів та перевірка електрики (з електриком), прибирання та сортування одягу і постільної білизни.',
  why_its_important   = 'Підготовлена нічліжка дає людям без постійного житла безпечне місце для сну, доступ до тепла, харчування та контакт із соціальними службами.'
WHERE id = 12;

UPDATE project SET
  description         = 'Щомісячний день безкоштовних юридичних консультацій для переселенців: субсидія, реєстрація, права на роботі, відновлення документів — юристи-волонтери відповідають на всі питання.',
  main_content        = '«Переселенці Разом» проводить «Юридичну суботу» в першу суботу кожного місяця. Приймають 6 юристів-волонтерів одночасно: кожна консультація — 20–30 хвилин. Теми: оформлення субсидії та допомоги ВПО, реєстрація за новим місцем проживання, трудові права та звільнення, відновлення паспорта та інших документів, питання нерухомості в зоні конфлікту. В черзі зазвичай 50–70 людей — реєстрація з 8:30.',
  what_volunteers_will_do = 'Реєструвати відвідувачів у чергу, видавати талони та пояснювати регламент, готувати юристам папір і воду, допомагати відвідувачам, що прийшли з дітьми, зберігати конфіденційність — не обговорювати чужі справи.',
  why_its_important   = 'Правова консультація допомагає ВПО коректно оформити документи, звернутися по доступні послуги та уникнути помилок у заявах і виплатах.'
WHERE id = 13;

UPDATE project SET
  description         = 'Прибирання 2 км берега Дніпра на Трухановому острові в Києві: сортування відходів, інформаційні знаки та фотофіксація результату.',
  main_content        = 'EcoKyiv щорічно проводить велике прибирання берегів Дніпра. Цього сезону локація — Труханів острів, де регулярно накопичуються побутові та будівельні відходи. Минулого року команда зібрала 1,2 тонни сміття. Цього разу планується прибрати ще один кілометр берега, встановити сортувальні станції на 4 фракції та передати відходи на вивезення комунальному транспорту.',
  what_volunteers_will_do = 'Збирати сміття в закріпленій зоні берега, сортувати на фракції (пластик, скло, метал, змішане), завантажувати заповнені мішки у вказані контейнери, встановлювати інформаційні знаки про правила поведінки на березі, фотографувати зону до і після для звіту.',
  why_its_important   = 'Прибирання берегів зменшує кількість відходів біля води, підтримує безпечний простір для відпочинку та привертає увагу до відповідальної поведінки на природі.'
WHERE id = 14;

UPDATE project SET
  description         = 'Rescue Львів привозить тварин із центру адопції до Тернополя, щоб охочі могли познайомитися з ними та отримати консультацію щодо відповідального всиновлення.',
  main_content        = 'Rescue Львів організовує виїзні виставки адопції раз на два місяці — в різних містах Львівщини та сусідніх областей. Цього разу — Тернопіль, де ще немає аналогічної ініціативи. Привеземо 30+ тварин: собаки, коти, кілька кроликів. Всі ветеринарно перевірені, вакциновані, стерилізовані/кастровані, мікрочіповані. На місці — консультант з адопції, ветеринар та юрист для оформлення договору всиновлення.',
  what_volunteers_will_do = 'Транспортувати тварин у переносках від притулку до місця виставки, облаштовувати стенди та огорожі, консультувати потенційних власників про характер і потреби конкретної тварини, допомагати оформлювати документи всиновлення, доглядати за тваринами протягом дня.',
  why_its_important   = 'Виїзні дні адопції розширюють коло потенційних опікунів, дають людям можливість особисто познайомитися з тваринами та допомагають центру швидше знаходити відповідальні родини.'
WHERE id = 15;

-- ============================================================================
-- РОЗШИРЕННЯ ТЕКСТІВ: новини 3–13
-- ============================================================================

UPDATE news SET
  description  = 'Rescue Львів шукає волонтерів для створення системи обліку тварин у центрі адопції.',
  main_content = 'Притулок «Друг» веде облік тварин у таблицях, що ускладнює оновлення статусів і підготовку звітів. Rescue Львів шукає команду волонтерів для розробки веб-застосунку: картка тварини, статуси перебування і лікування, фільтри за видом, породою та віком, публічна сторінка для потенційних опікунів. Орієнтовний термін — 2 місяці, участь онлайн 2–3 години на тиждень.'
WHERE id = 3;

UPDATE news SET
  description  = 'ВетеранUA відкрила перший у Харкові багатопрофільний центр для демобілізованих та їхніх родин — з психологами, юристами, консультантами з працевлаштування і курсами цифрових навичок.',
  main_content = 'Центр ВетеранUA розташований на вул. Сумській, 15 — у повністю відремонтованому приміщенні з доступом для людей з інвалідністю. Щодня Пн–Пт з 9:00 до 18:00 тут працюють: 2 психологи (запис необов''язковий), 1 юрист (консультації з пільг, документів, трудових прав), консультант з працевлаштування (резюме, співбесіди, вакансії) і волонтер-викладач цифрових навичок (смартфон, «Дія», онлайн-сервіси). Щотижнева група підтримки — вівторки о 18:00. За перший місяць роботи — 143 звернення. Вхід безкоштовний, без запису.'
WHERE id = 4;

UPDATE news SET
  description  = 'МедДопомога провела день безкоштовних консультацій: 12 лікарів-волонтерів прийняли 210 переселенців.',
  main_content = 'У неділю, 15 жовтня, у лікарні №4 Дніпра від 9:00 до 17:00 працювали 8 медичних кабінетів. Найбільший запит: терапевт (87 прийомів), педіатр (54), гінеколог (41), стоматолог-консультант (28). Пункт забору крові обробив 96 зразків. Пацієнтів, які потребували додаткового огляду, скерували до профільних лікарів через партнерську мережу. Наступна акція — 19 листопада, реєстрація відкрита.'
WHERE id = 5;

UPDATE news SET
  description  = 'ОсвітаПлюс набрала 80 слухачів на весняний семестр безкоштовних курсів англійської — три рівні, дванадцять волонтерів-викладачів, заняття тричі на тиждень.',
  main_content = 'Весняний семестр стартував 3 лютого і триватиме до 3 травня. Відкрито три рівні: A1 (26 осіб), A2 (32 особи), B1 (22 особи). Кожен рівень — 2 групи по 13–16 осіб, заняття у вівторок, четвер і суботу по 90 хвилин. Серед 12 викладачів-волонтерів — люди з досвідом навчання за кордоном, досвідчені вчителі та студенти мовних спеціальностей. Навчальні матеріали адаптовані під практичні потреби переселенців. Відвідуваність за перший місяць: 88%.'
WHERE id = 6;

UPDATE news SET
  description  = 'Рука Допомоги розподілила в Вінниці черговий вантаж — 150 родин отримали продуктові набори вагою по 23 кг кожен.',
  main_content = 'У вівторок вранці о 6:00 на склад «Руки Допомоги» прибула вантажівка з Польщі — 3,5 тонни продуктів від Caritas Ukraine та польської організації PKC. До 8:00 30 волонтерів розвантажили і почали фасування. Стандартний набір: гречка 2 кг, рис 2 кг, макарони 1 кг, тушонка ×3, олія 1 л, цукор 1 кг, сіль, мило ×2. Для родин з дітьми до 5 років — окремий дитячий набір (каша, пюре, сік). Три точки видачі працювали з 12:00 до 18:00. Черга — без очікування більше 20 хвилин. Всі 150 родин отримали набори до закриття.'
WHERE id = 7;

UPDATE news SET
  description  = 'Дитяча Радість зібрала 120 дітей переселенців на одноденне свято у Полтаві: аніматори, майстер-класи, театр, солодкий стіл і рюкзачки з канцелярією.',
  main_content = 'У неділю у Полтавському будинку культури відбулася подія для дітей ВПО. Від 10:00 до 15:00 одночасно працювали 3 майстер-класи, казковий тіньовий театр, фотозона, ігрова зона та солодкий стіл. 12 аніматорів і 8 волонтерів супроводжували 120 дітей від 3 до 12 років. Кожна дитина отримала рюкзачок із базовою канцелярією для навчання.'
WHERE id = 8;

UPDATE news SET
  description  = 'Відбудова Разом завершила трьохмісячний ремонт першого гуртожитку ВПО в Черкасах — нова покрівля, 12 відремонтованих кімнат, оновлені санвузли, 38 родин у теплі.',
  main_content = 'У вересні 2023 команда «Відбудови Разом» розпочала роботи в гуртожитку 1972 року будівництва, де протікала покрівля в 6 місцях. Протягом трьох місяців 28 волонтерів-будівельників працювали змінами по 8–10 осіб, матеріали надала ПРООН Україна. Результат: замінена покрівля, відремонтовані 12 кімнат, оновлені 4 санвузли та встановлені нові вікна у 8 приміщеннях. Зараз тут мешкають 38 родин — 97 людей.'
WHERE id = 9;

UPDATE news SET
  description  = 'Культурна ДНК оголошує дату і програму фестивалю: 20 фольклорних колективів, майстер-класи ткацтва і гончарства, виставка старовинного одягу, традиційна кухня і вільний вхід.',
  main_content = 'Фестиваль традиційної музики «Поліська Душа» відбудеться 14 вересня у Центральному парку Житомира. Сцена працюватиме з 10:00 до 18:00: 20 колективів із 8 районів Житомирщини виконуватимуть автентичні пісні, танці та інструментальну музику — без сучасних обробок. Паралельно: 4 майстерні (ткацтво, гончарство, витинанка, бісероплетіння), виставка старовинного одягу зі збірки Житомирського краєзнавчого музею, куточок традиційних страв від 6 господинь. Очікується 3 000+ відвідувачів. Підтримка — Укркультурфонд та Житомирська ОДА. Волонтери — потрібні, реєстрація відкрита.'
WHERE id = 10;

UPDATE news SET
  description  = 'Завдяки 40 волонтерам «Дах і Тепло» оновила 60 спальних місць, утеплила вікна і відновила систему опалення.',
  main_content = 'Підготовка до зимового сезону зайняла два вихідних. 40 волонтерів за суботу і неділю розібрали та зібрали 60 ліжок, побілили приміщення, встановили утеплювач на 18 вікнах, полагодили систему опалення разом із майстром-волонтером, розклали запаси зимового одягу та постільної білизни. Нічліжка відкрита щодня з 20:00 до 8:00, харчування надається двічі на день.'
WHERE id = 11;

UPDATE news SET
  description  = 'Переселенці Разом відновила безкоштовні юридичні консультації в Одесі: перша субота місяця, 6 юристів одночасно, допомога з виплатами, документами і трудовими правами.',
  main_content = 'Після двомісячної перерви через ремонт приміщення «Переселенці Разом» повертається з оновленим форматом: 6 юристів одночасно, реєстрація відвідувачів з 8:30. Консультують щодо оформлення виплат ВПО, реєстрації нового місця проживання, відновлення паспорта та свідоцтв, трудових спорів і питань нерухомості у постраждалих громадах. Середня тривалість консультації — 25 хвилин. Безкоштовно. Конфіденційно. Адреса: вул. Дерибасівська, 5.'
WHERE id = 12;

UPDATE news SET
  description  = 'EcoKyiv підбила підсумки осіннього екосуботника в Голосіївському парку: 80 волонтерів, 500 кг сміття за 4 години, 3 старі шини, 1 холодильник і 40 мішків відсортованого пластику.',
  main_content = 'Осінній суботник зібрав 83 учасники — від школярів до пенсіонерів, від студентів до корпоративних команд (прийшли три компанії з колегами). Прибирали 4 зони парку одночасно: берег озера, центральна алея, ліс за дитячим майданчиком і зона пікніків біля входу. Результат 4 годин роботи: 500 кг сміття, з яких 120 кг пластику відсортовано і передано на переробку, 80 кг скла — аналогічно. Окремо: 3 старі шини, холодильник, два матраци. Все крупногабаритне вивіз комунальний транспорт. Після прибирання — кава і чай від спонсорів та командне фото.'
WHERE id = 13;

-- ============================================================================
-- РОЗШИРЕННЯ ТЕКСТІВ: збори 1–13
-- ============================================================================

UPDATE fundraising_campaign SET
  description  = 'Щомісячний збір на корм та ветеринарні препарати для 80 собак притулку «Друг» у Львові.',
  main_content = 'Притулок «Друг» працює на волонтерській основі. Щомісяця потрібні кошти на сухий і вологий корм, ветеринарні препарати, засоби гігієни та дезінфекції. Після закупівель організація публікує фінансовий звіт і короткий перелік переданих матеріалів.'
WHERE id = 1;

UPDATE fundraising_campaign SET
  description  = 'Збір завершено: придбано мішки, рукавиці, граблі та лопати для наступних екосуботників EcoKyiv.',
  main_content = 'За 50 днів 134 донори зібрали 25 000 грн на комплект інвентарю для 5 великих прибирань: мішки для сміття, рукавиці, граблі, лопати, щипці для підбору відходів і сортувальну стрічку. Інвентар уже використано на подіях у Голосіївському парку та на Трухановому острові. Зібрано і вивезено 1,7 тонни відходів.'
WHERE id = 2;

UPDATE fundraising_campaign SET
  description  = 'Особистий збір волонтера на 10 вживаних ноутбуків для дітей шкільного віку, які живуть у гуртожитку ВПО в Києві та навчаються онлайн.',
  main_content = 'У гуртожитку на Оболоні мешкають 10 дітей від 8 до 15 років. Навчання відбувається онлайн або у змішаному форматі, але родини не мають достатньо техніки. Збір покриє придбання 10 справних вживаних ноутбуків, базове налаштування, перевірку батарей і передачу через координаторів центру розміщення. Усі чеки та акти передачі будуть опубліковані у звіті.'
WHERE id = 3;

UPDATE fundraising_campaign SET
  description  = 'Rescue Львів збирає кошти на ветеринарну допомогу тваринам, евакуйованим із громад у зоні підвищеного ризику.',
  main_content = 'Організація приймає тварин, яким потрібні операції, антибіотикотерапія та спеціальне харчування у реабілітаційний період. Цей збір покриє лікування 8–10 тварин, що надійдуть у найближчі три тижні. Витрати буде підтверджено рахунками клінік і фінансовим звітом.'
WHERE id = 4;

UPDATE fundraising_campaign SET
  description  = 'EcoKyiv збирає на очищення берегів річки Либідь у Києві: інвентар, вивезення великогабаритних відходів і аналіз якості води.',
  main_content = 'Річка Либідь — притока Дніпра, що протікає через Деміївку, Голосіїв і Теремки. На окремих ділянках берегів накопичуються побутові та будівельні відходи. EcoKyiv планує три прибирання протягом сезону. Кошти потрібні на оренду техніки для вивезення великогабаритних відходів, аналіз якості води в 5 точках до і після робіт, інвентар та інформаційні стенди.'
WHERE id = 5;

UPDATE fundraising_campaign SET
  description  = 'Збір Зореслави Чобіт закрито: 8 родин ВПО з немовлятами отримали підгузки, суміші та засоби гігієни.',
  main_content = 'Цей збір завершено. Кошти спрямовано на підтримку 8 родин з немовлятами у гуртожитку на Подолі. Закуплено підгузки різних розмірів, молочні суміші, вологі серветки та базові засоби догляду. Передача відбулася через координатора центру розміщення з фіксацією кількості отримувачів.'
WHERE id = 6;

UPDATE fundraising_campaign SET
  description  = 'Збираємо кошти на утеплення і безпечний обігрів вольєрів для 80 собак притулку «Друг».',
  main_content = 'Збір покриває підготовку центру перетримки до холодного сезону: 12 керамічних обігрівачів, утеплення 6 будок, монтажні матеріали для щілин і ремонт частини покрівлі над зовнішнім вольєром. Загальна сума — 45 000 грн. Закупівлі та виконані роботи будуть підтверджені фінансовим і фото-звітом.'
WHERE id = 7;

UPDATE fundraising_campaign SET
  description  = 'Школа №98 відкриває еколабораторію — збираємо на мікроскоп, набори для аналізу ґрунту та води, і польовий інвентар для учнів 5–9 класів.',
  main_content = 'Школа №98 у Голосіївському районі Києва за підтримки EcoKyiv запускає перший шкільний екогурток із справжньою лабораторією. Що плануємо закупити: мікроскоп Levenhuk (7 500 грн) для дослідження мікроорганізмів у воді та ґрунті, 4 набори для аналізу рН ґрунту і кислотності води (по 800 грн = 3 200 грн), 5 ботанічних визначників рослин Київщини (по 450 грн = 2 250 грн), 10 польових блокнотів і компасів для спостережень у парку (3 000 грн), захисні рукавички та окуляри для лабораторних занять (1 200 грн). Перший гурток — 24 учасники. Якщо зберемо більше — відкриємо другу групу.'
WHERE id = 8;

UPDATE fundraising_campaign SET
  description  = 'Особистий збір на 20 базових смартфонів для ветеранів після демобілізації, щоб підтримувати зв''язок з родиною, знаходити роботу і користуватись держпослугами.',
  main_content = 'Збір покриє закупівлю 20 бюджетних Android-смартфонів та коротке навчання з базових сервісів: Дія, відеозв''язок, онлайн-запис до лікаря і пошук вакансій. ВетеранUA координує список отримувачів і підготує публічний звіт із чеками та актами передачі.'
WHERE id = 9;

UPDATE fundraising_campaign SET
  description  = 'ВетеранUA збирає на медикаменти та реабілітаційні препарати для ветеранів у межах лікарських призначень.',
  main_content = 'Центр ВетеранUA щомісяця приймає 40–50 ветеранів. Частина клієнтів потребує медикаментозної підтримки в межах лікарських призначень, але не всі необхідні препарати покриваються державними програмами. Цей збір покриє три місяці підтримки для 15 ветеранів. Усі закупівлі будуть підтверджені документами і фінансовим звітом.'
WHERE id = 10;

UPDATE fundraising_campaign SET
  description  = 'МедДопомога обладнує мікроавтобус як пересувний медичний кабінет для щотижневих виїздів у громади з обмеженим доступом до лікарів.',
  main_content = 'У частині громад Дніпропетровської області доступ до регулярної медичної допомоги обмежений. Команда орендує мікроавтобус і переобладнує його на мобільний медкабінет: оглядовий стіл, холодильник для вакцин, апарат ЕКГ і базова аптека. Щотижня заплановано виїзд у 3–4 населені пункти, 1–2 лікарі та 3–4 волонтери-асистенти. Кошти потрібні на адаптацію мікроавтобуса, медичне обладнання та ліки на перший квартал.'
WHERE id = 11;

UPDATE fundraising_campaign SET
  description  = '«Дах і Тепло» розширює нічліжку до 80 місць — збираємо на 20 нових ліжок, матраси, подушки, ковдри та постільну білизну для нового крила.',
  main_content = 'Нічліжка «Дах і Тепло» у Харкові три роки працює на 60 місць. Цього року команда відремонтувала сусіднє приміщення і планує облаштувати 20 нових спальних місць: металеві ліжка, матраци, подушки, ковдри та комплекти постільної білизни. Загальна сума збору — 28 000 грн. Після закупівель буде опубліковано фінансовий звіт.'
WHERE id = 12;

UPDATE fundraising_campaign SET
  description  = '«Рука Допомоги» збирає на 100 продуктових наборів для найбільш вразливих родин Вінниці перед зимою — по 2 місяці запасу, включно з дитячим харчуванням.',
  main_content = 'Перед зимою «Рука Допомоги» формує 100 продуктових наборів для родин із низьким доходом. Один набір розрахований на 2 місяці для родини з 3–4 осіб і включає крупи, консерви, олію, борошно, цукор та додаткові позиції для родин із дітьми. Вартість одного набору — 850 грн. Повний звіт із закупівлями буде опублікований після розподілу.'
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
       'Простір для молоді від 16 до 30 років: ІТ-курси, волонтерство, дебати та освітні проєкти. Організовуємо безкоштовні воркшопи, стажування та освітні табори. Співпрацюємо з університетами та ліцеями Харківщини.',
       'PENDING', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448901/hand-and-hand/documents/reports/seed-report-07.pdf',
       '+380577001122', 'hello@molhub.kh.ua', 'Харків',
       'https://ui-avatars.com/api/?name=MH&background=7950f2&color=fff&size=200&bold=true', 6,
        'Створюємо можливості для навчання, волонтерства та самореалізації молоді у Харкові.'),
  (18, 36, 'ЕкоГрад Одеса', '34567890',
       'Захист екосистеми Чорноморського узбережжя: очищення пляжів, контроль за стихійними звалищами, освіта населення про роздільний збір сміття. Партнерська організація Global Ocean Watch.',
       'PENDING', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448902/hand-and-hand/documents/reports/seed-report-08.pdf',
       '+380487002233', 'eco@ekograd.od.ua', 'Одеса',
       'https://ui-avatars.com/api/?name=EO&background=12b886&color=fff&size=200&bold=true', 4,
       'Чисте море — право кожного жителя Одеси та туриста.'),
  (19, 37, 'Малюки у Безпеці', '45678901',
       'Навчання дітей і батьків правилам безпеки та евакуації. Розробка ігрових програм для шкіл з питань цивільного захисту.',
       'REJECTED', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448902/hand-and-hand/documents/reports/seed-report-09.pdf',
       '+380542003344', 'safe@maluku.sumy.ua', 'Суми',
       'https://ui-avatars.com/api/?name=MB&background=f76707&color=fff&size=200&bold=true', NULL,
       'Кожна дитина знає, що робити в кризовій ситуації.');

SELECT setval('organization_profile_id_seq', (SELECT MAX(id) FROM organization_profile));

-- 3 нові volunteer_profile (IDs 14–16): is_verified=FALSE
INSERT INTO volunteer_profile (id, user_id, display_name, phone, bio, skills_text, rating, is_verified, avatar_url, docs_url) VALUES
  (14, 38, 'Зоя Науменко',   '+380660001122',
       'Зооволонтер з 2023 року — рятую котів і собак з вулиці. Маю досвід перетримки до 10 тварин одночасно та базові навички надання допомоги пораненим тваринам.',
       'Порятунок тварин, перетримка, соціалізація', NULL, FALSE,
       'https://i.pravatar.cc/300?img=9',
       'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448898/hand-and-hand/documents/reports/seed-report-04.pdf'),
  (15, 39, 'Олексій Лещенко', '+380730004455',
       'Будівельник-волонтер. Беру участь у відбудові пошкоджених будівель і встановленні пандусів для людей з обмеженими можливостями.',
       'Будівництво, зварювання, монтаж, ремонт', NULL, FALSE,
       'https://i.pravatar.cc/300?img=51',
       'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448899/hand-and-hand/documents/reports/seed-report-05.pdf'),
  (16, 40, 'Катерина Салова', '+380507006677',
       'Вчителька початкових класів. Хочу організовувати заняття для дітей-переселенців та арт-терапевтичні сесії.',
       'Педагогіка, арт-терапія, діти, психологія', NULL, FALSE,
       'https://i.pravatar.cc/300?img=35',
       'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448900/hand-and-hand/documents/reports/seed-report-06.pdf');

SELECT setval('volunteer_profile_id_seq', (SELECT MAX(id) FROM volunteer_profile));

-- 3 нові проєкти (IDs 30–32): DRAFT — 2 очікують підтвердження, 1 відхилений
INSERT INTO project (id, organization_profile_id, title, description, status, starts_at, ends_at,
  main_content, what_volunteers_will_do, why_its_important, time, application_deadline,
  location_id, category_id, partners, image_url, participants)
VALUES
  (30, 1, 'Нічний патруль для безпритульних тварин',
      'Організовуємо нічні рейди по місту — шукаємо поранених і хворих тварин на вулицях Львова.',
      'DRAFT', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days 4 hours',
      'Rescue Львів запускає пілотний нічний моніторинг безпритульних тварин. Команди з 3–4 осіб перевірятимуть погоджені маршрути, фіксуватимуть локації та за потреби передаватимуть травмованих тварин до цілодобової ветеринарної клініки.',
      'Їхати в одній із машин-патрулів, допомагати виявляти тварин, при необхідності утримувати та транспортувати поранену тварину, вести журнал спостережень і фіксувати геоточки на карті.',
      'Систематичний нічний моніторинг допоможе команді краще розуміти маршрути, кількість звернень і потребу у ветеринарному реагуванні в різних районах міста.',
      'Щонеділі, 22:00–02:00', NOW() + INTERVAL '12 days', 1, 2,
      'Цілодобова ветеринарна клініка',
      'https://images.unsplash.com/photo-1559070169-a3077159ee16?auto=format&fit=crop&q=80&w=600',
      8),
  (31, 2, 'Посадка квіткових клумб у дворах ветеранів',
      'EcoKyiv разом з ОСББ облаштовує квіткові клумби у дворах, де мешкають ветерани та їхні родини.',
      'DRAFT', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days 3 hours',
      'Багато ветеранів та їхніх сімей живуть у будинках із занедбаними дворами. EcoKyiv пропонує просте і водночас символічне рішення — зробити ці двори квітучими. Ми закупляємо 500 цибулинних квітів (тюльпани, нарциси, крокуси), надаємо інвентар та супровід ландшафтного дизайнера. Ветерани самі обирають, де і що садити. Результат буде видно вже навесні.',
      'Допомагати розкопувати землю та садити цибулини за схемою, розставляти декоративні камінці та бордюри, фотографувати процес для звіту та соціальних мереж.',
      'Озеленення дворів покращує спільний простір для мешканців і створює просту можливість для сусідської взаємодії.',
      'Субота, 10:00–14:00', NOW() + INTERVAL '8 days', 2, 1,
      'КМДА, Асоціація ОСББ Києва',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600',
      20),
  (32, 7, 'Школа підприємництва для ветеранів',
      'Безкоштовний двотижневий курс для ветеранів: від ідеї бізнесу до першого продажу.',
      'DRAFT', NOW() + INTERVAL '21 days', NOW() + INTERVAL '35 days',
      'ВетеранUA спільно з партнерами запускає безкоштовний підприємницький курс для ветеранів. Програма триває 10 днів і охоплює маркетинг, фінанси, юридичне оформлення ФОП та пошук перших клієнтів. Наставники — підприємці з досвідом запуску малого бізнесу.',
      'Допомагати з реєстрацією учасників, підготовкою роздаткових матеріалів, організацією кейтерингу, зйомкою та документуванням заходів.',
      'Підприємницькі навички допомагають ветеранам планувати професійний розвиток, тестувати бізнес-ідеї та отримувати підтримку від наставників.',
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
      'З 1 червня вводяться нові вимоги до волонтерів-перетримників: анкетування, перевірка умов проживання та обов''язковий вступний тренінг.',
      'Rescue Львів оновлює правила перетримки тварин. Нові вимоги включають деталізовану анкету, перевірку умов проживання волонтером-куратором і короткий вступний онлайн-інструктаж.',
      1, 'PENDING'),
  (29, 'МедДопомога: звіт мобільної амбулаторії за квітень',
      'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=600',
      FALSE,
      'За квітень мобільна амбулаторія відвідала 9 прифронтових сіл Дніпропетровщини: прийнято 847 пацієнтів, проведено 312 ЕКГ, видано медикаменти на 156 000 грн.',
      'Мобільна амбулаторія МедДопомоги — мікроавтобус з оглядовим столом, холодильником для вакцин, апаратом ЕКГ і базовою аптекою — у квітні здійснила 12 виїздів у Нікопольський та Криворізький райони. Статистика місяця: 9 сіл охоплено, 847 пацієнтів прийнято, 312 ЕКГ виконано, пацієнтів із показами скеровано до лікарень, медикаменти на суму 156 000 грн видано безкоштовно. Дякуємо 47 волонтерам, які їздили разом із нами.',
      4, 'PENDING'),
  (30, 'ВетеранUA: набір на осінній цикл психологічних груп',
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600',
      FALSE,
      'Відкрито реєстрацію на груповий курс психологічної підтримки для ветеранів та членів їхніх сімей. 8 зустрічей, сертифікований психолог, безкоштовно.',
      'ВетеранUA оголошує набір до осіннього циклу груп психологічної підтримки. Формат: закрита група 6–8 осіб, 8 щотижневих зустрічей по 90 хвилин, ведучий — сертифікований психолог Тетяна Яворська. Заплановано три паралельні групи: для ветеранів, для членів родин ветеранів і змішана. Реєстрація доступна через сайт організації. Усі заняття безкоштовні.',
      3, 'PENDING');

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
      'Команда перевозить вакцини та вологі корми у звичайній вантажівці, що ускладнює збереження температурного режиму влітку. Рефрижераторний фургон допоможе безпечніше доставляти ветеринарні препарати, корм і матеріали для догляду. Кошторис: вживаний рефрижератор до 3.5 т — 85 000 грн, технічна перевірка та страховка — 12 000 грн, реєстрація та переобладнання — 8 000 грн. Разом: 105 000 грн.',
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
      'https://images.pexels.com/photos/9408865/pexels-photo-9408865.jpeg?auto=compress&cs=tinysrgb&w=600'),
  (16, 17, NULL,
      'Обладнання першого молодіжного хабу Харківщини',
      'Молодіжний Хаб Харків збирає на меблі, техніку та ремонт першого молодіжного простору в Холодногірському районі.',
      'Команда орендувала приміщення 120 кв. м у Холодногірському районі Харкова. Збір потрібен для облаштування функціонального простору: зала для воркшопів на 40 осіб, зона коворкінгу на 10 робочих місць, кухня-їдальня та ігрова зона. Кошторис: меблі — 65 000 грн, техніка — 42 000 грн, ремонт та оформлення — 33 000 грн. Разом: 140 000 грн.',
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
  -- Проєкти на модерацію
  ('PROJECT', 'PENDING',  30, 2,  NULL, NULL, NULL),
  ('PROJECT', 'PENDING',  31, 3,  NULL, NULL, NULL),
  ('PROJECT', 'REJECTED', 32, 7,  1,
      'Опис проєкту «Школа підприємництва для ветеранів» містить рекламні матеріали стороннього комерційного закладу без зазначення характеру партнерства. Уточніть умови співпраці з бізнес-школою та підтвердіть безкоштовність для учасників. Перегляньте розділ «Партнери» відповідно до правил платформи.',
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
      'Користувач неодноразово надсилав іншим учасникам однакові повідомлення зі сторонніми посиланнями. Після попереджень модераторів поведінка не змінилась. Обліковий запис заблоковано до завершення перевірки.',
      'ACTIVE', 'HIGH',
      NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days'),
  (29, 1,
      'Неповага до волонтерів',
      'Під час проєкту «Еко-пікнік» (09.04.2025) користувач грубо коментував роботу координатора та відмовлявся виконувати прохання організаторів. Зафіксовано скарги від 3 учасників. Перше офіційне попередження.',
      'ACTIVE', 'MEDIUM',
      NOW() - INTERVAL '7 days', NOW() + INTERVAL '23 days'),
  (30, 1,
      'Підозра у зловживанні системою нагород',
      'Виявлено аномальну активність: реєстрація на 7 проєктів протягом 2 годин з наступним скасуванням після нарахування балів. Відкрито внутрішню перевірку. Нарахування балів тимчасово призупинено.',
      'ACTIVE', 'LOW',
      NOW() - INTERVAL '2 days', NULL);

-- DONATIONS: доповнення до кампаній 4–9, 14–15
INSERT INTO donation (campaign_id, amount, donor_name, message, user_id) VALUES
  (4,  300.00,   'Р. Приймак',             'Підтримка від громади.',        35),
  (4,  1200.00,  'Анонім',                 NULL,                            NULL),
  (5,  800.00,   'В. Полтавець',           'Для ветеранів від серця',        29),
  (5,  2500.00,  'Корпоративний донат',    NULL,                            NULL),
  (6,  450.00,   'Т. Жайворон',            'Важлива ініціатива',             30),
  (7,  3000.00,  'Меценат Харкова',        NULL,                            NULL),
  (7,  750.00,   'С. Оберемок',            'На добро',                       31),
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
      '{"volunteer_id": 1, "display_name": "Анна Шимчук", "is_verified_after": true}',
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
      '{"volunteer_id": 16, "display_name": "Катерина Салова", "reason": "Нечитабельні документи"}',
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
  -- Додаткові REJECTED/PENDING
  (9,  27, 'REQUEST', 'REJECTED', NOW() - INTERVAL '9 days',  1),
  (9,  23, 'REQUEST', 'PENDING',  NULL,                       1),
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
-- NOTIFICATION_ORGANIZATION (14 сповіщень для організацій)
-- ============================================================================
INSERT INTO notification_organization
  (organization_id, message, is_read, type, entity_id, actor_id, project_id, expires_at)
VALUES
  -- REGISTRATION: нові заявки волонтерів на участь у проєктах
  (1, 'Анна Шимчук подала заявку на проєкт «Вигул собак у центрі адопції Львова»',
      TRUE,  'REGISTRATION', 1, 4, 1, NOW() + INTERVAL '4 days'),
  (1, 'Петро Іваненко подав заявку на проєкт «Вигул собак у центрі адопції Львова»',
      FALSE, 'REGISTRATION', 2, 5, 1, NOW() + INTERVAL '4 days'),
  (1, 'Марія Бойко подала заявку на проєкт «Вигул собак у центрі адопції Львова»',
      FALSE, 'REGISTRATION', 3, 6, 1, NOW() + INTERVAL '4 days'),
  (2, 'Анна Шимчук подала заявку на проєкт «Прибирання берегів річки Либідь»',
      TRUE,  'REGISTRATION', 4, 4, 3, NULL),
  (4, 'Софія Купрій подала заявку на проєкт «Тренінг з домедичної допомоги для цивільних»',
      TRUE,  'REGISTRATION', 6, 18, 5, NOW() + INTERVAL '3 days'),
  (4, 'Василь Полтавець подав заявку на проєкт «Тренінг з домедичної допомоги для цивільних»',
      FALSE, 'REGISTRATION', 7, 29, 5, NOW() + INTERVAL '3 days'),
  -- JOININGORG: запити на вступ до організації
  (1, 'Марія Бойко надіслала запит на вступ до організації',
      FALSE, 'JOININGORG', NULL, 6, NULL, NULL),
  (3, 'Василь Полтавець надіслав запит на вступ до організації ВетеранUA',
      FALSE, 'JOININGORG', NULL, 29, NULL, NULL),
  (5, 'Сергій Оберемок надіслав запит на вступ до організації ОсвітаПлюс',
      TRUE,  'JOININGORG', NULL, 31, NULL, NULL),
  -- GENERAL: загальні оголошення та новини
  (1, 'Партнер ЛКП «Лев» підтвердив участь у суботній акції 25 травня',
      TRUE,  'GENERAL', NULL, NULL, NULL, NULL),
  (2, 'Нова партія саджанців від «Зелений Київ» готова до отримання',
      FALSE, 'GENERAL', NULL, NULL, NULL, NULL),
  (14, 'Нова партія зеленої сітки від партнерів з Польщі прибула на склад',
      TRUE,  'GENERAL', NULL, NULL, NULL, NULL),
  -- TASK: нові завдання в проєктах
  (11, 'Нове завдання «Волонтер сцени на фестивалі» очікує виконавця',
      TRUE,  'TASK', NULL, NULL, 11, NULL),
  -- WARNING: системне попередження від адміна
  (1, 'Увага адміністратора: обліковий запис Романа Кривоноса заблоковано за порушення правил',
      FALSE, 'WARNING', NULL, 41, NULL, NULL),
  -- MEMBER LEFT: волонтер покинув організацію (демо нової фічі — нотифікація при виході)
  (1, 'Дарина Рябець покинув(ла) вашу організацію',
      FALSE, 'GENERAL', NULL, 22, NULL, NULL);

-- ============================================================================
-- REPORT (10 звітів організацій)
-- ============================================================================
INSERT INTO report (id, organization_profile_id, project_id, title, type, file_url, published_at, description) VALUES
  (1,  1, NULL,
      'Rescue Львів — Фінансовий звіт за 2025 рік',
      'FINANCIAL', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448895/hand-and-hand/documents/reports/seed-report-01.pdf',
      NOW() - INTERVAL '60 days',
      'Загальний бюджет: 847 200 грн. Джерела: донати (68%), гранти (24%), партнери (8%). Витрати: ветеринарні послуги 42%, корм та витратні матеріали 31%, логістика 15%, адміністрування 12%.'),
  (2,  1,  1,
      'Звіт проєкту «Вигул собак у центрі адопції Львова» (Q1 2025)',
      'RESULT', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448896/hand-and-hand/documents/reports/seed-report-02.pdf',
      NOW() - INTERVAL '45 days',
      'Проведено 12 прогулянок, залучено 47 волонтерів, соціалізовано 89 собак. 14 тварин після прогулянок знайшли домівку протягом 30 днів.'),
  (3,  2, NULL,
      'EcoKyiv — Звіт діяльності за квітень 2025',
      'ACTIVITY', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448897/hand-and-hand/documents/reports/seed-report-03.pdf',
      NOW() - INTERVAL '22 days',
      'Квітень: 4 еко-суботники, 63 волонтери, зібрано 2.4 тонни сміття, висаджено 200 саджанців, проведено 8 еко-уроків у школах (1200 учнів).'),
  (4,  2,  3,
      'Звіт прибирання берегів Дніпра (весна 2025)',
      'RESULT', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448898/hand-and-hand/documents/reports/seed-report-04.pdf',
      NOW() - INTERVAL '15 days',
      'Очищено 3.2 км берегової лінії, вилучено 860 кг сміття (з них 64% пластик, 18% скло), залучено 38 волонтерів, 4 організації-партнери.'),
  (5,  3, NULL,
      'ВетеранUA — Фінансовий звіт за 2024 рік',
      'FINANCIAL', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448899/hand-and-hand/documents/reports/seed-report-05.pdf',
      NOW() - INTERVAL '90 days',
      'Видатки 2024: реабілітація 35%, психологічна підтримка 28%, навчання та перекваліфікація 22%, адміністрування 15%. Охоплено 412 ветеранів та членів їхніх сімей.'),
  (6,  4,  5,
      'Звіт курсу тактичної медицини (1-й потік, лютий 2025)',
      'RESULT', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448900/hand-and-hand/documents/reports/seed-report-06.pdf',
      NOW() - INTERVAL '20 days',
      'Пройшли підготовку 28 цивільних (з 30 записаних). Рівень засвоєння MARCH-алгоритму: 94%. 100% учасників самостійно наклали турнікет за < 30 сек. Партнери: Центр такмеду Пульс, Нацгвардія.'),
  (7,  14, 16,
      'Звіт акції з плетіння маскувальних сіток (квітень 2025)',
      'ACTIVITY', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448901/hand-and-hand/documents/reports/seed-report-07.pdf',
      NOW() - INTERVAL '10 days',
      'Виготовлено 47 сіток 3×6 м, задіяно 62 волонтери на 6 сесіях. Все передано підрозділам ЗСУ на Харківському напрямку через офіційні канали.'),
  (8,  16, 20,
      'Звіт безкоштовних психологічних консультацій (Q1 2025)',
      'RESULT', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448902/hand-and-hand/documents/reports/seed-report-08.pdf',
      NOW() - INTERVAL '14 days',
      'Проведено 148 індивідуальних консультацій. Клієнти: ветерани 58%, переселенці 27%, члени сімей 15%. Середня оцінка сесії: 4.8/5.'),
  (9,  1, NULL,
      'Rescue Львів — Підсумковий звіт програми ОSK за 2024 рік',
      'OTHER', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448902/hand-and-hand/documents/reports/seed-report-09.pdf',
      NOW() - INTERVAL '120 days',
      'Програма «Відловити-Стерилізувати-Повернути»: стерилізовано 510 котів у 8 районах Львова, рецидивів після повернення 0%. Рекомендація ВООЗ підтверджена практикою.'),
  (10, 11, 26,
      'Звіт майстер-класу з писанкарства Полісся (лютий 2025)',
      'ACTIVITY', 'https://res.cloudinary.com/dkgehvvxf/image/upload/v1779448904/hand-and-hand/documents/reports/seed-report-10.pdf',
      NOW() - INTERVAL '5 days',
      'Учасників: 34. Вік: 8–72 роки. Виготовлено 120 писанок, 3 майстри народного мистецтва провели майстер-клас. Партнер: Житомирська ОДА.');

SELECT setval('report_id_seq', (SELECT MAX(id) FROM report));

-- ============================================================================
-- TASK: завдання для проєктів 16–29
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
  (22, NULL, -50,  'SPEND', 'Обмін балів на Стікерпак Hand&Hand (reward #1)'),
  (5,  NULL, -20,  'SPEND', 'Обмін балів на Сертифікат подяки (reward #4)'),
  (25, NULL, -200, 'SPEND', 'Обмін балів на Футболку Hand&Hand (reward #2)'),
  (24, NULL, -100, 'SPEND', 'Обмін балів на Кружку Hand&Hand (reward #3)'),
  -- BONUS: адмін додає бонусні бали
  (4,  NULL, 50, 'BONUS',  'Адмін-бонус: виключна організаційна робота на 5 проєктах поспіль'),
  (18, NULL, 30, 'BONUS',  'Адмін-бонус: найкращий волонтер місяця (квітень 2025)'),
  (25, NULL, 40, 'BONUS',  'Адмін-бонус: технічна підтримка платформи (міграція БД)'),
  -- PENALTY: адмін знімає бали
  (29, NULL, -20, 'PENALTY', 'Штраф: відмова від проєкту менш ніж за 24 год (project #3)'),
  (30, NULL, -10, 'PENALTY', 'Штраф: скасування реєстрації двічі поспіль без пояснення'),
  -- ADJUSTMENT: коригування помилки
  (5,  NULL, 5, 'ADJUSTMENT', 'Корекція помилкового нарахування від 2025-03-15');

-- Синхронізація points відповідно до нових транзакцій
UPDATE app_user AS u
SET points = u.points + v.delta
FROM (VALUES
  (4,   50),  -- BONUS
  (22, -50),  -- SPEND
  (21,  45),  -- EARN: task #14 + task #22
  (26,  10),  -- EARN: task #15
  (25, -145), -- EARN + SPEND + BONUS
  (5,  -15),  -- SPEND + ADJUSTMENT
  (24, -100), -- SPEND
  (18,  30),  -- BONUS
  (29, -20),  -- PENALTY
  (30, -10)   -- PENALTY
) AS v(id, delta)
WHERE u.id = v.id;

-- Балансувальні ADJUSTMENT-транзакції: зводять суму points_transaction із app_user.points
INSERT INTO points_transaction (user_id, task_assignment_id, amount, type, reason) VALUES
  (4,  NULL, 40,  'ADJUSTMENT', 'Коригування підсумкового балансу за результатами звірки'),
  (19, NULL, 50,  'ADJUSTMENT', 'Коригування підсумкового балансу за результатами звірки'),
  (21, NULL, 80,  'ADJUSTMENT', 'Коригування підсумкового балансу за результатами звірки'),
  (22, NULL, 20,  'ADJUSTMENT', 'Коригування підсумкового балансу за результатами звірки'),
  (24, NULL, 145, 'ADJUSTMENT', 'Коригування підсумкового балансу за результатами звірки'),
  (25, NULL, 100, 'ADJUSTMENT', 'Коригування підсумкового балансу за результатами звірки'),
  (27, NULL, 55,  'ADJUSTMENT', 'Коригування підсумкового балансу за результатами звірки'),
  (28, NULL, 45,  'ADJUSTMENT', 'Коригування підсумкового балансу за результатами звірки');

-- ============================================================================
-- NOTIFICATION: нові сповіщення для користувачів
-- ============================================================================
INSERT INTO notification (user_id, message, is_read, type) VALUES
  -- Нові учасники проєктів
  (18, 'Вашу заявку на подію «Тренінг з домедичної допомоги» прийнято.',      FALSE, 'PROJECT'),
  (27, 'Вас прийнято до проєкту «Юридичні консультації для ВПО».',            FALSE, 'PROJECT'),
  (22, 'Вашу заявку на подію «Безкоштовна секція футболу» прийнято.',         TRUE,  'PROJECT'),
  -- Задачі
  (21, 'Завдання #14 «Підготовка матеріалів» позначено як виконане. +15 балів.', FALSE, 'TASK'),
  (26, 'Завдання #15 «Листи підтримки» позначено як виконане. +10 балів.',    FALSE, 'TASK'),
  (25, 'Завдання #23 «Технічна підтримка» позначено як виконане. +15 балів.', FALSE, 'TASK'),
  -- Нагороди / Бали
  (4,  'Ви отримали 50 бонусних балів за якісну координацію подій.',          FALSE, 'REWARD'),
  (18, 'Ви отримали 30 бонусних балів за стабільну участь у волонтерських програмах.', FALSE, 'REWARD'),
  (25, 'Ви успішно обміняли 200 балів на Футболку Hand&Hand.',                TRUE,  'REWARD'),
  -- Попередження
  (29, 'Ви отримали попередження за скасування участі у проєкті менш ніж за 24 год.', FALSE, 'WARNING'),
  (30, 'На ваш обліковий запис видано попередження. Перегляньте деталі.',     FALSE, 'WARNING'),
  (41, 'Ваш обліковий запис заблоковано. Зверніться до підтримки.',           FALSE, 'WARNING'),
  -- Вступ до організації
  (4,  'Вас прийнято до організації «Rescue Львів».',                         FALSE, 'GENERAL'),
  (18, 'Вас прийнято до організації «ВетеранUA».',                            FALSE, 'GENERAL'),
  (19, 'ОсвітаПлюс запрошує вас стати членом організації.',                   TRUE,  'GENERAL'),
  (20, 'Вашу заявку до організації «Рука Допомоги» прийнято.',                FALSE, 'GENERAL'),
  -- Нові реєстрації
  (42, 'Дякуємо за реєстрацію в Hand&Hand. Підтвердіть email для активації.', FALSE, 'GENERAL');

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
-- ДЕМО-ПОЛІРУВАННЯ: фінальні стримані тексти і професійні демо-дані
-- ============================================================================

UPDATE admin_profile
SET full_name = 'Адміністратор платформи'
WHERE id = 1;

UPDATE app_user AS u
SET
  first_name = v.first_name,
  last_name = v.last_name
FROM (VALUES
  (1,  'Адміністратор', 'Платформи'),
  (2,  'Олена',         'Кравчук'),
  (3,  'Ігор',          'Шевченко'),
  (4,  'Анна',          'Шимчук'),
  (5,  'Петро',         'Іваненко'),
  (6,  'Марія',         'Бойко'),
  (7,  'Денис',         'Гнатюк'),
  (8,  'Марина',        'Савченко'),
  (9,  'Андрій',        'Бойко'),
  (10, 'Оксана',        'Мельник'),
  (11, 'Сергій',        'Коваль'),
  (12, 'Ірина',         'Ткаченко'),
  (13, 'Олег',          'Романюк'),
  (14, 'Наталія',       'Сидоренко'),
  (15, 'Тарас',         'Литвин'),
  (16, 'Світлана',      'Мороз'),
  (17, 'Дмитро',        'Остапенко'),
  (18, 'Софія',         'Купрій'),
  (19, 'Микола',        'Скляр'),
  (20, 'Оксана',        'Самусь'),
  (21, 'Іван',          'Хмара'),
  (22, 'Дарина',        'Рябець'),
  (23, 'Роман',         'Вишиванюк'),
  (24, 'Юлія',          'Дрофань'),
  (25, 'Богдан',        'Ластовецький'),
  (26, 'Анастасія',     'Буряк'),
  (27, 'Андрій',        'Марченко'),
  (28, 'Ольга',         'Чечіль'),
  (29, 'Василь',        'Полтавець'),
  (30, 'Тетяна',        'Жайворон'),
  (31, 'Сергій',        'Оберемок'),
  (32, 'Галина',        'Ткаченко'),
  (33, 'Юрій',          'Клименко'),
  (34, 'Олена',         'Яремченко'),
  (35, 'Ростислав',     'Приймак'),
  (36, 'Тетяна',        'Гордієнко'),
  (37, 'Вадим',         'Стецюк'),
  (38, 'Зоя',           'Науменко'),
  (39, 'Олексій',       'Лещенко'),
  (40, 'Катерина',      'Салова'),
  (41, 'Роман',         'Кривоніс'),
  (42, 'Людмила',       'Острик'),
  (43, 'Станіслав',     'Моргун')
) AS v(id, first_name, last_name)
WHERE u.id = v.id;

UPDATE volunteer_profile AS vp
SET
  display_name = v.display_name,
  bio = v.bio,
  skills_text = v.skills_text
FROM (VALUES
  (1,  'Анна Шимчук',        'Координує волонтерські команди, логістику та складський облік для гуманітарних ініціатив у Львові.',                     'Координація, логістика, складський облік, комунікація'),
  (2,  'Петро Іваненко',     'Допомагає громадським організаціям із веб-сервісами, автоматизацією процесів та технічною підтримкою.',                  'Web-розробка, автоматизація, технічна підтримка'),
  (3,  'Софія Купрій',       'Психологиня-волонтерка, проводить індивідуальні консультації та групові заняття для людей у кризових обставинах.',       'Психологічна підтримка, фасилітація, групова робота'),
  (4,  'Микола Скляр',       'Фахівець з ремонтних робіт, бере участь у відновленні житла та облаштуванні доступних просторів.',                      'Будівництво, ремонт, монтаж, технічна підтримка'),
  (5,  'Оксана Самусь',      'Медична сестра, підтримує виїзні прийоми, навчання з домедичної допомоги та координацію пацієнтів.',                    'Медицина, домедична допомога, реєстрація пацієнтів'),
  (6,  'Іван Хмара',         'Юрист-волонтер, консультує ВПО та ветеранські родини щодо документів, соціальних виплат і трудових прав.',              'Юридичні консультації, документи, права ВПО'),
  (7,  'Дарина Рябець',      'Викладачка англійської, допомагає з освітніми програмами для дітей і дорослих.',                                         'Освіта, іноземні мови, менторство'),
  (8,  'Роман Вишиванюк',    'Логіст, координує доставку гуманітарних вантажів та роботу з партнерами у регіонах.',                                   'Логістика, водіння, маршрутне планування'),
  (9,  'Юлія Дрофань',       'Фотографиня та дизайнерка, документує волонтерські події, готує матеріали для звітів і комунікацій.',                  'Фотографія, дизайн, SMM, звітність'),
  (10, 'Богдан Ластовецький','Розробник повного циклу, підтримує цифрові сервіси благодійних організацій.',                                             'IT, веб-розробка, бази даних, автоматизація'),
  (11, 'Анастасія Буряк',    'Тренерка з командної взаємодії, проводить навчання для координаторів і волонтерів.',                                     'Фасилітація, тренінги, командна робота'),
  (12, 'Андрій Марченко',    'Водій-волонтер, допомагає з евакуаційними рейсами та доставкою допомоги.',                                                'Водіння, евакуація, гуманітарна логістика'),
  (13, 'Ольга Чечіль',       'Перекладачка і редакторка, готує українські, англійські та німецькі матеріали для громадських організацій.',              'Переклад, редактура, копірайтинг'),
  (14, 'Зоя Науменко',       'Волонтерка у сфері захисту тварин, допомагає з перетримкою, транспортуванням та соціалізацією тварин.',                  'Захист тварин, перетримка, координація'),
  (15, 'Олексій Лещенко',    'Будівельник-волонтер, долучається до ремонтів соціальних просторів і встановлення пандусів.',                            'Будівництво, зварювання, монтаж'),
  (16, 'Катерина Салова',    'Педагогиня початкових класів, проводить заняття для дітей ВПО та допомагає з освітніми подіями.',                       'Педагогіка, робота з дітьми, арттерапія')
) AS v(id, display_name, bio, skills_text)
WHERE vp.id = v.id;

UPDATE organization_profile AS op
SET
  description = v.description,
  mission = v.mission
FROM (VALUES
  (1,  'Волонтерське об''єднання, що допомагає безпритульним і евакуйованим тваринам: лікування, перетримка, адопція та просвітницькі події.',      'Системна допомога тваринам і розвиток відповідального ставлення у громаді.'),
  (2,  'Громадська організація, що координує прибирання, сортування відходів, екопросвіту та відновлення міських зелених зон у Києві.',              'Чисте міське середовище через участь мешканців, бізнесу та місцевої влади.'),
  (3,  'Організація підтримує ветеранів і їхні родини через психологічні програми, правові консультації, навчання та працевлаштування.',             'Допомогти ветеранам повернутися до активного цивільного життя.'),
  (4,  'Медична благодійна ініціатива для ВПО, маломобільних людей та громад із обмеженим доступом до лікарів.',                                     'Наближати базову медичну допомогу до людей, які не можуть отримати її самостійно.'),
  (5,  'Освітня організація, що проводить безкоштовні курси, тренінги та менторські програми для дітей і дорослих.',                                'Дати людям практичні знання для навчання, роботи та щоденного життя.'),
  (6,  'Спортивна ініціатива для дітей, молоді та людей з інвалідністю, яка поєднує тренування, реабілітацію та командну підтримку.',                'Розвивати доступний спорт як інструмент здоров''я та соціалізації.'),
  (7,  'Організація координує продуктові, гігієнічні та побутові набори для родин у складних життєвих обставинах.',                                  'Швидко закривати базові потреби людей у кризових ситуаціях.'),
  (8,  'Команда проводить освітні, творчі та підтримувальні програми для дітей ВПО та родин у кризових обставинах.',                                'Створювати безпечний простір розвитку для дітей, які пережили вимушений переїзд.'),
  (9,  'Благодійна кухня і логістична команда, що забезпечує гаряче харчування та продуктові набори для літніх людей і людей без житла.',            'Забезпечувати регулярне харчування для людей, які не можуть подбати про це самостійно.'),
  (10, 'Команда ремонтує житло, соціальні простори та об''єкти доступності для постраждалих родин і громад.',                                        'Відновлювати безпечні умови життя після руйнувань і криз.'),
  (11, 'Культурна організація зберігає традиційну музику, ремесла та локальну спадщину через відкриті події й майстер-класи.',                      'Передавати культурну спадщину через практичну участь громади.'),
  (12, 'Соціальний центр надає нічліг, одяг, харчування, гігієнічну підтримку та супровід людям без житла.',                                        'Надати людині базову безпеку і шлях до відновлення документів та соціальних зв''язків.'),
  (13, 'Організація допомагає внутрішньо переміщеним особам з документами, консультаціями, інтеграцією та доступом до послуг.',                     'Підтримувати ВПО на етапі адаптації у новій громаді.'),
  (14, 'Волонтерська організація підтримує підрозділи ЗСУ матеріалами, логістикою, листами підтримки та допомогою родинам військових.',             'Організована тилова підтримка військових і їхніх сімей.'),
  (15, 'Організація працює над доступністю громадських просторів, правовою підтримкою та освітніми програмами для людей з інвалідністю.',           'Робити міське середовище доступним і зрозумілим для всіх.'),
  (16, 'Психологічна служба для ветеранів, ВПО та родин загиблих, що проводить консультації, групи підтримки та кризові інтервенції.',              'Надати професійну психологічну підтримку людям після травматичного досвіду.'),
  (17, 'Молодіжний простір у Харкові для навчання, волонтерства, дебатів, стажувань та громадських проєктів.',                                      'Допомогти молоді реалізовувати корисні ініціативи у своїй громаді.'),
  (18, 'Екологічна ініціатива Одеси, що займається очищенням узбережжя, сортуванням відходів і просвітою мешканців.',                              'Захищати прибережні екосистеми через регулярні дії громади.'),
  (19, 'Освітня ініціатива з безпеки дітей та батьків, що потребує доопрацювання документів для верифікації на платформі.',                         'Підготувати якісні програми цивільної безпеки для шкіл і родин.')
) AS v(id, description, mission)
WHERE op.id = v.id;

UPDATE project AS p
SET
  title = v.title,
  description = v.description,
  main_content = v.main_content,
  what_volunteers_will_do = v.what_volunteers_will_do,
  why_its_important = v.why_its_important,
  partners = v.partners
FROM (VALUES
  (1,  'Вигул собак у центрі адопції Львова', 'Потрібні волонтери для регулярного вигулу собак і допомоги працівникам центру адопції.', 'Центр адопції планує суботню зміну для соціалізації тварин. Волонтери отримають інструктаж, маршрут прогулянки та контакт координатора.', 'Вигулювати собак за визначеним маршрутом, дотримуватися правил безпеки, повідомляти координатора про стан тварин.', 'Регулярні прогулянки знижують стрес тварин і підвищують їхні шанси на адопцію.', 'ЛКП Лев, ветеринарні партнери'),
  (2,  'Сортування гуманітарного вантажу для центру адопції', 'Потрібна команда для прийому, сортування та обліку кормів, лежаків і ветеринарних матеріалів.', 'На склад прибуває гуманітарний вантаж для тварин, евакуйованих із прифронтових громад. Завдання поділені на зони прийому, перевірки, маркування та розміщення.', 'Розвантажувати коробки, перевіряти маркування, вести облік, складати товари за категоріями.', 'Швидке сортування дозволяє центру без затримок передати корм і матеріали тваринам на перетримці.', 'Європейські донори, локальні перевізники'),
  (3,  'Прибирання берегів річки Либідь', 'Організовуємо толоку для очищення берегової зони та сортування зібраних відходів.', 'EcoKyiv проводить планове прибирання ділянки річки Либідь із подальшою передачею пластику, скла та металу на переробку.', 'Збирати відходи, сортувати фракції, допомагати з логістикою мішків і фотофіксацією результатів.', 'Регулярне очищення берегів зменшує потрапляння сміття у воду та формує сталі екологічні практики.', 'КП Плесо, районна адміністрація'),
  (4,  'Озеленення території школи №125', 'Висаджуємо дерева та облаштовуємо навчальну зелену зону на шкільному подвір''ї.', 'Проєкт передбачає підготовку ґрунту, висадку дерев, встановлення опор і передачу школі плану догляду за насадженнями.', 'Готувати лунки, висаджувати дерева, встановлювати кілки, прибирати територію після робіт.', 'Зелена зона покращить мікроклімат подвір''я і стане практичним майданчиком для екологічної освіти.', 'Школа №125, батьківський комітет'),
  (5,  'Тренінг з домедичної допомоги для цивільних', 'Проводимо практичне навчання з базових дій до прибуття медиків.', 'МедДопомога організовує тренінг для мешканців громади: зупинка кровотечі, стабільне положення, виклик допомоги та безпечна комунікація.', 'Допомагати інструкторам, готувати матеріали, реєструвати учасників і підтримувати порядок у навчальній зоні.', 'Базові навички домедичної допомоги підвищують шанси людини дочекатися професійної медичної допомоги.', 'Червоний Хрест, медичні інструктори'),
  (6,  'Сортування теплого одягу для родин ВПО', 'Потрібні волонтери для перевірки, маркування та розміщення теплого одягу на складі.', 'Rescue Львів передає частину складських потужностей для гуманітарного сортування. Одяг розподілять за розмірами, сезоном і станом.', 'Перевіряти стан речей, сортувати за категоріями, оновлювати складський облік, готувати набори до видачі.', 'Добре організований склад допомагає родинам швидко отримувати потрібні речі без черг і втрат.', 'Міський гуманітарний штаб'),
  (7,  'Виїзний медичний прийом у громадах Тернопільщини', 'Команда медиків і волонтерів проведе базові консультації у селах із обмеженим доступом до лікарів.', 'Плануються огляди терапевта, вимірювання тиску, ЕКГ за показами та консультації щодо подальшого лікування.', 'Реєструвати пацієнтів, координувати чергу, допомагати з анкетами, супроводжувати людей до кабінетів.', 'Виїзні прийоми дозволяють виявити ризики для здоров''я у людей, які рідко можуть доїхати до лікарні.', 'Місцеві амбулаторії, сімейні лікарі'),
  (8,  'Екоосвіта для мешканців багатоквартирних будинків', 'Проводимо практичну зустріч про сортування, компостування та зменшення побутових відходів.', 'EcoKyiv готує відкритий воркшоп для ОСББ із прикладами контейнерів, маршрутами переробки та рекомендаціями для будинків.', 'Зустрічати учасників, роздавати матеріали, допомагати з демонстраційною зоною, збирати питання для експертів.', 'Коли мешканці розуміють, як працює сортування, будинок може стабільно зменшувати обсяг змішаних відходів.', 'Асоціація ОСББ Києва'),
  (9,  'Ремонт вольєрів у центрі тимчасової перетримки', 'Оновлюємо покриття, дверцята та дренаж у вольєрах перед сезоном дощів.', 'Команда проведе технічний огляд вольєрів, дрібний ремонт, заміну пошкоджених елементів і прибирання території.', 'Допомагати майстрам, переносити матеріали, фарбувати, прибирати будівельні залишки.', 'Безпечні вольєри зменшують ризик травм і хвороб у тварин, які очікують на адопцію.', 'Ветеринарні партнери'),
  (10, 'Арттерапевтична програма для дітей ВПО', 'Проводимо заняття з творчої підтримки для дітей, які пережили вимушений переїзд.', 'Програма складається з малювання, роботи з глиною і коротких групових вправ під супроводом психолога.', 'Готувати матеріали, допомагати дітям під час занять, підтримувати порядок і працювати за інструкціями психолога.', 'Творчі заняття допомагають дітям безпечно виражати емоції і поступово адаптуватися до нового середовища.', 'Дитячі психологи, освітній центр'),
  (11, 'Фестиваль традиційної музики та ремесел', 'Відкрита подія з майстер-класами, виступами та презентацією локальних культурних ініціатив.', 'Культурна ДНК проводить фестиваль для громади з фокусом на традиційні інструменти, спів і ремесла.', 'Допомагати з реєстрацією, навігацією гостей, підготовкою локацій і збором зворотного зв''язку.', 'Культурні події підтримують локальну ідентичність і залучають громаду до збереження спадщини.', 'Обласний центр народної творчості'),
  (12, 'Підготовка нічліжки до зимового сезону', 'Потрібна допомога з облаштуванням спальних місць, сортуванням одягу та перевіркою запасів.', 'Дах і Тепло готує приміщення до збільшеного зимового навантаження: ліжка, постіль, теплий одяг і графік чергувань.', 'Сортувати речі, розставляти меблі, маркувати набори, допомагати координатору з обліком.', 'Підготовлена нічліжка забезпечує людям без житла тепле і безпечне місце у холодний період.', 'Соціальні служби Харкова'),
  (13, 'Юридичні консультації для ВПО', 'Щомісячна юридична приймальня з питань документів, соціальних виплат і трудових прав.', 'Переселенці Разом запрошує юристів і волонтерів-реєстраторів для консультаційного дня.', 'Реєструвати відвідувачів, допомагати з копіями документів, координувати чергу до юристів.', 'Правова підтримка допомагає ВПО швидше отримувати послуги, виплати та відновлювати документи.', 'Центр безоплатної правової допомоги'),
  (14, 'Прибирання берегової зони Дніпра', 'Планова екологічна акція на Трухановому острові з сортуванням і вивезенням відходів.', 'Команди працюватимуть на кількох ділянках берегової лінії, збиратимуть відходи і передаватимуть вторсировину на переробку.', 'Збирати відходи, сортувати фракції, допомагати координаторам бригад, дотримуватися техніки безпеки.', 'Чисті береги зменшують забруднення води і роблять рекреаційні зони безпечнішими для громади.', 'КП Плесо, переробні компанії'),
  (15, 'Виїзний день адопції у Тернополі', 'Rescue Львів проводить зустріч із тваринами, готовими до адопції, та консультації для майбутніх опікунів.', 'Команда привезе вакцинованих тварин, проведе консультації щодо догляду і оформить заявки на відповідальну адопцію.', 'Допомагати з навігацією гостей, доглядом за тваринами, анкетами та консультаційною зоною.', 'Виїзні події допомагають тваринам знайти сім''ї поза межами одного міста.', 'Тернопільський центр адопції'),
  (16, 'Плетіння маскувальних сіток для підрозділів ЗСУ', 'Щотижнева волонтерська сесія з підготовки маскувальних сіток за запитами підрозділів.', 'Армія Змін організовує роботу на рамах, підготовку матеріалів, контроль якості та передачу готових сіток перевіреним контактам.', 'Нарізати тканину, плести сітки, перевіряти якість, пакувати й маркувати готові вироби.', 'Маскувальні матеріали допомагають підрозділам зменшувати видимість позицій і техніки.', 'Волонтерський центр Серце'),
  (17, 'Пакування листів і посилок підтримки для військових', 'Готуємо листи, малюнки та невеликі корисні набори для військових підрозділів.', 'Подія має чіткий список дозволених речей, облік коробок і маршрут передачі через волонтерську логістику.', 'Сортувати листи, пакувати набори, вести облік, допомагати з відправленням.', 'Такі посилки підтримують моральний стан військових і показують системну участь громади.', 'Мережа шкіл Києва, Укрпошта'),
  (18, 'Аудит та встановлення пандусів у громадських будівлях', 'Команда допоможе з аудитом доступності та монтажем базових елементів безбар''єрного входу.', 'Без Бар''єрів працює з переліком об''єктів, погоджених із власниками приміщень і фахівцями з доступності.', 'Проводити заміри, допомагати з монтажем, прибирати після робіт, робити фотофіксацію.', 'Доступний вхід дає людям з інвалідністю реальну можливість користуватися послугами громади.', 'Львівська міська рада, консультанти з доступності'),
  (19, 'Базовий курс української жестової мови', 'Відкритий воркшоп для працівників сервісних служб, волонтерів і всіх охочих.', 'Учасники вивчать базові жести для привітання, навігації, запиту допомоги та роботи з документами.', 'Реєструвати учасників, допомагати з технікою, готувати друковані матеріали, збирати відгуки.', 'Базова комунікація жестовою мовою робить послуги доступнішими для людей з порушеннями слуху.', 'Українське товариство глухих'),
  (20, 'Координація психологічних консультацій для ветеранів', 'Потрібні волонтери для адміністративної підтримки індивідуальних консультацій.', 'Простір Підтримки проводить консультації офлайн і онлайн, а волонтери допомагають із записом, нагадуваннями та технічною підтримкою.', 'Вести реєстрацію, нагадувати про зустрічі, допомагати із підключенням, підтримувати конфіденційність.', 'Адміністративна підтримка зменшує кількість пропущених консультацій і робить сервіс стабільним.', 'Психологи-партнери, ветеранські центри'),
  (21, 'Групова арттерапія для переселенців і ветеранів', 'Щотижнева група підтримки з творчими практиками під супроводом фахівця.', 'Заняття проводяться у малих групах із попередньою реєстрацією, правилами конфіденційності та добровільною участю.', 'Готувати матеріали, організовувати простір, допомагати ведучому, прибирати після заняття.', 'Групові практики допомагають учасникам відновлювати довіру та соціальні контакти.', 'Сертифіковані арттерапевти'),
  (22, 'Футбольна секція для дітей ВПО', 'Безкоштовні тренування для дітей 7-14 років із супроводом тренера і волонтерів.', 'СпортДух відкриває регулярну секцію, де форма, м''ячі й тренерська підтримка надаються безкоштовно.', 'Допомагати з реєстрацією, супроводом дітей, обліком відвідуваності та базовою безпекою.', 'Регулярний спорт допомагає дітям адаптуватися, знайти друзів і підтримувати фізичне здоров''я.', 'ДЮСШ №3 Запоріжжя'),
  (23, 'Адаптивний спорт для людей з інвалідністю', 'Тренування з адаптивного баскетболу і настільного тенісу з урахуванням потреб учасників.', 'Заняття проводять тренери з досвідом адаптивного спорту, а волонтери допомагають з обладнанням і навігацією.', 'Готувати майданчик, допомагати з інвентарем, страхувати учасників за інструкцією тренера.', 'Доступний спорт підтримує реабілітацію, впевненість і соціальну участь людей з інвалідністю.', 'Паралімпійський осередок громади'),
  (24, 'Доставка продуктів і ліків літнім людям', 'Формуємо та доставляємо адресні набори людям, які не можуть самостійно дістатися магазину чи аптеки.', 'Їжа та Турбота працює за перевіреним списком отримувачів від соціальних служб і сімейних лікарів.', 'Збирати набори, перевіряти адреси, завантажувати авто, передавати пакунки за актом отримання.', 'Адресна доставка закриває базові потреби людей із низькою мобільністю.', 'Соціальні служби Вінниці'),
  (25, 'Практикум цифрових сервісів для літніх людей', 'Навчаємо користуватися Дією, онлайн-записом до лікаря та базовими сервісами смартфона.', 'ОсвітаПлюс проводить невеликі групові заняття з індивідуальною допомогою під час налаштування застосунків.', 'Допомагати учасникам із телефонами, пояснювати кроки, перевіряти підключення та нотувати питання.', 'Цифрові навички дають літнім людям більше самостійності у доступі до послуг.', 'Бібліотека громади, ЦНАП'),
  (26, 'Майстер-клас з традиційного писанкарства', 'Культурна подія для дітей і дорослих із майстрами народного мистецтва.', 'Учасники дізнаються про традиційні орнаменти, техніки та безпечно працюватимуть із матеріалами під наглядом майстрів.', 'Готувати столи, матеріали, зустрічати учасників, допомагати майстрам і прибирати після події.', 'Практичні майстер-класи допомагають зберігати нематеріальну культурну спадщину.', 'Обласний центр народної творчості'),
  (27, 'Група психологічної підтримки для ветеранів', 'Закрита група з регулярними зустрічами, модерацією психолога та правилами конфіденційності.', 'ВетеранUA формує малу групу, де учасники зможуть обговорювати адаптацію, родинні стосунки та повернення до роботи.', 'Вести журнал відвідуваності, нагадувати про зустрічі, допомагати з організацією простору.', 'Підтримка у групі зменшує ізоляцію та допомагає людям утримувати контакт із фаховою допомогою.', 'Психологи ветеранських центрів'),
  (28, 'Мобільний пункт допомоги людям без житла', 'Видача гарячого харчування, одягу, гігієнічних наборів і консультацій соціального працівника.', 'Дах і Тепло запускає мобільний пункт на маршруті з найбільшою потребою за даними соціальних служб.', 'Роздавати набори, вести облік, допомагати з навігацією до соціальних послуг, підтримувати порядок.', 'Мобільна допомога досягає людей, які не приходять до стаціонарних центрів.', 'Соціальні служби Харкова'),
  (29, 'Виїзна вакцинація у прифронтових громадах', 'Медична бригада проведе вакцинацію та базові консультації у селах із обмеженим доступом до амбулаторій.', 'МедДопомога працює за погодженим маршрутом, з холодовим ланцюгом і попереднім списком пацієнтів.', 'Реєструвати пацієнтів, допомагати з формами, координувати чергу, підтримувати інформаційну зону.', 'Виїзна вакцинація зменшує ризики інфекцій у громадах із порушеною медичною інфраструктурою.', 'Сімейні лікарі, громади району'),
  (30, 'Нічний моніторинг безпритульних тварин', 'Пілотний проєкт для виявлення травмованих або хворих тварин у нічний час.', 'Команда працюватиме малими групами за погодженими маршрутами та передаватиме тварин до цілодобової клініки за потреби.', 'Супроводжувати координатора, фіксувати локації, допомагати із транспортуванням за інструкцією.', 'Нічний моніторинг дозволяє швидше реагувати на випадки, які не видно у денний час.', 'Цілодобова ветеринарна клініка'),
  (31, 'Озеленення дворів для ветеранських родин', 'EcoKyiv разом з ОСББ облаштовує невеликі зелені зони у дворах, де мешкають ветеранські родини.', 'Проєкт передбачає посадку багаторічних рослин, простий план догляду та залучення мешканців будинку.', 'Готувати ґрунт, висаджувати рослини, встановлювати бордюри, передавати інструкції з догляду.', 'Доглянуті спільні простори підтримують взаємодію сусідів і роблять двори комфортнішими.', 'Асоціація ОСББ Києва'),
  (32, 'Школа підприємництва для ветеранів', 'Безкоштовний інтенсив із базового планування власної справи, фінансів і юридичного оформлення.', 'ВетеранUA готує навчальну програму з менторами, практичними завданнями та консультаціями після завершення курсу.', 'Допомагати з реєстрацією, матеріалами, таймінгом занять і комунікацією з учасниками.', 'Підприємницькі навички допомагають ветеранам відновлювати професійну траєкторію та економічну самостійність.', 'Ветеранські бізнес-ментори')
) AS v(id, title, description, main_content, what_volunteers_will_do, why_its_important, partners)
WHERE p.id = v.id;

UPDATE news AS n
SET
  title = v.title,
  description = v.description,
  main_content = v.main_content
FROM (VALUES
  (1,  'Rescue Львів: підсумки програми допомоги тваринам за 2025 рік', 'Організація опублікувала річні результати лікування, перетримки та адопції тварин.', 'За 2025 рік команда Rescue Львів надала допомогу 320 тваринам, організувала 210 адопцій і провела 510 стерилізацій. Окремий розділ звіту присвячений витратам на лікування, корм і логістику.'),
  (2,  'EcoKyiv висадив 200 дерев у парках Києва', 'Команда завершила весняний марафон озеленення та передала громадам карту нових насаджень.', 'Під час чотирьох акцій волонтери висадили 200 саджанців дуба, липи, декоративної яблуні та клена. Кожне дерево отримало GPS-мітку, щоб мешканці могли долучатися до догляду й відстежувати стан насаджень.'),
  (3,  'Rescue Львів шукає IT-волонтерів для системи обліку', 'Команді потрібна допомога з розробкою веб-системи для обліку тварин, лікування та адопцій.', 'Планується створити картки тварин, статуси лікування, фільтри для адопції та внутрішній журнал догляду. Очікуване навантаження для волонтерів: кілька годин на тиждень.'),
  (4,  'Rescue Львів отримав грант на хірургічний блок', 'Партнерський фонд профінансує обладнання для ветеринарного блоку в центрі перетримки.', 'Організація підписала договір про цільове фінансування хірургічного обладнання, цифрового рентгену та ізолятора для інфекційних випадків. Грант покриває обладнання, а поточні потреби в кормі та догляді фінансуються окремими зборами.'),
  (5,  'EcoKyiv встановив еко-бокси у 15 школах Києва', 'Школи отримали трисекційні контейнери та методичні матеріали для роздільного збору відходів.', 'Перший етап освітнього проєкту охопив 3000 учнів. Волонтери провели екоуроки, передали школам інструкції щодо регулярного вивезення вторсировини та допомогли налаштувати облік заповнення контейнерів.'),
  (6,  'МедДопомога запустила гарячу лінію психологічної підтримки', 'Сертифіковані кризові психологи консультують ВПО та родини, які потребують термінової підтримки.', 'Безкоштовна всеукраїнська лінія працює цілодобово. Консультації проводять дипломовані фахівці з досвідом роботи з тривожними станами, втратою дому та адаптацією після травматичних подій.'),
  (7,  'Rescue Львів запускає мобільну ветеринарну амбулаторію', 'Обладнаний мікроавтобус проводитиме безкоштовні огляди тварин у громадах з обмеженим доступом до ветеринарів.', 'Мобільна амбулаторія отримала обладнання для стерилізацій, вакцинацій та базових хірургічних втручань. Графік виїздів на травень 2026 року затверджено, короткі звіти публікуватимуться після кожного рейсу.'),
  (8,  'EcoKyiv прозвітував про очищення озера на Оболоні', 'Під час акції волонтери зібрали понад 3 тонни побутових відходів і передали частину на переробку.', 'У прибиранні взяли участь понад 120 людей. Пластик і скло відсортовано окремо, великогабаритні відходи вивезено через комунального підрядника, а на локації встановлено інформаційні таблички про відповідальне поводження з відходами.'),
  (9,  'МедДопомога доставила медикаменти у центри розміщення', 'Інсуліни, серцеві препарати та засоби гігієни передані через координаторів центрів розміщення.', 'Команда доставила ліки, засоби догляду та 5 крісел колісних для маломобільних пацієнтів у чотири центри розміщення. Закупівлі та передачі внесено до внутрішнього звіту організації.'),
  (10, 'Rescue Львів провів день відкритих дверей центру адопції', 'Гості познайомилися з тваринами, умовами адопції та роботою волонтерів центру.', 'Протягом дня центр відвідали понад 200 людей. Подано 18 анкет на адопцію, усі заявки проходять стандартну перевірку умов утримання.'),
  (11, 'Дах і Тепло підготував нічліжку до зимового сезону', 'Соціальний центр оновив спальні місця, запаси білизни та графік чергування волонтерів.', 'Після підготовки нічліжка зможе приймати до 80 людей одночасно. Запаси одягу та гігієнічних наборів розподілені за категоріями.'),
  (12, 'Переселенці Разом відкрили юридичну приймальню', 'Щомісячна приймальня консультуватиме щодо документів, виплат, житла та трудових питань.', 'Перший день прийому охопив 63 звернення. Найчастіші теми: відновлення документів, статус ВПО, субсидії та трудові договори.'),
  (13, 'EcoKyiv прозвітував про осіннє прибирання парку', 'Під час акції зібрано 500 кг відходів, частину передано на переробку.', 'У прибиранні взяли участь 83 людини. Пластик, скло і метал відсортували окремо, великогабаритні відходи вивезла комунальна служба.'),
  (14, 'Армія Змін передала першу партію маскувальних сіток', 'Волонтери завершили й передали підрозділам 18 сіток за підтвердженими заявками.', 'Кожна сітка пройшла контроль якості та маркування. Команда відкриває додаткові вечірні зміни для охочих долучитися.'),
  (15, 'Армія Змін організувала візит до військового шпиталю', 'Волонтери передали листи, набори підтримки та провели коротку культурну програму для пацієнтів.', 'Понад 60 волонтерів і учнів трьох київських шкіл відвідали військовий шпиталь, передали 400 листів, набори гігієни та солодощі. Формат наступних візитів погоджено з адміністрацією закладу.'),
  (16, 'Без Бар''єрів завершила аудит доступності аптек Львова', 'Команда перевірила входи, навігацію та можливість отримання послуг для людей з інвалідністю.', 'За підсумками аудиту підготовлено рекомендації для 27 аптек. Частина закладів уже погодила встановлення пандусів і тактильних позначок.'),
  (17, 'Без Бар''єрів відкриває набір на курс жестової мови', 'Базовий курс призначений для волонтерів, працівників сервісних служб і всіх охочих.', 'Учасники вивчатимуть базові фрази для привітання, запиту допомоги, навігації та роботи з документами. Кількість місць обмежена.'),
  (18, 'Простір Підтримки публікує графік консультацій', 'Оновлено розклад індивідуальних консультацій для ветеранів, ВПО та членів родин.', 'Запис доступний через форму на сайті організації. Команда просить завчасно попереджати про перенесення зустрічі, щоб місце могли отримати інші люди.'),
  (19, 'Простір Підтримки розширює програму арттерапії', 'До дорослих груп додаються окремі заняття для підлітків 13-17 років.', 'Підліткові групи працюватимуть у малому складі під супроводом психолога. Участь безкоштовна після короткої співбесіди з координатором.'),
  (20, 'СпортДух запускає дитячу секцію у Запоріжжі', 'Безкоштовні тренування двічі на тиждень відкриті для дітей з родин ВПО.', 'Секція працюватиме у партнерстві з ДЮСШ. Форма, м''ячі та базове страхування на тренуванні забезпечуються організаторами.'),
  (21, 'СпортДух відкрив адаптивні тренування', 'Новий напрям включає баскетбол і настільний теніс для людей з інвалідністю.', 'Тренування проводитимуть фахівці з адаптивного спорту. Волонтери допомагають з обладнанням і супроводом учасників.'),
  (22, 'Їжа та Турбота доставила набори літнім людям', 'Адресну допомогу отримали 120 людей з низькою мобільністю у Вінниці та передмісті.', 'Кожен набір сформовано за стандартним списком і передано за актом отримання. Наступний маршрут доставки вже погоджується із соціальними службами.'),
  (23, 'ОсвітаПлюс провела практикум з онлайн-сервісів', 'Учасники навчилися записуватися до лікаря, користуватися Дією та налаштовувати безпечні паролі.', 'Практикум відвідали 32 людини. Волонтери допомагали кожному учаснику індивідуально, щоб після заняття навички можна було застосовувати самостійно.'),
  (24, 'Культурна ДНК оголошує майстер-клас з писанкарства', 'Подія присвячена традиційним технікам розпису та символіці орнаментів.', 'Майстер-клас проведуть троє майстрів народного мистецтва. Участь безкоштовна за попередньою реєстрацією.'),
  (25, 'ВетеранUA формує групи взаємопідтримки', 'Новий формат регулярних зустрічей допоможе ветеранам підтримувати контакт після консультацій.', 'Групи працюватимуть раз на тиждень у малому складі. Модератор стежитиме за правилами безпеки й конфіденційності.'),
  (26, 'Дах і Тепло відкрив мобільний пункт допомоги', 'Пункт видаватиме гаряче харчування, одяг і гігієнічні набори людям без житла.', 'Маршрут мобільного пункту погоджений із соціальними службами. Команда також інформуватиме людей про можливість відновлення документів.'),
  (27, 'МедДопомога оновила маршрут вакцинаційної бригади', 'Наступні виїзди заплановані у громади з обмеженим доступом до амбулаторій.', 'Бригада працюватиме за попередніми списками сімейних лікарів. Для кожної громади підготовлено інформаційні матеріали.'),
  (28, 'Rescue Львів оновлює правила перетримки тварин', 'Нові вимоги стосуються анкети, перевірки умов і вступного інструктажу для волонтерів.', 'Мета оновлення — підвищити безпеку тварин на перетримці та зробити процес зрозумілим для волонтерів. Правила набудуть чинності з 1 червня.'),
  (29, 'МедДопомога: звіт мобільної амбулаторії за квітень', 'За квітень мобільна амбулаторія відвідала 9 прифронтових сіл і прийняла 847 пацієнтів.', 'Команда провела 312 ЕКГ, виявила 23 критичні стани і видала медикаменти за призначенням лікаря. Повний фінансовий звіт буде опубліковано окремо.'),
  (30, 'ВетеранUA: набір на осінній цикл психологічних груп', 'Відкрито реєстрацію на 8 зустрічей із сертифікованим психологом для ветеранів і родин.', 'Групи працюватимуть у закритому форматі з попередньою реєстрацією. Організація перевіряє текст оголошення відповідно до правил платформи.')
) AS v(id, title, description, main_content)
WHERE n.id = v.id;

UPDATE fundraising_campaign AS fc
SET
  title = v.title,
  description = v.description,
  main_content = v.main_content
FROM (VALUES
  (1,  'Ліки та лікувальне харчування для центру перетримки', 'Збір покриває ветеринарні препарати, лікувальне харчування та базові профілактичні засоби для тварин.', 'Кошти будуть спрямовані на закупівлю лікувального корму, вакцин, протипаразитарних засобів і матеріалів для щоденного догляду. Організація опублікує чеки та короткий звіт після закупівлі.'),
  (2,  'Інвентар для міських екологічних толок', 'EcoKyiv формує власний комплект інструментів для регулярних прибирань парків і берегових зон.', 'План закупівлі включає рукавиці, міцні мішки, граблі, щипці, лопати та контейнерні наліпки для сортування. Інвентар використовуватиметься на відкритих подіях громади.'),
  (3,  'Ноутбуки для дітей з родин ВПО', 'Особистий збір волонтера на вживані ноутбуки для школярів, які навчаються дистанційно.', 'Планується придбати 10 справних ноутбуків, провести базове налаштування та передати їх дітям через координаторів центру розміщення. Передача буде підтверджена актами й фото без персональних даних дітей.'),
  (4,  'Евакуаційні рейси та ветеринарна допомога тваринам', 'Збір покриває пальне, транспортування та невідкладне лікування тварин із прифронтових громад.', 'Команда Rescue Львів здійснює рейси за погодженими маршрутами і передає тварин у ветеринарні клініки або на перетримку. Витрати будуть розділені на логістику, лікування і матеріали догляду.'),
  (5,  'Очищення русла річки Либідь', 'Кошти потрібні на техніку, вивезення великогабаритних відходів і матеріали для безпечної роботи волонтерів.', 'Проєкт доповнює регулярні толоки EcoKyiv і стосується ділянок, де ручного прибирання недостатньо. Після робіт буде опубліковано екологічний та фінансовий звіт.'),
  (6,  'Дитяче харчування та засоби гігієни для родин ВПО', 'Збір забезпечить базові потреби немовлят у гуртожитку для внутрішньо переміщених родин.', 'Закупівля включає суміші, підгузки, дитячі креми та вологі серветки. Набори передаються через координатора центру розміщення з фіксацією кількості отримувачів.'),
  (7,  'Утеплення центру тимчасової перетримки тварин', 'Збір на ремонт покрівлі, утеплення вольєрів і безпечні обігрівачі перед холодним сезоном.', 'Кошти підуть на матеріали для ремонту, теплоізоляцію і обладнання для секцій із тваринами, які потребують особливого догляду. Закупівлі будуть підтверджені документально.'),
  (8,  'Обладнання для шкільного еко-гуртка', 'EcoKyiv збирає на навчальні матеріали, мікроскоп і набори для дослідження води та повітря.', 'Мета збору — створити практичний гурток для учнів школи №98. Після закупівлі організація проведе відкритий урок і передасть школі інструкції з використання обладнання.'),
  (9,  'Смартфони для ветеранів на реабілітації', 'Особистий збір на базові смартфони для ветеранів, які проходять лікування або реабілітацію.', 'Смартфони допоможуть підтримувати зв''язок із родиною, користуватися державними сервісами і записуватися до лікарів. Перед передачею пристрої буде перевірено та налаштовано.'),
  (10, 'Тактичні аптечки для евакуаційних медичних бригад', 'МедДопомога збирає на сертифіковані засоби першої допомоги для виїзних команд.', 'План закупівлі включає турнікети, гемостатичні бинти, оклюзійні наліпки та перев''язувальні матеріали. Усі позиції купуватимуться у перевірених постачальників.'),
  (11, 'Переобладнання мобільного медичного кабінету', 'Збір допоможе облаштувати мікроавтобус для виїзних медичних прийомів у громадах.', 'Кошти потрібні на оглядовий стіл, холодильник для вакцин, портативний ЕКГ-апарат і витратні матеріали. Після запуску бригада працюватиме за погодженим графіком.'),
  (12, 'Ліжка та постіль для нічліжки', 'Дах і Тепло облаштовує додаткові 20 місць у зимовому крилі нічліжки.', 'Збір покриває металеві ліжка, матраци, подушки, ковдри і комплекти постільної білизни. Команда опублікує фото готового приміщення після монтажу.'),
  (13, 'Продуктові набори для 100 родин', 'Рука Допомоги збирає кошти на зимові продуктові набори для родин у складних обставинах.', 'Один набір розрахований на базові продукти тривалого зберігання. Передача відбуватиметься адресно або за попереднім записом, без відкритих черг.'),
  (14, 'Рефрижератор для перевезення вакцин і кормів', 'Rescue Львів збирає на транспорт із контрольованою температурою для ветеринарних вакцин і кормів.', 'Рефрижератор дозволить зберігати холодовий режим під час рейсів і безпечно перевозити великі партії допомоги. Кошторис включає купівлю, перевірку та реєстрацію транспорту.'),
  (15, 'Портативні кардіографи для мобільної амбулаторії', 'МедДопомога планує закупити три портативні ЕКГ-апарати для одночасного прийому в громадах.', 'Нове обладнання зменшить час очікування пацієнтів і дозволить швидше виявляти ризики серцево-судинних захворювань. До суми входять витратні матеріали та навчання команди.'),
  (16, 'Обладнання молодіжного хабу Харкова', 'Молодіжний Хаб Харків збирає на меблі, техніку та базове облаштування першого простору.', 'Кошти потрібні для навчальної зали, коворкінгу, кухні та зони групових зустрічей. Збір стане активним після завершення верифікації організації.')
) AS v(id, title, description, main_content)
WHERE fc.id = v.id;

UPDATE ticket AS t
SET
  title = v.title,
  description = v.description
FROM (VALUES
  (1,  'Доступ до підвалу для порятунку кішки з кошенятами', 'У підвалі житлового будинку залишилася кішка з кошенятами. Потрібна допомога волонтерів для безпечного доступу, огляду тварин і пошуку тимчасової перетримки.'),
  (2,  'Несанкціоноване складування шин біля Гідропарку', 'Біля берегової зони виявлено кілька десятків автомобільних шин. Потрібна оцінка обсягу робіт, координація вивезення та передача шин на утилізацію.'),
  (3,  'Доставка ліків для літньої мешканки', 'Літня мешканка потребує доставки серцевих препаратів і базових продуктів. Є список ліків і контакт для погодження часу передачі.'),
  (4,  'Тимчасова перетримка цуценят', 'Знайдено п''ятьох цуценят, яким потрібні суміш для вигодовування, ветеринарний огляд і короткострокова перетримка.'),
  (5,  'Аварійна гілка над дитячим майданчиком', 'На території дитячого садка після негоди пошкоджена гілка нависає над ігровою зоною. Потрібні фахівці або волонтери з відповідним інструментом.'),
  (6,  'Теплий одяг для дитини з родини ВПО', 'Родина ВПО шукає куртку на зріст 116-122 см та осіннє взуття 29-30 розміру для дитини. Передача можлива через координатора.'),
  (7,  'Ймовірний злив технічних відходів в озеро', 'На поверхні озера помічено маслянисту плівку та запах пального. Потрібна фіксація звернення, контакт з екоінспекцією і допомога з подальшими діями.'),
  (8,  'Транспорт до реабілітаційного центру для ветерана', 'Ветерану потрібні регулярні поїздки до реабілітаційного центру. Шукаємо волонтера з авто для погодженого графіка перевезень.'),
  (9,  'Корм для приватного міні-притулку', 'Приватний міні-притулок потребує кількох мішків сухого корму та координації доставки. Кількість тварин і адреса підтверджуються координатором.'),
  (10, 'Інвентар для прибирання прибудинкової території', 'Мешканці будинку планують прибрати двір і облаштувати клумбу. Потрібна допомога з інструментом, підготовкою ґрунту та вивезенням важких матеріалів.'),
  (11, 'Транспортування травмованого собаки до клініки', 'На узбіччі траси виявлено травмованого собаку. Потрібні волонтери з досвідом безпечного відлову і транспортом до ветеринарної клініки.'),
  (12, 'Пошкоджене дерево біля дитячого майданчика', 'Після сильного вітру дерево нахилилося над дитячим майданчиком. Потрібна оцінка ризику і допомога з безпечним видаленням гілок.'),
  (13, 'Юридична консультація щодо статусу ВПО', 'Користувач потребує консультації щодо оформлення статусу ВПО та пов''язаних документів. Потрібен юрист-волонтер.')
) AS v(id, title, description)
WHERE t.id = v.id;

UPDATE task AS tk
SET
  title = v.title,
  description = v.description
FROM (VALUES
  (1,  'Доставка корму до центру перетримки', 'Забрати корм зі складу партнерів і передати його координатору центру перетримки.'),
  (2,  'Координація групи прибирання', 'Допомогти координатору розподілити учасників за ділянками і проконтролювати здачу інвентарю.'),
  (3,  'Реєстрація учасників події', 'Перевіряти списки, видавати бейджі та позначати присутність у таблиці координатора.'),
  (4,  'Координація медичного прийому', 'Допомагати з чергою, анкетами пацієнтів і навігацією до лікарів.'),
  (5,  'Сортування одягу за категоріями', 'Перевіряти стан речей, групувати за розмірами та готувати полиці до видачі.'),
  (6,  'Формування гуманітарних наборів', 'Збирати набори за списком, перевіряти кількість позицій і передавати коробки на відвантаження.'),
  (7,  'Допомога на освітньому тренінгу', 'Підготувати роздаткові матеріали, зустріти учасників і допомогти з технікою.'),
  (8,  'Підготовка інвентарю для озеленення', 'Перевірити лопати, рукавиці, опори для саджанців і рознести інструмент по робочих зонах.'),
  (9,  'Фотофіксація результатів події', 'Зробити фото до і після робіт, передати матеріали координатору для звіту.'),
  (10, 'Розстановка ліжок та інвентарю', 'Допомогти розмістити ліжка, матраци та постіль у новому крилі нічліжки.'),
  (11, 'Переклад юридичних документів', 'Перекласти короткі довідки та супровідні тексти для партнерської організації.'),
  (12, 'Встановлення інформаційних стендів', 'Допомогти змонтувати стенди з навігацією та правилами участі на локації події.'),
  (13, 'Підготовка тварин до виїзної адопції', 'Перевірити переноски, документи, воду та необхідні матеріали перед виїздом.'),
  (14, 'Підготовка матеріалів для плетіння сіток', 'Нарізати тканину, підготувати рами та розкласти матеріали перед початком зміни.'),
  (15, 'Пакування листів підтримки', 'Відсортувати листи, перевірити пакування і промаркувати коробки для передачі.'),
  (16, 'Підготовка будівельного інструменту', 'Перевірити комплектність інструментів і матеріалів для монтажу елементів доступності.'),
  (17, 'Підготовка матеріалів для курсу жестової мови', 'Надрукувати картки, QR-коди та списки учасників для навчальної групи.'),
  (18, 'Координація запису на психологічні консультації', 'Підтвердити записи, нагадати учасникам про зустрічі та підтримувати конфіденційність.'),
  (19, 'Підготовка матеріалів для арттерапії', 'Розкласти фарби, папір, пензлі й прибрати простір після заняття.'),
  (20, 'Реєстрація дітей на спортивну секцію', 'Заповнювати анкети, видавати форму та пояснювати батькам розклад тренувань.'),
  (21, 'Асистування тренеру адаптивного спорту', 'Допомагати з обладнанням і страхуванням учасників відповідно до інструкцій тренера.'),
  (22, 'Формування та доставка продуктових наборів', 'Зібрати набори за списком, завантажити в авто і передати отримувачам за адресами.'),
  (23, 'Технічна підтримка на курсі цифрових сервісів', 'Допомагати учасникам встановлювати застосунки та проходити базові налаштування.'),
  (24, 'Підготовка матеріалів для писанкарства', 'Підготувати робочі місця, матеріали та інструменти для майстер-класу.'),
  (25, 'Ведення журналу груп підтримки', 'Реєструвати присутність учасників без розкриття персональних деталей.'),
  (26, 'Сортування гуманітарних наборів для людей без житла', 'Прийняти одяг і харчування від донорів, розподілити за категоріями та підготувати до видачі.'),
  (27, 'Реєстрація пацієнтів вакцинаційної бригади', 'Заповнювати форми, перевіряти документи та координувати чергу до медиків.')
) AS v(id, title, description)
WHERE tk.id = v.id;

UPDATE report AS r
SET
  title = v.title,
  description = v.description
FROM (VALUES
  (1,  'Rescue Львів: фінансовий звіт за 2025 рік', 'Звіт містить надходження, витрати на лікування, харчування, транспорт і адміністративні потреби організації.'),
  (2,  'Звіт про програму вигулу собак у центрі адопції', 'Підсумки участі волонтерів, кількість прогулянок, витрати на матеріали та результати соціалізації тварин.'),
  (3,  'EcoKyiv: звіт діяльності за квітень 2025 року', 'Описано проведені толоки, освітні події, передані на переробку матеріали та партнерські внески.'),
  (4,  'Звіт акції з прибирання берегів Дніпра', 'Підсумки кількості учасників, зібраних відходів, маршруту вивезення та витрат на інвентар.'),
  (5,  'ВетеранUA: фінансовий звіт за 2024 рік', 'Звіт про надходження, витрати на психологічні програми, юридичну підтримку та навчальні заходи.'),
  (6,  'Звіт курсу з домедичної допомоги', 'Кількість учасників, програма навчання, використані матеріали та рекомендації для наступного потоку.'),
  (7,  'Звіт акції з плетіння маскувальних сіток', 'Кількість виготовлених сіток, витрати на матеріали, кількість волонтерських годин і маршрут передачі.'),
  (8,  'Звіт безкоштовних психологічних консультацій', 'Агрегована статистика консультацій без персональних даних, витрати і плани розвитку програми.'),
  (9,  'Rescue Львів: звіт програми стерилізації', 'Підсумки кількості процедур, районів охоплення, витрат і рекомендацій ветеринарної команди.'),
  (10, 'Звіт майстер-класу з писанкарства', 'Кількість учасників, партнери, витрати на матеріали та короткі результати культурної події.')
) AS v(id, title, description)
WHERE r.id = v.id;

UPDATE reward AS rw
SET
  title = v.title,
  description = v.description
FROM (VALUES
  (1,  'Набір наліпок Hand&Hand', 'Вінілові наліпки з айдентикою платформи.'),
  (2,  'Футболка Hand&Hand', 'Бавовняна футболка унісекс для активних волонтерів.'),
  (3,  'Термочашка Hand&Hand', 'Багаторазова термочашка для волонтерських змін.'),
  (4,  'Сертифікат подяки', 'Іменний PDF-сертифікат за підтверджену волонтерську активність.'),
  (5,  'Рюкзак волонтера', 'Міський рюкзак з відбивними елементами для подій.'),
  (6,  'Запрошення на благодійну подію', 'Місце на щорічній відкритій події партнерів платформи.'),
  (7,  'Набір координатора', 'Блокнот, ручка, бейдж і термочашка для роботи на подіях.'),
  (8,  'Промокод партнерів', 'Знижка на товари першої потреби у партнерських магазинах.'),
  (9,  'Металевий значок Hand&Hand', 'Лаконічний значок для волонтерів платформи.'),
  (10, 'Доступ до онлайн-курсу', 'Безкоштовний доступ до одного навчального курсу з каталогу партнерів.'),
  (11, 'Менторська сесія', 'Годинна консультація з досвідченим координатором або лідером громадської організації.'),
  (12, 'Участь у тренінгу координаторів', 'Місце на практичному тренінгу з організації волонтерських подій.'),
  (13, 'Кепка Hand&Hand', 'Кепка з логотипом платформи для роботи на відкритих подіях.')
) AS v(id, title, description)
WHERE rw.id = v.id;

UPDATE donation AS d
SET message = v.message
FROM (VALUES
  (1,  'Підтримую ініціативу.'),
  (2,  'Дякую за системну роботу.'),
  (3,  'На закупівлю необхідного.'),
  (4,  'Підтримка від громади.'),
  (5,  'Дякую волонтерам.'),
  (6,  'На важливу справу.'),
  (7,  'Підтримую прозорий збір.'),
  (8,  'На потреби програми.'),
  (9,  'Долучаюся до збору.'),
  (10, 'Підтримка проєкту.'),
  (11, 'На обладнання та матеріали.'),
  (12, 'Дякую за допомогу людям.'),
  (13, 'Підтримую роботу команди.'),
  (14, 'Долучаюся до закупівлі.'),
  (15, 'На потреби отримувачів.'),
  (16, 'Підтримую ініціативу.'),
  (17, NULL),
  (18, 'Для ветеранських програм.'),
  (19, NULL),
  (20, 'Важлива ініціатива.'),
  (21, NULL),
  (22, 'На підтримку програми.'),
  (23, NULL),
  (24, 'Долучаюся до збору.'),
  (25, NULL),
  (26, 'Підтримка транспорту.'),
  (27, NULL),
  (28, 'На обладнання.')
) AS v(id, message)
WHERE d.id = v.id;

UPDATE points_transaction AS pt
SET reason = v.reason
FROM (VALUES
  (1,  'Завершено завдання #1: доставка корму до центру перетримки'),
  (2,  'Завершено завдання #2: координація групи прибирання'),
  (3,  'Завершено завдання #6: формування гуманітарних наборів'),
  (4,  'Участь у події #3: прибирання берегів річки Либідь'),
  (5,  'Реєстрація на подію #1: вигул собак у центрі адопції'),
  (6,  'Участь у події #3: екологічне прибирання'),
  (7,  'Участь у події #5: тренінг з домедичної допомоги'),
  (8,  'Участь у події #10: арттерапевтична програма'),
  (9,  'Участь у події #6: сортування теплого одягу'),
  (10, 'Участь у події #7: виїзний медичний прийом'),
  (11, 'Підготовка до події #9: ремонт вольєрів'),
  (12, 'Фотофіксація події #11: фестиваль традиційної музики'),
  (13, 'Технічна підтримка організації під час події #5'),
  (14, 'Тренінг для волонтерів перед подією #12'),
  (15, 'Логістична підтримка події #8'),
  (16, 'Завершено завдання #14: підготовка матеріалів для плетіння сіток'),
  (17, 'Завершено завдання #15: пакування листів підтримки'),
  (18, 'Завершено завдання #22: доставка продуктових наборів'),
  (19, 'Завершено завдання #23: технічна підтримка на курсі цифрових сервісів'),
  (20, 'Обмін балів на набір наліпок Hand&Hand'),
  (21, 'Обмін балів на сертифікат подяки'),
  (22, 'Обмін балів на футболку Hand&Hand'),
  (23, 'Обмін балів на термочашку Hand&Hand'),
  (24, 'Адміністративний бонус за якісну координацію подій'),
  (25, 'Адміністративний бонус за стабільну участь у волонтерських програмах'),
  (26, 'Адміністративний бонус за технічну підтримку платформи'),
  (27, 'Списання балів за скасування участі менш ніж за 24 години'),
  (28, 'Списання балів за повторне скасування участі без пояснення'),
  (29, 'Корекція помилкового нарахування від 2025-03-15')
) AS v(id, reason)
WHERE pt.id = v.id;

UPDATE notification AS n
SET message = v.message
FROM (VALUES
  (1,  'Вашу заявку на подію «Вигул собак у центрі адопції Львова» прийнято.'),
  (2,  'EcoKyiv запросив вас до організації.'),
  (3,  'Ваша заявка на подію «Вигул собак у центрі адопції Львова» очікує розгляду.'),
  (4,  'Дякуємо за реєстрацію в Hand&Hand.'),
  (5,  'Ваше звернення №1 прийняте на розгляд.'),
  (6,  'Вашу заявку на тренінг з домедичної допомоги прийнято.'),
  (7,  'Вас призначено на завдання #4: координація медичного прийому.'),
  (8,  'Вашу заявку на участь у виїзному медичному прийомі прийнято.'),
  (9,  'Ви стали членом організації «Відбудова Разом».'),
  (10, 'Вашу заявку на курс цифрової грамотності прийнято.'),
  (11, 'Новий збір від «Культурна ДНК» потребує підтримки.'),
  (12, 'Завдання #10 призначено вам: розстановка ліжок та інвентарю.'),
  (13, 'Дякуємо за реєстрацію в Hand&Hand. Долучайтеся до подій платформи.'),
  (14, 'Ваше звернення №9 прийняте на розгляд.'),
  (15, 'Ви отримали 10 балів за виконання завдання «Доставка корму».'),
  (16, 'Вашу заявку на подію «Тренінг з домедичної допомоги» прийнято.'),
  (17, 'Вас прийнято до події «Юридичні консультації для ВПО».'),
  (18, 'Вашу заявку на подію «Футбольна секція для дітей ВПО» прийнято.'),
  (19, 'Завдання #14 «Підготовка матеріалів» позначено як виконане. +15 балів.'),
  (20, 'Завдання #15 «Пакування листів підтримки» позначено як виконане. +10 балів.'),
  (21, 'Завдання #23 «Технічна підтримка» позначено як виконане. +15 балів.'),
  (22, 'Ви отримали 50 бонусних балів за якісну координацію подій.'),
  (23, 'Ви отримали 30 бонусних балів за стабільну участь у волонтерських програмах.'),
  (24, 'Ви успішно обміняли 200 балів на футболку Hand&Hand.'),
  (25, 'Ви отримали попередження за скасування участі менш ніж за 24 години.'),
  (26, 'На ваш обліковий запис видано попередження. Перегляньте деталі.'),
  (27, 'Ваш обліковий запис заблоковано. Зверніться до підтримки.'),
  (28, 'Вас прийнято до організації «Rescue Львів».'),
  (29, 'Вас прийнято до організації «ВетеранUA».'),
  (30, 'ОсвітаПлюс запрошує вас стати членом організації.'),
  (31, 'Вашу заявку до організації «Рука Допомоги» прийнято.'),
  (32, 'Дякуємо за реєстрацію в Hand&Hand. Підтвердіть email для активації.')
) AS v(id, message)
WHERE n.id = v.id;

UPDATE warnings AS w
SET
  reason = v.reason,
  description = v.description
FROM (VALUES
  (1, 'Масові небажані повідомлення', 'Користувач неодноразово надсилав іншим учасникам однакові повідомлення зі сторонніми посиланнями. Після попереджень модераторів поведінка не змінилась. Обліковий запис заблоковано до завершення перевірки.'),
  (2, 'Порушення правил участі в події', 'Під час події користувач відмовився виконувати інструкції координатора та некоректно комунікував з учасниками. Зафіксовано скарги від трьох волонтерів. Перше офіційне попередження.'),
  (3, 'Підозра у зловживанні системою балів', 'Виявлено повторні реєстрації на події з подальшим скасуванням після нарахування балів. Нарахування балів тимчасово призупинено до завершення внутрішньої перевірки.')
) AS v(id, reason, description)
WHERE w.id = v.id;

UPDATE audit_log AS al
SET payload = v.payload::jsonb
FROM (VALUES
  (1,  '{"organization_id": 1, "name": "Rescue Львів", "status_before": "PENDING", "status_after": "VERIFIED"}'),
  (2,  '{"volunteer_id": 1, "display_name": "Анна Шимчук", "is_verified_after": true}'),
  (3,  '{"organization_id": 19, "name": "Малюки у Безпеці", "reason": "Документи не відповідають вимогам"}'),
  (4,  '{"user_id": 41, "email": "user-blocked@demo.local", "reason": "Масові небажані повідомлення"}'),
  (5,  '{"news_id": 30, "title": "ВетеранUA: набір на осінній цикл психологічних груп", "reason": "Порушення правил п. 4.2"}'),
  (6,  '{"user_id": 29, "severity": "MEDIUM", "reason": "Порушення правил участі в події"}'),
  (7,  '{"volunteer_id": 16, "display_name": "Катерина Салова", "reason": "Нечитабельні документи"}'),
  (8,  '{"project_id": 30, "title": "Нічний моніторинг безпритульних тварин", "org_id": 1}'),
  (9,  '{"news_id": 29, "title": "МедДопомога: звіт мобільної амбулаторії за квітень"}')
) AS v(id, payload)
WHERE al.id = v.id;

-- ============================================================================
-- Підсумок: seed.sql повністю заповнений демо-даними
-- ============================================================================
-- project_registration: ~57  |  notification: ~32  |  notification_organization: 14
-- report: 10  |  task: 27  |  task_assignment: 28
-- organization_membership_request: ~28  |  points_transaction: ~29  |  ticket: 13
-- ============================================================================

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

COMMIT;
