// File: src/components/EmployeesManager.jsx
import React, { useEffect, useState } from 'react';

const EmployeesManager = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    employee_ssn: '',
    first_name: '',
    last_name: '',
    address: '',
    salary: '',
    hotel_id: '',
    role_type: ''
  });

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/employees');
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleAddEmployee = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee)
      });

      if (res.ok) {
        setNewEmployee({
          employee_ssn: '',
          first_name: '',
          last_name: '',
          address: '',
          salary: '',
          hotel_id: '',
          role_type: ''
        });
        fetchEmployees();
      } else {
        console.error('Failed to add employee');
      }
    } catch (err) {
      console.error('Error adding employee', err);
    }
  };

  const handleDeleteEmployee = async (ssn) => {
    try {
      const res = await fetch(`http://localhost:3000/api/employees/${ssn}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchEmployees();
      } else {
        console.error('Failed to delete employee');
      }
    } catch (err) {
      console.error('Error deleting employee', err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h3 className="text-lg font-bold mb-4">Employees</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <input name="employee_ssn" className="border rounded p-2" placeholder="SSN" value={newEmployee.employee_ssn} onChange={handleInputChange} />
        <input name="first_name" className="border rounded p-2" placeholder="First Name" value={newEmployee.first_name} onChange={handleInputChange} />
        <input name="last_name" className="border rounded p-2" placeholder="Last Name" value={newEmployee.last_name} onChange={handleInputChange} />
        <input name="address" className="border rounded p-2" placeholder="Address" value={newEmployee.address} onChange={handleInputChange} />
        <input name="salary" type="number" className="border rounded p-2" placeholder="Salary" value={newEmployee.salary} onChange={handleInputChange} />
        <input name="hotel_id" type="number" className="border rounded p-2" placeholder="Hotel ID" value={newEmployee.hotel_id} onChange={handleInputChange} />
        <input name="role_type" className="border rounded p-2" placeholder="Role" value={newEmployee.role_type} onChange={handleInputChange} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded h-fit" onClick={handleAddEmployee}>Add Employee</button>
      </div>

      <ul className="space-y-2">
        {employees.map((emp) => (
          <li key={emp.employee_ssn} className="p-4 border rounded shadow-sm flex justify-between items-center">
            <span>
              {emp.first_name} {emp.last_name} | Hotel ID: {emp.hotel_id} | Role: {emp.role_type}
            </span>
            <button className="text-red-500" onClick={() => handleDeleteEmployee(emp.employee_ssn)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeesManager;