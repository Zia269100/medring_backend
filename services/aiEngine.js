export function generateEmergencyPlan(medical = {}, situation = "unknown") {

  let steps = [];
  let level = "LOW";

  if (situation === "seizure") {
    level = "HIGH";
    steps.push("Lay patient on side");
    steps.push("Do NOT put anything in mouth");
    steps.push("Time the seizure");
  }

  if (situation === "unconscious") {
    level = "HIGH";
    steps.push("Check breathing");
    steps.push("Loosen tight clothes");
    steps.push("Call ambulance immediately");
  }

  if (situation === "accident") {
    level = "HIGH";
    steps.push("Stop bleeding with pressure");
    steps.push("Do not move neck or spine");
  }

  if (medical?.conditions?.includes("diabetes"))
    steps.push("Do NOT give sugar without checking");

  if (medical?.conditions?.includes("epilepsy"))
    steps.push("Seizure history detected. Protect head");

  return { level, steps };
}