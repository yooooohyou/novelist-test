// 生成《高考第一场，监考老师把我叫了出去》Word 文档
// 字号映射（half-points）：三号=32, 小四=24, 小三=30, 二号=44, 一号=52, 小二=36

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, PageBreak,
  Footer, PageNumber,
  HeadingLevel, LevelFormat,
} = require('docx');

const NOVEL_DIR = __dirname;
const OUTPUT = path.join(NOVEL_DIR, '高考第一场，监考老师把我叫了出去.docx');

const TITLE = '高考第一场，监考老师把我叫了出去';
const SUBTITLE = '——一篇关于母亲、谎言与十一年沉默的爽文短篇';

const CHAPTERS = [
  { file: '第01章.md', title: '第1章 那张半透明纸条' },
  { file: '第02章.md', title: '第2章 「我要报警」' },
  { file: '第03章.md', title: '第3章 原来你也劝我认' },
  { file: '第04章.md', title: '第4章 北上' },
];

// 行距 1.5 = line 360 (twentieths of a point, single = 240)
const LINE_SPACING_1_5 = { line: 360, lineRule: 'auto' };

// 正文段落（宋体小四 = 24 half-points = 12pt）
function bodyPara(text, opts = {}) {
  return new Paragraph({
    spacing: { ...LINE_SPACING_1_5, before: 0, after: 0 },
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    children: [
      new TextRun({
        text: text,
        font: { name: '宋体', eastAsia: '宋体' },
        size: 24, // 小四 12pt
        bold: opts.bold || false,
      }),
    ],
  });
}

// 章节标题（黑体三号 = 32 half-points = 16pt）
function chapterTitle(text) {
  return new Paragraph({
    spacing: { line: 360, lineRule: 'auto', before: 400, after: 400 },
    alignment: AlignmentType.CENTER,
    pageBreakBefore: true,
    children: [
      new TextRun({
        text: text,
        font: { name: '黑体', eastAsia: '黑体' },
        size: 32, // 三号 16pt
        bold: true,
      }),
    ],
  });
}

// 封面书名（黑体一号 = 52 half-points = 26pt）
function coverTitle(text) {
  return new Paragraph({
    spacing: { line: 360, lineRule: 'auto', before: 2400, after: 240 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: text,
        font: { name: '黑体', eastAsia: '黑体' },
        size: 52,
        bold: true,
      }),
    ],
  });
}

function coverSubtitle(text) {
  return new Paragraph({
    spacing: { line: 360, lineRule: 'auto', before: 240, after: 240 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: text,
        font: { name: '楷体', eastAsia: '楷体' },
        size: 28, // 小三
      }),
    ],
  });
}

// 解析 markdown：去掉 # 标题（章标题我们手动给），保留段落，
// 处理空段（保持原结构），处理水平线（---）作为分隔
function parseChapter(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split('\n');
  const paras = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.replace(/\r$/, '');

    // 跳过 markdown 一级标题（章节标题，我们外部已添加）
    if (/^#\s+/.test(trimmed)) {
      continue;
    }

    // 水平线 --- 作为视觉分隔，用空行代替
    if (/^---+\s*$/.test(trimmed)) {
      paras.push(bodyPara('', { center: true }));
      paras.push(bodyPara('· · ·', { center: true }));
      paras.push(bodyPara('', { center: true }));
      continue;
    }

    // 数字编号小节标题 **1.** **2.** 等 - 加粗居中
    const sectionMatch = trimmed.match(/^\*\*(\d+)\.\*\*\s*$/);
    if (sectionMatch) {
      paras.push(bodyPara(''));
      paras.push(bodyPara(`${sectionMatch[1]}.`, { bold: true }));
      continue;
    }

    // 空行 -> 空段
    if (trimmed === '') {
      paras.push(bodyPara(''));
      continue;
    }

    // 普通段落：去掉行内 **bold** 标记，保留文字
    const cleaned = trimmed.replace(/\*\*(.+?)\*\*/g, '$1');
    paras.push(bodyPara(cleaned));
  }

  return paras;
}

function buildDoc() {
  const children = [];

  // ===== 封面页 =====
  children.push(coverTitle(`《${TITLE}》`));
  children.push(coverSubtitle(SUBTITLE));
  // 留白
  for (let i = 0; i < 8; i++) children.push(bodyPara(''));

  // ===== 目录页 =====
  children.push(new Paragraph({
    spacing: { line: 360, lineRule: 'auto', before: 400, after: 400 },
    alignment: AlignmentType.CENTER,
    pageBreakBefore: true,
    children: [
      new TextRun({
        text: '目  录',
        font: { name: '黑体', eastAsia: '黑体' },
        size: 32,
        bold: true,
      }),
    ],
  }));
  children.push(bodyPara(''));
  for (const ch of CHAPTERS) {
    children.push(new Paragraph({
      spacing: { line: 360, lineRule: 'auto', before: 80, after: 80 },
      alignment: AlignmentType.LEFT,
      indent: { left: 720 },
      children: [
        new TextRun({
          text: ch.title,
          font: { name: '宋体', eastAsia: '宋体' },
          size: 24,
        }),
      ],
    }));
  }

  // ===== 各章正文 =====
  for (const ch of CHAPTERS) {
    const filePath = path.join(NOVEL_DIR, ch.file);
    children.push(chapterTitle(ch.title));
    const paras = parseChapter(filePath);
    children.push(...paras);
  }

  return new Document({
    creator: '',
    title: TITLE,
    description: SUBTITLE,
    styles: {
      default: {
        document: {
          run: {
            font: { name: '宋体', eastAsia: '宋体' },
            size: 24,
          },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  font: { name: '宋体', eastAsia: '宋体' },
                  size: 20,
                  children: [PageNumber.CURRENT],
                }),
              ],
            }),
          ],
        }),
      },
      children: children,
    }],
  });
}

const doc = buildDoc();
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log('生成成功:', OUTPUT);
  console.log('大小:', (buffer.length / 1024).toFixed(1), 'KB');
});
