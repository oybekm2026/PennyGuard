const form = document.querySelector("#expense-form");
const nameInput = document.querySelector("#expense-name");
const categorySelect = document.querySelector("#expense-category");
const amountInput = document.querySelector("#expense-amount");

const expenseList = document.querySelector("#expense-list");

const dateInput = document.querySelector("#expense-date");

const monthlyTotalElement = document.querySelector("#monthly-total");

const monthlyCategoryList = document.querySelector("#monthly-category-list");

const totalAmountElement = document.querySelector("#total-amount");
let totalAmount = 0;
const STORAGE_KEY = "pennyguard_expenses";
const savedExpenses = localStorage.getItem(STORAGE_KEY);
const expenses = savedExpenses ? JSON.parse(savedExpenses) : [];

const today = new Date();
const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
let monthlyTotal = 0;

function formatMoney(amount) {
    const formattedNumber = new Intl.NumberFormat("uz-UZ").format(amount);
    return `${formattedNumber} so'm`;
}

function renderMonthlyCategoryTotals() {
    monthlyCategoryList.replaceChildren();

    const categoryTotals = {};

    expenses.forEach(function (expense) {
        if (!expense.date || expense.date.slice(0, 7) !== currentMonth) {
            return;
        }

        if (!categoryTotals[expense.categoryLabel]) {
            categoryTotals[expense.categoryLabel] = 0;
        }

        categoryTotals[expense.categoryLabel] += expense.amount;
    });

    Object.keys(categoryTotals).forEach(function (categoryLabel) {
        const item = document.createElement("li");
        item.textContent =
            `${categoryLabel}: ${formatMoney(categoryTotals[categoryLabel])}`;

        monthlyCategoryList.appendChild(item);
    });
}

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

dateInput.value = getTodayDate();

form.addEventListener("submit", function (event) {
    event.preventDefault();
    
    const name = nameInput.value.trim();
    const category = categorySelect.value;
    const categoryLabel = categorySelect.options[categorySelect.selectedIndex].text;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (!name || !Number.isSafeInteger(amount) || amount < 1) {
    alert("Xarajat nomi va musbat butun summani kiriting.");
    return;
    }   

    totalAmount += amount;
    totalAmountElement.textContent = formatMoney(totalAmount);
    
    const expense = {
        name: name,
        category: category,
        categoryLabel: categoryLabel,
        amount: amount,
        date: date
    };

    expenses.push(expense);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    renderMonthlyCategoryTotals();
    if (expense.date && expense.date.slice(0, 7) === currentMonth) {
        monthlyTotal += expense.amount;
        monthlyTotalElement.textContent = formatMoney(monthlyTotal);
    }
    const listItem = document.createElement("li")
    listItem.textContent =
        `${expense.name} - ${expense.categoryLabel} - ${formatMoney(expense.amount)} - Sana: ${expense.date || "kiritilmagan"}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "O‘chirish";
    deleteButton.addEventListener("click", function () {
        const expenseIndex = expenses.indexOf(expense);
        expenses.splice(expenseIndex, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
        renderMonthlyCategoryTotals();
        listItem.remove();

        totalAmount -= expense.amount;
        totalAmountElement.textContent = formatMoney(totalAmount);

        if (expense.date && expense.date.slice(0, 7) === currentMonth) {
            monthlyTotal -= expense.amount;
            monthlyTotalElement.textContent = formatMoney(monthlyTotal);
        }
    });
    listItem.appendChild(deleteButton);

    expenseList.appendChild(listItem);

    form.reset();
    dateInput.value = getTodayDate();
});

expenses.forEach(function (expense) {
    const listItem = document.createElement("li");
    listItem.textContent =
        `${expense.name} - ${expense.categoryLabel} - ${formatMoney(expense.amount)} - Sana: ${expense.date || "kiritilmagan"}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "O‘chirish";
    deleteButton.addEventListener("click", function () {
        const expenseIndex = expenses.indexOf(expense);
        expenses.splice(expenseIndex, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
        renderMonthlyCategoryTotals();
        listItem.remove();

        totalAmount -= expense.amount;
        totalAmountElement.textContent = formatMoney(totalAmount);

        if (expense.date && expense.date.slice(0, 7) === currentMonth) {
            monthlyTotal -= expense.amount;
            monthlyTotalElement.textContent = formatMoney(monthlyTotal);
        }
    });
    listItem.appendChild(deleteButton);

    expenseList.appendChild(listItem);
    totalAmount += expense.amount;

    if (expense.date && expense.date.slice(0, 7) === currentMonth) {
        monthlyTotal += expense.amount;
    }
});

totalAmountElement.textContent = formatMoney(totalAmount);
monthlyTotalElement.textContent = formatMoney(monthlyTotal);
renderMonthlyCategoryTotals();



