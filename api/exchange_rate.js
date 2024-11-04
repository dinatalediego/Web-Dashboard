const axios = require('axios');
const axiosRetry = require('axios-retry');

// Configurar reintentos automáticos
axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => retryCount * 1000 });

module.exports = async (req, res) => {
    console.log("Iniciando solicitud a Exchange Rates API para obtener la tasa de cambio...");

    try {
        const response = await axios.get(`https://api.apilayer.com/exchangerates_data/latest`, {
            headers: {
                'apikey': process.env.EXCHANGE_RATES_API_KEY
            },
            params: {
                base: 'USD',
                symbols: 'EUR'
            }
        });

        const data = response.data;
        if (!data || !data.rates || !data.rates.EUR) {
            console.error("Error: Datos no válidos recibidos de Exchange Rates API");
            return res.status(500).json({ error: 'Datos no válidos de Exchange Rates API' });
        }

        console.log("Datos obtenidos de Exchange Rates API:", data);

        res.json({
            date: data.date,
            exchangeRate: data.rates.EUR
        });
    } catch (error) {
        console.error("Error al obtener datos de Exchange Rates API:", error.message || error);
        res.status(500).json({ error: 'Error al obtener datos de Exchange Rates API', details: error.message || error });
    }
};
