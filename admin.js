const companyName = localStorage.getItem("currentCompany");
let companies = JSON.parse(localStorage.getItem("companies")) || [];
let company = companies.find(c => c.name === companyName);

function addEmployee() {
  company.employees.push({
    employeeId: document.getElementById("empId").value,
    name: document.getElementById("empName").value,
    department: document.getElementById("empDept").value,
    salary: document.getElementById("empSalary").value,
    status: document.getElementById("empStatus").value
  });

  localStorage.setItem("companies", JSON.stringify(companies));
  window.location.href = "index.html";
}

function goBack() {
  window.location.href = "index.html";
}