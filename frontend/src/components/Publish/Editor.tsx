import { useCallback, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Prism from "prismjs";
import { getEditorTools } from "../../utils/editorTools";

type Props = {
  contentData?: OutputData
  changeInEditor?: (data: OutputData) => void
}

const Editor = ({ contentData, changeInEditor }: Props) => {
    const holderRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<EditorJS | null>(null);

    // Highlight everything under the editor container
    const highlight = useCallback(() => {
        if (holderRef.current) {
            Prism.highlightAllUnder(holderRef.current);
        }
    }, []);

    useEffect(() => {
        if (holderRef.current && !editorRef.current) {
            const editor = new EditorJS({
                holder: holderRef.current,
                data: contentData,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                tools: getEditorTools() as any,
                placeholder: "Pen up your craft here!! Can add headings, images, code list...",
                onReady: () => {
                    highlight();
                },
                onChange: async () => {
                    try {
                        const saved = await editor.save();
                        changeInEditor?.(saved);
                        highlight();
                    } catch (error) {
                        console.error("Error saving editor data:", error);
                    }
                },
            });
            editorRef.current = editor;
        }

        return () => {
            if (editorRef.current && typeof editorRef.current.destroy === "function") {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={holderRef}
            className="editorjs-wrapper prose border-gray-300 rounded"
        ></div>
    );
};

export default Editor;
