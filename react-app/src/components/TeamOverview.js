import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import teamOverviewData from '../data/team_overview.json';
import criteriaData from '../data/criteria.json';

const TeamOverview = () => {
  const [employees, setEmployees] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeSkills, setEmployeeSkills] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Load team overview data
    setEmployees(teamOverviewData);
    
    // Load criteria data
    setCriteria(criteriaData);
    
    // Initialize mock employee skills data
    const mockSkills = {};
    teamOverviewData.forEach(employee => {
      mockSkills[employee.id] = {};
      
      // Generate random skill levels for each category
      criteriaData.forEach(category => {
        mockSkills[employee.id][category.category] = Math.floor(Math.random() * 5) + 1;
      });
    });
    
    setEmployeeSkills(mockSkills);
  }, []);

  // Function to determine badge color based on value
  const getBadgeColor = (value) => {
    if (!value) return 'secondary';
    
    const valueStr = String(value).toLowerCase();
    if (valueStr.includes('high') || valueStr.includes('excellent')) return 'success';
    if (valueStr.includes('medium') || valueStr.includes('good')) return 'primary';
    if (valueStr.includes('low') || valueStr.includes('poor')) return 'warning';
    if (valueStr.includes('risk') || valueStr.includes('critical')) return 'danger';
    
    return 'info';
  };
  
  // Function to get level class name
  const getLevelClass = (level) => {
    return `level-${level}`;
  };
  
  // Function to handle employee selection
  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setEditMode(false);
  };
  
  // Function to handle skill level change
  const handleSkillLevelChange = (category, level) => {
    if (selectedEmployee && editMode) {
      setEmployeeSkills(prev => ({
        ...prev,
        [selectedEmployee.id]: {
          ...prev[selectedEmployee.id],
          [category]: level
        }
      }));
    }
  };
  
  // Function to save employee skills
  const saveEmployeeSkills = () => {
    setEditMode(false);
    // In a real app, this would save to backend
    alert('Employee skills saved successfully!');
  };
  
  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee => 
    employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.position && employee.position.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="team-overview">
      <h2 className="mb-4">Team Overview</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Team Skills Management</Card.Title>
          <p>View and manage skill levels for all team members.</p>
          
          <Form className="mt-3">
            <Form.Group>
              <Form.Control 
                type="text" 
                placeholder="Search employees..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      
      <Row>
        <Col md={4}>
          <Card>
            <Card.Header>Team Members</Card.Header>
            <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <div className="list-group">
                {filteredEmployees.map((employee, index) => (
                  <Button 
                    key={index} 
                    variant="outline-primary"
                    className={`list-group-item list-group-item-action text-start mb-2 ${selectedEmployee && selectedEmployee.id === employee.id ? 'active' : ''}`}
                    onClick={() => handleEmployeeSelect(employee)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{employee.id}</strong>
                        {employee.position && <div className="small">{employee.position}</div>}
                      </div>
                      {employee.risk && (
                        <span className={`badge bg-${getBadgeColor(employee.risk)}`}>
                          {employee.risk}
                        </span>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          {selectedEmployee ? (
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span>{selectedEmployee.id} - Skill Profile</span>
                <div>
                  {editMode ? (
                    <>
                      <Button variant="success" size="sm" onClick={saveEmployeeSkills} className="me-2">
                        Save Changes
                      </Button>
                      <Button variant="outline-secondary" size="sm" onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline-primary" size="sm" onClick={() => setEditMode(true)}>
                      Edit Skills
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Body>
                <Row className="mb-4">
                  <Col md={6}>
                    <h5>Employee Details</h5>
                    <p><strong>Position:</strong> {selectedEmployee.position || 'Not specified'}</p>
                    <p><strong>Skill Expertise:</strong> {selectedEmployee.skill_expertise || 'Not specified'}</p>
                    <p><strong>Value:</strong> {selectedEmployee.value || 'Not specified'}</p>
                    <p><strong>Potential:</strong> {selectedEmployee.potential || 'Not specified'}</p>
                  </Col>
                  <Col md={6}>
                    <h5>Performance Metrics</h5>
                    <p><strong>Risk Level:</strong> {selectedEmployee.risk || 'Not specified'}</p>
                    <p><strong>Salary Plan:</strong> {selectedEmployee.salary_increase_plan || 'Not specified'}</p>
                    <p><strong>Comments:</strong> {selectedEmployee.free_comment || 'None'}</p>
                  </Col>
                </Row>
                
                <h5>Skill Assessment</h5>
                <div className="table-responsive">
                  <table className="table table-bordered skill-matrix-table">
                    <thead>
                      <tr>
                        <th style={{ width: '30%' }}>Skill Category</th>
                        <th colSpan="5">Proficiency Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {criteria.map((category, index) => (
                        <tr key={index}>
                          <td>{category.category}</td>
                          {[1, 2, 3, 4, 5].map(level => (
                            <td 
                              key={level}
                              className={`text-center ${getLevelClass(level)} ${employeeSkills[selectedEmployee.id]?.[category.category] === level ? 'border border-dark' : ''}`}
                              onClick={() => handleSkillLevelChange(category.category, level)}
                              style={{ 
                                cursor: editMode ? 'pointer' : 'default',
                                width: '14%'
                              }}
                            >
                              {level}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {editMode && (
                  <Alert variant="info" className="mt-3">
                    Click on the skill level cells to update proficiency levels.
                  </Alert>
                )}
                
                <div className="mt-4">
                  <h5>Development Recommendations</h5>
                  <ul>
                    {Object.entries(employeeSkills[selectedEmployee.id] || {})
                      .filter(([_, level]) => level < 3)
                      .slice(0, 3)
                      .map(([category, level], index) => (
                        <li key={index}>
                          Focus on improving <strong>{category}</strong> from Level {level} to Level {level + 1}
                        </li>
                      ))}
                  </ul>
                  
                  <Button variant="outline-primary" className="mt-2">
                    View Full Development Plan
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Alert variant="info">
              Please select an employee to view their skill profile.
            </Alert>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default TeamOverview;
