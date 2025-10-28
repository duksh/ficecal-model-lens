import React from "react";
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view"

type CodeMirrorProps = {
    value: string;
    height: string;
    width: string;
    onChange: (value: string) => void;
};

export default function CodeMirror(props: CodeMirrorProps) {
    const editor = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (editor.current) {
            const view = new EditorView({
                doc: props.value,
                extensions: [
                    basicSetup,
                ],
                parent: editor.current,
            });

            return () => {
                view.destroy();
            };
        }
    }, [editor]);

    return (
        <div ref={editor} style={{height: props.height, width: props.width}}></div>
    )
}
