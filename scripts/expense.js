
let totalExpense = 0;
let expenseCategories = {}; // To keep track of different expense categories

// Function to add expense
function addExpense() {
    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const date = document.getElementById('expense-date').value;

    if (name && amount && date) {
        // Add to expense list
        const expenseItem = document.createElement('li');
        expenseItem.innerHTML = `
            <span class="expense-desc">${name}</span>
            <span class="expense-amount">₹${amount.toFixed(2)}</span>
            <span class="expense-date">${formatDate(date)}</span>
            <span class="delete-btn" onclick="deleteExpense(this, ${amount})">
                <i class="fas fa-trash"></i>
            </span>
        `;
        document.getElementById('expense-list').appendChild(expenseItem);

        // Update the total expense
        totalExpense += amount;
        document.getElementById('total-amount').innerText = `₹${totalExpense.toFixed(2)}`;
        
        // Update monthly total
        document.getElementById('monthly-total').innerText = `₹${totalExpense.toFixed(2)}`;
        
        // Update average expense
        const expenseList = document.getElementById('expense-list').children;
        const averageExpense = totalExpense / expenseList.length;
        document.getElementById('average-expense').innerText = `₹${averageExpense.toFixed(2)}`;

        // Update the category distribution
        addCategory(name, amount);

        // Update the pie chart
        updateChart();

        // Clear the input fields
        document.getElementById('expense-name').value = '';
        document.getElementById('expense-amount').value = '';
        document.getElementById('expense-date').value = '';
    } else {
        alert('Please fill out all fields');
    }
}

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to add expense category (for chart)
function addCategory(name, amount) {
    if (expenseCategories[name]) {
        expenseCategories[name] += amount;
    } else {
        expenseCategories[name] = amount;
    }
}

// Function to delete an expense
function deleteExpense(element, amount) {
    element.parentElement.remove();

    // Update the total expense
    totalExpense -= amount;
    document.getElementById('total-amount').innerText = `₹${totalExpense.toFixed(2)}`;

    // Find the category and remove the amount
    for (const category in expenseCategories) {
        if (expenseCategories[category] === amount) {
            expenseCategories[category] -= amount;
            if (expenseCategories[category] <= 0) {
                delete expenseCategories[category];
            }
            break;
        }
    }

    // Update the pie chart
    updateChart();
}

// Pie chart initialization
const ctx = document.getElementById('expense-chart').getContext('2d');
let expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: ['#ffcc00', '#66cc66', '#ff6666', '#33ccff', '#ff99cc'], // Add more colors if needed
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    }
});

// Function to update the pie chart
function updateChart() {
    const labels = Object.keys(expenseCategories);
    const data = Object.values(expenseCategories);

    expenseChart.data.labels = labels;
    expenseChart.data.datasets[0].data = data;
    expenseChart.update();
}





/*

let expenses = [];
let totalAmount = 0;

function addExpense() {
    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const date = document.getElementById('expense-date').value;

    if (name && amount && date) {
        const expense = { name, amount, date };
        expenses.push(expense);
        totalAmount += amount;
        updateExpenseList();
        updateTotalAmount();
        updateChart();
    }
}

function removeExpense(index) {
    totalAmount -= expenses[index].amount;
    expenses.splice(index, 1);
    updateExpenseList();
    updateTotalAmount();
    updateChart();
}

function updateExpenseList() {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';
    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${expense.name} - ₹${expense.amount.toFixed(2)} <span class="delete" onclick="removeExpense(${index})">X</span>`;
        expenseList.appendChild(li);
    });
}

function updateTotalAmount() {
    document.getElementById('total-amount').innerText = `₹${totalAmount.toFixed(2)}`;
}

function updateChart() {
    const ctx = document.getElementById('expense-chart').getContext('2d');
    const labels = expenses.map(expense => expense.name);
    const data = expenses.map(expense => expense.amount);

    if (window.expenseChart) {
        window.expenseChart.destroy();
    }

    window.expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

*/