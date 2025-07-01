import { useCallback, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Prism from "prismjs";
import { getEditorTools } from "./editorTools";

type Props = {
  data?: OutputData
  onChange?: (data: OutputData) => void
}

const Editor = ({ data, onChange }: Props) => {
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
                data,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                tools: getEditorTools() as any,
                placeholder: "Pen up your craft or thoughts or anything...",
                onReady: () => {
                    highlight();
                },
                onChange: async () => {
                    try {
                        const saved = await editor.save();
                        onChange?.(saved);
                        highlight();
                    } catch (error) {
                        console.error("Error saving editor data:", error);
                    }
                },
            });
            editorRef.current = editor;
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={holderRef}
            className="editorjs-wrapper, prose max-w-none border border-gray-300 rounded p-4"
        ></div>
    );
};

export default Editor;
