export default function Button(
    props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
    return (
        <button
            {...props}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded ${
                props.className || ""
            }`}
        >
            {props.children}
        </button>
    );
}
