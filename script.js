function addCustomer() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const advance = Number(document.getElementById("advance").value);
  const interest = Number(document.getElementById("interest").value);
  const months = Number(document.getElementById("months").value);

  if (!name || !phone || !amount || !months) {
    alert("Please fill Customer Name, Phone, Amount and EMI Months.");
    return;
  }

  if (advance > amount) {
    alert("Advance amount cannot be greater than plant amount.");
    return;
  }

  const balance = amount - advance;

  // Simple interest calculation
  const interestAmount = balance * (interest / 100);
  const totalPayable = balance + interestAmount;
  const monthlyEMI = totalPayable / months;

  const customerList = document.getElementById("customerList");

  const customerCard = document.createElement("div");
  customerCard.className = "customer-card";

  customerCard.innerHTML = `
    <h3>${escapeHTML(name)}</h3>
    <p>📱 Phone: ${escapeHTML(phone)}</p>
    <p>💰 Plant Amount: ₹${amount.toFixed(2)}</p>
    <p>💵 Advance: ₹${advance.toFixed(2)}</p>
    <p>📌 Balance: ₹${balance.toFixed(2)}</p>
    <p>📈 Interest: ₹${interestAmount.toFixed(2)}</p>
    <p>💳 Total Payable: ₹${totalPayable.toFixed(2)}</p>
    <p>📅 EMI Months: ${months}</p>
    <p>🔄 Monthly EMI: <strong>₹${monthlyEMI.toFixed(2)}</strong></p>
    <button onclick="this.parentElement.remove()">Remove</button>
  `;

  if (customerList.innerText.includes("No customers added yet.")) {
    customerList.innerHTML = "";
  }

  customerList.appendChild(customerCard);

  // Clear form
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("advance").value = "";
  document.getElementById("interest").value = "";
  document.getElementById("months").value = "";
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
