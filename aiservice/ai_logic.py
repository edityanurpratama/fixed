from typing import Dict, Tuple

RISK_LEVELS: Dict[str, int] = {
    "Low": 1,
    "Medium": 2,
    "High": 3,
    "Critical": 4,
}

KEYWORD_RISKS: Dict[str, str] = {
    "fire": "Critical",
    "kebakaran": "Critical",
    "smoke": "Critical",
    "asap": "Critical",
    "explosion": "Critical",
    "ledakan": "Critical",
    "chemical": "Critical",
    "kimia": "Critical",
    "gas leak": "Critical",
    "bocor gas": "Critical",
    "bocoran gas": "Critical",
    "leak": "High",
    "bocor": "High",
    "spill": "High",
    "tumpahan": "High",
    "tumpah": "High",
    "electric": "High",
    "listrik": "High",
    "arc flash": "High",
    "korsleting": "High",
    "sparks": "High",
    "percikan": "High",
    "broken": "High",
    "rusak": "High",
    "patah": "High",
    "cable": "Medium",
    "kabel": "Medium",
    "slippery": "Medium",
    "licin": "Medium",
    "wet floor": "Medium",
    "lantai basah": "Medium",
    "trip": "Medium",
    "tersandung": "Medium",
    "obstruction": "Medium",
    "halangan": "Medium",
    "dust": "Low",
    "debu": "Low",
    "noise": "Low",
    "bising": "Low",
    "suara": "Low",
    "vibration": "Low",
    "getaran": "Low",
    "fatigue": "Low",
    "lelah": "Low",
    "capek": "Low",
    "heat": "Low",
    "panas": "Low",
    "cold": "Low",
    "dingin": "Low",
}

LOCATION_RISKS: Dict[str, str] = {
    "boiler": "High",
    "electrical": "High",
    "panel": "High",
    "listrik": "High",
    "transformer": "High",
    "trafo": "High",
    "storage": "Medium",
    "gudang": "Medium",
    "pipeline": "High",
    "pipa": "High",
    "tank": "High",
    "tangki": "High",
    "confined space": "Critical",
    "ruang terbatas": "Critical",
    "reactor": "Critical",
    "reaktor": "Critical",
}

RECOMMENDATIONS: Dict[str, str] = {
    "Critical": "Hentikan aktivitas, evakuasi area, dan panggil tim HSE segera.",
    "High": "Lakukan inspeksi segera dan terapkan kontrol teknis sebelum lanjut.",
    "Medium": "Pantau area dan perkuat mitigasi sebelum bekerja lebih lanjut.",
    "Low": "Catat kondisi dan lakukan pemantauan rutin.",
}


def _map_to_highest_risk(current: str, candidate: str) -> str:
    if RISK_LEVELS[candidate] > RISK_LEVELS[current]:
        return candidate
    return current


def _score_description(description: str) -> Tuple[str, int]:
    description_lower = description.lower()
    risk = "Low"
    matches = 0

    for keyword, level in KEYWORD_RISKS.items():
        if keyword in description_lower:
            matches += 1
            risk = _map_to_highest_risk(risk, level)

    if matches == 0 and len(description_lower.split()) > 30:
        risk = _map_to_highest_risk(risk, "Medium")

    return risk, matches


def _score_location(location: str, current_risk: str) -> str:
    location_lower = location.lower()
    risk = current_risk
    for keyword, level in LOCATION_RISKS.items():
        if keyword in location_lower:
            risk = _map_to_highest_risk(risk, level)
    return risk


def _compute_confidence(matches: int, risk: str) -> float:
    base = 0.65 + min(0.25, matches * 0.08)
    if risk == "Critical":
        base += 0.08
    return round(min(base, 0.99), 2)


def predict_risk(description: str, location: str) -> Dict[str, object]:
    predicted_risk, matches = _score_description(description)
    predicted_risk = _score_location(location, predicted_risk)
    confidence = _compute_confidence(matches, predicted_risk)

    return {
        "predicted_risk": predicted_risk,
        "confidence": confidence,
        "recommendation": RECOMMENDATIONS.get(predicted_risk, "Lakukan tinjauan manual dan pastikan kontrol risiko.")
    }

def predict_fatigue(sleep_hours: float, stress_level: float) -> Dict[str, object]:
    """
    Rule-based Heuristic AI based on WellGuard EDA insights:
    - Sleep < 5 AND Stress > 7 => Critical (Tinggi)
    - Sleep < 6 OR Stress >= 6 => Medium (Sedang)
    - Sleep >= 7 AND Stress <= 5 => Low (Rendah)
    """
    if sleep_hours < 5.0 and stress_level > 7.0:
        fatigue_status = "Tinggi"
        recommendation = "🚨 Risiko Tinggi: Segera konsultasikan ke tim kesehatan kerja. Kurangi beban kerja."
    elif sleep_hours < 6.0 or stress_level >= 6.0:
        fatigue_status = "Sedang"
        recommendation = "⚠️ Perlu Perhatian: Tingkatkan kualitas tidur dan lakukan teknik relaksasi."
    elif sleep_hours >= 7.0 and stress_level <= 5.0:
        fatigue_status = "Rendah"
        recommendation = "✅ Kondisi Baik: Pertahankan pola tidur 7–8 jam dan jaga stress di level rendah."
    else:
        # Default middle ground
        fatigue_status = "Sedang"
        recommendation = "⚠️ Perlu Perhatian: Tetap pantau pola tidur dan tingkat stres."

    return {
        "fatigue_status": fatigue_status,
        "recommendation": recommendation
    }
