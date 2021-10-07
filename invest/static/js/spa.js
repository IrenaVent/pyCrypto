
const investmentsListRequest = new XMLHttpRequest()
const root_host = "http://127.0.0.1:5000/api/v1/"

function showInvesments() {
    if (this.readyState === 4 && this.status ===200) {
        const response = JSON.parse(this.responseText)
        const investments = response.investments
        console.log(investments)
        const tableInvestments = document.querySelector("#investments-table")
        
        let innerHTML = ""
        
        for (let i=0; i < investments.length; i++) {
            innerHTML = innerHTML +
            `<tr>
                <td>${investments[i].date}</td>
                <td>${investments[i].time}</td>
                <td>${investments[i].currency_from}</td>
                <td>${investments[i].amount_from}</td>
                <td>${investments[i].currency_to}</td>
                <td>${investments[i].amount_to}</td>
            </tr>`
        }
        tableInvestments.innerHTML = innerHTML
    } else {
        alert("Se ha producido un error en la base de datos")
    }
}

function showFormNewTrasnaction(ev) {
    ev.preventDefault()
    const form = document.querySelector("#transaction-form")
    form.classList.remove("disable")
}

window.onload = function() {  
    const url = `${root_host}investments`
    investmentsListRequest.open("GET", url, true)
    investmentsListRequest.onload = showInvesments
    investmentsListRequest.send()


    const addBTN = document.querySelector("#add-button")
    addBTN.addEventListener("click",showFormNewTrasnaction)
}