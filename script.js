document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('transaction-form');
    const transactionsBody = document.getElementById('transactions-body');
    const totalEntradas = document.getElementById('total-entradas');
    const totalSaidas = document.getElementById('total-saidas');
    const saldo = document.getElementById('saldo');
    const porcentagemLucro = document.getElementById('porcentagem-lucro');
    const ctx = document.getElementById('profitChart').getContext('2d');
    const resetButton = document.getElementById('reset-button');
    const addButton = document.getElementById('add-button');
    const saveEditButton = document.getElementById('save-edit-button');
    const cancelEditButton = document.getElementById('cancel-edit-button');
    const annualBody = document.getElementById('annual-body');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let chart;
    let editingIndex = -1;

    function updateSummary() {
        let entradas = 0;
        let saidas = 0;
        transactions.forEach(t => {
            if (t.type === 'entrada') entradas += t.amount;
            else saidas += t.amount;
        });
        totalEntradas.textContent = entradas.toFixed(2);
        totalSaidas.textContent = saidas.toFixed(2);
        const saldoValor = entradas - saidas;
        saldo.textContent = saldoValor.toFixed(2);
        const porcentagem = entradas > 0 ? (saldoValor / entradas) * 100 : 0;
        porcentagemLucro.textContent = porcentagem.toFixed(2);
        updateChart(porcentagem);
    }

    function updateChart(porcentagem) {
        if (chart) {
            chart.destroy();
        }
        chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Lucro', 'Gastos'],
                datasets: [{
                    data: [porcentagem, 100 - porcentagem],
                    backgroundColor: ['#28a745', '#dc3545'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    function renderTransactions() {
        const transactionsList = document.getElementById('transactions-list');
        transactionsList.innerHTML = '';
        const recentTransactions = transactions.slice(-10).reverse(); // Mostra apenas as 10 últimas transações, invertidas (mais recente primeiro)
        recentTransactions.forEach((t, index) => {
            const realIndex = transactions.length - 1 - index; // Índice real no array completo, ajustado para a ordem reversa
            const li = document.createElement('li');
            li.className = t.type;
            li.innerHTML = `
                <span>${t.date} - ${t.description} - ${t.type === 'entrada' ? 'Entrada' : 'Saída'} - R$ ${t.amount.toFixed(2)}</span>
                <button class="edit-btn" data-index="${realIndex}">Editar</button>
            `;
            transactionsList.appendChild(li);
        });

        // Event listener for edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const t = transactions[index];
                document.getElementById('description').value = t.description;
                document.getElementById('amount').value = t.amount;
                document.getElementById('type').value = t.type;
                editingIndex = index;
                addButton.style.display = 'none';
                saveEditButton.style.display = 'inline';
                cancelEditButton.style.display = 'inline';
            });
        });
    }

    function updateAnnualReport() {
        const monthlyEntradas = Array(12).fill(0);
        const monthlySaidas = Array(12).fill(0);
        transactions.forEach(t => {
            const date = new Date(t.date.split('/').reverse().join('-'));
            const month = date.getMonth();
            if (t.type === 'entrada') {
                monthlyEntradas[month] += t.amount;
            } else {
                monthlySaidas[month] += t.amount;
            }
        });
        annualBody.innerHTML = '';
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        months.forEach((month, index) => {
            const saldo = monthlyEntradas[index] - monthlySaidas[index];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${month}</td>
                <td>R$ ${saldo.toFixed(2)}</td>
            `;
            annualBody.appendChild(row);
        });
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (editingIndex >= 0) {
            // Save edit
            const description = document.getElementById('description').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const type = document.getElementById('type').value;
            transactions[editingIndex] = { ...transactions[editingIndex], description, amount, type };
            localStorage.setItem('transactions', JSON.stringify(transactions));
            editingIndex = -1;
            addButton.style.display = 'inline';
            saveEditButton.style.display = 'none';
            cancelEditButton.style.display = 'none';
            updateSummary();
            renderTransactions();
            form.reset();
        } else {
            // Add new
            const description = document.getElementById('description').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const type = document.getElementById('type').value;
            const date = new Date().toLocaleString('pt-BR');

            const transaction = { description, amount, type, date };
            transactions.push(transaction);
            localStorage.setItem('transactions', JSON.stringify(transactions));

            updateSummary();
            renderTransactions();
            form.reset();
        }
    });

    saveEditButton.addEventListener('click', function() {
        form.dispatchEvent(new Event('submit'));
    });

    cancelEditButton.addEventListener('click', function() {
        editingIndex = -1;
        addButton.style.display = 'inline';
        saveEditButton.style.display = 'none';
        cancelEditButton.style.display = 'none';
        form.reset();
    });

    resetButton.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja resetar todos os dados?')) {
            transactions = [];
            localStorage.removeItem('transactions');
            updateSummary();
            renderTransactions();
            updateAnnualReport();
        }
    });

    updateSummary();
    renderTransactions();
    updateAnnualReport();
});