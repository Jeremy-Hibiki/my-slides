---
theme: default
title: Claude Code 使用指南
canvasWidth: 1400
info: Claude Code 入门 + 进阶
# class: text-center
transition: view-transition
comark: true
fonts:
  provider: coollabs
  sans: 苹方-简
  serif: Noto Serif CJK SC
  mono: Cascadia Mono
  local: [苹方-简, Noto Serif CJK SC, Cascadia Mono]
---

# Claude Code 使用指南

## 入门 + 进阶 + Tips

中研院 数据平台 · 蒋正颀

jiangzhengqi@fmsh.com.cn

<Toc :columns="4"/>

<div class="abs-br m-6 flex gap-2 text-sm opacity-50">
  <span>2026.05</span>
</div>

---

# 安装

## 1. 安装 Node.js (推荐 24 版本)

- Windows 安装: https://registry.npmmirror.com/-/binary/node/latest-v24.x/node-v24.9.0-x64.msi
- Linux 安装: https://registry.npmmirror.com/-/binary/node/latest-v24.x/node-v24.9.0-linux-x64.tar.xz

## 2.1 通过 NPM 安装 Claude Code

- NPM 是 Node.js 的包管理器, 类似于 Python 的 pip、Java 的 Maven 等, 或者是 Ubuntu 的 apt 等
  ```bash
  npm config set -g registry https://registry.npmmirror.com
  ```

- 执行命令
  ```bash
  npm install -g @anthropic-ai/claude-code@latest
  ```

- 截止 v2.1.133 版本, 会下载约 70 MB 的文件, 请耐心等待

- 后续如果升级也执行相同的命令

---

# 安装

## 1. 安装 Node.js (推荐 24 版本)

- Windows 安装: https://registry.npmmirror.com/-/binary/node/latest-v24.x/node-v24.9.0-x64.msi
- Linux 安装: https://registry.npmmirror.com/-/binary/node/latest-v24.x/node-v24.9.0-linux-x64.tar.xz

## 2.2 离线安装 Claude Code（无网环境安装）

- 下载提供的 `.tgz` 包
  - `anthropic-ai-claude-code-2.1.133.tgz`
  - 下面两个根据系统二选一:
    - `anthropic-ai-claude-code-win32-x64-2.1.133.tgz`
    - `anthropic-ai-claude-code-linux-x64-2.1.133.tgz`

- 执行命令（以 Linux 服务器为例）
  ```bash
  npm install -g ./anthropic-ai-claude-code-2.1.133.tgz ./anthropic-ai-claude-code-win32-x64-2.1.133.tgz
  ```

---

# 启动

## 3. 启动 Claude Code

在项目目录下执行 `claude` 即可启动

```bash
claude                              # 交互式启动
claude "修复 login bug"             # 带初始提示
claude --continue                   # 继续上次会话
claude --resume                     # 打开会话选择器
claude -p "运行测试" --permission-mode dontAsk  # CI/CD 非交互模式
```

首次启动需选择认证方式：Anthropic 账号登录 / API Key / 配置反向代理（见后文 settings.json）

---

layout: section

---

# 基础使用

---

# 权限模式

`Shift+Tab` 循环切换，`--permission-mode` 启动时指定

| 模式 | 自动放行 | 场景 |
|------|---------|------|
| `default` | 仅读取 | 入门 / 敏感操作 |
| `acceptEdits` | 读取 + 文件编辑 + `mkdir`/`mv`/`cp` 等 | **日常开发（推荐）** |
| `plan` | 仅读取，不编辑 | 先分析再动手 |
| `auto` | 全部（独立分类器审查） | 长任务（需 Max/Team/API） |
| `dontAsk` | 仅 `allow` 预批准的工具 | CI/CD |
| `bypassPermissions` | 全部，无保护 | 仅限隔离容器 |

**受保护路径**（始终需确认）：`.git`, `.vscode`, `.env`, `.bashrc`, `.zshrc`, `.mcp.json`

---

# 权限规则

**评估顺序**：`deny` → `ask` → `allow`（deny 始终优先）

<div grid="~ cols-2 gap-6">

```json
// ~/.claude/settings.json
{
  "permissions": {
    "allow": [
      "Bash(tree:*)",
      "Bash(ls:*)",
      "Bash(ruff check:*)",
      "Bash(uv sync:*)",
      "Skill(glm-plan-usage:usage-query:*)"
    ],
    "deny": [
      "Read(.env*)",
      "Edit(.env*)",
      "Bash(cat *.env*)",
      "Bash(head *.env*)",
      "Read(**/__pycache__)"
    ],
    "defaultMode": "acceptEdits"
  }
}
```

<div>

| 规则 | 匹配 |
|------|------|
| `Bash` 或 `Bash(*)` | 所有 Bash 命令 |
| `Bash(npm test)` | 精确匹配 |
| `Bash(npm run *)` | 通配符前缀 |
| `Read(.env*)` | 当前目录 .env |
| `Edit(/src/**/*.ts)` | 项目 src 下 ts |
| `mcp__github` | 整个 MCP Server |
| `Skill(a:b:c)` | 特定 Skill 工具 |

内置只读命令免确认：`ls`, `cat`, `grep`, `find`, `git log` ...

</div>

</div>

---

# settings.json 配置

<div grid="~ cols-2 gap-6">

<div>

**设置优先级**

```
托管策略 (Managed)    ← IT 管理，不可覆盖
  ↓
CLI 参数              ← 启动时指定
  ↓
本地覆盖              ← .claude/settings.local.json
  ↓                    （gitignored，个人偏好）
项目配置              ← .claude/settings.json
  ↓                    （git 提交，团队共享）
用户配置              ← ~/.claude/settings.json
                       （个人，所有项目生效）
```

**deny 在任意层级设置后，其他层级都无法 allow**

</div>

<div>

**完整配置示例**（`~/.claude/settings.json`）

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
    "ANTHROPIC_MODEL": "glm-5.1",
    "ANTHROPIC_AUTH_TOKEN": "your-api-key",
    "ENABLE_LSP_TOOL": "1",
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1",
    "DISABLE_TELEMETRY": "1",
    "DISABLE_COST_WARNINGS": "1"
  },
  "permissions": {
    "allow": ["Bash(tree:*)", "Bash(ls:*)"],
    "deny": ["Read(.env*)", "Edit(.env*)"],
    "defaultMode": "acceptEdits"
  },
  "enabledPlugins": {
    "pyright-lsp@claude-plugins-official": true,
    "typescript-lsp@claude-plugins-official": true
  },
  "language": "简体中文, Chinese"
}
```

</div>

</div>

---

# settings.json 环境变量

<div grid="~ cols-2 gap-6">

<div>

**模型与连接**

| 变量 | 说明 |
|------|------|
| `ANTHROPIC_BASE_URL` | API 地址（可指向代理/私有部署） |
| `ANTHROPIC_MODEL` | 默认模型名 |
| `ANTHROPIC_AUTH_TOKEN` | API Key |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | 覆盖 Sonnet 层模型 |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | 覆盖 Haiku 层模型 |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | 覆盖 Opus 层模型 |
| `API_TIMEOUT_MS` | 超时（毫秒） |

</div>

<div>

**功能开关**

| 变量 | 说明 |
|------|------|
| `ENABLE_LSP_TOOL` | 启用 LSP 代码智能 |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | 启用 Agent Teams |
| `CLAUDE_CODE_NO_FLICKER` | 禁用终端闪烁 |
| `DISABLE_TELEMETRY` | 禁用遥测数据 |
| `DISABLE_COST_WARNINGS` | 禁用费用警告 |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | 禁用非必要网络请求 |

**其他顶层配置**

| 字段 | 说明 |
|------|------|
| `enabledPlugins` | 已启用插件 |
| `statusLine` | 自定义状态栏命令 |
| `teammateMode` | Teammate 模式（`in-process`） |
| `teammateDefaultModel` | Teammate 默认模型层级 |
| `verbose` | 详细输出模式 |

</div>

</div>

---

# CLAUDE.md — 持久指令

<div grid="~ cols-2 gap-6">

<div>

**文件位置**

| 范围 | 路径 | 共享 |
|------|------|------|
| 项目指令 | `./CLAUDE.md` 或 `./.claude/CLAUDE.md` | Git |
| 用户偏好 | `~/.claude/CLAUDE.md` | 个人 |
| 本地覆盖 | `./CLAUDE.local.md` | 个人（.gitignore） |

**加载**：从当前目录向上遍历，所有文件拼接。子目录按需加载。

**路径规则** `.claude/rules/*.md` — 仅匹配特定文件时加载：

```yaml
---
paths:
  - "src/api/**/*.ts"
---
# API 开发规则
- 所有接口必须包含输入校验
```

</div>

<div>

**编写要点**

- **< 200 行**，过长消耗上下文且降低遵从度
- 写具体可验证的规则
- 用 `/init` 自动生成初始版本

```markdown
# 项目约定
- 使用 pnpm，禁止 npm/yarn
- 组件用 `<script setup>` 语法
- 提交前运行 `pnpm test`
- API 路由在 `src/api/routes/`
```

**Auto Memory** — Claude 自动学习你的偏好

- 存储在 `~/.claude/projects/<path>/memory/`
- 用 `/memory` 浏览、编辑、开关
- 你纠正两次的错误，Claude 会自动记住

</div>

</div>

---

layout: section

---

# 进阶使用

---

# MCP — 连接外部工具

<div grid="~ cols-2 gap-6">

<div>

**3 种传输方式**

```bash
# HTTP（推荐，远程服务）
claude mcp add --transport http notion \
  https://mcp.notion.com/mcp

# SSE
claude mcp add --transport sse sentry \
  https://mcp.sentry.dev/mcp

# stdio（本地进程）
claude mcp add db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://localhost/mydb"
```

**3 种作用域**

| 作用域 | 存储 | 共享 |
|--------|------|------|
| Local | `~/.claude.json` | 个人/当前项目 |
| Project | `.mcp.json`（项目根） | 团队/Git |
| User | `~/.claude.json` | 个人/所有项目 |

</div>

<div>

**管理命令**

```bash
claude mcp list          # 列出所有
claude mcp get github    # 查看详情
claude mcp remove github # 删除
/mcp                     # 会话内查看状态和工具数
```

**热门 MCP 服务器**

| 服务 | 命令 |
|------|------|
| GitHub | `--transport http https://api.githubcopilot.com/mcp/` |
| Sentry | `--transport http https://mcp.sentry.dev/mcp` |
| Notion | `--transport http https://mcp.notion.com/mcp` |
| Stripe | `--transport http https://mcp.stripe.com` |
| 数据库 | `--transport stdio -- npx -y @bytebase/dbhub --dsn ...` |

`.mcp.json` 支持 `${VAR}` 环境变量展开，API Key 不用硬编码

</div>

</div>

---

# Plugins — 扩展能力

<div grid="~ cols-2 gap-6">

<div>

**安装与管理**

```bash
# 浏览可用插件
/plugin                  # 打开 Discover 标签页

# 安装（3 种作用域：User / Project / Local）
/plugin install github@claude-plugins-official
/plugin install typescript-lsp@claude-plugins-official
/plugin install commit-commands@claude-plugins-official

# 管理
/plugin disable github@claude-plugins-official
/plugin enable github@claude-plugins-official
/reload-plugins          # 重载所有插件（无需重启）
```

**官方市场热门插件**

| 类别 | 插件 | 功能 |
|------|------|------|
| 代码智能 | `typescript-lsp` | TS 类型检查、跳转定义 |
| | `pyright-lsp` | Python 类型检查 |
| | `gopls-lsp` | Go 代码智能 |
| 集成 | `github` | PR / Issue 操作 |
| | `sentry` | 错误监控查询 |
| 开发流 | `commit-commands` | Git commit/push/PR |

</div>

<div>

**插件结构**

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json      # 清单文件
├── skills/               # 自定义 Skills
├── agents/               # 自定义 Subagents
├── hooks/hooks.json      # Hooks
├── .mcp.json             # MCP 服务器
├── .lsp.json             # LSP 配置
└── settings.json         # 默认设置
```

**开发时加载**：`claude --plugin-dir ./my-plugin`

**添加第三方市场**

```bash
/plugin marketplace add anthropics/claude-code
/plugin marketplace list
/plugin marketplace remove marketplace-name
```

**团队共享**：在 settings.json 中配置 `extraKnownMarketplaces`

</div>

</div>

---

# Skills — 自定义工作流

<div grid="~ cols-2 gap-6">

<div>

**Skill 文件结构**

```
.claude/skills/
└── code-review/
    └── SKILL.md
```

**SKILL.md 格式**

```markdown
---
description: 审查代码的最佳实践和潜在问题。
  当 Review 代码或检查 PR 时自动触发。
---

审查代码时检查：
1. 代码组织和结构
2. 错误处理是否完善
3. 安全隐患
4. 测试覆盖是否充分
```

- Claude 根据 `description` 自动判断何时调用
- 用 `/技能名` 手动调用
- 提交到 Git 即可团队共享

</div>

<div>

**Bundled Skills（内置）**

| Skill | 功能 |
|-------|------|
| `/review` | 代码 Review |
| `/simplify` | 审查代码质量并修复 |
| `/batch` | 大规模并行代码变更（worktree 隔离） |
| `/loop` | 定时循环执行（`/loop 5m check deploy`） |
| `/security-review` | 安全审查 |
| `/fewer-permission-prompts` | 自动生成 allow 规则 |
| `/debug` | 读取 debug log 分析问题 |

**传递参数**：Skill 中用 `$ARGUMENTS` 接收用户输入

```markdown
---
description: 生成 API 文档
---
为 $ARGUMENTS 路径下的路由生成 API 文档...
```

调用：`/api-doc src/api/routes/`

</div>

</div>

---

# Subagent vs Agent Team

<div grid="~ cols-2 gap-6">

<div>

### Subagent

- **单会话内**的临时外包工
- 运行在独立上下文窗口，完成后返回摘要
- **单向汇报**：只能把结果返回给主 Agent
- 主 Agent 不受子任务日志/搜索结果的上下文污染
- 适合聚焦型任务：调研、代码审查、验证

**自定义 Subagent**：`.claude/agents/reviewer.md`

```yaml
---
name: security-reviewer
description: 安全审查代码
model: claude-haiku-4-5
tools:
  - Read
  - Grep
  - Bash(npm audit *)
---
检查以下安全问题：XSS、SQL 注入、
认证绕过...审查 $ARGUMENTS
```

</div>

<div>

### Agent Team（需 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`）

- **跨会话**的持久工程小队
- 每个 Teammate 是完全独立的 Claude 实例
- **双向通信**：队友间可互发消息，共享任务队列
- 支持 `in-process`（`Shift+Down` 切换）/ `split panes`（tmux 窗格）
- 适合需要协调的复杂工作

| | Subagent | Agent Team |
|---|---------|------------|
| 通信 | 只回报主 Agent | 队友间互发消息 |
| 成本 | 低（返回摘要） | 高（每个独立实例） |
| 生命周期 | 完成即销毁 | 持续存在 |
| 适用 | `审查这个 PR` | `三人并行重构 + 互审` |

</div>

</div>

---

# Hooks — 生命周期自动化

<div grid="~ cols-2 gap-6">

<div>

**Hook 类型**

| 类型 | 说明 |
|------|------|
| `command` | 执行 shell 命令 |
| `http` | POST 到 HTTP 端点 |
| `prompt` | 单轮 LLM 判断 |
| `agent` | 多轮 Agent 验证 |
| `mcp_tool` | 调用 MCP 工具 |

**关键事件**

| 事件 | 时机 | 能做什么 |
|------|------|---------|
| `PreToolUse` | 工具调用前 | **阻止** / 放行 |
| `PostToolUse` | 工具调用后 | 自动格式化等 |
| `UserPromptSubmit` | 用户提交 prompt | 注入上下文 |
| `Notification` | Claude 等待输入 | 桌面通知 |
| `Stop` | Claude 停止 | 验证任务完整性 |
| `SessionStart` | 会话开始 | 加载环境 |

</div>

<div>

**实战配置**

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.file_path'
                     | xargs npx prettier --write"
      }]
    }],
    "Notification": [{
      "matcher": "idle_prompt",
      "hooks": [{
        "type": "command",
        "command": "notify-send 'Claude Code' '任务完成'"
      }]
    }],
    "Stop": [{
      "hooks": [{
        "type": "prompt",
        "prompt": "检查所有测试是否通过。
          如果没通过，返回 {ok:false, reason:'...'}"
      }]
    }]
  }
}
```

`/hooks` 查看已配置的 Hooks

</div>

</div>

---

# 实用技巧

<div grid="~ cols-2 gap-6">

<div>

**上下文管理**

- 长会话跑 `Ctrl+O` 看 Transcript，了解什么在吃上下文
- `/compact` 压缩释放空间，`/compact focus on API 变更` 定向压缩
- `/context` 可视化上下文用量
- 用 Subagent 隔离大量搜索/日志，主会话只拿摘要

**并行工作**

- **Git Worktree** + 多终端 = 3-5 个 Claude 同时工作
- `/batch` 一键大规模迁移（自动 worktree 隔离 + 并行 PR）
- `Ctrl+B` 把长时间命令丢到后台

**Plan Mode**

```bash
> /plan 分析 auth 模块，制定 OAuth 方案
# Claude 只读取不编辑，输出计划后你审批
# 审批后自动切换到执行模式
```

</div>

<div>

**高效 Prompt**

```bash
# 给验证标准（Claude 表现最好的方式之一）
> 实现 validateEmail，测试用例:
> 'user@example.com' → true
> 'invalid' → false
> 实现后运行测试

# 引用具体文件 + 具体约束
> 修改 src/api/user.ts 的 getUserList，
> 参考 src/api/order.ts 的分页实现

# 委托而非指挥
> checkout 过期卡片有问题，
> src/payments/ 里的代码，调查并修复
```

**其他**

- `/btw` 工作时旁问，不进对话历史
- `!npm test` 直接执行 shell（不经过 Claude）
- 每次新任务前 `/clear` 保持上下文干净

</div>

</div>

---

# /loop 与 Ralph Loop — 持续迭代

<div grid="~ cols-2 gap-6">

<div>

### /loop — 内置定时任务

会话内 cron 调度，自动周期性执行提示

```bash
# 定时循环
/loop 5m check deploy           # 每 5 分钟检查部署状态
/loop 1h review open PRs        # 每小时检查 PR

# 用法
/loop <interval> <prompt>       # interval: 30s / 5m / 1h
/loop off                       # 停止循环
```

- 最长运行 **3 天**，会话退出即停止
- 支持 `durable: true` 写入磁盘，重启后恢复
- 适合：部署监控、定时审查、轮询状态

</div>

<div>

### Ralph Loop — 自主迭代插件

拦截 Claude 退出信号，强制重新注入上下文，直到任务达标

```bash
# 安装
/plugin install ralph-loop@claude-plugins-official

# 使用
/ralph 实现用户注册功能，所有测试通过才算完成
```

**原理**：Claude 说"完成了" → Stop Hook 判断未达标 → 阻断退出 → 重新注入 → 继续迭代

**适用场景**

| 场景 | 示例 |
|------|------|
| 自动修复 | "改到所有测试通过为止" |
| 代码审计 | "审计 src/ 下所有安全问题" |
| 迭代开发 | "实现 PRD 直到功能完整" |

**注意**：消耗 Token 较多，建议配合 `acceptEdits` 或 `auto` 模式

</div>

</div>

---

# 快捷键

<div grid="~ cols-2 gap-4">

**控制**

| 快捷键 | 功能 |
|--------|------|
| `Shift+Tab` | 循环权限模式 |
| `Ctrl+C` | 中断 |
| `Ctrl+O` | Transcript 观察器 |
| `Ctrl+G` | 外部编辑器编辑 prompt |
| `Ctrl+L` | 清屏重绘 |
| `Esc` `Esc` | 回退到 Checkpoint |
| `Ctrl+B` | 后台运行当前任务 |
| `Ctrl+T` | 切换任务列表 |

**输入**

| 快捷键 | 功能 |
|--------|------|
| `Enter` | 发送 |
| `Shift+Enter` / `Ctrl+J` | 换行不发送 |
| `Ctrl+V` | 粘贴图片到 prompt |
| `Ctrl+R` | 搜索命令历史 |

**模式切换**

| 快捷键 | 功能 |
|--------|------|
| `Alt+P` | 切换模型 |
| `Alt+T` | 切换 Extended Thinking |
| `Alt+O` | 切换 Fast Mode |

**Quick Commands**

| 前缀 | 功能 |
|------|------|
| `/` | 命令 / Skill |
| `!` | Shell 模式（`!npm test`） |
| `@` | 引用文件路径 |
| `Shift+Down` | 切换 Agent Team 队友 |

</div>

---

# 常用命令速查

| 命令 | 功能 |
|------|------|
| `/init` | 生成 CLAUDE.md（`CLAUDE_CODE_NEW_INIT=1` 交互式） |
| `/plan` | 进入 Plan 模式 |
| `/clear` | 新会话（旧的可在 `/resume` 恢复） |
| `/compact` | 压缩上下文 |
| `/model` | 切换模型 |
| `/context` | 上下文用量可视化 |
| `/permissions` | 管理权限规则 |
| `/diff` | 查看未提交变更 |
| `/memory` | 管理 CLAUDE.md 和 Auto Memory |
| `/doctor` | 诊断安装问题 |
| `/btw` | 旁问（不进历史、不中断当前工作） |
| `/plugin` | 插件管理（Discover / Installed / Marketplaces） |
| `/mcp` | MCP 服务器状态 |
| `/hooks` | 查看 Hooks 配置 |
| `/review` | 代码 Review |
| `/simplify` | 代码质量审查 + 修复 |
| `/batch` | 大规模并行变更 |
| `/loop` | 定时循环（`/loop 5m check deploy`） |
| `/security-review` | 安全审查 |
| `/usage` | 查看费用和使用量 |

---

layout: center
class: text-center
---

# 资源

<div class="mt-8 text-lg">

<a href="https://code.claude.com/docs" target="_blank">官方文档</a>
&nbsp;·&nbsp;
<a href="https://claude.com/plugins" target="_blank">插件市场</a>
&nbsp;·&nbsp;
<a href="https://github.com/anthropics/claude-code" target="_blank">GitHub</a>
&nbsp;·&nbsp;
<a href="https://github.com/anthropics/claude-code/issues" target="_blank">Issue</a>

</div>

<div class="mt-12 text-sm opacity-60">
文档索引：`code.claude.com/docs/llms.txt` · 加 `.md` 后缀直接读 Markdown
</div>
