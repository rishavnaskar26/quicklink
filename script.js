async function shorten() {
    const longUrl = document.getElementById("longUrl").value;

    const response = await fetch("/shorten", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ longUrl })
    });

    const data = await response.json();

    if (data.shortUrl) {
        document.getElementById("result").innerHTML =
            `<a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
    } else {
        document.getElementById("result").innerText = "Error creating link";
    }
}