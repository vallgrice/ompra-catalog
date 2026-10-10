# Совместимость подборки с Ompra / OMP

Дата аудита: 2026-10-10. Проверка исходников, без изменения движка, GUI и индексов каталога.

**Проверенная база:** OMP 18.8.6, репозиторий `nornzach/oh-my-pi`, engine commit `ba05fea603b57ae15e31f8c9d08719e8de419407`. Ниже пути `packages/coding-agent/...` считаются от корня этого репозитория. Пути `src/...` с пометкой **GUI** считаются от корня `vallgrice/oh-my-pi-gui`, текущей локальной рабочей копии Ompra на базе GUI 0.9.18. GUI содержит локальные изменения: номера строк относятся к рабочей копии на дату аудита, а не к опубликованному commit.

## Вывод

Текущий движок позволяет устанавливать настоящие MCP-коннекторы через каталог: для первой поставки подходят HTTP-пакеты без секретов, публичные серверы документации и OAuth-провайдеры с проверенной совместимостью. Наличие MCP endpoint само по себе не доказывает возможность входа из Ompra, доступа к аккаунту или полноту инструментов относительно ChatGPT.

Проверка исходников не заменяет проверку сервиса. Статус «готов к публикации» нужно присваивать только после acceptance checks ниже. Каталог OpenAI не является источником переносимых credentials, разрешений или готовых к установке в OMP пакетов.

## Формат устанавливаемого MCP-пакета

Наши существующие пакеты объявляют Agent Plugins 1.0.0 через root `plugin.json`. Для такого пакета используется **root `mcp.json`**, а не legacy `.mcp.json`:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  "mcpServers": {
    "api": {
      "type": "streamable-http",
      "url": "https://provider.example/mcp"
    }
  }
}
```

URL выше — пример, не рекомендуемый сервис. После обнаружения имя сервера будет `<plugin.json.name>:api`.

- `packages/coding-agent/src/discovery/agent-plugin-format.ts:23` — точный MCP schema URL.
- `packages/coding-agent/src/discovery/agent-plugin-format.ts:434` — проверка root-документа; допустимые типы `stdio`, `streamable-http`, `sse`.
- `packages/coding-agent/src/discovery/agent-plugins.ts:243` — чтение и containment-проверка root `mcp.json`.
- `packages/coding-agent/src/discovery/agent-plugins.ts:290` — namespace имени сервера.

Для стандартного remote-сервера допустимы только `type`, `url`, `headers`; для stdio — `type`, `command`, `args`, `env`, `cwd`. Неизвестные поля, в том числе `oauth`, `auth`, `enabled`, `timeout`, отклоняют соответствующую запись: `packages/coding-agent/src/discovery/agent-plugin-format.ts:40` и `:405`. Отсутствующий или неправильный `$schema` отключает MCP-компонент пакета, хотя корректные skills могут продолжить загружаться.

Legacy `.mcp.json` поддерживается другими discovery providers, но пакет с нашим стандартным `plugin.json` не следует смешивать с legacy-конвенциями.

## Авторизация, ключи и переносимость

1. **OAuth HTTP.** Пакет содержит только endpoint. Пользователь устанавливает пакет, открывает MCP и выбирает **Reauthorize**. Движок находит также package-discovered сервер, выполняет discovery, PKCE/DCR, открывает существующий браузерный диалог и хранит credentials в профиле. Definition-only HTTP-конфигурация использует credential binding по URL и не требует переписывать пакет: `packages/coding-agent/src/modes/rpc/rpc-mcp-extra.ts:430`, `:694`, `:710`, `:820`.
2. **Совместимость OAuth нужно подтвердить.** Без advertised dynamic client registration и без заранее настроенного client ID движок требует ручной `oauth.clientId`: `packages/coding-agent/src/mcp/oauth-flow.ts:749`. Текущий GUI wizard передаёт transport/command/args/env либо transport/url/headers, но не предоставляет поля static OAuth client ID: **GUI** `src/renderer/components/panels/mcp/McpServerWizard.tsx:130`. Такие сервисы нельзя обозначать как готовые к входу одним нажатием без дополнительной реализации или инструкции.
3. **Headers стандартного пакета literal/origin-locked.** `Authorization: Bearer ${TOKEN}` не подставит пользовательский ключ. Не публиковать секреты и не выдавать такую заглушку за рабочую конфигурацию: `packages/coding-agent/src/discovery/agent-plugins.ts:303`; `packages/coding-agent/src/mcp/manager.ts:2027`.
4. **Stdio.** Стандарт разворачивает только `${PLUGIN_ROOT}` и `${PLUGIN_DATA}`; `${MY_API_KEY}` остаётся буквальной строкой. Подпроцесс наследует окружение OMP и затем накладывает env пакета: `packages/coding-agent/src/discovery/agent-plugin-format.ts:243`; `packages/coding-agent/src/mcp/transports/stdio.ts:581`. Настройки plugin Settings автоматически в MCP не передаются. Для `npx` нужен установленный Node/npm, а внешние зависимости и browser binaries не становятся portable автоматически.
5. **UI до входа.** Стандартный OAuth wrapper без auth/oauth полей может показывать `authState: none`, disconnected и 0 tools. Это не доказывает отсутствие необходимости авторизации: `packages/coding-agent/src/modes/rpc/rpc-domains.ts:178`. Каталог должен отдельно и честно указывать необходимость аккаунта и шаг входа.
6. **Лицензия wrapper и условия сервиса различаются.** MIT нашего wrapper не означает MIT у подключаемого облачного сервиса. Author должен различать автора пакета Ompra и разработчика внешней интеграции; нельзя подразумевать официальное одобрение провайдером.

GUI Reauthorize и открытие браузера уже существуют: **GUI** `src/renderer/components/panels/mcp/McpServerCard.tsx:216`; `src/renderer/components/dialogs/ExtensionDialog.tsx:507`.

### Ограничение кнопки Test

`mcp_test({name})` ищет только writable user/project config. Package-discovered сервер может работать, но Test по имени вернёт `Server not found`: `packages/coding-agent/src/modes/rpc/rpc-mcp-extra.ts:202` и `:265`.

Возможная будущая адаптация GUI без изменения движка: для discovered-only HTTP/SSE сервера без дополнительных headers тестировать inline `{config: {transport, url}}`; URL-keyed OAuth credentials при этом доступны. Это не общий fallback: `RpcMcpServerInfo` не содержит полных args/env/headers, поэтому восстановить произвольный сервер из этой структуры нельзя. Пока исправление не реализовано и не проверено, не обещать безошибочную кнопку Test для всех wrapper-пакетов.

## Когда MCP скрывается или отключается

### Общие ограничения

- Restricted sessions не обнаруживают и не наследуют MCP: `packages/coding-agent/src/sdk.ts:2481`.
- `mcp.enableProjectConfig: false` исключает все project-level определения до дедупликации; это относится и к MCP из project-level пакетов. User-level определения могут остаться: `packages/coding-agent/src/mcp/config.ts:133`.
- User `disabledServers` подавляет имя независимо от исходного `enabled`. `enabledServers` может вернуть definition с `enabled: false`, но не отменяет denylist и последующие фильтры Exa/browser: `packages/coding-agent/src/mcp/config.ts:128`, `:141`, `:164`.
- Выключение самого пакета исключает его компоненты из discovery; это отдельный уровень от включения/выключения MCP-сервера. Проверять оба состояния после restart.

### Exa

Фильтр по умолчанию включён (`filterExa ?? true`), обычный SDK и RPC reload явно передают `true`: `packages/coding-agent/src/mcp/config.ts:105`; `packages/coding-agent/src/sdk.ts:2510`; `packages/coding-agent/src/modes/rpc/rpc-mcp-extra.ts:149`.

Распознавание Exa: точное имя `exa` без учёта регистра, либо `mcp.exa.ai` в HTTP/SSE URL, либо в stdio args. Namespaced имя `wrapper:exa` само по себе не совпадает с точным `exa`; один только package name `exa-mcp-server` в args тоже не равнозначен URL-маркеру. Источник: `packages/coding-agent/src/mcp/config.ts:187`.

| Запрошенные tools распознанного Exa-сервера | Что делает pinned OMP |
| --- | --- |
| Нет явного ограничения tools | Удаляет весь MCP-сервер из загружаемой конфигурации |
| Только `web_search_exa` | Удаляет весь MCP-сервер: это имя считается покрытым native Exa |
| Явно указан хотя бы один tool вне `web_search_exa` | Сохраняет весь MCP-сервер, включая запрошенные native и extra tools |

Tools читаются из query `tools=` HTTP URL либо stdio `--tools`, `-tools`, `--tools=...` и поддерживаемых строковых форм. Проверка имён относительно native-набора case-insensitive. Примеры extra tools в исходниках: `web_fetch_exa`, `web_search_advanced_exa`; их сегодняшнюю доступность у сервиса нужно проверять отдельно. Источник: `packages/coding-agent/src/mcp/config.ts:248`, `:254`, `:300`; regression tests `packages/coding-agent/test/mcp-exa-filter.test.ts:42`.

При фильтрации движок извлекает найденный Exa API key для native-интеграции; это не означает, что native-поиск доступен без подходящих credentials. В публичном каталоге не должно быть ключей в URL. Для generic Exa wrapper нельзя обещать инструменты MCP по умолчанию без явной конфигурации и проверки extra tools.

### Playwright и другие browser MCP

**Начальный startup:** browser-фильтр включается только когда одновременно: session unrestricted, `browser.enabled = true`, Eval зарегистрирован и активен. Если хотя бы одно условие не выполнено, helper возвращает false. Источник: `packages/coding-agent/src/mcp/config.ts:373`; применение `packages/coding-agent/src/sdk.ts:2473` и `:2512`; tests `packages/coding-agent/test/mcp-exa-filter.test.ts:20`.

Фильтр удаляет **весь распознанный сервер и все его MCP tools**, а не отдельные действия. Распознавание включает:

- точные bare server names `puppeteer`, `playwright`, `browserbase`, `browser-tools`, `browser-use`, `browser`;
- `@playwright/mcp` и перечисленные browser packages в stdio command/args;
- `browserbase.com` или `browser-use.com` в HTTP/SSE URL.

Namespaced имя само по себе с bare name не совпадает, но Playwright wrapper с args `@playwright/mcp@...` всё равно распознаётся по args. Произвольный удалённый browser endpoint на другом домене может не распознаться. Источник: `packages/coding-agent/src/mcp/config.ts:378`, `:388`, `:399`, `:404`, `:444`.

**Важное текущее расхождение:** RPC reload после add/reauth и `reload_plugins` передают в filterBrowser только `browser.enabled`, без повторной проверки активности Eval: `packages/coding-agent/src/modes/rpc/rpc-mcp-extra.ts:138`; `packages/coding-agent/src/modes/rpc/rpc-session-actions.ts:94`. Поэтому MCP, видимый после startup без активного Eval, может исчезнуть после такого reload при включённом browser.enabled. Не скрывать это ограничение в карточке Playwright.

**Live toggle:** включение native browser отключает распознанные browser MCP, выключение заново подключает их с учётом обычной конфигурации. Переключения сериализованы; native-флаг сам по себе не устанавливает Playwright или браузер: `packages/coding-agent/src/mcp/manager.ts:641`, `:696`; обновление session tools `packages/coding-agent/src/session/agent-session.ts:2523`. Отдельный `omp read` не имеет Eval prelude и явно оставляет browser MCP нефильтрованными: `packages/coding-agent/src/cli/read-cli.ts:95`.

## Ограничения опубликованной GUI schema

О текущем GUI 0.9.18 с локальными изменениями; это не возможности всех будущих версий.

| Поле/возможность | Что принимает текущая schema |
| --- | --- |
| `schemaVersion` | Только `1` |
| `kind` | `skill`, `extension`, `mcp` |
| `category` | `review`, `testing`, `debugging`, `refactoring`, `documentation`, `security`, `integration` |
| `icon` | Только 8 встроенных идентификаторов; внешние brand/logo URL отсутствуют |
| `requirements` | Только runtimes `node` / `bun` / `python` / `git`, boolean account/network |
| `evidence.status` | `bundled` / `documented`; это не readiness и не сертификат совместимости |
| Локализация | EN и ZH обязательны; RU необязателен |
| Размер | До 100 plugins, 30 marketplaces; сетевой документ до 256 KiB |
| Metadata-only / planned / manual / OAuth-ready | Отдельного поля readiness или action/setup нет |

Источники: **GUI** `src/shared/plugin-catalog.ts:45`, `:51`, `:55`, `:56`, `:61`, `:68`, `:96`; ограничение bytes **GUI** `src/main/plugin-catalog.ts:15`.

Schema strict: произвольные новые поля, категории `productivity` / `design` / `business`, секции «Популярные» и статусы `ready` / `planned` нельзя просто добавить в `catalog.json` — старый клиент отклонит документ. Remote catalog не может ссылаться на bundled/local marketplace: **GUI** `src/shared/plugin-catalog.ts:151`.

Карточка текущей витрины связана с native marketplace install, а не произвольной ссылкой подключения: **GUI** `src/renderer/components/panels/plugins/use-plugin-store.ts:247` и `:289`. Поэтому исследуемые интеграции без рабочего пакета/проверенного flow должны оставаться в отдельной подборке/roadmap, а не появляться как будто устанавливаемые. Для витрины, близкой к OpenAI, отдельным GUI-этапом нужны совместимое расширение schema, тематические секции, логотипы, provider/setup/readiness и разные реальные действия подключения.

## Acceptance checklist перед публикацией пакета

Ниже критерии, а не заявление о выполненных live-тестах каждой интеграции.

- [ ] Проверены первичные источники провайдера: endpoint, transport, supported tools, авторизация, тариф/аккаунт и ограничения клиента; зафиксирована дата и ссылка.
- [ ] Пакет содержит корректные `plugin.json`, `mcp.json`, package metadata и лицензию. Standard parser не даёт disabled/warnings. Конфигурация не смешивает standard и legacy.
- [ ] В публичных файлах нет tokens, secrets, реальных user IDs/account URLs, shell-подстановок ключей или неработающих `${TOKEN}` headers. MIT wrapper не выдаётся за лицензию сервиса.
- [ ] Источник установки закреплён на immutable Git SHA; native marketplace и GUI metadata согласованы по name/version/source. `node scripts/validate.mjs` и GUI schema validation проходят.
- [ ] Реальный bundled OMP устанавливает wrapper из публичного источника в свежий профиль без model API/provider keys. Нельзя считать каталог-parser или mock RPC достаточной проверкой runtime.
- [ ] После restart `get_mcp_servers` показывает ожидаемый namespaced сервер. Для public MCP подтверждены реальные tools/list и ненулевой toolCount; содержимое sample tool matches заявленным возможностям.
- [ ] Для OAuth подтверждены discovery/DCR либо описан реальный static-client setup. Браузерный вход проверен с явно авторизованным тестовым аккаунтом; без такого аккаунта статус остаётся «runtime auth не проверен», а не «готов». Отмена не повреждает прежние credentials.
- [ ] API-key сервис имеет реальный локальный способ ввода/хранения ключа без изменения публичного пакета; секрет не оказывается в git, логах или карточке.
- [ ] Проверены native filters: Exa tools restriction; Playwright/browser.enabled off/on, активный/неактивный Eval, startup и RPC reload; project config off; server и plugin disable/enable.
- [ ] Проверены разрыв сети, таймаут, ошибка входа, повторное подключение; UI не показывает installed как доказательство authorized/connected.
- [ ] Для discovered-only Test учтено текущее ограничение native RPC; кнопка не выдаётся за универсально рабочую без проверенной GUI-адаптации.
- [ ] Upgrade/disable/uninstall и перенос portable папки не оставляют tools от удалённого пакета; пользовательские settings и credentials сохраняются ожидаемым образом.
- [ ] Карточка называет внешнего провайдера, account/network/runtime prerequisites, шаг авторизации, статус фактической проверки и ограничения. EN/ZH согласованы, RU добавлен для подборки.

Предпочтительный первый vertical slice: один public documentation MCP и один действительно проверенный OAuth MCP, затем расширение подборки по тем же критериям. Большой список неподключаемых брендов не заменяет работающий каталог.
