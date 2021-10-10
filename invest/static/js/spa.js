const investmentsListRequest = new XMLHttpRequest();
const addTransactionRequest = new XMLHttpRequest();
const checkSufficientBalanceRequest = new XMLHttpRequest();

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

function requestAddTransaction() {
    if (this.readyState === 4 && this.status === 200) {
        const form = document.querySelector("#transaction-form");
        form.classList.add("disable");

        const url = `${root_host}investments`;
        investmentsListRequest.open("GET", url, true);
        investmentsListRequest.onload = showInvesments;
        investmentsListRequest.send();
    } else {
        alert("Se ha producido un error en el alta");
    }
}

function showInvesments() {
    if (this.readyState === 4 && this.status === 200) {
        const response = JSON.parse(this.responseText);
        const investments = response.investments;

        const tableInvestments = document.querySelector("#investments-table");

        let transactionsHTML = "";

        for (let i = 0; i < investments.length; i++) {
            transactionsHTML =
                transactionsHTML +
                `<tr>
                <td>${investments[i].date}</td>
                <td>${investments[i].time}</td>
                <td>${investments[i].currency_from}</td>
                <td class="form-number-column">${investments[i].amount_from}</td>
                <td>${investments[i].currency_to}</td>
                <td class="form-number-column">${investments[i].amount_to}</td>
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

// function checkSufficientBalance() {
//     ev.preventDefault();
//     const currency_from = document.querySelector("#currency-from").value;
//     const currency_to = document.querySelector("#currency-to").value;

//     json = {
//         currency_from: currency_from,
//         currency_to: currency_to,
//     };

//     const url = `${root_host}investment`;
//     checkSufficientBalanceRequest.open("POST", url, true);
//     checkSufficientBalanceRequest.setRequestHeader(
//         "Content-Type",
//         "application/json"
//     );
//     checkSufficientBalanceRequest.onload = requestAddTransaction;
//     checkSufficientBalanceRequest.send(JSON.stringify(json));
// }

function loadAmoutUnitPrice(ev) {
    ev.preventDefault();
    const amountTo = document.querySelector("#amount-to");
    amountTo.value = 200;
    const unitePrice = document.querySelector("#unit-price");
    unitePrice.value = 10;
}

// TODO refactor
function cleanForm() {
    const currencyFrom = document.querySelector("#currency-from");
    const amountFrom = document.querySelector("#amount-from");
    const currencyTo = document.querySelector("#currency-to");
    const amountTo = document.querySelector("#amount-to");
    const unitePrice = document.querySelector("#unit-price");

    currencyFrom.value = "default";
    amountFrom.value = "";
    currencyTo.value = "default";
    amountTo.value = "";
    unitePrice.value = "";
}

// TODO refactor
function addTransaction(ev) {
    ev.preventDefault();

    let currentDate = new Date();

    const date =
        currentDate.getFullYear() +
        "-" +
        (currentDate.getMonth() + 1) +
        "-" +
        currentDate.getDate();
    const time =
        currentDate.getHours() +
        ":" +
        currentDate.getMinutes() +
        ":" +
        currentDate.getSeconds();
    const currency_from = document.querySelector("#currency-from").value;
    const amount_from = document.querySelector("#amount-from").value;
    const currency_to = document.querySelector("#currency-to").value;
    const amount_to = document.querySelector("#amount-to").value;

    json = {
        date: date,
        time: time,
        currency_from: currency_from,
        amount_from: amount_from,
        currency_to: currency_to,
        amount_to: amount_to,
    };

    const url = `${root_host}investment`;
    addTransactionRequest.open("POST", url, true);
    addTransactionRequest.setRequestHeader("Content-Type", "application/json");
    addTransactionRequest.onload = requestAddTransaction;
    addTransactionRequest.send(JSON.stringify(json));
    cleanForm();
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

    const convertBTN = document.getElementById("convert-button");
    convertBTN.addEventListener("click", loadAmoutUnitPrice);

    const submintBTN = document.getElementById("submit-button");
    submintBTN.addEventListener("click", addTransaction);
};
