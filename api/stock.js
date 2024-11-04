const axios = require('axios');
const axiosRetry = require('axios-retry');

// Configurar reintentos automáticos
axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => retryCount * 1000 });

module.exports = async (req, res) => {
    console.log("Iniciando solicitud a Alpha Vantage API para obtener datos de acciones...");
    
    try {
        const response = await axios.get(`https://www.alphavantage.co/query`, {
            params: {
                function: 'TIME_SERIES_DAILY',
                symbol: 'AAPL',
                apikey: process.env.ALPHA_VANTAGE_API_KEY
            }
        });

        const data = response.data["Time Series (Daily)"];
        if (!data) {
            console.error("Error: Datos no válidos recibidos de Alpha Vantage");
            return res.status(500).json({ error: 'Datos no válidos de Alpha Vantage' });
        }

        // Obtener la fecha más reciente
        const latestDate = Object.keys(data)[0];
        const latestData = data[latestDate];
        
        console.log("Datos obtenidos de Alpha Vantage:", latestData);

        // Enviar respuesta con la fecha y el precio de cierre
        res.json({
            date: latestDate,
            closePrice: latestData['4. close'],
            dailyChange: (latestData['4. close'] - latestData['1. open']).toFixed(2),
        });
    } catch (error) {
        console.error("Error al obtener datos de Alpha Vantage:", error.message || error);
        res.status(500).json({ error: 'Error al obtener datos de Alpha Vantage', details: error.message || error });
    }
};
