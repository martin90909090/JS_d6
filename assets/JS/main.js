const clpInput = document.getElementById('clp');
const currencySelect = document.getElementById('monedas_ext');
const resultSpan = document.getElementById('result');
const ctx = document.getElementById('myChart').getContext('2d');

const getData = (currency) => {
  return fetch(`https://mindicador.cl/api/${currency}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la petición');
      }
      return response.json();
    });
};

const createChart = (labels, data) => {
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Valor de la moneda en los últimos 10 días',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        pointBackgroundColor: 'hsl(12, 100%, 50%)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};

const convertCurrency = () => {
  const clpValue = clpInput.value;
  const selectedCurrency = currencySelect.value;

  getData(selectedCurrency)
    .then(data => {
      const convertedValue = clpValue / data.serie[0].valor;
      resultSpan.textContent = `Resultado: ${convertedValue.toFixed(2)} ${selectedCurrency}`;
      const last10DaysData = data.serie.slice(0, 10);
      const labels = last10DaysData.map(item => item.fecha.substr(0, 10));
      const chartData = last10DaysData.map(item => item.valor);
      createChart(labels, chartData);
    })
    .catch(error => {
      console.error('Error:', error);
      resultSpan.textContent = 'Error al obtener los datos de la API';
    });
};

clpInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    convertCurrency();
  }
});

currencySelect.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    convertCurrency();
  }
});

document.getElementById('btn_convert').addEventListener('click', convertCurrency);
