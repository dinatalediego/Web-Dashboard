document.addEventListener("DOMContentLoaded", function () {
    async function fetchStockData() {
        try {
            const response = await fetch('/api/stock');
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            document.getElementById("stock-price").textContent = `Precio de Acción (AAPL): $${data.closePrice}`;
            document.getElementById("stock-change").textContent = `Cambio Diario: ${data.dailyChange} USD`;
            console.log("Datos de acciones obtenidos correctamente:", data);
        } catch (error) {
            document.getElementById("stock-price").textContent = "Error al obtener precio de acción.";
            document.getElementById("stock-change").textContent = "";
            console.error("Error al obtener datos de acciones:", error);
        }
    }

    async function fetchExchangeRate() {
        try {
            const response = await fetch('/api/exchange-rate');
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            document.getElementById("exchange-rate-value").textContent = `Tasa USD a EUR: ${data.exchangeRate}`;
            document.getElementById("exchange-rate-date").textContent = `Última Actualización: ${data.date}`;
            console.log("Datos de tasa de cambio obtenidos correctamente:", data);
        } catch (error) {
            document.getElementById("exchange-rate-value").textContent = "Error al obtener tasa de cambio.";
            document.getElementById("exchange-rate-date").textContent = "";
            console.error("Error al obtener datos de tasa de cambio:", error);
        }
    }

    // Llamadas a las funciones
    fetchStockData();
    fetchExchangeRate();
});
