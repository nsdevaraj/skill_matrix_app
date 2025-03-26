import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Form, Button, Nav, Tab, Alert, Modal, ProgressBar, Dropdown, Accordion, Badge } from 'react-bootstrap';
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
  const [skillLevels, setSkillLevels] = useState([1, 2, 3, 4, 5]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // Fields for the custom drag and drop functionality
  const [availableFields, setAvailableFields] = useState([]);
  const [rowFields, setRowFields] = useState([]);
  const [columnFields, setColumnFields] = useState([]);
  const [customPlan, setCustomPlan] = useState([]);
  
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
    
    setAvailableFields([...categoryFields, ...levelFields]);
    
    // Initialize expanded state for all categories
    const initialExpandedState = {};
    criteriaData.forEach((category, index) => {
      initialExpandedState[index] = false;
    });
    setExpandedCategories(initialExpandedState);
  }, []);

  // Function to move a field from one list to another
  const moveField = (field, source, target) => {
    // Remove from source
    const sourceList = source === 'available' ? availableFields : 
                      source === 'rows' ? rowFields : columnFields;
    const newSourceList = sourceList.filter(f => f.id !== field.id);
    
    // Add to target
    const targetList = target === 'available' ? availableFields : 
                      target === 'rows' ? rowFields : columnFields;
    const newTargetList = [...targetList, field];
    
    // Update state
    if (source === 'available') setAvailableFields(newSourceList);
    else if (source === 'rows') setRowFields(newSourceList);
    else if (source === 'columns') setColumnFields(newSourceList);
    
    if (target === 'available') setAvailableFields(newTargetList);
    else if (target === 'rows') setRowFields(newTargetList);
    else if (target === 'columns') setColumnFields(newTargetList);
    
    // Update custom plan
    updateCustomPlan(
      target === 'rows' ? newTargetList : rowFields,
      target === 'columns' ? newTargetList : columnFields
    );
  };
  
  // Function to update custom plan based on rows and columns
  const updateCustomPlan = (rows, cols) => {
    if (rows.length > 0 && cols.length > 0) {
      const newCustomPlan = [];
      
      rows.forEach(row => {
        if (row.type === 'category') {
          cols.forEach(column => {
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
  
  // Function to filter criteria based on search term and selected level
  const filteredCriteria = criteria.filter(category => {
    const matchesSearch = category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (category.subcategories && category.subcategories.some(sub => 
        sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    // If no level filter is applied, just check search term
    if (selectedLevel === null) {
      return matchesSearch;
    }
    
    // Check if the category has the selected level in its level_descriptions
    const hasSelectedLevel = category.level_descriptions && 
      Object.keys(category.level_descriptions).includes(selectedLevel.toString());
    
    return matchesSearch && hasSelectedLevel;
  });
  
  // Function to toggle expanded state for a category
  const toggleCategory = (index) => {
    setExpandedCategories(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Function to get level description
  const getLevelDescription = (level) => {
    switch(level) {
      case 1: return 'Beginner';
      case 2: return 'Basic';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return '';
    }
  };

  return (
    <div className="skill-upgrade-guide">
      <h2 className="mb-4">Skill Upgrade Guide</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Skill Development Visualization</Card.Title>
          <p>This interactive guide helps visualize the skill progression path for different roles and skill categories.</p>
          
          <Row className="mt-3">
            <Col md={8}>
              <Form.Group>
                <Form.Control 
                  type="text" 
                  placeholder="Search for skills..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" id="level-filter-dropdown" className="w-100">
                  {selectedLevel ? `Level ${selectedLevel} - ${getLevelDescription(selectedLevel)}` : 'Filter by Level'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSelectedLevel(null)}>All Levels</Dropdown.Item>
                  <Dropdown.Divider />
                  {skillLevels.map(level => (
                    <Dropdown.Item 
                      key={level} 
                      onClick={() => setSelectedLevel(level)}
                      className={selectedLevel === level ? 'active' : ''}
                    >
                      Level {level} - {getLevelDescription(level)}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
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
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <span>Skill Categories</span>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" size="sm" id="sort-dropdown">
                        Sort
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => {
                          const sorted = [...filteredCriteria].sort((a, b) => a.category.localeCompare(b.category));
                          setCriteria(sorted);
                        }}>
                          Alphabetical (A-Z)
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => {
                          const sorted = [...filteredCriteria].sort((a, b) => b.category.localeCompare(a.category));
                          setCriteria(sorted);
                        }}>
                          Alphabetical (Z-A)
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => {
                          const sorted = [...filteredCriteria].sort((a, b) => 
                            (b.subcategories?.length || 0) - (a.subcategories?.length || 0)
                          );
                          setCriteria(sorted);
                        }}>
                          Most Subcategories
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Card.Header>
                  <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <div className="list-group">
                      {filteredCriteria.map((category, index) => (
                        <Button 
                          key={index} 
                          variant="outline-primary"
                          className="list-group-item list-group-item-action text-start mb-2"
                          onClick={() => handleCategorySelect(category)}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <span>{category.category}</span>
                            {category.subcategories && category.subcategories.length > 0 && (
                              <Badge bg="info" pill>
                                {category.subcategories.length}
                              </Badge>
                            )}
                          </div>
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
                          <Accordion className="subcategory-accordion">
                            {selectedCategory.subcategories.map((subcategory, subIndex) => (
                              <Accordion.Item eventKey={subIndex.toString()} key={subIndex}>
                                <Accordion.Header>{subcategory.name}</Accordion.Header>
                                <Accordion.Body>
                                  <div className="subcategory-details">
                                    {subcategory.description ? (
                                      <p>{subcategory.description}</p>
                                    ) : (
                                      <p>No detailed description available for this subcategory.</p>
                                    )}
                                    
                                    {subcategory.skills && subcategory.skills.length > 0 ? (
                                      <>
                                        <h6 className="mt-3">Related Skills</h6>
                                        <ul className="list-group">
                                          {subcategory.skills.map((skill, skillIndex) => (
                                            <li className="list-group-item" key={skillIndex}>
                                              {skill}
                                            </li>
                                          ))}
                                        </ul>
                                      </>
                                    ) : null}
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>
                            ))}
                          </Accordion>
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
                          {getLevelDescription(level)}
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
                              <Dropdown>
                                <Dropdown.Toggle variant="link" id={`current-level-${index}`} className="p-0 text-decoration-none">
                                  Level {path.currentLevel}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  {[1, 2, 3, 4, 5].map(level => (
                                    <Dropdown.Item 
                                      key={level} 
                                      className={path.currentLevel === level ? 'active' : ''}
                                      onClick={() => {
                                        const updatedPaths = {...developmentPaths};
                                        updatedPaths[selectedRole][index].currentLevel = level;
                                        // This is a mock update since we're not actually changing the state
                                        // In a real app, you would update the state here
                                      }}
                                    >
                                      Level {level} - {getLevelDescription(level)}
                                    </Dropdown.Item>
                                  ))}
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                            <td className={getLevelClass(path.targetLevel)}>
                              <Dropdown>
                                <Dropdown.Toggle variant="link" id={`target-level-${index}`} className="p-0 text-decoration-none">
                                  Level {path.targetLevel}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  {[1, 2, 3, 4, 5].map(level => (
                                    <Dropdown.Item 
                                      key={level} 
                                      className={path.targetLevel === level ? 'active' : ''}
                                      onClick={() => {
                                        const updatedPaths = {...developmentPaths};
                                        updatedPaths[selectedRole][index].targetLevel = level;
                                        // This is a mock update since we're not actually changing the state
                                        // In a real app, you would update the state here
                                      }}
                                    >
                                      Level {level} - {getLevelDescription(level)}
                                    </Dropdown.Item>
                                  ))}
                                </Dropdown.Menu>
                              </Dropdown>
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
                <Accordion>
                  {developmentPaths[selectedRole].map((path, index) => (
                    path.currentLevel < path.targetLevel && (
                      <Accordion.Item eventKey={index.toString()} key={index}>
                        <Accordion.Header>
                          <strong>{path.category}:</strong> Level {path.currentLevel} → Level {path.targetLevel}
                        </Accordion.Header>
                        <Accordion.Body>
                          <p>Focus on advancing from Level {path.currentLevel} to Level {path.currentLevel + 1}</p>
                          <h6>Recommended Actions:</h6>
                          <ul>
                            <li>Complete relevant training courses</li>
                            <li>Practice through hands-on projects</li>
                            <li>Seek mentorship from higher-level colleagues</li>
                          </ul>
                          
                          <h6>Learning Resources:</h6>
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-primary" id={`resources-${index}`}>
                              Select Learning Resources
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item>Online Courses</Dropdown.Item>
                              <Dropdown.Item>Books & Documentation</Dropdown.Item>
                              <Dropdown.Item>Practice Projects</Dropdown.Item>
                              <Dropdown.Item>Mentorship Programs</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </Accordion.Body>
                      </Accordion.Item>
                    )
                  ))}
                </Accordion>
                
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
                
                {/* Simple drag and drop replacement */}
                <Row className="mb-4">
                  <Col md={4}>
                    <Card>
                      <Card.Header>Available Fields</Card.Header>
                      <Card.Body style={{ minHeight: '200px' }}>
                        <Dropdown className="mb-3">
                          <Dropdown.Toggle variant="outline-secondary" id="category-filter">
                            Filter Categories
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => {}}>All Categories</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => {}}>Technical Skills</Dropdown.Item>
                            <Dropdown.Item onClick={() => {}}>Soft Skills</Dropdown.Item>
                            <Dropdown.Item onClick={() => {}}>Leadership Skills</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        
                        {availableFields.map((field, index) => (
                          <Button 
                            key={index}
                            variant="outline-secondary"
                            className="m-1"
                            onClick={() => {
                              if (field.type === 'category') {
                                moveField(field, 'available', 'rows');
                              } else if (field.type === 'level') {
                                moveField(field, 'available', 'columns');
                              }
                            }}
                          >
                            {field.name}
                          </Button>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card>
                      <Card.Header>Rows (Categories)</Card.Header>
                      <Card.Body style={{ minHeight: '200px' }}>
                        {rowFields.map((field, index) => (
                          <Button 
                            key={index}
                            variant="primary"
                            className="m-1"
                            onClick={() => moveField(field, 'rows', 'available')}
                          >
                            {field.name} <span className="ms-2">×</span>
                          </Button>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card>
                      <Card.Header>Columns (Levels)</Card.Header>
                      <Card.Body style={{ minHeight: '200px' }}>
                        {columnFields.map((field, index) => (
                          <Button 
                            key={index}
                            variant="info"
                            className="m-1"
                            onClick={() => moveField(field, 'columns', 'available')}
                          >
                            {field.name} <span className="ms-2">×</span>
                          </Button>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                
                {rowFields.length > 0 && columnFields.length > 0 ? (
                  <Table bordered className="skill-matrix-table">
                    <thead>
                      <tr>
                        <th></th>
                        {columnFields.map((column, index) => (
                          <th key={index}>{column.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rowFields.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td><strong>{row.name}</strong></td>
                          {columnFields.map((column, colIndex) => (
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
                              <Dropdown>
                                <Dropdown.Toggle variant="link" id={`cell-${rowIndex}-${colIndex}`} className="p-0 text-decoration-none">
                                  {row.type === 'category' && column.type === 'level' ? 
                                    `${row.name} at ${column.name}` : '—'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item onClick={() => {}}>Set as Target</Dropdown.Item>
                                  <Dropdown.Item onClick={() => {}}>Set as Current</Dropdown.Item>
                                  <Dropdown.Item onClick={() => {}}>View Details</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">
                    Click on categories and levels above to add them to your matrix view
                  </Alert>
                )}
                
                {customPlan.length > 0 && (
                  <Card className="mt-4">
                    <Card.Header>Your Custom Development Plan</Card.Header>
                    <Card.Body>
                      <Accordion>
                        {customPlan.map((item, index) => (
                          <Accordion.Item eventKey={index.toString()} key={index}>
                            <Accordion.Header>
                              {item.description}
                            </Accordion.Header>
                            <Accordion.Body>
                              <div className="small text-muted mb-3">
                                Focus on reaching {item.category} Level {item.level}
                              </div>
                              
                              <h6>Recommended Actions:</h6>
                              <ul>
                                <li>Complete relevant training courses</li>
                                <li>Practice through hands-on projects</li>
                                <li>Seek mentorship from higher-level colleagues</li>
                              </ul>
                              
                              <Form.Group className="mb-3">
                                <Form.Label>Priority</Form.Label>
                                <Form.Select>
                                  <option>High</option>
                                  <option>Medium</option>
                                  <option>Low</option>
                                </Form.Select>
                              </Form.Group>
                              
                              <Form.Group className="mb-3">
                                <Form.Label>Target Completion Date</Form.Label>
                                <Form.Control type="date" />
                              </Form.Group>
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                      </Accordion>
                      
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
                                <Dropdown>
                                  <Dropdown.Toggle variant="link" id={`level-desc-${level}`} className="p-0 text-decoration-none">
                                    {selectedCategory.level_descriptions && 
                                    selectedCategory.level_descriptions[level] ? 
                                    selectedCategory.level_descriptions[level] : 
                                    `Standard level ${level} proficiency`}
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => {}}>View Details</Dropdown.Item>
                                    <Dropdown.Item onClick={() => {}}>Edit Description</Dropdown.Item>
                                    <Dropdown.Item onClick={() => {}}>Set as Target</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                              <td>
                                <Dropdown>
                                  <Dropdown.Toggle variant="link" id={`members-${level}`} className="p-0 text-decoration-none">
                                    {memberCount} team members
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Header>Team Members at Level {level}</Dropdown.Header>
                                    {employees.slice(0, memberCount).map((employee, idx) => (
                                      <Dropdown.Item key={idx}>{employee.id}</Dropdown.Item>
                                    ))}
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
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
                      <Accordion>
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>Skill Gap Overview</Accordion.Header>
                          <Accordion.Body>
                            <p>
                              Based on the current distribution, the team has strengths in levels 3-4 
                              for {selectedCategory.category}, but could benefit from developing more 
                              expertise at level 5.
                            </p>
                            
                            <h6>Recommendations:</h6>
                            <ul>
                              <li>Identify team members at level 4 who can be developed to level 5</li>
                              <li>Consider hiring or training specialists for this skill area</li>
                              <li>Develop mentorship programs to elevate overall team capability</li>
                            </ul>
                          </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                          <Accordion.Header>Development Opportunities</Accordion.Header>
                          <Accordion.Body>
                            <p>The following team members have been identified for potential skill development:</p>
                            
                            <Table bordered>
                              <thead>
                                <tr>
                                  <th>Team Member</th>
                                  <th>Current Level</th>
                                  <th>Target Level</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {employees.slice(0, 3).map((employee, idx) => (
                                  <tr key={idx}>
                                    <td>{employee.id}</td>
                                    <td>Level {Math.floor(Math.random() * 3) + 2}</td>
                                    <td>Level {Math.floor(Math.random() * 2) + 4}</td>
                                    <td>
                                      <Dropdown>
                                        <Dropdown.Toggle variant="outline-primary" size="sm">
                                          Actions
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                          <Dropdown.Item>Create Development Plan</Dropdown.Item>
                                          <Dropdown.Item>Assign Mentor</Dropdown.Item>
                                          <Dropdown.Item>Schedule Training</Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                      
                      <Button variant="outline-primary" className="mt-3">
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
                  <Accordion>
                    {selectedSkill.subcategories.map((subcategory, index) => (
                      <Accordion.Item eventKey={index.toString()} key={index}>
                        <Accordion.Header>{subcategory.name}</Accordion.Header>
                        <Accordion.Body>
                          <div className="subcategory-details">
                            {subcategory.description ? (
                              <p>{subcategory.description}</p>
                            ) : (
                              <p>No detailed description available for this subcategory.</p>
                            )}
                            
                            {subcategory.skills && subcategory.skills.length > 0 ? (
                              <>
                                <h6 className="mt-3">Related Skills</h6>
                                <ul className="list-group">
                                  {subcategory.skills.map((skill, skillIndex) => (
                                    <li className="list-group-item" key={skillIndex}>
                                      {skill}
                                    </li>
                                  ))}
                                </ul>
                              </>
                            ) : null}
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </>
              )}
              
              <h5 className="mt-4">Learning Resources</h5>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Online Courses</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>Coursera: Introduction to {selectedSkill.category}</li>
                      <li>Udemy: Advanced {selectedSkill.category} Techniques</li>
                      <li>LinkedIn Learning: {selectedSkill.category} for Professionals</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Books & Documentation</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>The Complete Guide to {selectedSkill.category}</li>
                      <li>{selectedSkill.category} Best Practices</li>
                      <li>Official Documentation and References</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Practice Projects</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>Beginner: Simple {selectedSkill.category} exercises</li>
                      <li>Intermediate: Building a {selectedSkill.category} portfolio</li>
                      <li>Advanced: Contributing to open-source {selectedSkill.category} projects</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
          <Dropdown as={Button.Group}>
            <Button variant="primary">Add to Development Plan</Button>
            <Dropdown.Toggle split variant="primary" id="add-to-plan-dropdown" />
            <Dropdown.Menu>
              <Dropdown.Item>Set as Current Level</Dropdown.Item>
              <Dropdown.Item>Set as Target Level</Dropdown.Item>
              <Dropdown.Item>Add to Custom View</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SkillUpgradeGuide;
