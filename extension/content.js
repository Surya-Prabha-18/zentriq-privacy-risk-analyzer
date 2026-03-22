console.log("Zentriq loaded");

const style = document.createElement("style");
style.innerHTML = `
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`;
document.head.appendChild(style);

function findPrivacyLink() {
    let links = document.querySelectorAll("a");

    for (let link of links) {
        let text = (link.innerText || "").toLowerCase();
        let href = (link.href || "").toLowerCase();

        if (text.includes("privacy") || href.includes("privacy")) {
            return link.href;
        }
    }

    if (window.location.hostname.includes("leetcode.com")) {
        return "https://leetcode.com/privacy/";
    }

    return null;
}

function tryFallback() {
    let base = window.location.origin;

    let paths = [
        "/privacy",
        "/privacy-policy",
        "/legal/privacy"
    ];

    for (let p of paths) {
        let url = base + p;

        fetch(url, { method: "HEAD" })
            .then(res => {
                if (res.ok) {
                    window.open(url, "_blank");
                }
            })
            .catch(() => {});
    }
}

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

setTimeout(() => {

    let url = window.location.href.toLowerCase();

if (url.includes("privacy")) {

    console.log("Privacy page detected");

    setTimeout(() => {

        console.log("Sending text length:", document.body.innerText.length);

        chrome.runtime.sendMessage(
            {
                action: "analyze",
                text: document.body.innerText.slice(0, 5000)
            },
            function (res) {

                console.log("Response:", res);

                if (!res) {
                    console.log("No response");
                    return;
                }

                showPopup(res);
            }
        );

    }, 3000);

    return;
}
    if (!sessionStorage.getItem("zentriq_opened")) {

        let link = findPrivacyLink();

        if (link) {
            console.log("Opening:", link);
            sessionStorage.setItem("zentriq_opened", "true");
            window.open(link, "_blank");
        } else {
            console.log("Trying fallback...");
            tryFallback();
        }
    }

}, 2500);












// console.log("Zentriq loaded");

// // animation
// const style = document.createElement("style");
// style.innerHTML = `
// @keyframes slideIn {
//   from { transform: translateX(100%); opacity: 0; }
//   to { transform: translateX(0); opacity: 1; }
// }`;
// document.head.appendChild(style);


// // find privacy link (strong version)
// function findPrivacyLink() {

//     let links = document.querySelectorAll("a");

//     for (let link of links) {
//         let text = (link.innerText || "").toLowerCase();
//         let href = (link.href || "").toLowerCase();

//         if (text.includes("privacy") || href.includes("privacy")) {
//             return link.href;
//         }
//     }

//     return null;
// }


// // fallback URLs
// function tryFallback() {

//     let base = window.location.origin;

//     let paths = [
//         "/privacy",
//         "/privacy-policy",
//         "/legal/privacy"
//     ];

//     for (let p of paths) {
//         let url = base + p;

//         fetch(url, { method: "HEAD" })
//             .then(res => {
//                 if (res.ok) {
//                     window.open(url, "_blank");
//                 }
//             })
//             .catch(() => {});
//     }
// }


// // popup
// function showPopup(data) {

//     let existing = document.getElementById("zentriq-popup");
//     if (existing) existing.remove();

//     let popup = document.createElement("div");

//     let color = data.result === "High" ? "red" :
//                 data.result === "Medium" ? "orange" : "lightgreen";

//     popup.innerHTML = `
//         <div style="font-size:16px;margin-bottom:8px;">🔐 Zentriq</div>
//         <div>Risk: <b style="color:${color}">${data.result}</b></div>
//         <div>Score: ${data.score}%</div>
//     `;

//     popup.style.position = "fixed";
//     popup.style.top = "20px";
//     popup.style.right = "20px";
//     popup.style.background = "#111";
//     popup.style.color = "white";
//     popup.style.padding = "12px";
//     popup.style.borderRadius = "10px";
//     popup.style.zIndex = "999999";
//     popup.style.animation = "slideIn 0.4s ease";

//     document.body.appendChild(popup);
// }


// // MAIN FLOW

// setTimeout(() => {

//     let url = window.location.href.toLowerCase();

//     // 👉 Already on privacy page → analyze
//     if (url.includes("privacy")) {

//         console.log("Privacy page detected");

//         chrome.runtime.sendMessage(
//             {
//                 action: "analyze",
//                 text: document.body.innerText.slice(0, 4000)
//             },
//             function (res) {
//                 if (!res) return;
//                 showPopup(res);
//             }
//         );

//         return;
//     }

//     if (!sessionStorage.getItem("zentriq_opened")) {

//         let link = findPrivacyLink();

//         if (link) {
//             console.log("Opening:", link);
//             sessionStorage.setItem("zentriq_opened", "true");
//             window.open(link, "_blank");
//         } else {
//             console.log("Trying fallback...");
//             tryFallback();
//         }
//     }

// }, 2500);