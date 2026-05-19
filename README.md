# AI 中文小说创作工作站

> 基于 Claude Code 的 AI 辅助中文网文创作系统，集成 7 个专业 Skills + 1 个 Agent，覆盖从拆书分析、大纲规划、逐章创作、去 AI 润色到成稿输出的完整工作流。

## 这是什么？

这是一个用 **Claude Code Skills** 搭建的中文小说创作工作站。它不是一个「一键生成小说」的玩具，而是一套**完整的创作工程体系**——把写网文这件事拆解成标准化的 6 个阶段，每个阶段都有专门的 AI 技能模块来辅助完成。

核心理念：**像做软件工程一样做小说创作**——有规划、有流程、有质检、有版本管理。

## 核心能力

| 能力 | 说明 | 对应 Skill |
|------|------|-----------|
| 风格拆书 | 分析参考作品的 11 个维度风格特征，生成可复用的风格手册 | 手动分析 |
| 大纲规划 | 生成完整的章节大纲、世界观设定、人物档案 | `chinese-novelist` |
| 逐章创作 | 串行创作，每章 2500-5000 字，章末设悬念钩子 | `chinese-novelist` |
| 去 AI 痕迹 | 24 种 AI 写作模式检测 + 自动修正，5 维度评分 | `humanizer-zh` |
| 叙事分析 | 角色弧光、戏剧张力、主题发展等维度的专业评估 | `novelist-analyst` |
| 任务规划 | 文件化任务管理（task_plan.md / findings.md / progress.md） | `planning-with-files` |
| 文档输出 | 合并章节、生成 Word 文档 | `docx` |
| 封面设计 | 引导生成 AI 绘图提示词，输出小说封面 | `novel-cover-designer` Agent |
| 阅读器 | 一键生成单文件 HTML 阅读器，支持章节导航和夜间模式 | `build_reader.py` |
| 前端设计 | 高质量 Web 界面设计（阅读器、展示站等） | `frontend-design` |

## 创作工作流

### 标准流程（3 阶段）

适合原创小说：

```
阶段 1：规划  →  大纲 + 人物档案
阶段 2：创作  →  逐章写作（3000-5000 字/章）
阶段 3：润色  →  去 AI 痕迹
```

### 仿写流程（6 阶段）

适合参考已有作品的风格进行创作：

```
Phase 1  拆书分析   →  分析参考作品风格，输出风格参考手册
Phase 2  骨架搭建   →  世界观 + 大纲 + 人物档案
Phase 3  逐章创作   →  串行执行，短剧爽文节奏，章末悬念钩子
Phase 4  润色去 AI  →  humanizer-zh 24 种模式检测，可批量处理
Phase 5  质量审查   →  8 维度 80 分制评分 + 连贯性 + 风格对比
Phase 6  输出成稿   →  合并章节 + Word 文档 + HTML 阅读器
```

## 质量标准

| 指标 | 达标线 | 说明 |
|------|--------|------|
| 章节字数 | ≥ 2500 字 | 排除 Markdown 标记和标点后计算 |
| 去 AI 评分 | ≥ 35/50 | humanizer-zh 5 维度各 10 分 |
| 质量评分 | ≥ 60/80 | 8 维度综合评分 |

## 项目结构

```
novelist-test/
├── novels/                           # 小说作品目录
│   └── <小说名>/
│       ├── 00-大纲.md                # 故事概述、章节规划、世界观
│       ├── 01-人物档案.md            # 角色设定（主角/反派/配角）
│       ├── 02-风格参考手册.md        # 仿写风格分析（可选）
│       ├── 03-审查报告.md            # 质量审查结果（可选）
│       ├── 第01章.md ~ 第N章.md      # 章节正文
│       ├── build_reader.py           # HTML 阅读器生成脚本
│       ├── reader.html               # 生成的单文件阅读器
│       ├── 封面图.png                # AI 生成的封面
│       └── site/                     # 静态阅读站点
├── references/                       # 仿写参考作品原文
├── qimao/                            # 七猫平台投稿资料
├── .claude/
│   ├── skills/                       # 7 个 Claude Code Skills
│   │   ├── chinese-novelist/         # 核心创作（含 11 份参考文档）
│   │   ├── humanizer-zh/             # 去 AI 痕迹（24 种模式）
│   │   ├── novelist-analyst/         # 叙事分析
│   │   ├── docx/                     # Word 文档
│   │   ├── planning-with-files/      # 任务规划
│   │   ├── frontend-design/          # 前端设计
│   │   └── find-skills/              # 技能发现
│   └── agents/
│       └── novel-cover-designer.md   # 封面设计 Agent
├── task_plan.md                      # 任务规划
├── findings.md                       # 发现与决策日志
├── progress.md                       # 创作进度跟踪
└── CLAUDE.md                         # Claude Code 项目指令
```

## 快速开始

### 环境要求

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI
- Python ≥ 3.12 + [uv](https://docs.astral.sh/uv/)
- Node.js（用于 docx 技能）

### 创建新小说

在 Claude Code 中执行：

```
使用 chinese-novelist 帮我写一部小说
```

Skill 会通过 5 个问题确认题材、风格、篇幅等信息，然后自动进入规划和创作流程。

### 常用命令

```bash
# 检查单章字数
uv run .claude/skills/chinese-novelist/scripts/check_chapter_wordcount.py novels/<小说名>/第01章.md

# 检查全部章节字数
uv run .claude/skills/chinese-novelist/scripts/check_chapter_wordcount.py --all novels/<小说名>

# 生成 HTML 阅读器
cd novels/<小说名> && uv run build_reader.py
```

### Skill 调用方式

在 Claude Code 对话中直接说：

| 任务 | 说法 |
|------|------|
| 创作小说 | `使用 chinese-novelist 写一部小说` |
| 润色章节 | `使用 humanizer-zh 润色 novels/<小说名>/第01章.md` |
| 叙事分析 | `使用 novelist-analyst 分析这个章节` |
| 生成封面 | `帮我做一个封面` |
| 导出 Word | `使用 docx 将章节合并为 Word 文档` |
| 任务规划 | `使用 planning-with-files 规划创作任务` |

## Skills 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                    Claude Code CLI                       │
├──────────┬──────────┬──────────┬──────────┬─────────────┤
│ chinese  │humanizer │novelist  │  docx    │  planning   │
│ novelist │   zh     │ analyst  │          │ with-files  │
├──────────┴──────────┴──────────┴──────────┴─────────────┤
│  11 份参考文档  │  24 种检测模式  │  XML Schema 规范    │
├────────────────┴────────────────┴───────────────────────┤
│              Python 脚本 (uv) + Node.js                  │
└─────────────────────────────────────────────────────────┘
```

每个 Skill 都是一个独立模块，包含：
- `SKILL.md` — 技能定义和执行流程
- `references/` — 参考文档（写作技法、模板等）
- `scripts/` — 辅助脚本（字数统计、文档处理等）

## 当前作品

### 《洞悉天机三千年，一不小心无敌了》

- **题材**：玄幻修仙 · 系统流 · 扮猪吃虎
- **规划**：100 章 / 10 卷
- **进度**：卷一（第 1-10 章）初稿完成
- **参考风格**：《顶级气运，悄悄修炼千年》
- **目标平台**：七猫中文网

## 适合谁用？

- 想用 AI 辅助写网文但不满足于「一键生成」的创作者
- 对创作质量有要求、希望系统化管理创作流程的作者
- 想探索 Claude Code Skills 在内容创作领域应用的开发者
- 对 AI + 创作工程化感兴趣的人

## 技术栈

- **AI 引擎**：Claude (Anthropic) via Claude Code
- **技能系统**：Claude Code Skills（.claude/skills/）
- **智能体**：Claude Code Agents（.claude/agents/）
- **Python 环境**：uv + Python 3.12+
- **文档处理**：docx-js (npm)
- **版本管理**：Git

## License

本项目为个人创作工具，仅供学习和参考。小说作品版权归作者所有。
