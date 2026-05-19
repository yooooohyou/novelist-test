const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, PageBreak, LevelFormat,
} = require("/opt/node22/lib/node_modules/docx");

const DIR = __dirname;
const TITLE = "全家逼我帮弟弟高考作弊，我递的全是错题";

const chapterFiles = fs.readdirSync(DIR)
  .filter((f) => /^第\d+章\.md$/.test(f))
  .sort();

const children = [];

// 封面页
children.push(
  new Paragraph({ spacing: { before: 2400 }, children: [] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 600 },
    children: [new TextRun({ text: "《" + TITLE + "》", bold: true, size: 44, font: "黑体" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: "短篇 · 共九章 · 约一万二千字", size: 24, font: "宋体" })],
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

for (const file of chapterFiles) {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const lines = raw.split("\n");
  let title = file.replace(".md", "");
  const body = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith("# ")) { title = t.slice(2).trim(); continue; }
    body.push(t);
  }

  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: title, bold: true, size: 32, font: "黑体" })],
    }),
  );

  for (const para of body) {
    children.push(
      new Paragraph({
        spacing: { line: 360 },
        indent: { firstLine: 480 },
        children: [new TextRun({ text: para, size: 24, font: "宋体" })],
      }),
    );
  }
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "宋体", size: 24 } } },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "黑体" },
        paragraph: { spacing: { before: 240, after: 360 }, outlineLevel: 0 },
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(path.join(DIR, "《" + TITLE + "》.docx"), buf);
  console.log("已生成: 《" + TITLE + "》.docx (" + chapterFiles.length + " 章)");
});
