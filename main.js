// script.js

document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount');
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const convertButton = document.getElementById('convertButton');
    const resultDiv = document.getElementById('result');

    const apiKey = '6a65c7b21ccc64074551bd35'; // Substituído pela sua chave da API
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const currencies = Object.keys(data.conversion_rates);

            // Adiciona uma opção padrão "Selecione uma moeda"
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Selecione uma moeda';
            defaultOption.value = '';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            fromCurrency.appendChild(defaultOption.cloneNode(true));
            toCurrency.appendChild(defaultOption.cloneNode(true));

            currencies.forEach(currency => {
                const option1 = document.createElement('option');
                option1.value = currency;
                option1.textContent = currency;
                fromCurrency.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = currency;
                option2.textContent = currency;
                toCurrency.appendChild(option2);
            });

            // Define "Selecione uma moeda" como a opção selecionada padrão
            fromCurrency.selectedIndex = 0;
            toCurrency.selectedIndex = 0;

            // Disable the same currency option in the opposite dropdown
            fromCurrency.addEventListener('change', handleCurrencyChange);
            toCurrency.addEventListener('change', handleCurrencyChange);
        });

    convertButton.addEventListener('click', () => {
        const amount = amountInput.value;
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (amount === '' || isNaN(amount)) {
            resultDiv.textContent = 'Por favor, insira um valor válido.';
            return;
        }

        if (from === '' || to === '') {
            resultDiv.textContent = 'Por favor, selecione as moedas.';
            return;
        }

        const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const result = data.conversion_result;
                resultDiv.textContent = `${amount} ${from} = ${formatCurrency(result)} ${to}`;
            })
            .catch(error => {
                resultDiv.textContent = 'Erro ao obter as taxas de câmbio. Tente novamente mais tarde.';
                console.error('Erro:', error);
            });
    });

    function handleCurrencyChange() {
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (from === to) {
            // Inverte os valores se as moedas forem iguais
            fromCurrency.value = to;
            toCurrency.value = from;
        }

        disableSameCurrencyOption(fromCurrency, toCurrency);
        disableSameCurrencyOption(toCurrency, fromCurrency);
    }

    function disableSameCurrencyOption(selectedCurrencyDropdown, otherCurrencyDropdown) {
        const selectedCurrency = selectedCurrencyDropdown.value;
        const options = otherCurrencyDropdown.querySelectorAll('option');

        options.forEach(option => {
            if (option.value === selectedCurrency) {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        });
    }

    function formatCurrency(value) {
        return value.toFixed(2).replace('.', ',');
    }
});
