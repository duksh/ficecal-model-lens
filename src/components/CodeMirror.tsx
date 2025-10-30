import React from "react";
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view"
import { sql, SQLite } from "@codemirror/lang-sql";

type CodeMirrorProps = {
    value: string;
    maxHeight: string;
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
                    sql({
                        dialect: SQLite,
                    }),
                ],
                parent: editor.current,
                dispatchTransactions: (trs) => {
                    view.update(trs);
                    for (const tr of trs) {
                        if (tr.docChanged) {
                            props.onChange(view.state.doc.toString());
                        }
                    }
                }
            });

            return () => {
                view.destroy();
            };
        }
    }, [editor]);

    return (
        <div style={{ maxHeight: props.maxHeight }} ref={editor}></div>
    )
}
