console.log("Zentriq content script loaded");

(async function () {

    let text = document.body.innerText;

    console.log("Checking page...");

    if (text.toLowerCase().includes("privacy")) {

        console.log("Privacy detected");

        chrome.runtime.sendMessage(
            {
                action: "analyze",
                text: text.slice(0, 3000)
            },
            function (response) {

                console.log("Response:", response);

                if (!response) {
                    console.error("No response from backend");
                    return;
                }

                showPopup(response);
            }
        );
    }

})();

function showPopup(data) {

    let existing = document.getElementById("zentriq-popup");
    if (existing) existing.remove();

    let popup = document.createElement("div");
    popup.id = "zentriq-popup";

    popup.innerHTML = `
        <h3>🔐 Zentriq</h3>
        <p><b>Risk:</b> ${data.result}</p>
        <p><b>Score:</b> ${data.score}%</p>
    `;

    popup.style.position = "fixed";
    popup.style.top = "20px";              // 🔥 changed
    popup.style.right = "20px";
    popup.style.width = "260px";
    popup.style.background = "#000";       // 🔥 strong color
    popup.style.color = "#fff";
    popup.style.padding = "15px";
    popup.style.borderRadius = "10px";
    popup.style.zIndex = "999999";         // 🔥 VERY IMPORTANT
    popup.style.boxShadow = "0 0 15px rgba(0,0,0,0.7)";

    document.body.appendChild(popup);
}