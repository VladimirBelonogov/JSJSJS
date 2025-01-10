const CITIES = ['Москва', 'Казань', 'Санкт-Петербург', 'Екатеринбург'];

async function getData(url) {
    // https://developer.mozilla.org/ru/docs/Web/API/Fetch_API/Using_Fetch
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
    });
    return response.json();
}
