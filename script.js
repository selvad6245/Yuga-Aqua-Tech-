const SUPABASE_URL = "https://mjljhmogiviwsraglwck.supabase.co";
const SUPABASE_KEY = "sb_publishable_U4Z168UvRgiLWeK_ZWZmgQ_9Wcgpo3y";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// LOGIN
async function loginUser() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    document.getElementById("loginMessage").textContent =
      "Email and password enter pannunga.";
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    document.getElementById("loginMessage").textContent =
      "Login failed: " + error.message;
    return;
  }

  document.getElementById("loginMessage").textContent =
    "Login successful! ✅";

  loadCustomers();
}


// ADD CUSTOMER
async function addCustomer() {
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
  const interestAmount = balance * (interest / 100);
  const totalPayable = balance + interestAmount;
  const monthlyEMI = totalPayable / months;

  const { error } = await supabaseClient
    .from("Customer")
    .insert({
      name: name,
      phone: phone,
      Amount: amount,
      Advance_Amount: advance,
      interest: interest,
      months: months,
      monthly_emi: monthlyEMI,
      paid_amount: advance,
      status: "Active"
    });

  if (error) {
    console.error(error);
    alert("Customer save failed: " + error.message);
    return;
  }

  alert("Customer saved successfully! ✅");

  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("advance").value = "";
  document.getElementById("interest").value = "";
  document.getElementById("months").value = "";

  loadCustomers();
}


// LOAD CUSTOMERS
async function loadCustomers() {
  const { data, error } = await supabaseClient
    .from("Customer")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const customerList = document.getElementById("customerList");

  if (!data || data.length === 0) {
    customerList.innerHTML = "<p>No customers added yet.</p>";
    return;
  }

  customerList.innerHTML = "";

  data.forEach(customer => {
    const card = document.createElement("div");
    card.className = "customer-card";

    card.innerHTML = `
      <h3>${escapeHTML(customer.name)}</h3>
      <p>📱 Phone: ${escapeHTML(customer.phone)}</p>
      <p>💰 Plant Amount: ₹${Number(customer.amount).toFixed(2)}</p>
      <p>💵 Advance: ₹${Number(customer.Advance_Amount).toFixed(2)}</p>
      <p>💳 Monthly EMI: ₹${Number(customer.monthly_emi).toFixed(2)}</p>
      <p>📅 EMI Months: ${customer.months}</p>
      <p>📌 Paid: ₹${Number(customer.paid_amount || 0).toFixed(2)}</p>
      <p>🔵 Status: ${escapeHTML(customer.status || "Active")}</p>
    `;

    customerList.appendChild(card);
  });
}


// SECURITY
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}