export function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

export function formatVal(v) {
    if (v === null || v === undefined || v === "") return "—";
    if (typeof v === "number") {
        return v % 1 === 0 ? v : v.toFixed(3);
    }
    return v;
}