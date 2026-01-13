import type { Model, VendorInfo } from "../../dataFormat";
import Link from "../Link";
import ModelHeader from "./ModelHeader";
import ModelMetadata from "./ModelMetadata";
import TokenizerPreview from "./TokenizerPreview";
import PricingCalculator from "./PricingCalculator";

type ModelPageProps = {
    modelId: string;
    model: Model;
    vendors: Record<string, VendorInfo>;
};

export default function ModelPage({
    modelId,
    model,
    vendors,
}: ModelPageProps) {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-4">
                <Link href="/">&larr; Back to all models</Link>
            </div>
            <ModelHeader model={model} />
            <ModelMetadata model={model} />
            {model.tokeniser && (
                <TokenizerPreview
                    tokeniser={model.tokeniser}
                    modelName={model.cleanName}
                />
            )}
            <PricingCalculator
                modelId={modelId}
                model={model}
                vendors={vendors}
            />
        </div>
    );
}
