import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import HardBreak from "@tiptap/extension-hard-break";
import { OutlineItem } from "./extensions/OutlineItem";
import { generateDummyData, dummyDataToHTML } from "./utils/dummyData";
import "./App.css";
import "./extensions/OutlineItem.css";

const App = () => {
  // 開発時は少量のデータを使用、本番テスト時は1000行
  const isDevelopment = process.env.NODE_ENV === "development";
  const dataCount = isDevelopment ? 20 : 1000;
  const dummyData = generateDummyData(dataCount);

  const editor = useEditor({
    extensions: [
      Document.configure({ content: "outline_item+" }),
      Text,
      HardBreak,
      OutlineItem,
    ],
    content: dummyDataToHTML(dummyData),
  });

  return (
    <div className="App">
      <h1>Tiptap Outliner</h1>
      <div className="editor-info">
        <p>
          Items: {dummyData.length} | Mode:{" "}
          {isDevelopment ? "Development" : "Performance Test"}
        </p>
      </div>
      <div className="editor-container">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default App;
