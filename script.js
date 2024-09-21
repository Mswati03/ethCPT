document.getElementById('contractForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const description = document.getElementById('description').value;
    const priceUSD = document.getElementById('priceUSD').value;

    const response = await fetch('/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, priceUSD })
    });

    const result = await response.json();

    document.getElementById('result').innerText = result.negotiatedPrice
        ? `Negotiated Price: $${result.negotiatedPrice}`
        : 'Failed to negotiate price';
});