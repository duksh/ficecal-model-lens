/**
 * Performance data from Artificial Analysis (artificialanalysis.ai)
 *
 * This data is scraped from their LLM API Providers Leaderboard.
 * Since they don't have a public API, this data needs to be manually updated.
 *
 * To update this data:
 * 1. Visit https://artificialanalysis.ai/leaderboards/providers
 * 2. Open browser console and run the extraction script (see bottom of file)
 * 3. Replace the PERFORMANCE_DATA array below
 *
 * Data format: [vendorId, modelName, tokensPerSecond, latencyMs]
 * - vendorId: Our internal vendor ID (aws, openai, anthropic, etc.)
 * - modelName: Model name as shown on Artificial Analysis
 * - tokensPerSecond: Median output speed in tokens/second
 * - latencyMs: Median time to first token in milliseconds
 */

type PerformanceEntry = [string, string, number, number];

// Last updated: 2026-01-13
const PERFORMANCE_DATA: PerformanceEntry[] = [
    // OpenAI
    ["openai", "GPT-5.2 (xhigh)", 92, 29830],
    ["openai", "GPT-5.1 (high)", 125, 28310],
    ["openai", "GPT-5.2 (medium)", 73, 590],
    ["openai", "GPT-5.1 Codex (high)", 236, 16030],
    ["openai", "GPT-5 mini (high)", 68, 125900],
    ["openai", "GPT-5.1 Codex mini (high)", 167, 7490],
    ["openai", "GPT-5.2", 67, 490],
    ["openai", "GPT-5.2", 77, 460],
    ["openai", "GPT-5 nano (high)", 117, 117230],
    ["openai", "o3", 274, 12240],

    // Anthropic
    ["anthropic", "Claude Opus 4.5", 74, 1680],
    ["anthropic", "Claude Opus 4.5", 75, 1950],
    ["anthropic", "Claude 4.5 Sonnet", 78, 1570],
    ["anthropic", "Claude 4.5 Haiku", 108, 420],

    // AWS Bedrock
    ["aws", "Claude Opus 4.5", 89, 1690],
    ["aws", "Claude Opus 4.5", 82, 1770],
    ["aws", "Claude 4.5 Sonnet", 104, 1760],
    ["aws", "Claude 4.5 Haiku", 92, 650],
    ["aws", "MiniMax-M2", 72, 620],
    ["aws", "Nova 2.0 Pro Preview (medium)", 130, 22300],
    ["aws", "gpt-oss-120B (high)", 261, 600],
    ["aws", "Nova 2.0 Pro Preview (low)", 132, 13000],
    ["aws", "Nova 2.0 Lite (medium)", 252, 14230],
    ["aws", "gpt-oss-20B (high)", 377, 21730],
    ["aws", "Qwen3 235B 2507", 62, 680],
    ["aws", "Nova 2.0 Omni (low)", 237, 3080],
    ["aws", "gpt-oss-120B (low)", 204, 580],
    ["aws", "Nova 2.0 Pro Preview", 160, 460],
    ["aws", "Mistral Large 3", 90, 640],
    ["aws", "gpt-oss-20B (low)", 210, 5110],
    ["aws", "Qwen3 Coder 30B A3B", 103, 690],
    ["aws", "Nova Premier (medium)", 95, 920],
    ["aws", "Nova Premier (low)", 112, 450],
    ["aws", "Llama 3.1 405B Latency Optimized", 73, 450],
    ["aws", "Llama 3.1 405B Standard", 23, 1800],
    ["aws", "Nova 2.0 Omni", 227, 700],
    ["aws", "Ministral 14B (Dec '25)", 170, 610],
    ["aws", "Ministral 8B (Dec '25)", 232, 590],
    ["aws", "Llama 3.3 70B", 143, 450],
    ["aws", "Llama 4 Scout", 194, 530],
    ["aws", "NVIDIA Nemotron Nano 9B V2", 109, 660],
    ["aws", "Ministral 3B (Dec '25)", 357, 600],
    ["aws", "Gemma 3 27B", 95, 620],
    ["aws", "Llama 3.2 3B", 294, 340],
    ["aws", "Gemma 3 4B", 179, 610],
    ["aws", "Llama 3.2 90B (Vision)", 51, 450],
    ["aws", "Llama 3.2 11B (Vision)", 142, 370],
    ["aws", "Magistral Small 1.2", 43, 600],
    ["aws", "Nova Micro", 464, 360],
    ["aws", "Kimi K2 Thinking", 85, 620],

    // GCP (Google Vertex / AI Studio)
    ["gcp", "Claude Opus 4.5 Vertex", 59, 910],
    ["gcp", "Claude Opus 4.5 Vertex", 46, 1190],
    ["gcp", "Claude 4.5 Sonnet Vertex", 68, 900],
    ["gcp", "Claude 4.5 Haiku Vertex", 89, 530],
    ["gcp", "Gemini 3 Pro Preview (high) (Vertex)", 139, 31370],
    ["gcp", "Gemini 3 Pro Preview (high) (AI Studio)", 126, 32190],
    ["gcp", "Gemini 3 Flash (AI Studio)", 225, 11550],
    ["gcp", "Gemini 3 Flash (AI Studio)", 194, 690],
    ["gcp", "Gemini 2.5 Pro Vertex", 143, 35730],
    ["gcp", "Gemini 2.5 Pro (AI Studio)", 160, 34100],
    ["gcp", "MiniMax-M2 Vertex", 175, 250],
    ["gcp", "gpt-oss-120B (high) Vertex", 367, 260],
    ["gcp", "DeepSeek V3.2 Vertex", 53, 510],
    ["gcp", "DeepSeek V3.2 Vertex", 57, 520],
    ["gcp", "Gemini 3 Pro Preview (low) (AI Studio)", 118, 3310],
    ["gcp", "Gemini 3 Pro Preview (low) (Vertex)", 133, 4070],
    ["gcp", "Kimi K2 Thinking Vertex", 220, 300],
    ["gcp", "Qwen3 Next 80B A3B Vertex", 174, 320],
    ["gcp", "gpt-oss-20B (high) Vertex", 433, 160],
    ["gcp", "Qwen3 235B 2507 Vertex", 121, 370],
    ["gcp", "gpt-oss-120B (low) Vertex", 230, 260],
    ["gcp", "Gemini 2.5 Flash-Lite (Sep) (AI Studio)", 572, 6680],
    ["gcp", "gpt-oss-20B (low) Vertex", 455, 170],
    ["gcp", "Qwen3 Next 80B A3B Vertex", 226, 310],
    ["gcp", "Gemini 2.5 Flash-Lite (Sep) (AI Studio)", 399, 330],
    ["gcp", "Llama 3.1 405B Vertex", 24, 390],
    ["gcp", "Llama 3.3 70B Vertex", 155, 190],
    ["gcp", "Llama 4 Scout Vertex", 179, 420],
    ["gcp", "Gemma 3 27B (AI Studio)", 41, 3840],
    ["gcp", "Gemma 3 4B (AI Studio)", 38, 930],
    ["gcp", "Llama 3.2 90B (Vision) Vertex", 21, 170],
    ["gcp", "Gemma 3 1B (AI Studio)", 35, 510],
    ["gcp", "Gemma 3n E2B (AI Studio)", 39, 370],
    ["gcp", "DeepSeek R1 0528 Vertex", 204, 290],

    // DeepSeek
    ["deepseek", "DeepSeek V3.2", 30, 1400],
    ["deepseek", "DeepSeek V3.2", 29, 1350],

    // Mistral
    ["mistral", "Magistral Medium 1.2", 40, 510],
    ["mistral", "Mistral Large 3", 50, 530],
    ["mistral", "Devstral 2", 49, 490],
    ["mistral", "Mistral Medium 3.1", 89, 400],
    ["mistral", "Ministral 14B (Dec '25)", 147, 310],
    ["mistral", "Devstral Small", 230, 360],
    ["mistral", "Mistral Small 3.2", 90, 300],
    ["mistral", "Ministral 8B (Dec '25)", 194, 290],
    ["mistral", "Ministral 3B (Dec '25)", 299, 270],
    ["mistral", "Magistral Small 1.2", 206, 330],

    // Alibaba
    ["alibaba", "Qwen3 Max Thinking", 37, 1820],
    ["alibaba", "Qwen3 Max", 26, 1920],
    ["alibaba", "Qwen3 235B A22B 2507", 77, 1150],
    ["alibaba", "Qwen3 VL 235B A22B", 43, 1100],
    ["alibaba", "Qwen3 VL 235B A22B", 36, 1090],
    ["alibaba", "Qwen3 Next 80B A3B", 168, 1170],
    ["alibaba", "Qwen3 235B 2507", 40, 1090],
    ["alibaba", "Qwen3 30B A3B 2507", 164, 970],
    ["alibaba", "Qwen3 Coder 30B A3B", 99, 1490],
    ["alibaba", "Qwen3 VL 30B A3B", 103, 920],
    ["alibaba", "Qwen3 VL 30B A3B", 97, 900],
    ["alibaba", "Qwen3 Omni 30B A3B", 99, 950],
    ["alibaba", "Qwen3 30B A3B 2507", 76, 1030],
    ["alibaba", "Qwen3 VL 8B", 65, 970],
    ["alibaba", "Qwen3 VL 8B", 107, 910],
    ["alibaba", "Qwen3 Omni 30B A3B", 88, 990],
    ["alibaba", "Qwen3 0.6B", 187, 890],
    ["alibaba", "Qwen3 VL 32B", 46, 980],
    ["alibaba", "Qwen3 1.7B", 126, 900],
    ["alibaba", "Qwen3 0.6B", 201, 890],
    ["alibaba", "Qwen3 VL 32B", 49, 1070],
];

// Vendor ID mapping from Artificial Analysis provider names
const VENDOR_MAP: Record<string, string> = {
    "Amazon Bedrock": "aws",
    "Amazon Bedrock Standard": "aws",
    "Amazon Bedrock Latency Optimized": "aws",
    OpenAI: "openai",
    Anthropic: "anthropic",
    Mistral: "mistral",
    "Google (Vertex)": "gcp",
    "Google (AI Studio)": "gcp",
    "Google Vertex": "gcp",
    DeepSeek: "deepseek",
    "Alibaba Cloud": "alibaba",
};

/**
 * Normalizes a model name for matching.
 * Removes version suffixes, parenthetical notes, and normalizes spacing.
 */
function normalizeModelName(name: string): string {
    return (
        name
            .toLowerCase()
            // Remove parenthetical suffixes like "(high)", "(low)", "(Vertex)", "(AI Studio)"
            .replace(/\s*\([^)]*\)\s*/g, " ")
            // Remove "vertex" suffix
            .replace(/\s*vertex\s*/gi, " ")
            // Normalize whitespace
            .replace(/\s+/g, " ")
            .trim()
    );
}

/**
 * Converts an Artificial Analysis model name to our slugified model ID format.
 */
function modelNameToSlug(name: string): string {
    // Special case mappings
    const specialMappings: Record<string, string> = {
        "claude opus 4.5": "claude-opus-4-5",
        "claude 4.5 sonnet": "claude-sonnet-4-5",
        "claude 4.5 haiku": "claude-haiku-4-5",
        "gpt-5.2": "gpt-5-2",
        "gpt-5.1": "gpt-5-1",
        "gpt-5": "gpt-5",
        o3: "o3",
        "gemini 3 pro preview": "gemini-3-0-pro",
        "gemini 3 flash": "gemini-3-0-flash",
        "gemini 2.5 pro": "gemini-2-5-pro",
        "gemini 2.5 flash-lite": "gemini-2-5-flash-lite",
        "deepseek v3.2": "deepseek-v3-2",
        "deepseek v3": "deepseek-v3",
        "deepseek r1": "deepseek-r1",
        "llama 3.1 405b": "llama-3-1-405b-instruct",
        "llama 3.3 70b": "llama-3-3-70b-instruct",
        "llama 4 scout": "llama-4-scout-17b-16e-instruct",
        "llama 3.2 3b": "llama-3-2-3b-instruct",
        "llama 3.2 11b": "llama-3-2-11b-vision-instruct",
        "llama 3.2 90b": "llama-3-2-90b-vision-instruct",
        "mistral large 3": "mistral-large-3",
        "mistral medium 3.1": "mistral-medium-3-1",
        "mistral small 3.2": "mistral-small-3-2",
        "ministral 14b": "ministral-14b",
        "ministral 8b": "ministral-8b",
        "ministral 3b": "ministral-3b",
        "magistral medium 1.2": "magistral-medium-1-2",
        "magistral small 1.2": "magistral-small-1-2",
        "devstral 2": "devstral-2",
        "devstral small": "devstral-small",
        "qwen3 max": "qwen3-max",
        "qwen3 235b a22b": "qwen3-235b-a22b",
        "qwen3 30b a3b": "qwen3-30b-a3b",
        "nova 2.0 pro preview": "amazon-nova-2-0-pro-preview",
        "nova 2.0 lite": "amazon-nova-2-0-lite",
        "nova 2.0 omni": "amazon-nova-2-0-omni",
        "nova premier": "amazon-nova-premier",
        "nova micro": "amazon-nova-micro",
        "gemma 3 27b": "gemma-3-27b-it",
        "gemma 3 4b": "gemma-3-4b-it",
        "gemma 3 1b": "gemma-3-1b-it",
        "kimi k2 thinking": "kimi-k2-thinking",
        "minimax-m2": "minimax-m2",
        "gpt-oss-120b": "gpt-oss-120b",
        "gpt-oss-20b": "gpt-oss-20b",
        "nvidia nemotron nano 9b v2": "nvidia-nemotron-nano-9b-v2",
    };

    const normalized = normalizeModelName(name);

    // Try exact match first
    if (specialMappings[normalized]) {
        return specialMappings[normalized];
    }

    // Try prefix match
    for (const [prefix, slug] of Object.entries(specialMappings)) {
        if (normalized.startsWith(prefix)) {
            return slug;
        }
    }

    // Default: convert to slug format
    return normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// Build lookup map: vendorId -> modelSlug -> { tokensPerSecond, latencyMs }
type PerformanceMetrics = { tokensPerSecond: number; latencyMs: number };
const performanceLookup = new Map<string, Map<string, PerformanceMetrics>>();

for (const [vendorId, modelName, tokensPerSecond, latencyMs] of PERFORMANCE_DATA) {
    if (!performanceLookup.has(vendorId)) {
        performanceLookup.set(vendorId, new Map());
    }
    const vendorMap = performanceLookup.get(vendorId)!;
    const modelSlug = modelNameToSlug(modelName);

    // If we already have data for this model, keep the better (faster) values
    const existing = vendorMap.get(modelSlug);
    if (!existing || tokensPerSecond > existing.tokensPerSecond) {
        vendorMap.set(modelSlug, { tokensPerSecond, latencyMs });
    }
}

/**
 * Gets performance metrics for a model from a specific vendor.
 * @param modelSlug - Our slugified model ID (e.g., "claude-opus-4-5")
 * @param vendorId - Our vendor ID (e.g., "aws", "openai")
 * @returns Performance metrics or undefined if not found
 */
export function getPerformanceMetrics(
    modelSlug: string,
    vendorId: string
): PerformanceMetrics | undefined {
    const vendorMap = performanceLookup.get(vendorId);
    if (!vendorMap) return undefined;

    // Try exact match
    if (vendorMap.has(modelSlug)) {
        return vendorMap.get(modelSlug);
    }

    // Try prefix matching for versioned models
    for (const [slug, metrics] of vendorMap) {
        if (modelSlug.startsWith(slug) || slug.startsWith(modelSlug)) {
            return metrics;
        }
    }

    return undefined;
}

/**
 * Gets all available performance data for a model across all vendors.
 * @param modelSlug - Our slugified model ID
 * @returns Map of vendorId -> PerformanceMetrics
 */
export function getAllPerformanceMetricsForModel(
    modelSlug: string
): Map<string, PerformanceMetrics> {
    const result = new Map<string, PerformanceMetrics>();

    for (const [vendorId, vendorMap] of performanceLookup) {
        const metrics = vendorMap.get(modelSlug);
        if (metrics) {
            result.set(vendorId, metrics);
        } else {
            // Try prefix matching
            for (const [slug, m] of vendorMap) {
                if (modelSlug.startsWith(slug) || slug.startsWith(modelSlug)) {
                    result.set(vendorId, m);
                    break;
                }
            }
        }
    }

    return result;
}

export { VENDOR_MAP };

/*
 * EXTRACTION SCRIPT
 *
 * Run this in the browser console at https://artificialanalysis.ai/leaderboards/providers
 * to extract updated performance data:
 *
 * ```javascript
 * const vendorMap = {
 *   'Amazon Bedrock': 'aws',
 *   'Amazon Bedrock Standard': 'aws',
 *   'Amazon Bedrock Latency Optimized': 'aws',
 *   'OpenAI': 'openai',
 *   'Anthropic': 'anthropic',
 *   'Mistral': 'mistral',
 *   'Google (Vertex)': 'gcp',
 *   'Google (AI Studio)': 'gcp',
 *   'Google Vertex': 'gcp',
 *   'DeepSeek': 'deepseek',
 *   'Alibaba Cloud': 'alibaba'
 * };
 *
 * const rows = document.querySelectorAll('table tbody tr');
 * const data = [];
 * rows.forEach((row) => {
 *   const cells = row.querySelectorAll('td');
 *   if (cells.length > 0) {
 *     const provider = cells[0]?.textContent?.trim();
 *     const model = cells[1]?.textContent?.trim();
 *     const speed = cells[6]?.textContent?.trim();
 *     const latency = cells[7]?.textContent?.trim();
 *     if (provider && model && speed && speed !== '-' && latency && latency !== '-' && vendorMap[provider]) {
 *       data.push([vendorMap[provider], model, parseFloat(speed), Math.round(parseFloat(latency) * 1000)]);
 *     }
 *   }
 * });
 * console.log(JSON.stringify(data, null, 2));
 * ```
 */
