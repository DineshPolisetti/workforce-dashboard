/* ================= DEMO DATA ================= */

// create demo data only once
if (!localStorage.getItem("employees_Deloitte")) {

  const demoEmployees = [

    {empId:"EMP001", empName:"Rahul Sharma", department:"IT", salary:75000, status:"Active"},
    {empId:"EMP002", empName:"Priya Reddy", department:"HR", salary:65000, status:"Active"},
    {empId:"EMP003", empName:"Arjun Kumar", department:"Finance", salary:72000, status:"On Leave"},
    {empId:"EMP004", empName:"Sneha Patel", department:"IT", salary:80000, status:"Active"},
    {empId:"EMP005", empName:"Kiran Verma", department:"Marketing", salary:60000, status:"Resigned"},

    {empId:"EMP006", empName:"Ananya Gupta", department:"IT", salary:90000, status:"Active"},
    {empId:"EMP007", empName:"Vikram Singh", department:"Finance", salary:85000, status:"Active"},
    {empId:"EMP008", empName:"Neha Sharma", department:"HR", salary:62000, status:"Active"},
    {empId:"EMP009", empName:"Rohit Mehta", department:"Marketing", salary:58000, status:"On Leave"},
    {empId:"EMP010", empName:"Pooja Nair", department:"IT", salary:92000, status:"Active"},

    {empId:"EMP011", empName:"Amit Das", department:"Finance", salary:78000, status:"Active"},
    {empId:"EMP012", empName:"Divya Iyer", department:"HR", salary:64000, status:"Active"},
    {empId:"EMP013", empName:"Sandeep Yadav", department:"IT", salary:87000, status:"Resigned"},
    {empId:"EMP014", empName:"Meera Joshi", department:"Marketing", salary:61000, status:"Active"},
    {empId:"EMP015", empName:"Karthik Reddy", department:"IT", salary:95000, status:"Active"},

    {empId:"EMP016", empName:"Ritika Kapoor", department:"Finance", salary:76000, status:"Active"},
    {empId:"EMP017", empName:"Manish Agarwal", department:"Marketing", salary:59000, status:"Active"},
    {empId:"EMP018", empName:"Nisha Verma", department:"HR", salary:63000, status:"On Leave"},
    {empId:"EMP019", empName:"Aditya Sharma", department:"IT", salary:88000, status:"Active"},
    {empId:"EMP020", empName:"Shreya Banerjee", department:"Finance", salary:81000, status:"Active"}

  ];

  localStorage.setItem("employees_Deloitte", JSON.stringify(demoEmployees));

}

let deptChartInstance = null;


/* ================= SAVE EMPLOYEE ================= */

function saveEmployee(event) {

  event.preventDefault();

  const empId = document.getElementById("empId").value.trim();
  const empName = document.getElementById("empName").value.trim();
  const department = document.getElementById("department").value.trim();
  const salary = document.getElementById("salary").value.trim();
  const status = document.getElementById("status").value;

  if (!empId || !empName || !department || !salary || !status) {
    alert("Please fill all fields");
    return;
  }

  let company = localStorage.getItem("companyName");

  if (!company) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  const employee = {
    empId,
    empName,
    department,
    salary: Number(salary),
    status
  };

  let employees = JSON.parse(localStorage.getItem("employees_" + company)) || [];

  employees.push(employee);

  localStorage.setItem("employees_" + company, JSON.stringify(employees));

  alert("Employee Saved Successfully!");

  window.location.href = "index.html";

}


/* ================= LOAD EMPLOYEES ================= */

function loadEmployees() {

  const employeeList = document.getElementById("employeeList");
  if (!employeeList) return;

  let company = localStorage.getItem("companyName");

  // if visitor → show demo
  if (!company) {
    company = "Deloitte";
  }

  let employees = JSON.parse(localStorage.getItem("employees_" + company)) || [];

  employeeList.innerHTML = "";

  let total = employees.length;
  let active = 0;
  let leave = 0;
  let resigned = 0;
  let totalSalary = 0;

  employees.forEach((emp, index) => {

    if (emp.status === "Active") active++;
    if (emp.status === "On Leave") leave++;
    if (emp.status === "Resigned") resigned++;

    totalSalary += emp.salary;

    employeeList.innerHTML += `
    <div class="emp-card">
      <h4>${emp.empName}</h4>
      <p><strong>ID:</strong> ${emp.empId}</p>
      <p><strong>Department:</strong> ${emp.department}</p>
      <p><strong>Salary:</strong> ₹${emp.salary}</p>
      <p><strong>Status:</strong> ${emp.status}</p>

      <button onclick="editEmployee(${index})">Edit</button>
      <button onclick="deleteEmployee(${index})">Delete</button>
    </div>
    `;
  });

  document.getElementById("totalEmp").innerText = total;
  document.getElementById("activeEmp").innerText = active;
  document.getElementById("leaveEmp").innerText = leave;
  document.getElementById("resignedEmp").innerText = resigned;
  document.getElementById("totalSalary").innerText = "₹" + totalSalary;

  document.getElementById("avgSalary").innerText =
    total > 0 ? "₹" + Math.round(totalSalary / total) : "₹0";

  updateChart(employees);
}


/* ================= EDIT EMPLOYEE ================= */

function editEmployee(index) {

  let company = localStorage.getItem("companyName") || "Deloitte";

  let employees = JSON.parse(localStorage.getItem("employees_" + company)) || [];

  const emp = employees[index];

  const newName = prompt("Edit Name:", emp.empName);
  const newDept = prompt("Edit Department:", emp.department);
  const newSalary = prompt("Edit Salary:", emp.salary);
  const newStatus = prompt("Edit Status:", emp.status);

  if (!newName || !newDept || !newSalary || !newStatus) return;

  employees[index] = {
    ...emp,
    empName: newName,
    department: newDept,
    salary: Number(newSalary),
    status: newStatus
  };

  localStorage.setItem("employees_" + company, JSON.stringify(employees));

  loadEmployees();
}


/* ================= DELETE EMPLOYEE ================= */

function deleteEmployee(index) {

  let company = localStorage.getItem("companyName") || "Deloitte";

  let employees = JSON.parse(localStorage.getItem("employees_" + company)) || [];

  employees.splice(index, 1);

  localStorage.setItem("employees_" + company, JSON.stringify(employees));

  loadEmployees();
}


/* ================= CHART ================= */

function updateChart(employees) {

  const ctx = document.getElementById("deptChart");
  if (!ctx) return;

  const deptCount = {};

  employees.forEach(emp => {

    if (!deptCount[emp.department]) {
      deptCount[emp.department] = 0;
    }

    deptCount[emp.department]++;

  });

  const labels = Object.keys(deptCount);
  const data = Object.values(deptCount);

  if (deptChartInstance) {
    deptChartInstance.destroy();
  }

  deptChartInstance = new Chart(ctx, {
    type: "bar",
    indexAxis: "y",
    data: {
      labels: labels,
      datasets: [{
        label: "Employees per Department",
        data: data,
        backgroundColor: "#1f3c88",
        borderRadius: 6,
        barThickness: 28
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}


/* ================= INIT ================= */

window.onload = function () {

  let company = localStorage.getItem("companyName");

  if (!company) {
    company = "Deloitte";
  }

  const title = document.getElementById("dashboardTitle");

  if (title) {
    title.innerText = company + " - Employee Dashboard";
  }

  loadEmployees();
};


/* ================= DARK MODE ================= */

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}


/* ================= LOGOUT ================= */

function logout() {

  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("companyName");

  window.location.href = "login.html";

}