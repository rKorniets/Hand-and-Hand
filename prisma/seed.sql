-- ============================================================================
-- Seed data for hand_and_hand demo
-- ============================================================================
-- Запускати на чистій базі (після prisma migrate reset або prisma db push).
-- Усі демо-юзери мають пароль: Demo1234!
-- (argon2id хеш — той самий що генерує auth.service.ts)
--
-- Логіни:
--   admin@demo.local         (ADMIN)
--   org-rescue@demo.local    (ORGANIZATION, верифікована)
--   org-eco@demo.local       (ORGANIZATION, верифікована)
--   vol-anna@demo.local      (VOLUNTEER, верифікована)
--   vol-petro@demo.local     (VOLUNTEER, верифікована)
--   user@demo.local          (APP_USER)
-- ============================================================================

BEGIN;

-- Очистити дані (TRUNCATE з RESTART IDENTITY скидає sequences)
TRUNCATE TABLE
  donation,
  fundraising_category,
  fundraising_campaign,
  task_category,
  task_assignment,
  task,
  ticket,
  project_category,
  project_registration,
  project,
  report,
  news_category,
  news,
  organization_category,
  organization_membership_request,
  organization_profile,
  volunteer_profile,
  admin_profile,
  approval_request,
  password_reset_token,
  reward_redemption,
  reward,
  points_transaction,
  warnings,
  category,
  location,
  app_user
RESTART IDENTITY CASCADE;

-- ============================================================================
-- 1. LOCATIONS (міста)
-- ============================================================================
INSERT INTO location (id, lat, lng, address, region, city) VALUES
  (1, 49.839683, 24.029717, 'вул. Соборна, 1',     'Львівська область',         'Львів'),
  (2, 50.450100, 30.523400, 'вул. Хрещатик, 22',   'Київська область',          'Київ'),
  (3, 49.553517, 25.594767, 'вул. Руська, 10',     'Тернопільська область',     'Тернопіль'),
  (4, 46.482526, 30.723310, 'вул. Дерибасівська, 5','Одеська область',          'Одеса'),
  (5, 48.922633, 24.711117, 'вул. Незалежності, 3', 'Івано-Франківська область','Івано-Франківськ');

SELECT setval('location_id_seq', (SELECT MAX(id) FROM location));

-- ============================================================================
-- 2. CATEGORIES (універсальні теги)
-- ============================================================================
INSERT INTO category (id, name, slug) VALUES
  (1, 'Екологія',         'ecology'),
  (2, 'Тварини',          'animals'),
  (3, 'Освіта',           'education'),
  (4, 'Медицина',         'medicine'),
  (5, 'Армія',            'military'),
  (6, 'Соціальна допомога','social-aid'),
  (7, 'Культура',         'culture'),
  (8, 'Діти',             'kids'),
  (9, 'Літні люди',       'elderly'),
  (10, 'Переселенці',     'idp');

SELECT setval('category_id_seq', (SELECT MAX(id) FROM category));

-- ============================================================================
-- 3. APP_USER (юзери)
-- ============================================================================
-- Хеш для "Demo1234!" — скопійований з argon2.hash() у auth.service.ts
-- Якщо хочете інший пароль — згенеруйте новий хеш командою:
--   node -e "require('argon2').hash('YourPassword').then(console.log)"
INSERT INTO app_user (id, email, password_hash, role, status, points, first_name, last_name, city, organization_id) VALUES
  -- 1: admin
  (1, 'admin@demo.local',
      '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
      'ADMIN', 'ACTIVE', 0, 'Адмін', 'Демо', 'Київ', NULL),
  -- 2: org власник #1 (Rescue)
  (2, 'org-rescue@demo.local',
      '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
      'ORGANIZATION', 'ACTIVE', 0, 'Олена', 'Кравчук', 'Львів', NULL),
  -- 3: org власник #2 (Eco)
  (3, 'org-eco@demo.local',
      '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
      'ORGANIZATION', 'ACTIVE', 0, 'Ігор', 'Шевченко', 'Київ', NULL),
  -- 4: волонтер #1
  (4, 'vol-anna@demo.local',
      '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
      'VOLUNTEER', 'ACTIVE', 120, 'Анна', 'Мельник', 'Львів', NULL),
  -- 5: волонтер #2
  (5, 'vol-petro@demo.local',
      '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
      'VOLUNTEER', 'ACTIVE', 80, 'Петро', 'Іваненко', 'Київ', NULL),
  -- 6: звичайний юзер
  (6, 'user@demo.local',
      '$argon2id$v=19$m=65536,t=3,p=4$HypMD5dd8o1YWetiTRI6UQ$iyJvFPkscNI6X6As6Bl5cbbauvMDh3SM4VAOXO9Xczg',
      'APP_USER', 'ACTIVE', 0, 'Марія', 'Бойко', 'Тернопіль', NULL);

SELECT setval('app_user_id_seq', (SELECT MAX(id) FROM app_user));

-- ============================================================================
-- 4. ADMIN_PROFILE
-- ============================================================================
INSERT INTO admin_profile (id, user_id, full_name, is_super_admin) VALUES
  (1, 1, 'Адмін Демо', TRUE);

SELECT setval('admin_profile_id_seq', (SELECT MAX(id) FROM admin_profile));

-- ============================================================================
-- 5. VOLUNTEER_PROFILE
-- ============================================================================
INSERT INTO volunteer_profile (id, user_id, display_name, phone, bio, skills_text, rating, is_verified, avatar_url) VALUES
  (1, 4, 'AnnaHelper',  '+380671234567',
      'Допомагаю з логістикою гумдопомоги. 3 роки досвіду в волонтерстві.',
      'Логістика, водіння, психологія', 4.80, TRUE,
      'https://i.pravatar.cc/150?img=47'),
  (2, 5, 'PetroDoer',   '+380677654321',
      'IT-волонтер, допомагаю з сайтами та автоматизацією.',
      'Розробка, дизайн, копірайтинг', 4.50, TRUE,
      'https://i.pravatar.cc/150?img=12');

SELECT setval('volunteer_profile_id_seq', (SELECT MAX(id) FROM volunteer_profile));

-- ============================================================================
-- 6. ORGANIZATION_PROFILE
-- ============================================================================
INSERT INTO organization_profile (id, user_id, name, edrpou, description, verification_status, official_docs_url, contact_phone, contact_email, city, logo_url, location_id, mission) VALUES
  (1, 2, 'Rescue Львів',     '12345678',
      'Зоозахисна організація: рятуємо безпритульних тварин у Львові та області.',
      'VERIFIED', 'https://example.com/docs/rescue.pdf', '+380322001122', 'contact@rescue.lviv.ua',
      'Львів', 'https://placehold.co/200x200/ff6b6b/ffffff/png?text=Rescue', 1,
      'Кожна тварина заслуговує на дім.'),
  (2, 3, 'EcoKyiv',          '87654321',
      'Прибираємо парки, висаджуємо дерева, робимо екоосвіту в школах.',
      'VERIFIED', 'https://example.com/docs/eco.pdf', '+380442002233', 'hello@ecokyiv.org.ua',
      'Київ', 'https://placehold.co/200x200/51cf66/ffffff/png?text=Eco', 2,
      'Чисте місто — здорове майбутнє.');

SELECT setval('organization_profile_id_seq', (SELECT MAX(id) FROM organization_profile));

-- Прив'язати волонтера #5 (Петро) як члена EcoKyiv
UPDATE app_user SET organization_id = 2 WHERE id = 5;

-- ============================================================================
-- 7. ORGANIZATION_CATEGORY (теги для організацій)
-- ============================================================================
INSERT INTO organization_category (organization_id, category_id) VALUES
  (1, 2),  -- Rescue → Тварини
  (1, 6),  -- Rescue → Соціальна допомога
  (2, 1),  -- EcoKyiv → Екологія
  (2, 3);  -- EcoKyiv → Освіта

-- ============================================================================
-- 8. PROJECT (події)
-- ============================================================================
INSERT INTO project (id, organization_profile_id, title, description, status, starts_at, ends_at, main_content, what_volunteers_will_do, why_its_important, time, application_deadline, location_id, category_id, partners, image_url) VALUES
  (1, 1, 'Прогулянка з собаками з притулку',
      'Допоможи вигуляти собак з притулку «Друг» — 2 години у суботу.',
      'ACTIVE', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days 2 hours',
      'Притулок «Друг» приймає 80+ собак. Раз на тиждень нам потрібно 10 волонтерів щоб вигуляти всіх.',
      'Вигуляти 1-2 собак протягом години, погратися, дати воду.',
      'Соціалізація — критично важлива для собак що довго в притулку.',
      'Субота, 10:00 - 12:00', NOW() + INTERVAL '5 days', 1, 2,
      'Притулок «Друг», ZooLviv', 'https://placehold.co/600x400/ffa94d/ffffff/png?text=Dogs+Walk'),

  (2, 1, 'Стерилізація вуличних котів',
      'Збір волонтерів-водіїв для перевезення вуличних котів до клініки.',
      'ACTIVE', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days 6 hours',
      'Програма OSK — стерилізація і повернення. Цикл 1 день: ловіння → клініка → повернення.',
      'Допомогти ловити котів пастками, перевезти до клініки, повернути на місце.',
      'Контроль популяції без жорстокості.',
      'Неділя, 8:00 - 14:00', NOW() + INTERVAL '12 days', 1, 2,
      'Ветклініка «Лапа»', 'https://placehold.co/600x400/74c0fc/ffffff/png?text=TNR'),

  (3, 2, 'Прибирання Голосіївського парку',
      'Великий екосуботник — збираємо сміття в парку, отримуємо мерч.',
      'ACTIVE', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days 4 hours',
      'Голосіївський парк — улюблене місце відпочинку киян. Раз на сезон робимо генеральне прибирання.',
      'Збирати сміття у мішки (інвентар надаємо), сортувати на пластик/скло/папір.',
      'Прибрана природа = більше людей хочуть проводити час на свіжому повітрі.',
      'Субота, 9:00 - 13:00', NOW() + INTERVAL '8 days', 2, 1,
      'КП «Київзеленбуд», Plastic Free Ukraine', 'https://placehold.co/600x400/8ce99a/ffffff/png?text=Park+Cleanup'),

  (4, 2, 'Висадка дерев у школі №125',
      'Висаджуємо 50 саджанців у дворі школи разом з учнями.',
      'DRAFT', NOW() + INTERVAL '21 days', NOW() + INTERVAL '21 days 5 hours',
      'Школа №125 виділила територію під невеликий гай. Саджанці донорив EcoKyiv.',
      'Копати ями, висаджувати дерева, поливати, проводити мініекскурсію для учнів.',
      'Діти що висадили дерево — берегтимуть його.',
      'П''ятниця, 10:00 - 15:00', NOW() + INTERVAL '19 days', 2, 3,
      'Школа №125', 'https://placehold.co/600x400/63e6be/ffffff/png?text=Trees');

SELECT setval('project_id_seq', (SELECT MAX(id) FROM project));

INSERT INTO project_category (project_id, category_id) VALUES
  (1, 2), (1, 6),
  (2, 2),
  (3, 1), (3, 6),
  (4, 1), (4, 3), (4, 8);

-- ============================================================================
-- 9. PROJECT_REGISTRATION (записи на події)
-- ============================================================================
INSERT INTO project_registration (project_id, user_id, status) VALUES
  (1, 4, 'CONFIRMED'),  -- Анна → Прогулянка
  (1, 5, 'PENDING'),    -- Петро → Прогулянка
  (1, 6, 'PENDING'),    -- Марія → Прогулянка
  (3, 4, 'CONFIRMED'),  -- Анна → Прибирання парку
  (3, 5, 'CONFIRMED');  -- Петро → Прибирання парку

-- ============================================================================
-- 10. NEWS (новини)
-- ============================================================================
INSERT INTO news (id, title, image_url, is_pinned, description, main_content, created_by, organization_id) VALUES
  (1, 'Підсумки 2025: 320 врятованих тварин',
      'https://placehold.co/600x400/ff8787/ffffff/png?text=Rescue+2025', TRUE,
      'Дякуємо всім хто допомагав нам впродовж року.',
      'У 2025 році команда Rescue Львів рятувала тварин 24/7. Загальна статистика: 320 тварин знайшли дім, 510 пройшли стерилізацію, 12 ветклінік стали партнерами. Найбільше дякуємо нашим волонтерам — без вас ми б не змогли зробити й третини.',
      2, 1),
  (2, 'Висадили 200 дерев у Києві',
      'https://placehold.co/600x400/69db7c/ffffff/png?text=Trees+200', FALSE,
      'Спільна акція з мерією та школами столиці.',
      'У квітні провели 4 акції з озеленення районів Києва. Усього висаджено 200 саджанців: дуб, клен, липа, береза. Кожне дерево має GPS-точку — будемо моніторити приживаність.',
      3, 2),
  (3, 'Шукаємо IT-волонтерів',
      'https://placehold.co/600x400/4dabf7/ffffff/png?text=IT+Help', FALSE,
      'Допоможіть зробити сайт для притулку.',
      'Rescue Львів шукає frontend та backend розробників на pro bono проект — система обліку тварин у притулку. Технології: Angular + NestJS. Терміни — 2 місяці. Запис у формі.',
      2, 1);

SELECT setval('news_id_seq', (SELECT MAX(id) FROM news));

INSERT INTO news_category (news_id, category_id) VALUES
  (1, 2),
  (2, 1),
  (3, 2);

-- ============================================================================
-- 11. FUNDRAISING_CAMPAIGN (збори)
-- ============================================================================
INSERT INTO fundraising_campaign (id, organization_profile_id, volunteer_profile_id, title, description, main_content, goal_amount, current_amount, status, start_at, end_at, jar_link, image_url) VALUES
  (1, 1, NULL, 'Корм та ліки для притулку «Друг»',
      'Збір на місячну норму корму та ветеринарних препаратів для 80 собак.',
      'Кожен місяць притулок витрачає ~45 000 грн на корм + ~15 000 грн на ліки. Зараз каса порожня. Будь-яка сума допоможе.',
      60000.00, 23450.00, 'ACTIVE', NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days',
      'https://send.monobank.ua/jar/demoRescueFood',
      'https://placehold.co/600x400/ffd43b/ffffff/png?text=Food+%26+Meds'),

  (2, 2, NULL, 'Інвентар для екосуботників',
      'Купуємо мішки, рукавиці, граблі — для 5 наступних прибирань.',
      'Один екосуботник на 50 людей коштує близько 4 500 грн (мішки + рукавиці одноразові + інструменти багаторазові). Збираємо на 5 акцій.',
      25000.00, 25000.00, 'COMPLETED', NOW() - INTERVAL '60 days', NOW() - INTERVAL '10 days',
      'https://send.monobank.ua/jar/demoEcoTools',
      'https://placehold.co/600x400/a9e34b/ffffff/png?text=Eco+Tools'),

  (3, NULL, 2, 'Ноутбуки для дітей-переселенців',
      'Особистий збір Петра: 10 ноутбуків для дітей з гуртожитку ВПО.',
      'У гуртожитку для ВПО в Києві живуть 10 дітей шкільного віку. У них немає техніки для дистанційного навчання. Купимо вживані ноутбуки на OLX.',
      40000.00, 8200.00, 'ACTIVE', NOW() - INTERVAL '3 days', NOW() + INTERVAL '30 days',
      'https://send.monobank.ua/jar/demoLaptops',
      'https://placehold.co/600x400/9775fa/ffffff/png?text=Laptops');

SELECT setval('fundraising_campaign_id_seq', (SELECT MAX(id) FROM fundraising_campaign));

INSERT INTO fundraising_category (campaign_id, category_id) VALUES
  (1, 2), (1, 6),
  (2, 1),
  (3, 8), (3, 10), (3, 3);

-- ============================================================================
-- 12. DONATION (донати)
-- ============================================================================
INSERT INTO donation (campaign_id, amount, donor_name, message, user_id) VALUES
  (1, 500.00,  'Анна М.',      'Тримайтесь, ви молодці!', 4),
  (1, 1000.00, 'Олег',         'За мою колишню собаку', NULL),
  (1, 250.00,  'Анонім',       NULL, NULL),
  (1, 200.00,  'Марія',        'Скільки можу', 6),
  (1, 21500.00,'Великий донор',NULL, NULL),
  (2, 5000.00, 'Партнерська компанія', 'На добру справу', NULL),
  (2, 20000.00,'Анонімний жертводавець', NULL, NULL),
  (3, 1000.00, 'Колишній колега Петра', 'Тримай, друже', NULL),
  (3, 7200.00, 'Анна М.',      'Передай дітям привіт', 4);

-- ============================================================================
-- 13. APPROVAL_REQUEST (заявки на модерацію)
-- ============================================================================
-- Усі демо-проекти/новини/збори вже APPROVED щоб одразу були видні в публ. списках
INSERT INTO approval_request (type, status, entity_id, submitted_by, reviewed_by, reviewed_at) VALUES
  ('PROJECT',     'APPROVED', 1, 2, 1, NOW() - INTERVAL '6 days'),
  ('PROJECT',     'APPROVED', 2, 2, 1, NOW() - INTERVAL '6 days'),
  ('PROJECT',     'APPROVED', 3, 3, 1, NOW() - INTERVAL '6 days'),
  ('PROJECT',     'PENDING',  4, 3, NULL, NULL),
  ('NEWS',        'APPROVED', 1, 2, 1, NOW() - INTERVAL '30 days'),
  ('NEWS',        'APPROVED', 2, 3, 1, NOW() - INTERVAL '15 days'),
  ('NEWS',        'APPROVED', 3, 2, 1, NOW() - INTERVAL '3 days'),
  ('FUNDRAISING', 'APPROVED', 1, 2, 1, NOW() - INTERVAL '5 days'),
  ('FUNDRAISING', 'APPROVED', 2, 3, 1, NOW() - INTERVAL '60 days'),
  ('FUNDRAISING', 'APPROVED', 3, 5, 1, NOW() - INTERVAL '3 days');

-- ============================================================================
-- 14. TASK (мікрозавдання в межах проектів)
-- ============================================================================
INSERT INTO task (id, project_id, title, description, status, difficulty, points_reward_base, location_id, deadline) VALUES
  (1, 1, 'Привезти корм у притулок',
      'Забрати 5 мішків корму з магазину та довезти до притулку.',
      'OPEN', 'EASY', 10, 1, NOW() + INTERVAL '6 days'),
  (2, 3, 'Координація групи на прибиранні',
      'Інструктаж нових волонтерів, роздача інвентарю.',
      'OPEN', 'MEDIUM', 25, 2, NOW() + INTERVAL '10 days');

SELECT setval('task_id_seq', (SELECT MAX(id) FROM task));

INSERT INTO task_category (task_id, category_id) VALUES
  (1, 2), (1, 6),
  (2, 1);

-- ============================================================================
-- 15. REWARD (нагороди за бали)
-- ============================================================================
INSERT INTO reward (id, title, description, cost_points, stock, is_active) VALUES
  (1, 'Стікерпак Hand&Hand',  'Набір з 5 вініл-стікерів',                       50, 100, TRUE),
  (2, 'Футболка Hand&Hand',   'Бавовняна футболка, унісекс',                   200, 30,  TRUE),
  (3, 'Кружка Hand&Hand',     'Керамічна кружка 330мл',                        100, 50,  TRUE),
  (4, 'Сертифікат подяки',    'Іменний PDF-сертифікат за активність',           20, 999, TRUE);

SELECT setval('reward_id_seq', (SELECT MAX(id) FROM reward));

-- ============================================================================
-- 16. POINTS_TRANSACTION (історія балів)
-- ============================================================================
INSERT INTO points_transaction (user_id, amount, type, reason) VALUES
  (4,  50, 'EARN',  'Завершено task #1: привіз корм'),
  (4,  70, 'EARN',  'Участь у проекті #3: прибирання парку'),
  (5,  30, 'EARN',  'Реєстрація на проект #1'),
  (5,  50, 'EARN',  'Участь у проекті #3: прибирання парку');

-- ============================================================================
-- 17. ORGANIZATION_MEMBERSHIP_REQUEST (запит на вступ до орг)
-- ============================================================================
INSERT INTO organization_membership_request (organization_id, user_id, direction, status) VALUES
  (1, 6, 'REQUEST', 'PENDING'),  -- Марія хоче приєднатись до Rescue
  (2, 4, 'INVITE',  'PENDING');  -- EcoKyiv запросив Анну

COMMIT;

-- ============================================================================
-- Швидкі перевірки після сідингу
-- ============================================================================
-- SELECT email, role, status FROM app_user;
-- SELECT id, name, verification_status FROM organization_profile;
-- SELECT id, title, status FROM project;
-- SELECT id, title, current_amount, goal_amount, status FROM fundraising_campaign;
