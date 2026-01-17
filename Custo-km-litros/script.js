document.getElementById('calcForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const precoLitro = parseFloat(document.getElementById('precoLitro').value);
    const consumo = parseFloat(document.getElementById('consumo').value);
    
    if (precoLitro <= 0 || consumo <= 0) {
        document.getElementById('resultado').innerHTML = 'Por favor, insira valores válidos.';
        return;
    }
    
    const custoPorKm = precoLitro / consumo;
    const valorMinimoCorrida = (custoPorKm * 2) + 0.95;
    const valorOtimo = (custoPorKm * 2) + 1.50;
    const resultado = `Custo por km: R$ ${custoPorKm.toFixed(2)}<br>Valor mínimo para aceitar corrida: R$ ${valorMinimoCorrida.toFixed(2)}<br>Valor ótimo para aceitar corrida: R$ ${valorOtimo.toFixed(2)}<br>`;
    
    document.getElementById('resultado').innerHTML = resultado;
});

document.getElementById('back-button').addEventListener('click', function() {
    window.location.href = '../index.html';
});