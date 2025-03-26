import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Form, Button, Nav, Tab, Alert, Modal, ProgressBar } from 'react-bootstrap';
import { FieldsKeeperProvider, FieldsKeeperRootBucket } from 'react-fields-keeper';
import skillUpgradeGuideData from '../data/skill_upgrade_guide.json';
import criteriaData from '../data/criteria.json';
import teamOverviewData from '../data/team_overview.json';

const SkillUpgradeGuide = () => {
  const [criteria, setCriteria] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('matrix');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fields for the drag and drop functionality
  const [fields, setFields] = useState({
    rows: [],
    columns: [],
    values: []
  });
  
  // Sample development paths for different roles
  const [developmentPaths] = useState({
    'Junior Developer': [
      { category: 'Software Development Life Cycle (SDLC)', currentLevel: 1, targetLevel: 3 },
      { category: 'Programming Languages', currentLevel: 2, targetLevel: 4 },
      { category: 'Testing', currentLevel: 1, targetLevel: 3 },
    ],
    'Senior Developer': [
      { category: 'Software Development Life Cycle (SDLC)', currentLevel: 3, targetLevel: 5 },
      { category: 'Programming Languages', currentLevel: 4, targetLevel: 5 },
      { category: 'System Design', currentLevel: 3, targetLevel: 5 },
      { category: 'Leadership', currentLevel: 2, targetLevel: 4 },
    ],
    'Product Developer': [
      { category: 'Software Development Life Cycle (SDLC)', currentLevel: 3, targetLevel: 4 },
      { category: 'Product Management', currentLevel: 3, targetLevel: 5 },
      { category: 'User Experience', currentLevel: 2, targetLevel: 4 },
    ]
  });
  
  const [selectedRole, setSelectedRole] = useState('Junior Developer');
  const [customPlan, setCustomPlan] = useState([]);
  
  useEffect(() => {
    // Load criteria data
    setCriteria(criteriaData);
    
    // Load team overview data
    setEmployees(teamOverviewData);
    
    // Initialize fields for drag and drop
    const categoryFields = criteriaData.map(category => ({
      id: category.category,
      name: category.category,
      type: 'category'
    }));
    
    const levelFields = [1, 2, 3, 4, 5].map(level => ({
      id: `level-${level}`,
      name: `Level ${level}`,
      type: 'level'
    }));
    
    setFields({
      rows: [],
      columns: [],
      values: [...categoryFields, ...levelFields]
    });
  }, []);

  // Function to handle field assignment changes
  const handleFieldsChange = (newFields) => {
    setFields(newFields);
    
    // Generate custom plan based on field selections
    if (newFields.rows.length > 0 && newFields.columns.length > 0) {
      const newCustomPlan = [];
      
      newFields.rows.forEach(row => {
        if (row.type === 'category') {
          newFields.columns.forEach(column => {
            if (column.type === 'level') {
              const level = parseInt(column.name.split(' ')[1]);
              newCustomPlan.push({
                category: row.name,
                level: level,
                description: `Achieve ${row.name} at ${column.name}`
              });
            }
          });
        }
      });
      
      setCustomPlan(newCustomPlan);
    }
  };
  
  // Function to handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  
  // Function to get level class name
  const getLevelClass = (level) => {
    return `level-${level}`;
  };
  
  // Function to open skill detail modal
  const openSkillDetail = (skill) => {
    setSelectedSkill(skill);
    setShowDetailModal(true);
  };
  
  // Function to filter criteria based on search term
  const filteredCriteria = criteria.filter(category => 
    category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Custom Fields Keeper component to replace the original FieldsKeeper
  const CustomFieldsKeeper = ({ fields, onChange }) => {
    return (
      <FieldsKeeperProvider>
        <div className="fields-keeper-container">
          <Row>
            <Col md={4}>
              <h6>Rows</h6>
              <div className="fields-keeper-box">
                <FieldsKeeperRootBucket
                  id="rows"
                  items={fields.rows}
                  onItemsChange={(items) => onChange({ ...fields, rows: items })}
                />
              </div>
            </Col>
            <Col md={4}>
              <h6>Columns</h6>
              <div className="fields-keeper-box">
                <FieldsKeeperRootBucket
                  id="columns"
                  items={fields.columns}
                  onItemsChange={(items) => onChange({ ...fields, columns: items })}
                />
              </div>
            </Col>
            <Col md={4}>
              <h6>Available Fields</h6>
              <div className="fields-keeper-box">
                <FieldsKeeperRootBucket
                  id="values"
                  items={fields.values}
                  onItemsChange={(items) => onChange({ ...fields, values: items })}
                />
              </div>
            </Col>
          </Row>
        </div>
      </FieldsKeeperProvider>
    );
  };

  return (
    <div className="skill-upgrade-guide">
      <h2 className="mb-4">Skill Upgrade Guide</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Skill Development Visualization</Card.Title>
          <p>This interactive guide helps visualize the skill progression path for different roles and skill categories.</p>
          
          <Form className="mt-3">
            <Form.Group>
              <Form.Control 
                type="text" 
                placeholder="Search for skills..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      
      <Tab.Container id="skill-guide-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="matrix">Skill Matrix</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="development">Development Paths</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="custom">Custom View</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="team">Team Skills</Nav.Link>
          </Nav.Item>
        </Nav>
        
        <Tab.Content>
          <Tab.Pane eventKey="matrix">
            <Row className="mb-4">
              <Col md={4}>
                <Card>
                  <Card.Header>Skill Categories</Card.Header>
                  <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <div className="list-group">
                      {filteredCriteria.map((category, index) => (
                        <Button 
                          key={index} 
                          variant="outline-primary"
                          className="list-group-item list-group-item-action text-start mb-2"
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category.category}
                        </Button>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={8}>
                {selectedCategory && (
                  <Card className="category-card">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <span>{selectedCategory.category} Progression</span>
                      <Button 
                        variant="outline-info" 
                        size="sm"
                        onClick={() => openSkillDetail(selectedCategory)}
                      >
                        Detailed View
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      <Table bordered className="skill-matrix-table">
                        <thead>
                          <tr>
                            <th>Skill Level</th>
                            <th>Description</th>
                            <th>Requirements</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[1, 2, 3, 4, 5].map(level => (
                            <tr key={level} className={getLevelClass(level)}>
                              <td><strong>Level {level}</strong></td>
                              <td>
                                {selectedCategory.level_descriptions && 
                                selectedCategory.level_descriptions[level] ? 
                                selectedCategory.level_descriptions[level] : 
                                `Standard level ${level} proficiency`}
                              </td>
                              <td>
                                {level === 1 && 'Basic understanding of concepts'}
                                {level === 2 && 'Can apply with supervision'}
                                {level === 3 && 'Can work independently'}
                                {level === 4 && 'Can guide others'}
                                {level === 5 && 'Expert level, can innovate'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      
                      {selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
                        <div className="mt-3">
                          <h5>Related Skills</h5>
                          <div className="d-flex flex-wrap">
                            {selectedCategory.subcategories.map((subcategory, index) => (
                              <div key={index} className="subcategory-item me-2 mb-2">
                                {subcategory.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                )}
                
                {!selectedCategory && (
                  <Alert variant="info">
                    Please select a skill category to view its progression details.
                  </Alert>
                )}
              </Col>
            </Row>
            
            <Card>
              <Card.Header>Skill Level Legend</Card.Header>
              <Card.Body>
                <Row>
                  {[1, 2, 3, 4, 5].map(level => (
                    <Col key={level} xs={12} md={2} className="mb-2">
                      <div className={`p-2 text-center ${getLevelClass(level)}`}>
                        <strong>Level {level}</strong>
                        <div className="small">
                          {level === 1 && 'Beginner'}
                          {level === 2 && 'Basic'}
                          {level === 3 && 'Intermediate'}
                          {level === 4 && 'Advanced'}
                          {level === 5 && 'Expert'}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Tab.Pane>
          
          <Tab.Pane eventKey="development">
            <Row className="mb-4">
              <Col md={4}>
                <Card>
                  <Card.Header>Select Role</Card.Header>
                  <Card.Body>
                    <Form.Select 
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      {Object.keys(developmentPaths).map((role, index) => (
                        <option key={index} value={role}>
                          {role}
                        </option>
                      ))}
                    </Form.Select>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={8}>
                <Card>
                  <Card.Header>Development Path for {selectedRole}</Card.Header>
                  <Card.Body>
                    <Table bordered className="skill-matrix-table">
                      <thead>
                        <tr>
                          <th>Skill Category</th>
                          <th>Current Level</th>
                          <th>Target Level</th>
                          <th>Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {developmentPaths[selectedRole].map((path, index) => (
                          <tr key={index}>
                            <td>{path.category}</td>
                            <td className={getLevelClass(path.currentLevel)}>
                              Level {path.currentLevel}
                            </td>
                            <td className={getLevelClass(path.targetLevel)}>
                              Level {path.targetLevel}
                            </td>
                            <td>
                              <ProgressBar 
                                now={(path.currentLevel / path.targetLevel) * 100}
                                label={`${Math.round((path.currentLevel / path.targetLevel) * 100)}%`}
                                variant={path.currentLevel >= path.targetLevel ? "success" : "info"}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <Card>
              <Card.Header>Development Recommendations</Card.Header>
              <Card.Body>
                <h5>Next Steps for {selectedRole}</h5>
                <ul>
                  {developmentPaths[selectedRole].map((path, index) => (
                    path.currentLevel < path.targetLevel && (
                      <li key={index}>
                        <strong>{path.category}:</strong> Focus on advancing from Level {path.currentLevel} to Level {path.currentLevel + 1}
                        <ul>
                          <li>Complete relevant training courses</li>
                          <li>Practice through hands-on projects</li>
                          <li>Seek mentorship from higher-level colleagues</li>
                        </ul>
                      </li>
                    )
                  ))}
                </ul>
                
                <div className="mt-4">
                  <Button variant="success">Generate Development Plan</Button>{' '}
                  <Button variant="outline-primary">Export to PDF</Button>
                </div>
              </Card.Body>
            </Card>
          </Tab.Pane>
          
          <Tab.Pane eventKey="custom">
            <Card className="mb-4">
              <Card.Header>Custom Skill Matrix View</Card.Header>
              <Card.Body>
                <p>Drag and drop categories and levels to create your custom skill matrix view.</p>
                <CustomFieldsKeeper
                  fields={fields}
                  onChange={handleFieldsChange}
                />
                
                {fields.rows.length > 0 && fields.columns.length > 0 ? (
                  <Table bordered className="skill-matrix-table">
                    <thead>
                      <tr>
                        <th></th>
                        {fields.columns.map((column, index) => (
                          <th key={index}>{column.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {fields.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td><strong>{row.name}</strong></td>
                          {fields.columns.map((column, colIndex) => (
                            <td 
                              key={colIndex} 
                              className={
                                column.type === 'level' ? 
                                  getLevelClass(parseInt(column.name.split(' ')[1])) : ''
                              }
                              onClick={() => {
                                if (row.type === 'category' && column.type === 'level') {
                                  const category = criteria.find(c => c.category === row.name);
                                  if (category) {
                                    setSelectedCategory(category);
                                    setActiveTab('matrix');
                                  }
                                }
                              }}
                              style={{ cursor: row.type === 'category' && column.type === 'level' ? 'pointer' : 'default' }}
                            >
                              {row.type === 'category' && column.type === 'level' ? 
                                `${row.name} at ${column.name}` : '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">
                    Drag categories to rows and levels to columns to create your skill matrix view
                  </Alert>
                )}
                
                {customPlan.length > 0 && (
                  <Card className="mt-4">
                    <Card.Header>Your Custom Development Plan</Card.Header>
                    <Card.Body>
                      <ol>
                        {customPlan.map((item, index) => (
                          <li key={index} className="mb-2">
                            {item.description}
                            <div className="small text-muted">
                              Focus on reaching {item.category} Level {item.level}
                            </div>
                          </li>
                        ))}
                      </ol>
                      
                      <div className="mt-3">
                        <Button variant="success">Save Plan</Button>{' '}
                        <Button variant="outline-primary">Export to PDF</Button>
                      </div>
                    </Card.Body>
                  </Card>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>
          
          <Tab.Pane eventKey="team">
            <Card>
              <Card.Header>Team Skill Distribution</Card.Header>
              <Card.Body>
                <p>This view shows the distribution of skills across the team.</p>
                
                <Form.Group className="mb-3">
                  <Form.Label>Select Skill Category</Form.Label>
                  <Form.Select onChange={(e) => handleCategorySelect(criteria.find(c => c.category === e.target.value))}>
                    <option value="">Select a skill category</option>
                    {criteria.map((category, index) => (
                      <option key={index} value={category.category}>
                        {category.category}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                {selectedCategory && (
                  <div className="mt-4">
                    <h5>{selectedCategory.category} - Team Distribution</h5>
                    
                    <Table bordered className="skill-matrix-table">
                      <thead>
                        <tr>
                          <th>Level</th>
                          <th>Description</th>
                          <th>Team Members</th>
                          <th>Distribution</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[5, 4, 3, 2, 1].map(level => {
                          // Simulate team distribution - in a real app, this would come from actual data
                          const memberCount = Math.floor(Math.random() * employees.length);
                          const percentage = (memberCount / employees.length) * 100;
                          
                          return (
                            <tr key={level} className={getLevelClass(level)}>
                              <td><strong>Level {level}</strong></td>
                              <td>
                                {selectedCategory.level_descriptions && 
                                selectedCategory.level_descriptions[level] ? 
                                selectedCategory.level_descriptions[level] : 
                                `Standard level ${level} proficiency`}
                              </td>
                              <td>{memberCount} team members</td>
                              <td>
                                <ProgressBar 
                                  now={percentage} 
                                  label={`${Math.round(percentage)}%`}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    
                    <div className="mt-4">
                      <h5>Team Skill Gap Analysis</h5>
                      <p>
                        Based on the current distribution, the team has strengths in levels 3-4 
                        for {selectedCategory.category}, but could benefit from developing more 
                        expertise at level 5.
                      </p>
                      
                      <Button variant="outline-primary" className="mt-2">
                        View Detailed Analysis
                      </Button>
                    </div>
                  </div>
                )}
                
                {!selectedCategory && (
                  <Alert variant="info">
                    Please select a skill category to view team distribution.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      
      {/* Skill Detail Modal */}
      <Modal 
        show={showDetailModal} 
        onHide={() => setShowDetailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedSkill && selectedSkill.category}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSkill && (
            <>
              <Card className="mb-3">
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h5>Low Proficiency</h5>
                      <p>{selectedSkill.description || 'No description available'}</p>
                    </Col>
                    <Col md={6}>
                      <h5>High Proficiency</h5>
                      <p>{selectedSkill.high_description || 'No description available'}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              
              <h5>Level Progression</h5>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>Description</th>
                    <th>Expected Behaviors</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map(level => (
                    <tr key={level} className={getLevelClass(level)}>
                      <td><strong>Level {level}</strong></td>
                      <td>
                        {selectedSkill.level_descriptions && 
                        selectedSkill.level_descriptions[level] ? 
                        selectedSkill.level_descriptions[level] : 
                        `Standard level ${level} proficiency`}
                      </td>
                      <td>
                        {level === 1 && 'Understands basic concepts, requires guidance for all tasks'}
                        {level === 2 && 'Can perform routine tasks with some supervision'}
                        {level === 3 && 'Works independently on most tasks, seeks help for complex issues'}
                        {level === 4 && 'Solves complex problems, can mentor others, contributes to improvements'}
                        {level === 5 && 'Recognized expert, develops new approaches, leads initiatives'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {selectedSkill.subcategories && selectedSkill.subcategories.length > 0 && (
                <>
                  <h5 className="mt-4">Related Skills</h5>
                  <Row>
                    {selectedSkill.subcategories.map((subcategory, index) => (
                      <Col key={index} md={4} className="mb-2">
                        <div className="subcategory-item">
                          {subcategory.name}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </>
              )}
              
              <h5 className="mt-4">Learning Resources</h5>
              <ul>
                <li>Online courses focused on {selectedSkill.category}</li>
                <li>Internal training materials</li>
                <li>Recommended books and articles</li>
                <li>Practice projects</li>
              </ul>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            Add to Development Plan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SkillUpgradeGuide;
