import React, { useEffect, useState } from 'react';

const hotelChains = ["Chain A", "Chain B", "Chain C", "Chain D", "Chain E"];

const EmployeesManager = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    employee_ssn: '',
    first_name: '',
    last_name: '',
    address: '',
    salary: '',
    hotel_id: '', // now represents a hotel chain
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
    <div className="card">
      <h3>Employees</h3>
      <div className="form-container">
        <input 
          type="text" 
          name="employee_ssn" 
          placeholder="SSN" 
          className="input" 
          value={newEmployee.employee_ssn} 
          onChange={handleInputChange} 
        />
        <input 
          type="text" 
          name="first_name" 
          placeholder="First Name" 
          className="input" 
          value={newEmployee.first_name} 
          onChange={handleInputChange} 
        />
        <input 
          type="text" 
          name="last_name" 
          placeholder="Last Name" 
          className="input" 
          value={newEmployee.last_name} 
          onChange={handleInputChange} 
        />
        <input 
          type="text" 
          name="address" 
          placeholder="Address" 
          className="input" 
          value={newEmployee.address} 
          onChange={handleInputChange} 
        />
        <input 
          type="number" 
          name="salary" 
          placeholder="Salary" 
          className="input" 
          value={newEmployee.salary} 
          onChange={handleInputChange} 
        />
        <select 
          name="hotel_id" 
          className="input" 
          value={newEmployee.hotel_id} 
          onChange={handleInputChange}
        >
          <option value="">Select Hotel Chain</option>
          {hotelChains.map((chain, idx) => (
            <option key={idx} value={chain}>{chain}</option>
          ))}
        </select>
        <input 
          type="text" 
          name="role_type" 
          placeholder="Role" 
          className="input" 
          value={newEmployee.role_type} 
          onChange={handleInputChange} 
        />
        <button className="button" onClick={handleAddEmployee}>Add Employee</button>
      </div>
      <ul>
        {employees.map(emp => (
          <li
            key={emp.employee_ssn}
            className="card"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span>{emp.first_name} {emp.last_name} | Hotel: {emp.hotel_id} | Role: {emp.role_type}</span>
            <button className="button" onClick={() => handleDeleteEmployee(emp.employee_ssn)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeesManager;