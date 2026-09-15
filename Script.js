function addCustomer() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const advance = Number(document.getElementById("advance").value);
  const interest = Number(document.getElementById("interest").value);
  const months = Number(document.getElementById("months").value);

  if (!name || !phone || !amount || !months) {
    alert("Please enter customer name, phone, plant amount and EMI months.");
    return;
  }

  if (advance > amount) {
    alert("Advance amount cannot be greater than plant amount.");
    return;
  }

  const balance = amount - advance;
  const interestAmount = balance * interest / 100;
  const totalPayable = balance + interestAmount;
  const monthlyEMI = totalPayable / months;

  const customer = {
    name,
    phone,
    amount,
    advance,
    balance,
    interest,
    interestAmount,
    totalPayable,
    monthlyEMI,
    months,
    paid: 0
  };

  let customers = JSON.parse(localStorage.getItem("yugaCustomers")) || [];
  customers.push(customer);

  localStorage.setItem("yugaCustomers", JSON.stringify(customers));

  clearForm();
  displayCustomers();
}

function displayCustomers() {
  const list = document.getElementById("customerList");
  const customers = JSON.parse(localStorage.getItem("yugaCustomers")) || [];

  if (customers.length === 0) {
    list.innerHTML = "<p>No customers added yet.</p>";
    return;
  }

  list.innerHTML = "";

  customers.forEach((customer, index) => {
    const pending = customer.totalPayable - customer.paid;

    const div = document.createElement("div");
    div.className = "customer";

    div.innerHTML = `
      <h3>${customer.name}</h3>

      <p><strong>Phone:</strong> ${customer.phone}</p>
      <p><strong>Plant Amount:</strong> ₹${customer.amount.toFixed(2)}</p>
      <p><strong>Advance:</strong> ₹${customer.advance.toFixed(2)}</p>
      <p><strong>Balance:</strong> ₹${customer.balance.toFixed(2)}</p>
      <p><strong>Interest:</strong> ${customer.interest}%</p>
      <p><strong>Total Payable:</strong> ₹${customer.totalPayable.toFixed(2)}</p>
      <p><strong>Monthly EMI:</strong> ₹${customer.monthlyEMI.toFixed(2)}</p>
      <p><strong>Paid:</strong> ₹${customer.paid.toFixed(2)}</p>
      <p><strong>Pending:</strong> ₹${pending.toFixed(2)}</p>
      
      <button onclick="deleteCustomer(${index})" class="delete-btn">
        Delete Customer
      </button>
    `;

    list.appendChild(div);
  });
}

function deleteCustomer(index) {
  if (!confirm("Delete this customer?")) {
    return;
  }

  let customers = JSON.parse(localStorage.getItem("yugaCustomers")) || [];

  customers.splice(index, 1);

  localStorage.setItem("yugaCustomers", JSON.stringify(customers));

  displayCustomers();
}

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("advance").value = "";
  document.getElementById("interest").value = "";
  document.getElementById("months").value = "";
}

displayCustomers();
