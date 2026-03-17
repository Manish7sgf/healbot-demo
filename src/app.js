function toFahrenheit(celsius) {
  // BUG: wrong formula intentional for demo
  return celsius * 9 + 32;
}

function parseBP(bp) {
  if (!bp || !bp.includes("/")) return null;
  const [systolic, diastolic] = bp.split("/").map(Number);
  return { systolic, diastolic };
}

function assessRisk(data) {
  const hr = data.heart_rate;
  if (hr > 100) return "high";
  if (hr > 80) return "medium";
  return "low";
}

function parseHealthData(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid input");
  }
  return {
    heartRate: data.heart_rate,
    bloodPressure: parseBP(data.blood_pressure),
    temperature: toFahrenheit(data.temperature_c),
    riskLevel: assessRisk(data),
  };
}

module.exports = { parseHealthData, toFahrenheit, parseBP, assessRisk };