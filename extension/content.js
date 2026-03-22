console.log("Zentriq loaded");

// styles
const style = document.createElement("style");
style.innerHTML = `
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
`;
document.head.appendChild(style);


// find privacy link
function findPrivacyLink() {
    let links = document.querySelectorAll("a");

    for (let link of links) {
        let text = (link.innerText || "").toLowerCase();
        let href = (link.href || "").toLowerCase();

        if (text.includes("privacy") || href.includes("privacy")) {
            return link.href;
        }
    }

    // fallback for LeetCode
    if (window.location.hostname.includes("leetcode.com")) {
        return "https://leetcode.com/privacy/";
    }

    return null;
}


// popup
function showPopup(data) {

    let existing = document.getElementById("zentriq-popup");
    if (existing) existing.remove();

    let popup = document.createElement("div");

    let color = data.result === "High" ? "red" :
                data.result === "Medium" ? "orange" : "lightgreen";

    popup.innerHTML = `
        <div style="font-size:16px;margin-bottom:8px;">🔐 Zentriq</div>
        <div>Risk: <b style="color:${color}">${data.result}</b></div>
        <div>Score: ${data.score}%</div>
    `;

    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.right = "20px";
    popup.style.background = "#111";
    popup.style.color = "white";
    popup.style.padding = "12px";
    popup.style.borderRadius = "10px";
    popup.style.zIndex = "999999";
    popup.style.animation = "slideIn 0.4s ease";

    document.body.appendChild(popup);
}


// MAIN FLOW

setTimeout(() => {

    let url = window.location.href.toLowerCase();

    // ✅ CASE 1: Already on privacy page → analyze
    if (url.includes("privacy")) {

        console.log("Privacy page detected");

        chrome.runtime.sendMessage(
            {
                action: "analyze",
                text: document.body.innerText.slice(0, 4000)
            },
            function (res) {
                if (!res) return;
                showPopup(res);
            }
        );

        return;
    }

    // ✅ CASE 2: Main page → open privacy ONCE
    if (!sessionStorage.getItem("zentriq_opened")) {

        let link = findPrivacyLink();

        if (link) {
            console.log("Opening privacy page:", link);

            sessionStorage.setItem("zentriq_opened", "true");

            window.open(link, "_blank");
        }
    }

}, 2500);