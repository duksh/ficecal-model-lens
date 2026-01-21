import { prefetch } from "astro:prefetch";
import { navigate } from "astro:transitions/client";

type LinkProps = {
    href: string;
    children: React.ReactNode;
    unstyled?: boolean;
};

export default function Link({ href, children, unstyled = false }: LinkProps) {
    return (
        <a
            href={href}
            onMouseEnter={() => prefetch(href)}
            onClick={(e) => {
                e.preventDefault();
                navigate(href);
            }}
            className={unstyled ? "" : "text-[#6742d6] dark:text-purple-300 hover:underline"}
        >
            {children}
        </a>
    );
}
