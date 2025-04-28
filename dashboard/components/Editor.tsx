"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
interface EditorProps {
    onChange: (value: string) => void,
    value: string
}
export default function Editor(props: EditorProps) {



    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "list",
        "bullet",
        "link",
        "image",
    ];

    return (
        <div className="editor min">
            <ReactQuill
                modules={modules}
                theme="snow"
                value={props.value}
                onChange={props.onChange}
                formats={formats}
            />
        </div>
    );
}
