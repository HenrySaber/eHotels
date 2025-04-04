import React, { useEffect, useState } from 'react';

const hotelChains = ["Chain A", "Chain B", "Chain C", "Chain D", "Chain E"];

const EmployeesManager = () => {
  const [employees, setEmployees] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activeSection, setActiveSection] = useState('rooms'); // 'rooms' or 'employees'

  const [newEmployee, setNewEmployee] = useState({
    employee_ssn: '',
    first_name: '',
    last_name: '',
    address: '',
    salary: '',
    hotel_id: '',
    role_type: ''
  });

  const fetchRooms = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/rooms');
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error('Failed to fetch rooms', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/employees');
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleDamageChange = (roomId, value) => {
    setRooms(prev =>
      prev.map(room =>
        room.room_id === roomId ? { ...room, damages: value } : room
      )
    );
  };

  const handleUpdateDamage = async (room) => {
    try {
      const res = await fetch(`http://localhost:3000/api/rooms/${room.room_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(room)
      });
      if (!res.ok) throw new Error('Failed to update damage');
      alert('✅ Damage updated successfully');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update damage');
    }
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
      if (res.ok) fetchEmployees();
      else console.error('Failed to delete employee');
    } catch (err) {
      console.error('Error deleting employee', err);
    }
  };

  const handleLoadRooms = () => {
    setActiveSection('rooms');
    fetchRooms();
  };

  const handleLoadEmployees = () => {
    setActiveSection('employees');
    fetchEmployees();
  };

  return (
    <div className="container">
      <h2 className="heading">Room Damage Management</h2>

      <div className="mb-4">
        <button className="button mr-2" onClick={handleLoadRooms}>
          {activeSection === 'rooms' ? 'Reload Rooms' : 'Load Rooms'}
        </button>
        <button className="button" onClick={handleLoadEmployees}>
          {activeSection === 'employees' ? 'Reload Employees' : 'Load Employees'}
        </button>
      </div>

      {activeSection === 'rooms' && (
        <>
          <ul>
  {rooms.map(room => (
    <li key={room.room_id} className="card">
      <p><strong>Room #{room.room_id}</strong></p>
      <p>Capacity: {room.capacity}</p>
      <p>Area: {room.area} sqft</p>
      <p>Hotel ID: {room.hotel_id}</p>
      <p>Sea View: {room.sea_view ? "Yes" : "No"}</p>
      <p>Mountain View: {room.mountain_view ? "Yes" : "No"}</p>
      <p>Extendable: {room.extendable ? "Yes" : "No"}</p>
      <p>Price: ${room.price}</p>
      <p><strong>Damage Description:</strong></p>
      <textarea
        className="input"
        rows="2"
        value={room.damages || ''}
        onChange={(e) => handleDamageChange(room.room_id, e.target.value)}
      />
      <button className="button" onClick={() => handleUpdateDamage(room)}>Update Damage</button>
    </li>
  ))}
</ul>
        </>
      )}

      {activeSection === 'employees' && (
        <>
          <h2 className="heading mt-6">Manage Employees</h2>
          <div className="form-container grid grid-cols-2">
            <input type="text" name="employee_ssn" placeholder="SSN" className="input" value={newEmployee.employee_ssn} onChange={handleInputChange} />
            <input type="text" name="first_name" placeholder="First Name" className="input" value={newEmployee.first_name} onChange={handleInputChange} />
            <input type="text" name="last_name" placeholder="Last Name" className="input" value={newEmployee.last_name} onChange={handleInputChange} />
            <input type="text" name="address" placeholder="Address" className="input" value={newEmployee.address} onChange={handleInputChange} />
            <input type="number" name="salary" placeholder="Salary" className="input" value={newEmployee.salary} onChange={handleInputChange} />
            <select name="hotel_id" className="input" value={newEmployee.hotel_id} onChange={handleInputChange}>
              <option value="">Select Hotel Chain</option>
              {hotelChains.map((chain, idx) => (
                <option key={idx} value={chain}>{chain}</option>
              ))}
            </select>
            <input type="text" name="role_type" placeholder="Role" className="input" value={newEmployee.role_type} onChange={handleInputChange} />
            <button className="button" onClick={handleAddEmployee}>Add Employee</button>
          </div>

          <ul>
            {employees.map(emp => (
              <li key={emp.employee_ssn} className="card" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{emp.first_name} {emp.last_name} | Hotel: {emp.hotel_id} | Role: {emp.role_type}</span>
                <button className="button" onClick={() => handleDeleteEmployee(emp.employee_ssn)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default EmployeesManager;
