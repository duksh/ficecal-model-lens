import type { Model } from "../../dataFormat";

export default function ModelHeader({ model, description }: { model: Model; description: string }) {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold">{model.cleanName}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        </div>
    );
}
