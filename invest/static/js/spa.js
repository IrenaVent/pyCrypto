const investmentsListRequest = new XMLHttpRequest();
const root_host = "http://127.0.0.1:5000/api/v1/";

const currencyList = [
    "EUR",
    "ETH",
    "LTC",
    "BNB",
    "EOS",
    "XLM",
    "TRX",
    "BTC",
    "XRP",
    "BCH",
    "USDT",
    "BSV",
    "ADA",
];

function showInvesments() {
    // console.log(this.readyState)
    // console.log(this.status)
    if (this.readyState === 4 && this.status === 200) {
        const response = JSON.parse(this.responseText);
        const investments = response.investments;
        // console.log(investments)
        const tableInvestments = document.querySelector("#investments-table");

        let transactionsHTML = "";

        for (let i = 0; i < investments.length; i++) {
            transactionsHTML =
                transactionsHTML +
                `<tr>
                <td>${investments[i].date}</td>
                <td>${investments[i].time}</td>
                <td>${investments[i].currency_from}</td>
                <td>${investments[i].amount_from}</td>
                <td>${investments[i].currency_to}</td>
                <td>${investments[i].amount_to}</td>
            </tr>`;
        }
        tableInvestments.innerHTML = transactionsHTML;
    } else {
        const response = JSON.parse(this.responseText);
        const errorMessageDiv = document.querySelector("#error-message");
        const errorHTML = `<p>Database access error: ${response.message}</p>`;
        errorMessageDiv.innerHTML = errorHTML;
    }
}

function showFormNewTrasnaction(ev) {
    ev.preventDefault();
    const form = document.querySelector("#transaction-form");
    form.classList.remove("disable");
}

function loadCurrencyList(selector) {
    const currencyListSelect = document.getElementById(selector);
    let currencyListHTML;
    for (let i = 0; i < currencyList.length; i++) {
        currencyListHTML += `
        <option value="${currencyList[i]}">${currencyList[i]}</option>`;
    }
    currencyListSelect.innerHTML += currencyListHTML;
}

window.onload = function () {
    const url = `${root_host}investments`;
    investmentsListRequest.open("GET", url, true);
    investmentsListRequest.onload = showInvesments;
    investmentsListRequest.send();

    const addBTN = document.querySelector("#add-button");
    addBTN.addEventListener("click", showFormNewTrasnaction);

    const currencyListFrom = document.getElementById("currency-from");
    currencyListFrom.addEventListener(
        "click",
        loadCurrencyList("currency-from")
    );

    const currencyListTo = document.getElementById("currency-to");
    currencyListTo.addEventListener("click", loadCurrencyList("currency-to"));
};
