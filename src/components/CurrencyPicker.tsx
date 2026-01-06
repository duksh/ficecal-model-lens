import React from "react";
import { useStateItem } from "../state";
import forexData from "../../public/forex.json";

type ForexEntry = { rate: number; name: string };

// Sort currencies with common ones first, then alphabetically
const PRIORITY_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY"];

const sortedCurrencies = Object.entries(forexData as Record<string, ForexEntry>).sort(
    ([codeA], [codeB]) => {
        const upperA = codeA.toUpperCase();
        const upperB = codeB.toUpperCase();
        const priorityA = PRIORITY_CURRENCIES.indexOf(upperA);
        const priorityB = PRIORITY_CURRENCIES.indexOf(upperB);

        if (priorityA !== -1 && priorityB !== -1) {
            return priorityA - priorityB;
        }
        if (priorityA !== -1) return -1;
        if (priorityB !== -1) return 1;
        return upperA.localeCompare(upperB);
    }
);

export default function CurrencyPicker() {
    const [currency, setCurrency] = useStateItem("currency");

    const handleChange = React.useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setCurrency(e.target.value);
        },
        [setCurrency]
    );

    return (
        <select
            value={currency}
            onChange={handleChange}
            className="p-2 border rounded-md bg-white text-gray-900 text-sm"
            autoComplete="off"
        >
            {sortedCurrencies.map(([code, info]) => (
                <option key={code} value={code}>
                    {code.toUpperCase()} - {info.name}
                </option>
            ))}
        </select>
    );
}
