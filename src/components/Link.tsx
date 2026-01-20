import { prefetch } from "astro:prefetch";
import { navigate } from "astro:transitions/client";

export default function Link({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            onMouseEnter={() => prefetch(href)}
            onClick={(e) => {
                e.preventDefault();
                navigate(href);
            }}
            className="text-[#6742d6] dark:text-purple-300 hover:underline"
        >
            {children}
        </a>
    );
}
