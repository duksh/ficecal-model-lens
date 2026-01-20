export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded ${
                props.className || ""
            }`}
        >
            {props.children}
        </button>
    );
}
