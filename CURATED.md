# Подборка для каталога Ompra

Проверено по документации разработчиков **10 октября 2026 года**. Предлагается
**34 карточки на базе 28 интеграций**. Семь карточек Google используют один
Workspace-коннектор с выбором сервисов и разрешений.

Это подборка для расширения каталога. Авторизованные подключения из Ompra ещё
не проверены; перечисленные интеграции пока не добавлены в установочный
`catalog.json`. Публичный каталог по-прежнему содержит шесть собственных навыков.

## Ориентир и принцип отбора

[Каталог OpenAI](https://chatgpt.com/plugins) — ориентир для разделов, карточек,
поиска и сценариев. Дополнительный источник — официальный публичный
[openai/plugins](https://github.com/openai/plugins), где доступны примеры
манифестов, навыков и MCP-конфигураций. Документация OpenAI описывает
[плагины как набор навыков и/или MCP-инструментов](https://developers.openai.com/plugins/concepts/plugins).

Наша рекомендация — близкий набор рабочих сценариев: код, документы, поиск,
командная работа, дизайн и бизнес. В первую очередь отобраны сервисы с
документированным публичным способом подключения. Наличие карточки у OpenAI
само по себе не даёт стороннему клиенту доступ к сервису или его OAuth-приложению.

Метки ниже обозначают **способ будущего подключения**, а не подтверждённую
работоспособность в Ompra. «Официальный» относится к серверу поставщика;
Google Workspace через community bridge явно помечен как сторонняя интеграция.
Для облачных сервисов сохраняются требования аккаунта, тарифа и разрешений.

## Первая очередь — 12 инструментов

| Инструмент | Польза | Условие подключения |
|---|---|---|
| [Context7](https://github.com/upstash/context7/blob/master/packages/mcp/README.md) | Актуальные инструкции и примеры для библиотек | Remote MCP; базовый режим без ключа, с лимитами |
| [Firecrawl](https://docs.firecrawl.dev/mcp-server/keyless) | Поиск и извлечение содержимого сайтов | Ограниченный remote-режим без ключа; расширение через аккаунт |
| [GitHub](https://github.com/github/github-mcp-server) | Репозитории, issues, PR и Actions | Личный токен; для OAuth нужна регистрация клиента Ompra |
| [Supabase](https://supabase.com/docs/guides/ai-tools/mcp) | Структура БД, SQL, миграции и журналы | OAuth или токен; начать с конкретного проекта и read-only |
| [Notion](https://developers.notion.com/guides/mcp/overview) | Поиск, страницы и базы знаний | Hosted MCP с OAuth |
| [Linear](https://linear.app/docs/mcp) | Задачи, проекты и комментарии | OAuth или ключ; есть read-only endpoint |
| [Atlassian](https://atlassian.github.io/atlassian-mcp-server/) | Jira и Confluence | Hosted MCP v2; доступ к сайту и политика администратора |
| [Sentry](https://mcp.sentry.dev/) | Ошибки и диагностика приложений | OAuth; рекомендуется ограничить проектом |
| [PostHog](https://github.com/PostHog/posthog/blob/master/services/mcp/README.md) | Аналитика, эксперименты и feature flags | Remote MCP; документирован личный API-ключ |
| [Render](https://render.com/docs/mcp-server) | Развёртывания и журналы сервисов | Remote MCP с личным API-ключом |
| [Plane](https://developers.plane.so/dev-tools/mcp-server) | Задачи и планирование проекта | Hosted OAuth или PAT с указанием workspace |
| [Jotform](https://www.jotform.com/developers/mcp/) | Формы и ответы пользователей | OAuth; обычный API key для MCP не поддерживается |

Сначала следует подтвердить полный цикл для Context7 и Firecrawl: установка
пакета → появление MCP → получение инструментов → запрос агента → отключение.
Затем тот же цикл для одного OAuth-сервиса и одного подключения с личным токеном.
Остальные карточки первой очереди публикуются после аналогичной проверки.

Чтобы сохранить компактную portable-поставку, remote MCP подключаются по HTTP.
Node/Python, браузеры и локальные серверы устанавливаются только по выбору
пользователя для нужной интеграции. Включать все зависимости подборки в EXE
не требуется.

## Полный состав

### Разработка — 9 карточек

| Карточка | Рабочий сценарий | Настройка и ограничения |
|---|---|---|
| [GitHub](https://github.com/github/github-mcp-server) | Найти issue, разобраться в коде, подготовить PR | PAT; собственный OAuth-клиент для удобного входа |
| [Supabase](https://supabase.com/docs/guides/ai-tools/mcp) | Проверить схему, запросы и миграции | OAuth/PAT, выбор проекта; read-only по умолчанию |
| [Render](https://render.com/docs/mcp-server) | Разобраться с неуспешным deploy по журналам | API key и права на выбранный workspace |
| [Railway](https://docs.railway.com/ai/mcp-server) | Управлять сервисом и диагностировать deploy | Remote OAuth или современный `railway mcp`; старый npm-сервер deprecated |
| [Vercel](https://vercel.com/docs/agent-resources/vercel-mcp) | Проекты, deploy и журналы | Подключение account-инструментов требует одобренного клиента |
| [Context7](https://github.com/upstash/context7/blob/master/packages/mcp/README.md) | Найти документацию под версию зависимости | Keyless remote с лимитами; повышенные лимиты через ключ |
| [Playwright](https://github.com/microsoft/playwright-mcp) | Проверить интерфейс, консоль и сетевые запросы | Node ≥18 и браузер отдельно; учитывать встроенный Browser OMP |
| [Superpowers](https://github.com/obra/superpowers) | Планирование, TDD, отладка и ревью | MIT-навыки; upstream Pi-интеграцию нужно адаптировать и проверить для OMP |
| [Shopify Dev](https://shopify.dev/docs/apps/build/ai-toolkit) | Разрабатывать Shopify-приложения по документации и API-схемам | Локальный Node-сервер; это developer tools, доступ к управлению магазином не подтверждён |

### Продуктивность — 9 карточек

Google-карточки ниже — **community bridge**
[taylorwilsdon/google_workspace_mcp](https://github.com/taylorwilsdon/google_workspace_mcp).
Нужны Python, uv, Google Cloud project, включённые API и собственные OAuth
credentials. Минимальная версия Python в текущем
[pyproject.toml](https://raw.githubusercontent.com/taylorwilsdon/google_workspace_mcp/main/pyproject.toml)
— 3.10; для нашей инструкции разумно выбрать 3.11+. Пакет MIT, аккаунт Google
и данные остаются под условиями Google. Runtime и credentials нужно разместить
в portable-профиле и проверить переносимость.

| Карточка | Рабочий сценарий | Подключение |
|---|---|---|
| Gmail | Разобрать переписку и подготовить ответы | Общий Workspace bridge; доступ только к выбранным mail scopes |
| Google Drive | Найти и прочитать файлы, организовать папки | Тот же bridge, отдельный набор Drive scopes |
| Google Calendar | Проверить занятость и подготовить встречу | Тот же bridge, Calendar scopes |
| Google Docs | Создать и отредактировать документ | Тот же bridge, Docs/Drive scopes по операции |
| Google Sheets | Обновить таблицу и разобрать данные | Тот же bridge, Sheets/Drive scopes по операции |
| Google Slides | Подготовить и изменить презентацию | Тот же bridge, Slides/Drive scopes по операции |
| Google Contacts | Найти контакт или группу | Тот же bridge, People scopes |
| [Notion](https://developers.notion.com/guides/mcp/get-started-with-mcp) | Вести знания, планы и страницы | Официальный hosted OAuth MCP |
| [Dropbox](https://help.dropbox.com/integrations/connect-dropbox-mcp-server) | Найти и организовать рабочие файлы | Официальная beta; для Ompra нужны собственное Dropbox app/OAuth или одобрение |

Альтернативный путь для Google — официальный
[Workspace MCP Developer Preview](https://developers.google.com/workspace/guides/configure-mcp-servers).
Он требует допуска в Preview, настройки Cloud project/APIs и OAuth. Это вариант
подключения тех же продуктов, а не ещё восемь самостоятельных карточек.

### Задачи и проекты — 4 карточки

| Карточка | Рабочий сценарий | Подключение |
|---|---|---|
| [Linear](https://linear.app/docs/mcp) | Превратить запрос в задачи, уточнить статус проекта | OAuth или ключ; read-only доступен отдельно |
| [Atlassian](https://atlassian.github.io/atlassian-mcp-server/) | Связать задачу Jira с документацией Confluence | Официальный MCP v2; Cloud account и административные политики |
| [Plane](https://developers.plane.so/dev-tools/mcp-server) | Вести work items, циклы и проектные страницы | Hosted OAuth/PAT; для приватного self-hosted есть отдельный локальный сервер |
| [Asana](https://developers.asana.com/docs/integrating-with-asanas-mcp-server) | Задачи, проекты и отчёты | Предварительная регистрация OAuth-приложения; DCR отсутствует |

### Коммуникации — 2 карточки

| Карточка | Рабочий сценарий | Подключение |
|---|---|---|
| [Slack](https://docs.slack.dev/ai/slack-mcp-server/) | Найти обсуждение, прочитать тред, подготовить сообщение | Собственное зарегистрированное internal/Marketplace app, OAuth и разрешения workspace; DCR отсутствует |
| [Microsoft 365 Work IQ](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/work-iq/mcp/overview) | Работать с контекстом Outlook, Teams и файлов | Организация Microsoft 365, Entra/admin consent и актуальные условия доступа/оплаты |

Microsoft 365 предлагается одной честно описанной enterprise-карточкой.
Поддержка личного Outlook.com и независимых универсальных Outlook/Teams
подключений в Ompra этим исследованием не подтверждена.

### Поиск и исследования — 2 карточки

| Карточка | Рабочий сценарий | Подключение |
|---|---|---|
| [Firecrawl](https://docs.firecrawl.dev/mcp-server/keyless) | Найти источники и извлечь содержимое страницы | Keyless remote для ограниченного набора инструментов; аккаунт для расширенного доступа |
| [Exa](https://exa.ai/docs/get-started/exa-mcp) | Веб-поиск и сбор материалов | Базовый keyless remote, OAuth/API key для расширения; проверить фильтрацию Exa в OMP |

### Дизайн — 3 карточки

| Карточка | Рабочий сценарий | Что требуется до публикации |
|---|---|---|
| [Figma](https://developers.figma.com/docs/figma-mcp-server/) | Взять структуру макета и реализовать её в коде | Remote допускает клиентов из каталога Figma; отдельно проверить локальный MCP в Figma Desktop для Other editors |
| [Canva](https://www.canva.dev/docs/apps/mcp/access/) | Создавать, изменять и экспортировать дизайн | Собственная признанная OAuth-интеграция; client secret нельзя вшивать в portable EXE |
| [tldraw](https://github.com/tldraw/tldraw/blob/main/apps/mcp-app/README.md) | Создавать и редактировать диаграммы на холсте | Поддержка MCP Apps и widget bridge в Ompra; отдельно проверить лицензионные условия SDK |

Для интерактивных холстов и встроенных редакторов нужна
[поддержка MCP Apps на стороне клиента](https://apps.extensions.modelcontextprotocol.io/api/documents/Overview.html).
Она включает изолированный iframe, обмен сообщениями, lifecycle и передачу темы.
Наличие текстового MCP-инструмента не подтверждает наличие полноценного холста.

### Бизнес и аналитика — 5 карточек

| Карточка | Рабочий сценарий | Подключение |
|---|---|---|
| [Sentry](https://mcp.sentry.dev/) | Разобрать сбой, связать ошибки с кодом | Hosted OAuth; ограничение организацией/проектом |
| [PostHog](https://github.com/PostHog/posthog/blob/master/services/mcp/README.md) | Метрики, эксперименты и feature flags | Hosted MCP; личный API-ключ, выбранные tool groups и права проекта |
| [Stripe](https://docs.stripe.com/mcp) | Разобрать billing и данные тестового аккаунта | OAuth или Agent API key; начать с sandbox/read-only. С 31.10.2026 обычные ключи без Agent tag не принимаются MCP |
| [HubSpot](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server) | Работать с CRM и связанными активностями | Собственный MCP connector/OAuth; набор функций зависит от роли и подписки |
| [Jotform](https://www.jotform.com/developers/mcp/) | Создать форму и обработать ответы | OAuth; поддерживаются бесплатные и платные аккаунты с их лимитами |

## Как приблизить витрину к OpenAI

1. **Стартовый экран:** редакционная полка «Рекомендуем» из 12 карточек выше;
   затем тематические разделы. Отдельная полка «Новое» строится по дате публикации.
   Название «Популярное» появляется при наличии измеряемой статистики.
2. **Компактные карточки:** значок, название, одна строка пользы, действие.
   Поиск по названию, сценариям и категориям. Семь сервисов Google могут быть
   отдельными карточками, но должны показывать общую установку Workspace.
3. **Страница интеграции:** 2–3 примера запросов, возможности, ограничения,
   автор, официальный/community статус, зависимости, авторизация, условия
   сервиса, версия пакета и дата нашей проверки. Внешний бренд не означает
   партнёрство с Ompra.
4. **Действие зависит от состояния:** «Установить» → «Подключить аккаунт» →
   «Подключено»; для неподдержанного пути — «Инструкция» или «В разработке».
   Установка пакета сама по себе не считается подключением сервиса.
5. **Установленные:** отдельно от общедоступного каталога, с управлением аккаунтом,
   разрешениями, отключением, удалением и обновлением. Ошибка сети, истёкший
   вход или отсутствующий runtime должны иметь понятное действие восстановления.
6. **Обе темы:** единая геометрия карточек и панелей, контрастные значки и
   состояния для светлой/тёмной темы. Редакционный список приходит из GitHub,
   подключение и выполнение инструментов остаются в локальном приложении.

## Требования перед установочной публикацией

- На каждую интеграцию: настоящий OMP-пакет либо поддерживаемый setup flow.
  Стандартный Agent Plugin использует root `plugin.json` и `mcp.json`;
  конфиги из других клиентов требуют преобразования.
- Код фиксируется версией и неизменяемым Git SHA. Remote MCP остаётся внешним
  изменяемым сервисом; обновление метаданных не должно молча обновлять локальный код.
- Секреты вводятся локально. OAuth client ID/connector ID другого приложения
  не переносится в Ompra. Не следует публиковать `Bearer ${TOKEN}` в стандартном
  пакете: OMP воспринимает такие headers буквально.
- Проверяются реальная установка, discovery, auth/cancel/logout, `tools/list`,
  разрешённый вызов инструмента, отключение/удаление и повторный запуск.
  Для локальных серверов — отсутствие записи вне portable-профиля и перенос папки.
- Подключения с фиксированным OAuth-клиентом требуют соответствующих полей
  настройки или отдельного setup flow в GUI. Универсального DCR недостаточно
  для сервисов с предварительным одобрением.
- Публикация выдаёт точные статусы «проверена документация» и «проверено подключение».
  Наш MIT wrapper не меняет лицензию стороннего кода и условия облачного сервиса.

Текущая схема витрины не поддерживает все эти состояния и тематические разделы.
Её нужно расширить перед импортом подборки. Подробности текущего движка и GUI —
в [аудите совместимости](research/omp-compatibility.md).

## Что исключено из первой подборки

- Старые локальные Notion MCP и `@railway/mcp-server`: у поставщиков есть более
  актуальные рекомендуемые пути, указанные выше.
- Shopify Admin «управляет всем магазином»: исследованные официальные Dev и
  Storefront MCP не подтверждают такой универсальный доступ.
- Gusto, MagicPath, творческие и развлекательные сервисы без проверенного
  подходящего публичного подключения: вернуться после отдельного аудита.
- Копирование всех документных навыков Anthropic под MIT: их
  [репозиторий](https://github.com/anthropics/skills) различает открытые навыки
  и source-available document skills; лицензию нужно проверять для каждого пакета.

## Файлы исследования

- [curation.json](curation.json) — машинная подборка, статусы и примеры запросов;
  отдельный draft, не установочный feed приложения.
- [research/developer-tools.json](research/developer-tools.json) — 13 технических
  интеграций с первичными источниками и вариантами подключения.
- [research/productivity.json](research/productivity.json) — 15 интеграций,
  включая альтернативные пути Google и Shopify, с условиями авторизации.
- [research/observability.json](research/observability.json) — Sentry и PostHog,
  способы доступа и ограничения проверки.
- [research/omp-compatibility.md](research/omp-compatibility.md) — ограничения
  закреплённой версии OMP и проверки для адаптеров.

Конфигурации в research — справочные примеры из документации, они не являются
готовыми манифестами OMP. В подборке отсутствуют credentials пользователя,
установка пакетов и действия с аккаунтами не выполнялись.
