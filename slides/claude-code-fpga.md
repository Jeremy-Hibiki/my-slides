---
theme: default
title: Claude Code 101 · FPGA 部门入门
canvasWidth: 1400
info: 面向非软件开发同事的 Claude Code 入门演示
transition: view-transition
comark: true
fonts:
  provider: coollabs
  sans: 苹方-简
  serif: Noto Serif CJK SC
  mono: Cascadia Mono
  local: [苹方-简, Noto Serif CJK SC, Cascadia Mono]
hideInToc: true
---

# Claude Code 101

## 从零开始用 AI 处理日常工作

中研院 数据平台 · 蒋正颀

<div class="abs-br m-6 text-sm opacity-50">2026.05</div>

---
layout: intro
hideInToc: true
---

# 今天讲什么

<Toc :columns="2" :maxDepth="1" />

---
layout: section
---

# Claude Code 是什么

---
layout: two-cols-header
---

## 你可能已经用过 ChatGPT / Claude 网页版

::left::

**网页版 AI**

<div class="mt-4 rounded-xl border border-gray-200 p-5 bg-gray-50 text-sm font-mono leading-7">
  <div class="text-blue-600">我：帮我写一段 Python 读取 CSV 文件</div>
  <div class="text-gray-500 mt-2">AI：好的，这是代码：<br><code>import pandas as pd ...</code></div>
  <div class="text-blue-600 mt-2">我：（复制代码）→ 去终端运行 → 报错 → 截图 → 回来问...</div>
</div>

<div class="mt-4 text-orange-600 font-medium">
  ⚠️ 需要手动复制代码、切换窗口、自己运行、自己反馈错误
</div>

::right::

**Claude Code（命令行工具）**

<div class="mt-4 rounded-xl border border-green-200 p-5 bg-green-50 text-sm font-mono leading-7">
  <div class="text-blue-600">我：帮我写一段 Python 读取这个 CSV 文件，并统计每列数据</div>
  <div class="text-gray-500 mt-2">
    Claude：（读取文件 → 写代码 → 自动运行 → 发现报错 → 自动修复 → 输出结果）
  </div>
  <div class="text-green-600 mt-2">✓ 结果已输出到 output.csv</div>
</div>

<div class="mt-4 text-green-600 font-medium">
  ✅ Claude 在你的电脑上直接读文件、写代码、运行、修复——<strong>全自动</strong>
</div>

---

## 核心差别：Claude Code 能操作你的文件

<div grid="~ cols-3 gap-6 mt-6">

<div class="rounded-xl border-2 border-gray-200 p-5 text-center">
  <div class="text-4xl mb-3">📖</div>
  <div class="font-bold text-lg mb-2">读</div>
  <div class="text-sm text-gray-600 leading-6">
    读取你的 Verilog 文件<br>
    读取报告、日志<br>
    理解整个项目的结构
  </div>
</div>

<div class="rounded-xl border-2 border-blue-300 p-5 text-center">
  <div class="text-4xl mb-3">✏️</div>
  <div class="font-bold text-lg mb-2">写</div>
  <div class="text-sm text-gray-600 leading-6">
    写 Python/Shell 脚本<br>
    生成分析报告<br>
    修改、重构代码
  </div>
</div>

<div class="rounded-xl border-2 border-green-300 p-5 text-center">
  <div class="text-4xl mb-3">▶️</div>
  <div class="font-bold text-lg mb-2">执行</div>
  <div class="text-sm text-gray-600 leading-6">
    直接运行脚本<br>
    遇到报错自动修复<br>
    给你看最终结果
  </div>
</div>

</div>

<div class="mt-8 p-5 bg-blue-50 rounded-xl border border-blue-200">

**一句话总结**：Claude Code 是一个住在你终端里的 AI 助手，它能<strong>直接接触你的文件</strong>，帮你写脚本、分析数据、处理重复工作——你只需要用中文告诉它目标。

</div>

---
layout: two-cols-header
---

## 对 FPGA 工程师来说，能做什么

::left::

**📊 分析 & 可视化**

- 解析门级网表，统计各类 cell 数量
- 将网表关系可视化为连接图
- 从时序报告中提取关键路径、slack 统计
- 对比多个综合结果的差异

**📄 文档处理**

- 读取 STA 报告，生成汇总表格
- 把 Vivado/DC 的约束文件转换格式
- 批量处理多个 corner 的报告文件

::right::

**🔧 脚本与自动化**

- 写 TCL 脚本完成重复的综合/仿真流程
- 写 Python 批处理文件格式转换
- 遇到 Tcl 报错，直接粘给它帮你诊断

**💬 知识问答**

- "这个 timing violation 是什么意思？"
- "帮我解释这段 Verilog 的逻辑"
- "CDC 问题通常怎么排查？"

---
layout: section
---

# 安装 & 启动

---
layout: two-cols-header
---

## 安装（两步搞定）


::left::

### 第一步：安装 Node.js

Node.js 是运行 Claude Code 所需的基础环境（类似于运行 Python 程序需要先装 Python）

**Windows 下载地址**（内网镜像，无需翻墙）：

```
https://registry.npmmirror.com/-/binary/node/latest-v24.x/
node-v24.9.0-x64.msi
```

下载后双击安装，一路下一步即可


::right::


### 第二步：安装 Claude Code

打开命令提示符（Win+R → 输入 `cmd`），执行：

```bash
npm config set -g registry https://registry.npmmirror.com
npm install -g @anthropic-ai/claude-code@latest
```

安装完成后，你就有了 `claude` 这个命令

**验证安装**：
```bash
claude --version
# 输出版本号即成功
```

<div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm">
💡 如果公司电脑无法联网安装，可以找数据平台拿离线安装包（.tgz），用 <code>npm install -g ./包名.tgz</code> 本地安装
</div>

---
layout: two-cols-header
---

## 启动 & 连接到内部模型


::left::

### 配置内部 AI 模型

Claude Code 默认连接 Anthropic 官网（需要账号和费用）。我们使用内部部署的模型，需要做一次配置。

配置文件位置：`~/.claude/settings.json`
（Windows：`C:\Users\你的用户名\.claude\settings.json`）

内容如下（数据平台会提供现成的配置文件）：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "no-key",
    "ANTHROPIC_BASE_URL": "http://192.168.131.119:8002",
    "ANTHROPIC_MODEL": "Qwen3.5-35B-A3B"
  },
  "permissions": { "defaultMode": "acceptEdits" },
  "language": "简体中文, Chinese"
}
```


::right::


### 启动方式

**方式一：交互式（最常用）**

```bash
# 进入你的工作目录
cd D:\fpga_projects\my_design

# 启动
claude
```

**方式二：带着问题直接启动**

```bash
claude "帮我统计 top.v 里有多少个 DFF"
```

<div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-sm">
✅ 启动后你会看到一个对话界面，就像微信聊天一样，用中文输入你的需求即可
</div>

---
layout: section
---

# 基本使用方式

---

## 操作界面长这样

<div class="mt-4 rounded-xl border-2 border-gray-300 overflow-hidden font-mono text-sm">

<div class="bg-gray-800 text-gray-200 px-4 py-2 text-xs flex gap-2 items-center">
  <div class="w-3 h-3 rounded-full bg-red-500"></div>
  <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
  <div class="w-3 h-3 rounded-full bg-green-500"></div>
  <span class="ml-2 opacity-60">Terminal — claude</span>
</div>

<div class="bg-gray-900 text-gray-100 p-5 leading-7">

```
╭─ Claude Code (claude-4-sonnet) ──────────────────────────────╮
│  /help for help · /clear for new session · Ctrl+C to quit     │
╰──────────────────────────────────────────────────────────────╯

> █
```

</div>

</div>

<div grid="~ cols-3 gap-5 mt-6 text-sm">

<div class="p-4 rounded-lg bg-blue-50 border border-blue-200">
  <div class="font-bold mb-2">💬 用中文描述需求</div>
  直接打字，像聊天一样<br>
  <code class="text-xs">帮我分析这个文件...</code>
</div>

<div class="p-4 rounded-lg bg-purple-50 border border-purple-200">
  <div class="font-bold mb-2">📎 引用文件</div>
  用 <code>@文件名</code> 指定文件<br>
  <code class="text-xs">@synth_top.v 里有几个DFF？</code>
</div>

<div class="p-4 rounded-lg bg-orange-50 border border-orange-200">
  <div class="font-bold mb-2">⌨️ 常用快捷键</div>
  <code>Ctrl+C</code> 中断当前操作<br>
  <code>ESC ESC</code> 撤销上一步
</div>

</div>

---
layout: two-cols-header
---

## Claude Code 能"看到"什么


::left::

**它能主动读取**

- 你当前目录下的所有文件
- 你指定的任何文件路径
- 运行命令后的输出结果
- 报错信息（自动获取）

**它不会主动动的**

- 不会上传文件到云端
- 不会访问其他电脑
- 不会在你不知道的情况下修改文件
  - （修改前会告诉你，可以配置无需确认）


::right::


**你给它什么，它就能处理什么**

```
工作目录/
├── synth_top.v          ← 它能读
├── timing_report.rpt    ← 它能读
├── constraints.xdc      ← 它能读
└── （你创建的任何文件）  ← 它都能读
```

<div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm">
💡 <strong>小技巧</strong>：在你的项目目录下启动 Claude Code，它就能自动感知整个项目的上下文，不需要每次都说"在哪个文件里"
</div>

---
layout: section
---

# 实战演示：分析门级网表

---
layout: two-cols-header
---

## 背景：综合后的门级网表


::left::

**什么是门级网表（Gate-Level Netlist）**

- FPGA/ASIC 综合之后生成的 Verilog 文件
- 用标准单元（AND、OR、DFF 等）描述电路
- 通常几千到几十万行，人工阅读困难

```verilog
// synth_top.v（综合后网表片段）
module top (input clk, rst, a, b,
            output y);
  wire n1, n2, n3, n4;

  AND2_X1 U1 (.A(a),  .B(b),   .Z(n1));
  INV_X1  U2 (.A(rst),         .ZN(n2));
  DFF_X1  U3 (.D(n1), .CK(clk),.Q(n3));
  OR2_X1  U4 (.A(n3), .B(n2),  .Z(n4));
  BUF_X2  U5 (.A(n4),          .Z(y));
endmodule
```


::right::


**我们想从中获取什么**

<div class="space-y-3 mt-2">

<div class="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
  <span class="text-xl">📊</span>
  <div>
    <div class="font-bold text-sm">Cell 统计</div>
    <div class="text-xs text-gray-600">各种 cell 类型的数量分布（面积估算）</div>
  </div>
</div>

<div class="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
  <span class="text-xl">🔗</span>
  <div>
    <div class="font-bold text-sm">连接关系可视化</div>
    <div class="text-xs text-gray-600">把电路的连接关系画成图，直觉地看结构</div>
  </div>
</div>

<div class="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
  <span class="text-xl">📋</span>
  <div>
    <div class="font-bold text-sm">结构化信息提取</div>
    <div class="text-xs text-gray-600">输入/输出端口、信号名、模块层次</div>
  </div>

---
hideInToc: true
---

## 演示开始：描述任务

<div class="mt-4 rounded-xl border-2 border-gray-300 overflow-hidden font-mono text-sm">
<div class="bg-gray-800 text-gray-200 px-4 py-2 text-xs flex gap-2 items-center">
  <div class="w-3 h-3 rounded-full bg-red-500"></div>
  <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
  <div class="w-3 h-3 rounded-full bg-green-500"></div>
  <span class="ml-2 opacity-60">Terminal — claude (D:\fpga_projects\cpu_core)</span>
</div>
<div class="bg-gray-900 text-gray-100 p-5 leading-7 text-xs">

```
> 我有一个综合后的门级网表文件 synth_top.v，帮我做三件事：
  1. 统计所有 cell 的类型和数量，输出表格
  2. 用 Python 把 cell 之间的连接关系画成可视化图
  3. 列出所有 primary input/output 端口
```

</div>
</div>

<div class="mt-4 grid grid-cols-3 gap-4 text-sm">

<div v-click class="p-4 bg-green-50 border border-green-300 rounded-xl">
  <div class="font-bold text-green-700 mb-1">✅ 好的需求描述方式</div>
  <ul class="text-xs space-y-1 text-gray-700">
    <li>明确说了文件名</li>
    <li>把任务拆成清晰的编号列表</li>
    <li>说清楚了每项的预期输出形式</li>
  </ul>
</div>

<div v-click class="p-4 bg-yellow-50 border border-yellow-300 rounded-xl">
  <div class="font-bold text-yellow-700 mb-1">💡 不用担心说错</div>
  <ul class="text-xs space-y-1 text-gray-700">
    <li>Claude 会先问你确认</li>
    <li>随时可以说"不对，我的意思是..."</li>
    <li>一次说不清，分多轮也可以</li>
  </ul>
</div>

<div v-click class="p-4 bg-blue-50 border border-blue-300 rounded-xl">
  <div class="font-bold text-blue-700 mb-1">🔑 核心原则</div>
  <ul class="text-xs space-y-1 text-gray-700">
    <li>说<strong>目标</strong>，不用说步骤</li>
    <li>像给实习生布置任务一样说话</li>
    <li>告诉他"做什么"，让他想"怎么做"</li>
  </ul>
</div>

</div>

---
hideInToc: true
---

## Claude 开始工作：读文件 → 写脚本

<div class="mt-3 rounded-xl border-2 border-gray-300 overflow-hidden font-mono">
<div class="bg-gray-800 text-gray-200 px-4 py-2 text-xs flex gap-2 items-center">
  <div class="w-3 h-3 rounded-full bg-red-500"></div>
  <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
  <div class="w-3 h-3 rounded-full bg-green-500"></div>
  <span class="ml-2 opacity-60">Terminal — claude</span>
</div>
<div class="bg-gray-900 text-gray-100 p-4 leading-6 text-xs">

```
● Read(synth_top.v)  ← 读取网表文件（5842 行）
  ↳ 分析结构: 找到 1 个 module，检测到 AND2、OR2、INV、DFF 等 cell 类型

● Write(analyze_netlist.py)  ← 生成分析脚本
  ↳ 写入完成 (87 行)

● Bash(python analyze_netlist.py)  ← 直接运行
```

</div>
</div>

<div class="mt-2 rounded-xl border-2 border-red-300 overflow-hidden font-mono">
<div class="bg-red-800 text-red-100 px-4 py-2 text-xs">⚠️ 运行报错</div>
<div class="bg-red-950 text-red-200 p-4 text-xs leading-6">

```
Traceback (most recent call last):
  File "analyze_netlist.py", line 3, in <module>
    import networkx as nx
ModuleNotFoundError: No module named 'networkx'
```

</div>
</div>

<div class="mt-3 rounded-xl border-2 border-gray-300 overflow-hidden font-mono">
<div class="bg-gray-800 text-gray-200 px-4 py-2 text-xs">Claude 自动处理</div>
<div class="bg-gray-900 text-gray-100 p-4 text-xs leading-6">

```
● Bash(pip install networkx matplotlib)  ← 自动安装缺少的库
  ↳ Successfully installed networkx-3.4  matplotlib-3.10

● Bash(python analyze_netlist.py)  ← 重新运行
```

</div>
</div>

<div v-click class="mt-3 p-3 bg-green-50 border border-green-300 rounded-xl text-sm">
💡 <strong>这就是 Claude Code 的核心价值</strong>：遇到报错不需要你去 Google，它自己判断原因、自己修复、自己重试
</div>

---
hideInToc: true
---
layout: two-cols-header
---

## 第一版结果：可视化图 & Cell 统计表


::left::

**Cell 类型统计（已输出）**

<div class="rounded-xl border border-gray-200 overflow-hidden text-xs font-mono">
<div class="bg-gray-100 px-3 py-1.5 font-bold text-gray-700">cell_summary.txt</div>
<table class="w-full">
<thead class="bg-gray-50">
<tr class="border-b"><th class="p-2 text-left">Cell 类型</th><th class="p-2 text-right">数量</th><th class="p-2 text-right">占比</th></tr>
</thead>
<tbody>
<tr class="border-b"><td class="p-2">DFF_X1</td><td class="p-2 text-right">1247</td><td class="p-2 text-right">38.2%</td></tr>
<tr class="border-b bg-gray-50"><td class="p-2">AND2_X1</td><td class="p-2 text-right">623</td><td class="p-2 text-right">19.1%</td></tr>
<tr class="border-b"><td class="p-2">INV_X1</td><td class="p-2 text-right">441</td><td class="p-2 text-right">13.5%</td></tr>
<tr class="border-b bg-gray-50"><td class="p-2">OR2_X1</td><td class="p-2 text-right">389</td><td class="p-2 text-right">11.9%</td></tr>
<tr class="border-b"><td class="p-2">BUF_X2</td><td class="p-2 text-right">234</td><td class="p-2 text-right">7.2%</td></tr>
<tr class="border-b bg-gray-50"><td class="p-2">MUX2_X1</td><td class="p-2 text-right">187</td><td class="p-2 text-right">5.7%</td></tr>
<tr><td class="p-2 text-gray-500">其他</td><td class="p-2 text-right text-gray-500">140</td><td class="p-2 text-right text-gray-500">4.4%</td></tr>
</tbody>
</table>
</div>

<div class="mt-2 text-xs text-gray-500">共 3261 个 cell，已保存至 cell_summary.txt</div>


::right::


**可视化图（第一版）**

<div class="rounded-xl bg-gray-100 border border-gray-300 h-52 flex items-center justify-center text-gray-400 text-sm">
  <div class="text-center">
    <div class="text-5xl mb-3">🕸️</div>
    <div>节点密集，连线交叉严重</div>
    <div class="text-xs mt-1">3261 个节点挤在一起，看不清楚</div>
  </div>
</div>

<div v-click class="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-xl text-sm">
  图生成了，但是太乱了——这时候<strong>直接告诉 Claude 哪里不满意</strong>，让它改进
</div>

---
hideInToc: true
---

## 反馈与调试：让 Claude 改进可视化

<div class="mt-3 rounded-xl border-2 border-gray-300 overflow-hidden font-mono">
<div class="bg-gray-800 text-gray-200 px-4 py-2 text-xs">用户追加需求</div>
<div class="bg-gray-900 text-gray-100 p-4 text-xs leading-6">

```
> 图太乱了，节点太多看不清楚。能不能：
  1. 只画 DFF 之间的连接（去掉中间的组合逻辑细节）
  2. 按照 DFF 的名称前缀分组，分层显示
  3. 同时输出一个 HTML 交互式版本，可以缩放和拖动
```

</div>
</div>

<div class="mt-2 rounded-xl border-2 border-gray-300 overflow-hidden font-mono">
<div class="bg-gray-800 text-gray-200 px-4 py-2 text-xs">Claude 的工作过程</div>
<div class="bg-gray-900 text-gray-100 p-4 text-xs leading-6">

```
好的，我来重新设计可视化方案：
  1. 分析 DFF 之间的通路，忽略中间组合逻辑节点
  2. 用 DFF 名称前缀（如 reg_ctrl_*, reg_data_*）自动分组
  3. 用 pyvis 库生成可交互的 HTML 图

● Bash(pip install pyvis)
  ↳ Successfully installed pyvis-0.3.2

● Write(netlist_viz.py)   ← 重写可视化脚本（124 行）

● Bash(python netlist_viz.py)
  ↳ netlist_graph.html 生成完成（DFF 节点 1247 个，分 8 组）
```

</div>
</div>

<div v-click class="mt-3 p-3 bg-blue-50 border border-blue-300 rounded-xl text-sm">
💡 <strong>多轮对话才是正常工作模式</strong>。第一版不满意很正常，像指导实习生一样反馈意见，它会根据你的反馈调整
</div>

---
hideInToc: true
---
layout: two-cols-header
---

## 最终成果：交互式可视化 & 结构化信息


::left::

**交互式 HTML 图**（`netlist_graph.html`）

<div class="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600 p-4 h-56 flex flex-col justify-between">
  <div class="flex gap-3 flex-wrap">
    <div class="px-3 py-1.5 rounded-full text-xs font-bold" style="background:#1e40af;color:#93c5fd">reg_ctrl (47)</div>
    <div class="px-3 py-1.5 rounded-full text-xs font-bold" style="background:#14532d;color:#86efac">reg_data (312)</div>
    <div class="px-3 py-1.5 rounded-full text-xs font-bold" style="background:#7c2d12;color:#fdba74">reg_fsm (88)</div>
    <div class="px-3 py-1.5 rounded-full text-xs font-bold" style="background:#4c1d95;color:#c4b5fd">reg_addr (156)</div>
    <div class="px-3 py-1.5 rounded-full text-xs font-bold" style="background:#164e63;color:#67e8f9">reg_io (78)</div>
    <div class="px-3 py-1.5 rounded-full text-xs font-bold" style="background:#713f12;color:#fde68a">reg_arb (62)</div>
  </div>
  <div class="text-gray-400 text-xs text-center mt-2">浏览器打开 netlist_graph.html，可缩放、点击节点查看详情</div>
  <div class="flex gap-2 mt-2 text-xs text-gray-500">
    <span>🖱️ 拖动节点</span>
    <span>🔍 滚轮缩放</span>
    <span>🖱️ 点击高亮路径</span>
  </div>
</div>


::right::


**结构化提取结果**（`netlist_info.json`）

```json
{
  "module": "top",
  "ports": {
    "inputs": ["clk", "rst_n", "data_in[31:0]",
               "addr[15:0]", "valid"],
    "outputs": ["data_out[31:0]", "ready", "err"]
  },
  "cell_count": 3261,
  "dff_groups": {
    "reg_ctrl": 47,
    "reg_data": 312,
    "reg_fsm": 88
  },
  "generated_at": "2026-05-13T10:30:00"
}
```

</div>

</div>

<div v-click class="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm">
✅ <strong>整个过程约 5 分钟</strong>，只需两轮对话——如果手写脚本，可能要一两小时
</div>

---
layout: section
---

# 怎么说才能用好它

---
layout: two-cols-header
---

## 让 Claude Code 表现更好的几个技巧


::left::

**✅ 说目标，而不是说步骤**

```diff
- 帮我用 Python 写一个 open() 函数打开文件，
  然后用 re.findall() 匹配 cell 名称...

+ 帮我从 synth_top.v 里提取所有 cell 实例的
  名字和类型，输出成 CSV 格式
```

你不需要知道怎么实现，只需要知道你要什么

<hr class="my-4 border-gray-200" />

**✅ 给出验证标准**

```
帮我统计 DFF 数量，
要求：和 DC 综合报告里的 Combinational Area
这行的数字对得上，对不上你继续检查
```

告诉它什么算"成功"，它会自己验证


::right::


**✅ 提供足够的上下文**

```
这是我们用 TSMC 28nm 工艺综合的 CPU 核，
库里的 DFF 单元前缀是 DFF_X，SRAM 是 SRAM_SP。
帮我统计逻辑单元面积，不要把 SRAM 算进去
```

背景信息越清楚，结果越准确

<hr class="my-4 border-gray-200" />

**✅ 遇到问题直接说**

```
这个图里的箭头方向反了，
应该是从驱动端到接收端，你改一下

这个表格缺少了 MUX 类型的 cell，
我记得原文件里有 MUX2_X1 的，再检查一下
```

不用客气，直接指出问题就行

---

## 一些常见问题

<div class="mt-4 space-y-4">

<div v-click class="p-4 rounded-xl border-l-4 border-blue-400 bg-blue-50">
  <div class="font-bold text-blue-800">Q：它能看到多大的文件？</div>
  <div class="text-sm text-gray-700 mt-1">大多数门级网表（几万行）完全没问题。超大文件（几十万行）它会自动采样关键部分。可以告诉它"重点关注 xxx 模块"缩小范围。</div>
</div>

<div v-click class="p-4 rounded-xl border-l-4 border-green-400 bg-green-50">
  <div class="font-bold text-green-800">Q：它生成的代码可靠吗？需要我审查吗？</div>
  <div class="text-sm text-gray-700 mt-1">对于分析脚本，建议先看一眼逻辑是否合理，特别是核实关键数字（总 cell 数等）。Claude Code 会自动运行并验证输出，但业务逻辑的正确性最终由你判断。</div>
</div>

<div v-click class="p-4 rounded-xl border-l-4 border-purple-400 bg-purple-50">
  <div class="font-bold text-purple-800">Q：我的文件会上传到外网吗？</div>
  <div class="text-sm text-gray-700 mt-1">使用内网配置后，所有请求发送到内部 GPU 服务器（192.168.x.x），文件内容作为对话上下文传给模型，但模型部署在内网，不对外。请勿将涉密文件用于 AI 分析。</div>
</div>

<div v-click class="p-4 rounded-xl border-l-4 border-orange-400 bg-orange-50">
  <div class="font-bold text-orange-800">Q：它做到一半突然不知道怎么继续了怎么办？</div>
  <div class="text-sm text-gray-700 mt-1">告诉它"先暂停，告诉我你现在的理解是什么，再告诉我下一步打算怎么做"——让它先说方案，你确认没问题再让它继续。</div>
</div>

</div>

---
layout: center
class: text-center
hideInToc: true
---

# 总结

<div grid="~ cols-3 gap-8 mt-10 text-left">

<div class="p-6 rounded-2xl bg-blue-50 border-2 border-blue-200">
  <div class="text-3xl mb-3">🤖</div>
  <div class="font-bold text-xl mb-2">Claude Code 是什么</div>
  <div class="text-sm text-gray-600 leading-6">
    住在终端里的 AI 助手<br>
    能读文件、写脚本、执行命令<br>
    你只需要用中文说目标
  </div>
</div>

<div class="p-6 rounded-2xl bg-green-50 border-2 border-green-200">
  <div class="text-3xl mb-3">⚡</div>
  <div class="font-bold text-xl mb-2">能帮 FPGA 工程师做什么</div>
  <div class="text-sm text-gray-600 leading-6">
    解析网表 / 可视化电路<br>
    分析时序报告<br>
    处理重复性文件操作
  </div>
</div>

<div class="p-6 rounded-2xl bg-purple-50 border-2 border-purple-200">
  <div class="text-3xl mb-3">💬</div>
  <div class="font-bold text-xl mb-2">怎么用好它</div>
  <div class="text-sm text-gray-600 leading-6">
    说目标不说步骤<br>
    给出验证标准<br>
    多轮对话反馈改进
  </div>
</div>

</div>

<div class="mt-10 text-gray-500 text-sm">
  问题 / 配置帮助：<strong>蒋正颀</strong>  jiangzhengqi@fmsh.com.cn
  &nbsp;·&nbsp;
  内网 AI 服务：<strong>http://192.168.131.119:8002</strong>
</div>
