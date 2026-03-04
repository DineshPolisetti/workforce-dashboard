let deptChartInstance = null;
/* ================= PROTECT DASHBOARD ================= */

if (window.location.pathname.includes("index.html")) {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
  }
}

/* ================= SAVE EMPLOYEE ================= */

function saveEmployee(event) {
  event.preventDefault(); // STOP PAGE REFRESH

  const empId = document.getElementById("empId").value.trim();
  const empName = document.getElementById("empName").value.trim();
  const department = document.getElementById("department").value.trim();
  const salary = document.getElementById("salary").value.trim();
  const status = document.getElementById("status").value;

  if (!empId || !empName || !department || !salary || !status) {
    alert("Please fill all fields");
    return;
  }

  const employee = {
    empId,
    empName,
    department,
    salary: Number(salary),
    status
  };

  let employees = JSON.parse(localStorage.getItem("employees")) || [];

  employees.push(employee);

  localStorage.setItem("employees", JSON.stringify(employees));

  alert("Employee Saved Successfully!");

  window.location.href = "index.html";
}

/* ================= LOAD EMPLOYEES ================= */

function loadEmployees() {

  const employeeList = document.getElementById("employeeList");
  if (!employeeList) return;

  let employees = JSON.parse(localStorage.getItem("employees")) || [];

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

/* ================= DELETE ================= */

function editEmployee(index) {

  let employees = JSON.parse(localStorage.getItem("employees")) || [];

  const emp = employees[index];

  const newName = prompt("Edit Name:", emp.empName);
  const newDept = prompt("Edit Department:", emp.department);
  const newSalary = prompt("Edit Salary:", emp.salary);
  const newStatus = prompt("Edit Status (Active / On Leave / Resigned):", emp.status);

  if (!newName || !newDept || !newSalary || !newStatus) return;

  employees[index] = {
    ...emp,
    empName: newName,
    department: newDept,
    salary: Number(newSalary),
    status: newStatus
  };

  localStorage.setItem("employees", JSON.stringify(employees));

  loadEmployees(); // refresh instantly
}
function deleteEmployee(index) {

  let employees = JSON.parse(localStorage.getItem("employees")) || [];

  employees.splice(index, 1);

  localStorage.setItem("employees", JSON.stringify(employees));

  loadEmployees(); // instantly refresh dashboard + chart
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
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: { display: false }
    },
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1 }
    }
  }
}
  });
}

/* ================= INIT ================= */

window.onload = function () {

  const companyName = localStorage.getItem("companyName");
  const companyLocation = localStorage.getItem("companyLocation");
  const companyDescription = localStorage.getItem("companyDescription");

  const title = document.getElementById("dashboardTitle");
  const location = document.getElementById("companyLocation");
  const description = document.getElementById("companyDescription");

  if (companyName && title) {
    title.innerText = companyName + " - Employee Dashboard";
  }

  if (companyLocation && location) {
    location.innerText = "Location: " + companyLocation;
  }

  if (companyDescription && description) {
    description.innerText = "About: " + companyDescription;
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
  window.location.href = "login.html";
}