# Claude Code 实用技巧、最佳实践与进阶功能调研报告

> 调研日期: 2026-05-07 | 来源: 官方文档 + 社区最佳实践
> 用途: 团队内部分享幻灯片素材

---

## 一、真实世界的使用模式与工作流

### 1.1 并行会话 + Git Worktree（最大生产力提升）

Anthropic 官方团队推荐的工作方式：**同时运行 3-5 个 Claude 会话**，每个在独立的 git worktree 中。

```bash
# Claude Code 内置 worktree 支持
# 建议做法：
# - 为每个 worktree 命名
# - 设置 shell alias（za, zb, zc）快速切换
# - 终端标签页用颜色区分
# - 开启终端通知，知道哪个 Claude 需要你注意
```

**核心原则**: 保留一个 "分析" worktree 专门用于读日志和跑查询。

### 1.2 Plan Mode（规划模式）

- 按 `Shift+Tab` 切换到 Plan Mode
- **典型流程**: 进入 Plan Mode -> 完善计划 -> 切换到 acceptEdits -> Claude 执行
- 适用场景: 复杂任务、多文件修改、架构决策
- "把精力倾注在计划上，让 Claude 一次性完成实现"

### 1.3 反馈闭环（验证 -- 头号技巧）

> "给 Claude 一个验证自己工作的方法，最终结果质量会显著提升。"

- 包含测试命令、linter 检查、预期输出
- 如果 Claude 能自己关闭反馈闭环，它会迭代到输出正确为止
- 不同领域的验证方式：bash 命令、测试套件、模拟器、浏览器测试

### 1.4 CLAUDE.md 最佳实践

| 建议 | 说明 |
|------|------|
| 保持简洁 | 控制在 60 行以内 |
| 作为 AI 入职文档 | 像给新员工写的项目说明 |
| 持续迭代 | 每次 Claude 犯错后，添加规则到 CLAUDE.md |
| 团队共享 | 提交到 git，整个团队共同维护 |
| 项目级 vs 用户级 | `./CLAUDE.md`（项目级）和 `~/.claude/CLAUDE.md`（用户级） |

**关键习惯**: 每次纠正后追加: "Update your CLAUDE.md so you don't make that mistake again."

### 1.5 Effort Level（推理力度）

```
/effort low    -- 更少 token，更快
/effort medium -- 默认
/effort high   -- 推荐用于所有工作（Team/Enterprise 默认）
/effort max    -- 硬核调试、架构决策
/effort auto   -- Claude 自动决定
```

### 1.6 模型选择建议

Anthropic 团队原话: "Opus with thinking 是我用过的最好的编程模型，虽然比 Sonnet 更大更慢，但需要更少的引导，工具使用更好，最终几乎总是比用小模型更快。"

**数学**: 更少的引导 + 更好的工具使用 = 整体更快的结果。

---

## 二、MCP 服务器：发现、安装与管理

### 2.1 MCP 是什么

MCP（Model Context Protocol）让 Claude Code 连接到外部工具和服务，扩展其能力。每个 MCP 服务器提供一组工具（tools），Claude 可以调用这些工具来与外部系统交互。

### 2.2 两种配置方式

**方式一：CLI 命令（推荐）**

```bash
# 基本语法
claude mcp add <name> [options] -- <command> [args...]

# 常用选项
#   -s user       # 用户级（全局）
#   -s project    # 项目级
#   -e KEY=VALUE  # 环境变量
#   --transport stdio  # 传输方式（默认）
#   --transport sse    # SSE 远程服务器
```

**方式二：配置文件**

在 `.claude/settings.json`（项目级）或 `~/.claude.json`（用户级）中：

```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "some-mcp-server"],
      "env": {
        "API_KEY": "your-key"
      }
    }
  }
}
```

或在项目根目录创建 `.mcp.json` 文件。

### 2.3 管理命令

```bash
claude mcp list              # 列出已配置的服务器
claude mcp remove <name>     # 移除服务器
claude mcp add <name> ...    # 添加服务器
```

### 2.4 常见 MCP 服务器配置示例

**GitHub MCP**
```bash
claude mcp add github -s user -- npx -y @modelcontextprotocol/server-github
# 需要 GITHUB_PERSONAL_ACCESS_TOKEN 环境变量
```

**文件系统访问**
```bash
claude mcp add filesystem -s user \
  -- npx -y @modelcontextprotocol/server-filesystem ~/Documents
```

**Brave Search**
```bash
claude mcp add brave-search -s user \
  -- env BRAVE_API_KEY=<your_key> npx -y @anthropic/mcp-server-brave-search
```

**Notion**
```bash
claude mcp add notion -- npx @notionhq/notion-mcp-server \
  -e NOTION_API_KEY=your_key_here
```

**Sentry**
```bash
# 通过插件方式安装（见下文插件部分）
/plugin install sentry@claude-plugins-official
```

**Stripe / Linear / Slack / Figma** 等都可以通过官方插件市场一键安装。

### 2.5 官方 MCP 服务器仓库

[github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) -- 包含所有参考实现和社区服务器列表。

---

## 三、自定义 Skills（技能）

### 3.1 什么是 Skills

Skills 是扩展 Claude Code 能力的自定义命令，用 Markdown 文件定义，通过 `/name` 调用。如果你重复某个操作超过一天一次，就应该把它变成 Skill。

### 3.2 文件格式与位置

**推荐格式**（新）:
```
.claude/skills/<name>/SKILL.md
```

**兼容格式**（旧）:
```
.claude/commands/<name>.md
```

### 3.3 SKILL.md 文件结构

一个典型的 Skill 文件是纯 Markdown，包含：

```markdown
---
description: "简要描述这个 Skill 做什么"
---

# Skill 标题

这里写 Claude 应该执行的指令。

## 步骤

1. 第一步做什么
2. 第二步做什么

## 注意事项

- 注意点 1
- 注意点 2
```

**关键字段**:
- `description`: 出现在 Skill 列表中，Claude 根据它决定是否自动调用
- 正文: 具体的指令和步骤

### 3.4 Claude 如何发现 Skills

1. **手动调用**: 输入 `/` 查看所有可用 Skills，输入 `/name` 直接调用
2. **自动调用**: Skills 在 `SKILL.md` 格式下，Claude 可以根据 description 自主决定是否调用
3. **发现范围**: 项目级 `.claude/skills/` > 用户级 `~/.claude/skills/` > 插件提供的 Skills

### 3.5 实用 Skill 示例

**示例 1: 初始化新模块**
```markdown
# .claude/skills/init-module/SKILL.md
---
description: "初始化一个新的项目模块，包含标准目录结构和配置文件"
---

创建一个新的模块，遵循以下规范：

1. 创建标准目录结构: src/, tests/, docs/
2. 添加 package.json / tsconfig.json
3. 创建 README.md
4. 配置 ESLint 和 Prettier
5. 初始化 git 并创建初始提交
```

**示例 2: 代码审查**
```markdown
# .claude/skills/review/SKILL.md
---
description: "对当前 git diff 进行全面代码审查"
---

审查当前暂存的更改：

1. 运行 `git diff --staged` 查看变更
2. 检查代码质量、安全性、性能
3. 验证是否有对应测试
4. 输出审查报告
```

### 3.6 内联 Bash（高级）

Skills 支持内联 Bash 命令，在调用时预计算信息：

```markdown
---
description: "显示当前 git 状态并建议下一步"
---

当前状态:
```bash
git status
git log --oneline -5
```

基于以上状态，分析并建议下一步操作。
```

### 3.7 团队共享

将 `.claude/skills/` 目录提交到 git 仓库，团队所有成员自动获得这些 Skills。

---

## 四、插件系统（Plugins）

### 4.1 什么是插件

插件是一个打包单元，可以包含 Skills、Agents、Hooks、MCP 服务器和 LSP 配置。插件通过市场（Marketplace）分发。

### 4.2 官方市场

Anthropic 官方市场 `claude-plugins-official` 自动可用。运行 `/plugin` 进入 Discover 标签浏览。

### 4.3 安装命令

```bash
# 从官方市场安装
/plugin install github@claude-plugins-official
/plugin install sentry@claude-plugins-official
/plugin install notion@claude-plugins-official

# 也可以用 CLI
claude plugin install <plugin-name>
claude plugin install <plugin-name> --scope project   # 项目级

# 从第三方市场安装
/plugin install plugin-name@marketplace-name
```

### 4.4 安装作用域

| 作用域 | 说明 |
|--------|------|
| User（默认） | 全局安装，所有项目可用 |
| Project | 安装到 `.claude/settings.json`，团队共享 |
| Local | 仅自己在当前项目可用 |
| Managed | 管理员通过企业策略安装 |

### 4.5 管理命令

```bash
/plugin                          # 打开插件管理器（交互式）
/plugin install <name>@<market>  # 安装
/plugin disable <name>@<market>  # 禁用（不卸载）
/plugin enable <name>@<market>   # 重新启用
/plugin uninstall <name>@<market># 完全卸载
/reload-plugins                  # 重新加载插件（无需重启）
/plugin validate                 # 验证插件
```

### 4.6 官方插件分类

**代码智能（LSP 插件）**:
| 语言 | 插件名 | 需要的二进制 |
|------|--------|-------------|
| Python | pyright-lsp | pyright-langserver |
| TypeScript | typescript-lsp | typescript-language-server |
| Go | gopls-lsp | gopls |
| Rust | rust-analyzer-lsp | rust-analyzer |
| C/C++ | clangd-lsp | clangd |
| Java | jdtls-lsp | jdtls |

安装后，Claude 在每次文件编辑后自动获取类型错误、缺失导入等诊断信息。

**外部集成**:
- 源码管理: `github`, `gitlab`
- 项目管理: `atlassian`(Jira/Confluence), `asana`, `linear`, `notion`
- 设计: `figma`
- 基础设施: `vercel`, `firebase`, `supabase`
- 通信: `slack`
- 监控: `sentry`

**开发工作流**:
- `commit-commands`: Git 提交工作流
- `pr-review-toolkit`: PR 审查专用 agents
- `plugin-dev`: 创建自己的插件

### 4.7 添加第三方市场

```bash
# 从 GitHub 仓库添加
/plugin marketplace add owner/repo

# 从 Git URL 添加
/plugin marketplace add https://gitlab.com/company/plugins.git

# 从本地路径添加
/plugin marketplace add ./my-marketplace

# 从远程 URL 添加
/plugin marketplace add https://example.com/marketplace.json
```

### 4.8 创建自己的市场

只需要一个包含 `.claude-plugin/marketplace.json` 的 git 仓库。

### 4.9 团队配置市场

在 `.claude/settings.json` 中：

```json
{
  "extraKnownMarketplaces": {
    "my-team-tools": {
      "source": {
        "source": "github",
        "repo": "your-org/claude-plugins"
      }
    }
  }
}
```

---

## 五、Subagents vs Agent Teams：精确区别

### 5.1 核心区别对照表

| 维度 | Subagents（子代理） | Agent Teams（代理团队） |
|------|---------------------|------------------------|
| **上下文** | 独立上下文窗口，结果返回给调用者 | 独立上下文窗口，完全独立运行 |
| **通信** | 只能向主代理报告结果 | 团队成员之间可以直接互相发消息 |
| **协调** | 主代理管理所有工作 | 共享任务列表，自主协调 |
| **生命周期** | 短暂的，执行完即消失（"fire-and-forget"） | 持久的，持续存在并积累上下文 |
| **最佳场景** | 只关心结果的聚焦任务 | 需要讨论和协作的复杂工作 |
| **Token 消耗** | 较低：结果摘要返回主上下文 | 较高：每个成员是独立的 Claude 实例 |
| **类比** | 派出去干活的"外包工" | 有协作关系的"工程小队" |
| **成本** | 只付工作+摘要的费用 | 付多个并发会话的费用 |

### 5.2 何时使用 Subagents

- 工人只需做 **孤立任务** 然后报告
- 需要 **管理上下文窗口** 大小
- 任务是 **顺序或独立** 的
- 想要 **更低成本/开销**
- 示例: 代码探索、单文件编辑、信息检索

### 5.3 何时使用 Agent Teams

- 任务需要 **专业人员之间的协调**
- 代理需要 **共享上下文** 并直接通信
- 构建 **跨多文件/模块的复杂功能**
- 需要 **实时可见性** 了解每个代理在做什么
- **需要在团队成员之间互相挑战和质疑**
- 示例: 全栈功能开发、PR 并行审查、竞争性假设调试

### 5.4 Agent Teams 架构

```
┌─────────────┐
│  Team Lead   │  ← 主 Claude 会话
│  (协调者)    │
└──────┬──────┘
       │ 创建团队、分配任务、综合结果
       │
  ┌────┼────┬────┐
  │    │    │    │
┌─┴─┐┌─┴─┐┌─┴─┐┌─┴─┐
│ A ││ B ││ C ││ D │  ← 独立的 Claude 实例
└───┘└───┘└───┘└───┘
  ↕    ↕    ↕    ↕     ← 成员之间可直接通信
     共享任务列表
```

组件:
- **Team Lead**: 创建团队的主 Claude 会话
- **Teammates**: 独立的 Claude Code 实例
- **Task List**: 共享的工作项列表
- **Mailbox**: 代理间消息系统

### 5.5 启用 Agent Teams

```json
// settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### 5.6 实际使用示例

**并行代码审查**:
```
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

**竞争性假设调试**:
```
Users report the app exits after one message.
Spawn 5 agent teammates to investigate different hypotheses.
Have them talk to each other to try to disprove each other's theories.
```

### 5.7 最佳实践

- 团队规模: 3-5 个成员为佳
- 每个成员 5-6 个任务保持高效
- 避免两个成员编辑同一文件
- 先从研究和审查任务开始尝试

---

## 六、社区高级技巧与"Power User"秘诀

### 6.1 每次新任务前执行 `/clear`

防止上下文污染，避免之前对话影响当前任务。

### 6.2 使用 `/batch` 进行大规模迁移

`/batch` 会采访你了解迁移需求，然后将工作分发到多个 worktree agent，每个独立工作、测试并创建 PR。

### 6.3 Subagent + Worktree 隔离

在 agent 定义中添加 `isolation: worktree`，实现大规模并行变更的完全隔离。

### 6.4 `/btw` 提问不打断

Claude 工作时，用 `/btw` 提出快速问题，不会中断当前工作流。单轮对话，无工具调用，但有完整上下文。

### 6.5 `/simplify` 代码质量检查

在任何提示后追加 `/simplify`，它会运行并行代理审查变更代码的复用性、质量、效率和 CLAUDE.md 合规性。

### 6.6 Chrome 扩展（前端必备）

安装 Claude Code Chrome 扩展后，Claude 可以在浏览器中迭代前端效果。官方比喻："让人建网站但不让用浏览器，结果能好吗？"

### 6.7 语音输入

语音模式可用于所有用户。说话速度是打字的 3 倍，提示自然变得更详细。Claude Code 团队大部分编码都通过语音完成。

### 6.8 `--bare` 加速 SDK 启动

```bash
claude -p --bare   # 约 10 倍更快的启动（跳过本地配置搜索）
```

### 6.9 `--add-dir` 多仓库工作

```bash
claude --add-dir ../other-repo   # 给 Claude 访问额外目录的权限
```

### 6.10 权限预批准

```bash
/permissions
# 预批准常用安全命令，写入团队 .claude/settings.json
# 支持完整通配符: "Bash(bun run *)", "Edit(/docs/**)"
```

### 6.11 自动模式

```bash
claude --enable-auto-mode
# 安全操作自动批准，危险操作仍需确认
# Shift+Tab 循环: default -> acceptEdits -> plan -> auto
```

### 6.12 `/loop` 和 `/schedule`

- `/loop` 本地循环任务（最多 3 天）
- `/schedule` 云端定时任务（电脑关闭也继续运行）

### 6.13 Hooks（钩子）

常见模式 -- `PostToolUse` 自动格式化:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "npx prettier --write $FILE"
      }
    ]
  }
}
```

### 6.14 Session 分支

```bash
/branch                                    # 从当前会话分支
claude --resume <session-id> --fork-session  # 从 CLI 分支
```

### 6.15 输出风格

```
/config -> 设置输出风格
- Explanatory: 边工作边解释框架和模式（适合新代码库）
- Learning: 教练式引导
- Custom: 自定义 Claude 的语气
```

---

## 七、键盘快捷键（官方文档验证）

### 7.1 全局操作

| 快捷键 | 操作 |
|--------|------|
| `Ctrl+C` | 取消当前操作（硬编码，不可重绑定） |
| `Ctrl+D` | 退出 Claude Code（硬编码） |
| `Ctrl+T` | 切换任务列表可见性 |
| `Ctrl+O` | 切换详细记录查看器 |

### 7.2 聊天操作

| 快捷键 | 操作 |
|--------|------|
| `Enter` | 提交消息 |
| `Shift+Tab` | 循环权限模式 (default -> acceptEdits -> plan -> auto) |
| `Ctrl+J` | 插入新行（不提交） |
| `Ctrl+L` | 强制重绘屏幕 |
| `Cmd+K` | 全屏模式下双击运行 /clear |
| `Ctrl+G` 或 `Ctrl+X Ctrl+E` | 打开外部编辑器 |
| `Ctrl+S` | 暂存当前提示 |
| `Ctrl+V` (`Alt+V` on Windows) | 粘贴图片 |
| `Meta+P` | 打开模型选择器 |
| `Meta+O` | 切换快速模式 |
| `Meta+T` | 切换扩展思考 |
| `Ctrl+X Ctrl+K` | 终止所有后台代理 |

### 7.3 历史与导航

| 快捷键 | 操作 |
|--------|------|
| `Ctrl+R` | 打开历史搜索 |
| `Up / Down` | 上一条/下一条历史记录 |

### 7.4 任务操作

| 快捷键 | 操作 |
|--------|------|
| `Ctrl+B` | 将当前任务放到后台（注意: tmux 前缀冲突） |
| `Shift+Down` | 在 Agent Teams 中切换团队成员 |

### 7.5 自定义快捷键

```bash
/keybindings   # 创建或打开 ~/.claude/keybindings.json
```

配置文件格式:
```json
{
  "$schema": "https://www.schemastore.org/claude-code-keybindings.json",
  "bindings": [
    {
      "context": "Chat",
      "bindings": {
        "ctrl+e": "chat:externalEditor",
        "ctrl+u": null
      }
    }
  ]
}
```

设置 `null` 可取消默认绑定。支持 20 个上下文（Chat, Autocomplete, Settings, Confirmation 等），支持组合键（chords）如 `ctrl+k ctrl+s`。

### 7.6 保留快捷键（不可重绑定）

| 快捷键 | 原因 |
|--------|------|
| Ctrl+C | 硬编码中断/取消 |
| Ctrl+D | 硬编码退出 |
| Ctrl+M | 终端中等同于 Enter |
| Caps Lock | 终端应用无法接收 |

### 7.7 终端冲突注意

| 快捷键 | 冲突 |
|--------|------|
| Ctrl+B | tmux 前缀键（按两次发送） |
| Ctrl+A | GNU screen 前缀键 |
| Ctrl+Z | Unix 进程挂起 (SIGTSTP) |

---

## 八、快速参考：关键配置文件路径

| 文件 | 路径 | 用途 |
|------|------|------|
| 项目级 CLAUDE.md | `./CLAUDE.md` | 项目 AI 指令 |
| 用户级 CLAUDE.md | `~/.claude/CLAUDE.md` | 全局 AI 偏好 |
| 自动记忆 | `~/.claude/projects/<project>/memory/` | 自动保存的偏好 |
| Skills（新） | `.claude/skills/<name>/SKILL.md` | 自定义技能 |
| Skills（旧） | `.claude/commands/<name>.md` | 自定义命令 |
| 自定义 Agent | `.claude/agents/<name>.md` | 子代理定义 |
| 项目设置 | `.claude/settings.json` | 项目级配置 |
| 用户设置 | `~/.claude/settings.json` | 用户级配置 |
| 快捷键 | `~/.claude/keybindings.json` | 自定义键盘快捷键 |
| MCP 配置 | `.mcp.json` 或 settings.json 中 | MCP 服务器配置 |
| 团队配置 | `~/.claude/teams/<name>/config.json` | Agent Team 状态 |
| 任务列表 | `~/.claude/tasks/<team-name>/` | 团队共享任务 |

---

## 九、核心工作流速查

```
日常开发流程:
1. /clear（清除上下文）
2. Shift+Tab 进入 Plan Mode（规划）
3. 完善计划
4. Shift+Tab 切换到 acceptEdits（执行）
5. /simplify（质量检查）
6. 提交

并行工作流程:
1. 创建多个 worktree
2. 每个 worktree 启动一个 Claude 会话
3. 各自独立工作
4. 合并 PR

团队协作流程:
1. 启用 Agent Teams
2. 描述任务和团队结构
3. Claude 自动创建团队和任务
4. 实时监控和调整
5. 完成后清理团队
```

---

## 参考来源

- [Claude Code 官方文档](https://code.claude.com/docs)
- [Claude Code Power User Tips - 官方帮助中心](https://support.claude.com/en/articles/14554000-claude-code-power-user-tips)
- [Claude Code 键盘快捷键 - 官方文档](https://code.claude.com/docs/en/keybindings)
- [Agent Teams - 官方文档](https://code.claude.com/docs/en/agent-teams)
- [Skills - 官方文档](https://code.claude.com/docs/en/skills)
- [Plugins Marketplace - 官方文档](https://code.claude.com/docs/en/discover-plugins)
- [MCP 配置 - 官方文档](https://code.claude.com/docs/en/mcp)
- [50 Claude Code Tips - Builder.io](https://www.builder.io/blog/claude-code-tips-best-practices)
- [Claude Code Best Practices - UX Planet](https://uxplanet.org/claude-code-best-practices-57fbc3d5d09e)
- [Reddit: Best Practices for Claude Code](https://www.reddit.com/r/Anthropic/comments/1qmu07f/what_are_your_best_practices_for_claude_code_in/)
- [Claude Subagents vs Agent Teams - Reddit](https://www.reddit.com/r/ClaudeCode/comments/1rumv62/claude_subagents_vs_agent_teams_explained_simply/)
- [5 MCP Setups That Work - dev.to](https://dev.to/klement_gunndu/connect-claude-code-to-your-tools-with-mcp-5-setups-that-work-f30)
- [MCP Servers - 官方仓库](https://github.com/modelcontextprotocol/servers)
- [Claude Code Cheatsheet - 帮助中心](https://support.claude.com/en/articles/14553413-claude-code-cheatsheet)
- [Claude Plugin Hub - 社区目录](https://www.claudepluginhub.com/)
