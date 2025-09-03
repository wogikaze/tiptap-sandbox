import React from "react";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";

interface OutlineItemAttributes {
  id: string;
  collapsed: boolean;
  level: number;
  type: "normal" | "task";
  checked?: boolean;
}

export const OutlineItemComponent: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  editor,
  getPos,
}) => {
  const attrs = node.attrs as OutlineItemAttributes;
  const { level, collapsed, type, checked } = attrs;

  const toggleCollapse = () => {
    updateAttributes({ collapsed: !collapsed });
  };

  return (
    <NodeViewWrapper
      className="outline-item"
      data-level={level}
      data-collapsed={collapsed}
      data-item-type={type}
    >
      <div className="outline-item-content">
        <button
          onClick={toggleCollapse}
          className="outline-item-toggle"
          type="button"
        >
          {collapsed ? "▶" : "▼"}
        </button>

        {type === "task" && (
          <input
            type="checkbox"
            checked={checked || false}
            onChange={(e) => updateAttributes({ checked: e.target.checked })}
            className="outline-item-checkbox"
          />
        )}

        <div className="outline-item-text">
          <span
            className="indent-mark"
            style={{ userSelect: "text", color: "#ccc" }}
          >
            {Array.from({ length: level }, (_, i) => {
              const onMouseDown = (e: React.MouseEvent) => {
                // Prevent native focus change so we can programmatically set selection
                e.preventDefault();

                // getPos may be a function that returns the node's position
                const pos = typeof getPos === "function" ? getPos() : (getPos as unknown as number);
                if (editor && typeof pos === "number") {
                  // place cursor at the start of this node's content
                  // node start is pos + 1
                  editor.chain().focus().setTextSelection(pos + 1).run();
                }
              };

              return (
                <span
                  key={i}
                  className="indent-space"
                  data-indent-index={i}
                  onMouseDown={onMouseDown}
                >
                  {" "}
                </span>
              );
            })}
          </span>
          <NodeViewContent />
        </div>
      </div>
    </NodeViewWrapper>
  );
};
