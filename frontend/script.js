async function searchLocation(query) {
    const apiKey = 'pk.4aa50b3509eb35021789f305ebcd4f37';
    const response = await fetch(`https://api.locationiq.com/v1/autocomplete.php?key=${apiKey}&q=${encodeURIComponent(query)}`);
    const data = await response.json();
    console.log(data);
}

document.getElementById('autocomplete').addEventListener('input', (e) => {
    searchLocation(e.target.value);
});
