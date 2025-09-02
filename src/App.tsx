import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./App.css";

const App = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World! 🌍️</p>",
  });

  return (
    <div className="App">
      <h1>Tiptap Outliner</h1>
      <EditorContent editor={editor} />
    </div>
  );
};

export default App;
