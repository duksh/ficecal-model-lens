import type { APIRoute, GetStaticPaths } from "astro";

// Valid tiktoken encodings and their source URLs
// This is the canonical list - only these paths are valid
const TIKTOKEN_SOURCES: Record<string, string> = {
    "cl100k_base": "https://openaipublic.blob.core.windows.net/encodings/cl100k_base.tiktoken",
    "o200k_base": "https://openaipublic.blob.core.windows.net/encodings/o200k_base.tiktoken",
};

export const prerender = true;

// Generate static paths for each valid encoding
export const getStaticPaths: GetStaticPaths = () => {
    return Object.keys(TIKTOKEN_SOURCES).map((encoding) => ({
        params: { encoding },
    }));
};

// Cache for development (doesn't affect production since it builds once)
const cache = new Map<string, string>();

export const GET: APIRoute = async ({ params }) => {
    const encoding = params.encoding;

    if (!encoding || !TIKTOKEN_SOURCES[encoding]) {
        return new Response("Invalid encoding", { status: 404 });
    }

    // Check cache first (for dev server)
    const cached = cache.get(encoding);
    if (cached) {
        return new Response(cached, {
            status: 200,
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });
    }

    const sourceUrl = TIKTOKEN_SOURCES[encoding];
    console.log(`Fetching tiktoken encoding ${encoding} from ${sourceUrl}`);

    const response = await fetch(sourceUrl);

    if (!response.ok) {
        throw new Error(`Failed to fetch tiktoken encoding ${encoding}: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();
    cache.set(encoding, data);

    console.log(`Cached tiktoken encoding ${encoding} (${(data.length / 1024).toFixed(1)} KB)`);

    return new Response(data, {
        status: 200,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
};
