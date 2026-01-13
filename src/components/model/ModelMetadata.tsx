import type { Model } from "../../dataFormat";

function MetadataItem({ label, value, href }: { label: string; value: string; href?: string }) {
    return (
        <div className="flex flex-col">
            {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    {label}
                </a>
            ) : (
                <span className="text-sm text-gray-500">{label}</span>
            )}
            <span className="font-medium">{value}</span>
        </div>
    );
}

export default function ModelMetadata({ model }: { model: Model }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <MetadataItem
                label="Self-hostable"
                value={model.selfhostable ? "Yes" : "No"}
            />
            <MetadataItem
                label="Reasoning Capable"
                value={model.reasoning ? "Yes" : "No"}
            />
            {model.humanitysLastExamPercentage !== undefined && (
                <MetadataItem
                    label="Humanity's Last Exam"
                    value={`${model.humanitysLastExamPercentage.toFixed(1)}%`}
                    href="https://lastexam.ai/"
                />
            )}
            {model.sweBenchResolvedPercentage !== undefined && (
                <MetadataItem
                    label="SWE-Bench Resolved"
                    value={`${model.sweBenchResolvedPercentage.toFixed(1)}%`}
                    href="https://www.swebench.com/"
                />
            )}
            {model.skatebenchScore !== undefined && (
                <MetadataItem
                    label="SkateBench Score"
                    value={`${model.skatebenchScore.toFixed(2)}%`}
                    href="https://skatebench.t3.gg/"
                />
            )}
        </div>
    );
}
