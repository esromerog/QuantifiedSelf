import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { P5iFrame } from "../visuals/P5Code/p5iframe";
import { useDispatch, useSelector } from "react-redux";
import React, { useRef, useEffect, useState } from "react";
import { allVisSources } from "../../../App";

// To insert it into the actual editor
// this.editor.chain().insertContentAt(this.editor.state.selection.head, { type: this.type.name }).focus().run()

const P5Extension = Node.create({
  name: "P5Visualization",
  group: "block",
  tag: "p5-visualization",
  atom: true,
  addAttributes() {
    return {
      visID: {
        default: "circle_basic",
        parseHTML: (element) => element.getAttribute("visID"),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(P5LessonVisualsTipTap);
  },
  renderHTML({ HTMLAttributes }) {
    return ["react-component", mergeAttributes(HTMLAttributes)];
  },
  parseHTML() {
    return [
      {
        tag: "p5-visualization",
      },
    ];
  },
});

export default P5Extension;

function _getVisMeta(visID) {
  let result = allVisSources.find(({ id }) => id == visID);
  if (typeof result === "undefined") {
    const customVis = JSON.parse(localStorage.getItem("visuals"));
    result = customVis.find((x) => x.id == visID);
  }
  return result;
}

function LoadP5LessonVisuals({ visMetadata }) {
  const visID = visMetadata?.id;
  const params = useSelector((state) => state.params);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  function getCode() {
    if (visMetadata?.code) {
      import(`../../../assets/visuals/p5/${visMetadata.code}`).then((res) => {
        setCode(res.default);
      });
    } else if ("custom" in visMetadata) {
      const customVisuals = localStorage.getItem(`visuals/${visID}`);
      setCode(customVisuals);
    } else {
      setCode("");
    }
  }

  function setCode(str) {
    localStorage.setItem(`visuals/${visID}`, str);
    _setCode(str);
  }

  const [dispCode, setDispCode] = useState(false);
  const [code, _setCode] = useState("");

  useEffect(() => {
    setCode(getCode());
  }, []);

  return (
    <NodeViewWrapper>
      <P5iFrame params={params} code={code} />
    </NodeViewWrapper>
  );
}

function P5LessonVisualsTipTap(props) {
  const visMetadata = _getVisMeta(props.node.attrs.visID);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "params/load", payload: visMetadata });
  }, []);

  return (
    <NodeViewWrapper>
      <LoadP5LessonVisuals visMetadata={visMetadata} />
    </NodeViewWrapper>
  );
}

export function P5LessonVisuals({ visID }) {
  const visMetadata = _getVisMeta(visID);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "params/load", payload: visMetadata });
  }, []);

  return <LoadP5LessonVisuals visMetadata={visMetadata} />;
}
