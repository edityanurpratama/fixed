const axios = require('axios');

const analyzeRisk = async (req, res) => {
    try {
        const { deskripsi, lokasi } = req.body;

        // Call the Python AI Microservice
        const aiResponse = await axios.post('http://localhost:8000/predict-risk', {
            description: deskripsi,
            location: lokasi
        });

        res.json(aiResponse.data);
    } catch (error) {
        // Fallback if AI service is down
        res.json({
            predicted_risk: "Unknown (AI Service Down)",
            confidence: 0,
            recommendation: "Manual review required."
        });
    }
};

module.exports = { analyzeRisk };
