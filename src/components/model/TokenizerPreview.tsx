import React from "react";
import type { Tokenisers } from "../../dataFormat";

type TokenizerPreviewProps = {
    tokeniser: Tokenisers;
    modelName: string;
};

export default function TokenizerPreview({
    tokeniser,
    modelName,
}: TokenizerPreviewProps) {
    const [text, setText] = React.useState("");
    const [tokenCount, setTokenCount] = React.useState<number | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const tokenizerRef = React.useRef<any>(null);

    const countTokens = React.useCallback(async () => {
        if (!text.trim()) {
            setTokenCount(0);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            switch (tokeniser.type) {
                case "tiktoken":
                    await countTiktokenTokens(
                        tokeniser.bpePath,
                        text,
                        tokenizerRef,
                        setTokenCount
                    );
                    break;
                case "transformers":
                    await countTransformersTokens(
                        tokeniser.pretrainedPath,
                        text,
                        tokenizerRef,
                        setTokenCount
                    );
                    break;
                case "site-api":
                    await countSiteApiTokens(
                        tokeniser.apiUrl,
                        text,
                        setTokenCount
                    );
                    break;
            }
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }, [text, tokeniser]);

    React.useEffect(() => {
        const timeout = setTimeout(countTokens, 300);
        return () => clearTimeout(timeout);
    }, [text, countTokens]);

    return (
        <div className="mb-8 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Tokenizer Preview</h2>
            <p className="text-sm text-gray-500 mb-3">
                Using {tokeniser.type === "tiktoken" && "tiktoken"}
                {tokeniser.type === "transformers" && "HuggingFace Transformers"}
                {tokeniser.type === "site-api" && "API"} tokenizer
            </p>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to count tokens..."
                className="w-full p-3 border rounded-md min-h-[100px] font-mono text-sm"
            />
            <div className="mt-3 flex items-center gap-4">
                {loading ? (
                    <span className="text-gray-500">Counting...</span>
                ) : error ? (
                    <span className="text-red-500 text-sm">{error}</span>
                ) : (
                    <span className="font-medium">
                        Token count: {tokenCount ?? 0}
                    </span>
                )}
            </div>
        </div>
    );
}

async function countTiktokenTokens(
    bpePath: string,
    text: string,
    tokenizerRef: React.MutableRefObject<any>,
    setTokenCount: (count: number) => void
) {
    if (!tokenizerRef.current) {
        const { Tiktoken } = await import("js-tiktoken");
        const response = await fetch(bpePath);
        const bpeData = await response.text();

        const ranks: Record<string, number> = {};
        for (const line of bpeData.split("\n")) {
            if (!line.trim()) continue;
            const spaceIdx = line.lastIndexOf(" ");
            if (spaceIdx === -1) continue;
            const token = line.slice(0, spaceIdx);
            const rank = parseInt(line.slice(spaceIdx + 1), 10);
            ranks[atob(token)] = rank;
        }

        tokenizerRef.current = new Tiktoken(ranks);
    }
    const tokens = tokenizerRef.current.encode(text);
    setTokenCount(tokens.length);
}

async function countTransformersTokens(
    pretrainedPath: string,
    text: string,
    tokenizerRef: React.MutableRefObject<any>,
    setTokenCount: (count: number) => void
) {
    if (!tokenizerRef.current) {
        const { AutoTokenizer } = await import("@huggingface/transformers");
        tokenizerRef.current = await AutoTokenizer.from_pretrained(
            pretrainedPath
        );
    }
    const encoded = await tokenizerRef.current.encode(text);
    setTokenCount(encoded.length);
}

async function countSiteApiTokens(
    apiUrl: string,
    text: string,
    setTokenCount: (count: number) => void
) {
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    const data = await response.json();
    setTokenCount(data.tokenCount);
}
