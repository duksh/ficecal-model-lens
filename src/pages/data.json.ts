import type { APIRoute } from "astro";
import type { DataFormat } from "../dataFormat";

export const prerender = true;

export const data: DataFormat = {
  vendors: {
    "openai": {
      cleanName: "OpenAI",
      learnMoreUrl: "https://openai.com",
      regionCleanNames: {
        "": {
          "us-east-1": "US East 1",
          "eu-west-1": "EU West 1"
        }
      },
      euOrUKRegions: ["eu-west-1"]
    },
    "anthropic": {
      cleanName: "Anthropic",
      learnMoreUrl: "https://anthropic.com",
      regionCleanNames: {
        "": {
          "us-west-2": "US West 2",
          "eu-central-1": "EU Central 1"
        }
      },
      euOrUKRegions: ["eu-central-1"]
    },
    "aws": {
      cleanName: "Amazon Web Services",
      learnMoreUrl: "https://aws.amazon.com/bedrock",
      regionCleanNames: {
        "bedrock": {
          "us-east-1": "US East (N. Virginia)",
          "eu-west-1": "Europe (Ireland)",
          "ap-southeast-1": "Asia Pacific (Singapore)"
        }
      },
      euOrUKRegions: ["eu-west-1"]
    }
  },
  models: {
    "gpt-4": {
      cleanName: "GPT-4",
      brand: "OpenAI",
      companyCountryCode: "US",
      vendors: [
        {
          vendorRef: "openai",
          regionPricing: {
            "us-east-1": [0.03, 0.06, null, null],
            "eu-west-1": [0.03, 0.06, null, null]
          },
          latencyMs: 1500,
          tokensPerSecond: 50,
          lowCapacity: false
        }
      ],
      selfhostable: false,
      reasoning: true,
      tokeniser: {
        type: "tiktoken",
        bpePath: "cl100k_base"
      },
      humanitysLastExamPercentage: 88.0,
      sweBenchResolvedPercentage: 15.1,
      skatebenchScore: 82.4
    },
    "gpt-3.5-turbo": {
      cleanName: "GPT-3.5 Turbo",
      brand: "OpenAI", 
      companyCountryCode: "US",
      vendors: [
        {
          vendorRef: "openai",
          regionPricing: {
            "us-east-1": [0.0015, 0.002, null, null],
            "eu-west-1": [0.0015, 0.002, null, null]
          },
          latencyMs: 800,
          tokensPerSecond: 120,
          lowCapacity: false
        }
      ],
      selfhostable: false,
      reasoning: false,
      tokeniser: {
        type: "tiktoken",
        bpePath: "cl100k_base"
      },
      humanitysLastExamPercentage: 70.0,
      sweBenchResolvedPercentage: 8.2,
      skatebenchScore: 65.1
    },
    "claude-3-opus": {
      cleanName: "Claude 3 Opus",
      brand: "Anthropic",
      companyCountryCode: "US", 
      vendors: [
        {
          vendorRef: "anthropic",
          regionPricing: {
            "us-west-2": [0.015, 0.075, null, null],
            "eu-central-1": [0.015, 0.075, null, null]
          },
          latencyMs: 2000,
          tokensPerSecond: 40,
          lowCapacity: false
        }
      ],
      selfhostable: false,
      reasoning: true,
      tokeniser: {
        type: "transformers",
        pretrainedPath: "anthropic/claude-tokenizer"
      },
      humanitysLastExamPercentage: 86.8,
      sweBenchResolvedPercentage: 13.4,
      skatebenchScore: 95.0
    },
    "claude-3-sonnet": {
      cleanName: "Claude 3 Sonnet",
      brand: "Anthropic",
      companyCountryCode: "US",
      vendors: [
        {
          vendorRef: "anthropic", 
          regionPricing: {
            "us-west-2": [0.003, 0.015, null, null],
            "eu-central-1": [0.003, 0.015, null, null]
          },
          latencyMs: 1200,
          tokensPerSecond: 80,
          lowCapacity: false
        }
      ],
      selfhostable: false,
      reasoning: true,
      tokeniser: {
        type: "transformers",
        pretrainedPath: "anthropic/claude-tokenizer"
      },
      humanitysLastExamPercentage: 79.2,
      sweBenchResolvedPercentage: 11.9,
      skatebenchScore: 88.3
    },
    "llama-2-70b": {
      cleanName: "LLaMA 2 70B",
      brand: "Meta",
      companyCountryCode: "US",
      vendors: [
        {
          vendorRef: "aws",
          regionPricing: {
            "us-east-1": [0.00195, 0.00256, null, null],
            "eu-west-1": [0.00195, 0.00256, null, null],
            "ap-southeast-1": [0.00195, 0.00256, null, null]
          },
          latencyMs: 1800,
          tokensPerSecond: 30,
          lowCapacity: true
        }
      ],
      selfhostable: true,
      reasoning: false,
      tokeniser: {
        type: "transformers",
        pretrainedPath: "meta-llama/Llama-2-70b-hf"
      },
      humanitysLastExamPercentage: 54.2,
      sweBenchResolvedPercentage: 4.8,
      skatebenchScore: 45.6
    }
  }
};

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
