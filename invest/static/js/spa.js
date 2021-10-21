const investmentsListRequest = new XMLHttpRequest();
const addTransactionRequest = new XMLHttpRequest();
const checkEnoughBalanceRequest = new XMLHttpRequest();
const statusBalanceRequest = new XMLHttpRequest();

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
    "ADA",
];

function errorMessage(response, error) {
    const errorMessageDiv = document.querySelector("#error-message");
    const errorHTML = `<p>${error}: ${response.message}</p>`;
    errorMessageDiv.innerHTML = errorHTML;
}

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
        errorMessage(response, "Database access error");
    }
}

function requestCoinAPITransaction() {
    const errorMessageDiv = document.querySelector("#error-message");
    const errorHTML = "";
    errorMessageDiv.innerHTML = errorHTML;
    const response = JSON.parse(this.responseText);

    if (this.readyState === 4 && this.status === 201) {
        const amountTo = document.querySelector("#amount-to");
        amountTo.value = response["amount-to"].toFixed(4);

        const unitePrice = document.querySelector("#unit-price");
        unitePrice.value = response["unit-price"].toFixed(4);

        const saveBtn = document.querySelector("#save-btn");
        saveBtn.classList.remove("disable");

        const currency_from = document.querySelector("#currency-from");
        currency_from.setAttribute("disabled", true);
        const amount_from = document.querySelector("#amount-from");
        amount_from.setAttribute("disabled", true);
        const currency_to = document.querySelector("#currency-to");
        currency_to.setAttribute("disabled", true);
    } else {
        errorMessage(response, "Request error");
    }
}

function loadInvesments() {
    const response = JSON.parse(this.responseText);

    if (this.readyState === 4 && this.status === 200) {
        const investments = response.investments;

        if (investments.length != 0) {
            const noTransactionsMessageDiv = document.querySelector(
                "#no-transactions-message"
            );
            const messageHTML = "";

            noTransactionsMessageDiv.innerHTML = messageHTML;
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
        errorMessage(response, "Database access error");
    }
}

function loadStatus() {
    const tableStatus = document.querySelector(".status-container");
    tableStatus.classList.remove("disable");
    const response = JSON.parse(this.responseText);

    if (this.readyState === 4 && this.status === 200) {
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
        errorMessage(response, "CoinApi request error");
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
    const addBtn = document.querySelector("#add-button");
    addBtn.classList.add("disable");
    const form = document.querySelector("#transaction-form");
    form.classList.remove("disable");
    const cancelBtn = document.querySelector("#cancel-button");
    cancelBtn.classList.remove("disable");
    const saveBtn = document.querySelector("#save-btn");
    saveBtn.classList.add("disable");
}

function cancelTransaction() {
    const cancelBtn = document.querySelector("#cancel-button");
    cancelBtn.classList.add("disable");
    const addBtn = document.querySelector("#add-button");
    addBtn.classList.remove("disable");
    const form = document.querySelector("#transaction-form");
    form.classList.add("disable");
    resetForm();
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

function errorMessageForm(message) {
    const errorMessageDiv = document.querySelector("#error-message");
    const errorHTML = `<p>${message}</p>`;
    errorMessageDiv.innerHTML = errorHTML;
}

function validateInputsFromButtonConvert(ev) {
    ev.preventDefault();

    const currency_from = document.querySelector("#currency-from");
    const amount_from = document.querySelector("#amount-from");
    const currency_to = document.querySelector("#currency-to");

    if (
        currency_from.value == "default" ||
        amount_from.value == "" ||
        currency_to.value == "default"
    ) {
        errorMessageForm("Please fill the form");
    } else if (currency_from.value == currency_to.value) {
        errorMessageForm("Currencies should be different");
    } else {
        checkEnoughBalance();
    }
}

function checkEnoughBalance() {
    const currency_from = document.querySelector("#currency-from").value;
    const amount_from = document.querySelector("#amount-from").value;
    const currency_to = document.querySelector("#currency-to").value;

    const dataToCheckBalance = {
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
    checkEnoughBalanceRequest.send(JSON.stringify(dataToCheckBalance));
    checkEnoughBalanceRequest.onload = requestCoinAPITransaction;
}

function resetForm() {
    document.querySelector("#currency-from").value = "default";
    document.querySelector("#amount-from").value = "";
    document.querySelector("#currency-to").value = "default";
    document.querySelector("#amount-to").value = "";
    document.querySelector("#unit-price").value = "";
    const currency_from = document.querySelector("#currency-from");
    currency_from.removeAttribute("disabled");
    const amount_from = document.querySelector("#amount-from");
    amount_from.removeAttribute("disabled");
    const currency_to = document.querySelector("#currency-to");
    currency_to.removeAttribute("disabled");
    const cancelBtn = document.querySelector("#cancel-button");
    cancelBtn.classList.add("disable");
    const addBtn = document.querySelector("#add-button");
    addBtn.classList.remove("disable");
    const errorMessageDiv = document.querySelector("#error-message");
    const errorHTML = "";
    errorMessageDiv.innerHTML = errorHTML;
}

function createTime(date) {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function createDate(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function addTransaction(ev) {
    ev.preventDefault();

    const currency_from = document.querySelector("#currency-from").value;
    const amount_from = document.querySelector("#amount-from").value;
    const currency_to = document.querySelector("#currency-to").value;
    const amount_to = document.querySelector("#amount-to").value;
    let currentDate = new Date();

    const newTransaction = {
        message: "add_transaction",
        date: createDate(currentDate),
        time: createTime(currentDate),
        currency_from: currency_from,
        amount_from: amount_from,
        currency_to: currency_to,
        amount_to: amount_to,
    };

    const url = `${root_host}investment`;
    addTransactionRequest.open("POST", url, true);
    addTransactionRequest.setRequestHeader("Content-Type", "application/json");
    addTransactionRequest.send(JSON.stringify(newTransaction));
    addTransactionRequest.onload = requestAddTransaction;
    resetForm();
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

    const cancelBTN = document.getElementById("cancel-button");
    cancelBTN.addEventListener("click", cancelTransaction);

    const submitBTN = document.getElementById("save-btn");
    submitBTN.addEventListener("click", addTransaction);
};
