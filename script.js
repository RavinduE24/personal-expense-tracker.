// 1. Get HTML elements
const transType = document.getElementById('transType');
const transDesc = document.getElementById('transDesc');
const transAmount = document.getElementById('transAmount');
const transCategory = document.getElementById('transCategory');
const transDate = document.getElementById('transDate');
const formError = document.getElementById('formError');

const addBtn = document.getElementById('addBtn');
const clearFormBtn = document.getElementById('clearFormBtn');
const filterType = document.getElementById('filterType');

const totalIncomeEl = document.getElementById('totalIncome');
const totalExpensesEl = document.getElementById('totalExpenses');
const currentBalanceEl = document.getElementById('currentBalance');
const tableBody = document.getElementById('transactionTableBody');

// 2. Load transactions from localStorage or start empty
let transactions = [];
let savedData = localStorage.getItem('expensesApp');
if (savedData !== null) {
    transactions = JSON.parse(savedData);
}

// Set today's date as default
transDate.valueAsDate = new Date();

// Render initial data
updateDashboard();

// 3. Add Transaction Button Click
addBtn.addEventListener('click', function() {
    let type = transType.value;
    let desc = transDesc.value.trim();
    let amount = parseFloat(transAmount.value);
    let category = transCategory.value;
    let date = transDate.value;

    // Form Validation: Ensure fields are filled and amount is > 0
    if (desc === "" || isNaN(amount) || amount <= 0 || category === "" || date === "") {
        formError.classList.remove('d-none');
        return;
    }
    
    // Hide error if valid
    formError.classList.add('d-none');

    // Create a transaction object
    let newTransaction = {
        id: Date.now(), // Unique ID based on current time
        type: type,
        description: desc,
        amount: amount,
        category: category,
        date: date
    };

    // Add to our list and save
    transactions.push(newTransaction);
    saveData();
    updateDashboard();

    // Show success alert as seen in the mockup
    alert("Transaction added successfully!");

    // Clear form inputs
    clearForm();
});

// 4. Clear Form Button Click
clearFormBtn.addEventListener('click', function() {
    clearForm();
});

function clearForm() {
    transType.value = 'Income';
    transDesc.value = '';
    transAmount.value = '';
    transCategory.value = '';
    transDate.valueAsDate = new Date();
    formError.classList.add('d-none');
}

// 5. Delete Transaction Logic
function deleteTransaction(idToRemove) {
    let newArray = [];
    // Standard loop to filter out the deleted ID
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].id !== idToRemove) {
            newArray.push(transactions[i]);
        }
    }
    transactions = newArray;
    saveData();
    updateDashboard();
}

// 6. Save to Local Storage
function saveData() {
    localStorage.setItem('expensesApp', JSON.stringify(transactions));
}

// 7. Update Dashboard (Calculate totals and redraw table)
function updateDashboard() {
    let income = 0;
    let expense = 0;

    // Calculate totals using a standard for loop
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].type === 'Income') {
            income += transactions[i].amount;
        } else {
            expense += transactions[i].amount;
        }
    }

    let balance = income - expense;

    // Update the summary cards on screen
    totalIncomeEl.innerText = "LKR " + income.toLocaleString('en-US', {minimumFractionDigits: 2});
    totalExpensesEl.innerText = "LKR " + expense.toLocaleString('en-US', {minimumFractionDigits: 2});
    currentBalanceEl.innerText = "LKR " + balance.toLocaleString('en-US', {minimumFractionDigits: 2});

    // Redraw the table
    renderTable();
}

// 8. Handle Filters
filterType.addEventListener('change', function() {
    renderTable();
});

// 9. Draw the Table Data
function renderTable() {
    // Clear existing table rows
    tableBody.innerHTML = "";
    
    let filterValue = filterType.value; // 'All', 'Income', or 'Expense'
    let count = 0;

    for (let i = 0; i < transactions.length; i++) {
        let t = transactions[i];

        // Apply filter logic
        if (filterValue === 'All' || filterValue === t.type) {
            count++;
            
            // Build the table row
            let tr = document.createElement('tr');
            
            // Determine text color based on type
            let badgeClass = t.type === 'Income' ? 'bg-success' : 'bg-danger';
            let sign = t.type === 'Income' ? '+' : '-';
            
            tr.innerHTML = `
                <td>${t.date}</td>
                <td>${t.description}</td>
                <td><span class="badge ${badgeClass}">${t.type}</span></td>
                <td>${t.category}</td>
                <td class="fw-bold"> ${sign} LKR ${t.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                <td><button class="btn btn-outline-danger btn-sm" onclick="deleteTransaction(${t.id})">Delete</button></td>
            `;
            
            tableBody.appendChild(tr);
        }
    }

    // Show empty state if no transactions match
    if (count === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="empty-table-row">No transactions found.</td></tr>`;
    }
}