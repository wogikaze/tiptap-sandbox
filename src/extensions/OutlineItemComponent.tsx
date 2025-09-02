import React from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";

interface OutlineItemComponentProps {
  node: {
    attrs: {
      id: string;
      collapsed: boolean;
      level: number;
      type: "normal" | "task";
      checked?: boolean;
    };
  };
  updateAttributes: (
    attrs: Partial<OutlineItemComponentProps["node"]["attrs"]>,
  ) => void;
}

export const OutlineItemComponent: React.FC<OutlineItemComponentProps> = ({
  node,
  updateAttributes,
}) => {
  const { attrs } = node;
  const { level, collapsed, type, checked } = attrs;

  const toggleCollapse = () => {
    updateAttributes({ collapsed: !collapsed });
  };

  const indentStyle = {
    marginLeft: `${level * 20}px`,
  };

  return (
    <NodeViewWrapper
      className="outline-item"
      style={indentStyle}
      data-level={level}
      data-collapsed={collapsed}
      data-item-type={type}
    >
      <div className="outline-item-content">
        <span className="outline-item-line-number">{level + 1}</span>

        {type === "task" && (
          <input
            type="checkbox"
            checked={checked || false}
            onChange={(e) => updateAttributes({ checked: e.target.checked })}
            className="outline-item-checkbox"
          />
        )}

        <button
          onClick={toggleCollapse}
          className="outline-item-toggle"
          type="button"
        >
          {collapsed ? "▶" : "▼"}
        </button>

        <NodeViewContent className="outline-item-text" />
      </div>
    </NodeViewWrapper>
  );
};
