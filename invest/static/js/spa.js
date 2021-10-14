const investmentsListRequest = new XMLHttpRequest();
const addTransactionRequest = new XMLHttpRequest();
const checkEnoughBalanceRequest = new XMLHttpRequest();
const statusBalanceRequest = new XMLHttpRequest();

// x.toFixed(2) to format price

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
        investmentsListRequest.onload = loadInvesments;
        investmentsListRequest.send();
    } else {
        const response = JSON.parse(this.responseText);
        const errorMessageDiv = document.querySelector("#error-message");
        const errorHTML = `<p>Database access error: ${response.message}</p>`;
        errorMessageDiv.innerHTML = errorHTML;
    }
}

function requestCoinAPITransaction() {
    const errorMessageDiv = document.querySelector("#error-message");
    const errorHTML = "";
    errorMessageDiv.innerHTML = errorHTML;

    if (this.readyState === 4 && this.status === 201) {
        const response = JSON.parse(this.responseText);

        const amountTo = document.querySelector("#amount-to");
        amountTo.value = response["amount-to"].toFixed(4);

        const unitePrice = document.querySelector("#unit-price");
        unitePrice.value = response["unit-price"].toFixed(4);

        const saveBtn = document.querySelector("#save-btn");
        saveBtn.classList.remove("disable");
    } else {
        const response = JSON.parse(this.responseText);
        const errorMessageDiv = document.querySelector("#error-message");
        const errorHTML = `<p>${response.message}</p>`;
        errorMessageDiv.innerHTML = errorHTML;
    }
}

function loadInvesments() {
    if (this.readyState === 4 && this.status === 200) {
        const response = JSON.parse(this.responseText);
        const investments = response.investments;

        if (investments.length != 0) {
            const tableInvestments =
                document.querySelector("#investments-table");

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
            requestStatus();
        } else {
            const noTransactionsMessageDiv = document.querySelector(
                "#no-transactions-message"
            );
            const messageHTML = `<p>No transactions yet. Add your first one to start.</p>`;
            noTransactionsMessageDiv.innerHTML = messageHTML;

            const tableStatus = document.querySelector(".status-container");
            tableStatus.classList.add("disable");
        }
    } else {
        const response = JSON.parse(this.responseText);
        const errorMessageDiv = document.querySelector("#error-message");
        const errorHTML = `<p>Database access error: ${response.message}</p>`;
        errorMessageDiv.innerHTML = errorHTML;
    }
}

function loadStatus() {
    const tableStatus = document.querySelector(".status-container");
    tableStatus.classList.remove("disable");

    if (this.readyState === 4 && this.status === 200) {
        const response = JSON.parse(this.responseText);
        const valueStatus = response.data;

        const statusTable = document.querySelector("#status-table");
        const investedHTML = `<td>${valueStatus["invested"].toFixed(4)}</td>`;
        const totalHTML = `<td>${valueStatus["total"].toFixed(4)}</td>`;
        const outcomeHTML = `<td>${valueStatus["outcome"].toFixed(4)}</td>`;
        statusTable.innerHTML = investedHTML + totalHTML + outcomeHTML;

        if (valueStatus["outcome"].toFixed(4) <= 0) {
            const statusTable = document
                .querySelector("#status-table")
                .getElementsByTagName("td");
            statusTable[2].style.color = "red";
        }
    } else {
        const response = JSON.parse(this.responseText);
        const errorMessageDiv = document.querySelector("#error-message");
        const errorHTML = `<p>CoinAPI request error: ${response.message}</p>`;
        errorMessageDiv.innerHTML = errorHTML;
    }
}

function requestStatus() {
    const url = `${root_host}status`;
    statusBalanceRequest.open("GET", url, true);
    statusBalanceRequest.onload = loadStatus;
    statusBalanceRequest.send();
}

function showFormNewTrasnaction(ev) {
    ev.preventDefault();
    const form = document.querySelector("#transaction-form");
    form.classList.remove("disable");
    const saveBtn = document.querySelector("#save-btn");
    saveBtn.classList.add("disable");
}

function loadCurrencyList(selector) {
    const currencyListSelect = document.getElementById(selector);
    let currencyListHTML;
    for (let i = 0; i < currencyList.length; i++) {
        currencyListHTML += `
        <option value="${currencyList[i]}" name="${currencyList[i]}">${currencyList[i]}</option>`;
    }
    currencyListSelect.innerHTML += currencyListHTML;
}

function validateInputsFromButtonConvert(ev) {
    ev.preventDefault();

    const currency_from = document.querySelector("#currency-from");
    const amount_from = document.querySelector("#amount-from");
    const currency_to = document.querySelector("#currency-to");

    if (
        currency_from.value == "" ||
        amount_from.value == "" ||
        currency_to.value == ""
    ) {
        const errorMessageDiv = document.querySelector("#error-message");
        const errorHTML = `<p>Please fill the form</p>`;
        errorMessageDiv.innerHTML = errorHTML;
    } else if (currency_from.value == currency_to.value) {
        const errorMessageDiv = document.querySelector("#error-message");
        const errorHTML = `<p>Currencies should be different</p>`;
        errorMessageDiv.innerHTML = errorHTML;
    } else {
        checkEnoughBalance();
    }
}

function checkEnoughBalance() {
    const currency_from = document.querySelector("#currency-from").value;
    const amount_from = document.querySelector("#amount-from").value;
    const currency_to = document.querySelector("#currency-to").value;

    json = {
        message: "convert",
        currency_from: currency_from,
        amount_from: amount_from,
        currency_to: currency_to,
    };

    const url = `${root_host}investment`;
    checkEnoughBalanceRequest.open("POST", url, true);
    checkEnoughBalanceRequest.setRequestHeader(
        "Content-Type",
        "application/json"
    );
    checkEnoughBalanceRequest.send(JSON.stringify(json));
    checkEnoughBalanceRequest.onload = requestCoinAPITransaction;
}

// TODO refactor
function cleanForm() {
    document.querySelector("#currency-from").value = "default";
    document.querySelector("#amount-from").value = "";
    document.querySelector("#currency-to").value = "default";
    document.querySelector("#amount-to").value = "";
    document.querySelector("#unit-price").value = "";
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
        message: "add_transaction",
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
    addTransactionRequest.send(JSON.stringify(json));
    addTransactionRequest.onload = requestAddTransaction;
    cleanForm();
}

window.onload = function () {
    const url = `${root_host}investments`;
    investmentsListRequest.open("GET", url, true);
    investmentsListRequest.onload = loadInvesments;
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
    convertBTN.addEventListener("click", validateInputsFromButtonConvert);

    const submitBTN = document.getElementById("save-btn");
    submitBTN.addEventListener("click", addTransaction);
};
