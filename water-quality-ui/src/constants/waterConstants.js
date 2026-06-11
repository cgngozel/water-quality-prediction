export const COLOR_OPTIONS = [
    "Colorless",
    "Near Colorless",
    "Faint Yellow",
    "Light Yellow",
    "Yellow",
    "Yellow, Foamy",
    "Muddy",
    "Blue-Green"
];

export const SOURCE_OPTIONS = [
    "River",
    "Ground",
    "Spring",
    "Lake",
    "Stream",
    "Reservoir",
    "Aquifer",
    "Well"
];

export const INITIAL_FORM = {
    pH: "",
    Iron: "",
    Nitrate: "",
    Chloride: "",
    Lead: "",
    Zinc: "",
    Color: "Colorless",
    Turbidity: "",
    Fluoride: "",
    Copper: "",
    Odor: "",
    Sulfate: "",
    Conductivity: "",
    Chlorine: "",
    Manganese: "",
    "Total Dissolved Solids": "",
    Source: "River"
};

export const FIELD_CONFIG = [
    { key: "pH", label: "pH Level", unit: "pH", hint: "0–14" },
    { key: "Iron", label: "Iron", unit: "mg/L", hint: "≤ 0.3" },
    { key: "Nitrate", label: "Nitrate", unit: "mg/L", hint: "≤ 10" },
    { key: "Chloride", label: "Chloride", unit: "mg/L", hint: "≤ 250" },
    { key: "Lead", label: "Lead", unit: "mg/L", hint: "≤ 0.015" },
    { key: "Zinc", label: "Zinc", unit: "mg/L", hint: "≤ 5" },
    { key: "Turbidity", label: "Turbidity", unit: "NTU", hint: "≤ 1" },
    { key: "Fluoride", label: "Fluoride", unit: "mg/L", hint: "≤ 1.5" },
    { key: "Copper", label: "Copper", unit: "mg/L", hint: "≤ 1.3" },
    { key: "Odor", label: "Odor", unit: "TON", hint: "0–3" },
    { key: "Sulfate", label: "Sulfate", unit: "mg/L", hint: "≤ 250" },
    { key: "Conductivity", label: "Conductivity", unit: "μS/cm", hint: "≤ 500" },
    { key: "Chlorine", label: "Chlorine", unit: "mg/L", hint: "≤ 4" },
    { key: "Manganese", label: "Manganese", unit: "mg/L", hint: "≤ 0.05" },
    { key: "Total Dissolved Solids", label: "Total Dissolved Solids", unit: "mg/L", hint: "≤ 500" }
];