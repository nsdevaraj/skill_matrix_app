import React, { useState, useEffect } from 'react';
import { Card, Table, Accordion, Badge, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import criteriaWithAllLevels from '../data/criteria_with_all_levels.json';

const Criteria = () => {
  const [criteria, setCriteria] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  
  useEffect(() => {
    // Load criteria data with all proficiency levels
    setCriteria(criteriaWithAllLevels);
    
    // Initialize expanded state for all categories
    const initialExpandedState = {};
    criteriaWithAllLevels.forEach((category, index) => {
      initialExpandedState[index] = false;
    });
    setExpandedCategories(initialExpandedState);
  }, []);

  // Function to determine badge color based on level
  const getLevelBadgeColor = (level) => {
    switch(level) {
      case 1: return 'danger';
      case 2: return 'warning';
      case 3: return 'info';
      case 4: return 'primary';
      case 5: return 'success';
      default: return 'secondary';
    }
  };
  
  // Function to toggle expanded state for a category
  const toggleCategory = (index) => {
    setExpandedCategories(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Function to filter criteria based on search term
  const filteredCriteria = criteria.filter(category => 
    category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (category.subcategories && category.subcategories.some(sub => 
      sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  return (
    <div className="criteria">
      <h2 className="mb-4">Skill Criteria</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Master Criteria Reference</Card.Title>
          <p>This page shows the detailed criteria for evaluating skills across different categories with four proficiency levels: Low, Medium, Average, and High.</p>
          
          <Form className="mt-3">
            <Form.Group>
              <Form.Control 
                type="text" 
                placeholder="Search for skills or categories..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Header>Skill Categories</Card.Header>
            <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <div className="list-group">
                {filteredCriteria.map((category, index) => (
                  <Button 
                    key={index} 
                    variant="outline-primary"
                    className={`list-group-item list-group-item-action text-start mb-2 ${selectedCategory === index ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(index)}
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
          {selectedCategory !== null ? (
            <div className="selected-category">
              <Card className="mb-3">
                <Card.Header className="bg-primary text-white">
                  <h4>{filteredCriteria[selectedCategory].category}</h4>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6} className="mb-3">
                      <h5>Low Proficiency</h5>
                      <p>{filteredCriteria[selectedCategory].description || 'No description available'}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <h5>Medium Proficiency</h5>
                      <p>{filteredCriteria[selectedCategory].medium_description || 'No description available'}</p>
                    </Col>
                    <Col md={6}>
                      <h5>Average Proficiency</h5>
                      <p>{filteredCriteria[selectedCategory].average_description || 'No description available'}</p>
                    </Col>
                    <Col md={6}>
                      <h5>High Proficiency</h5>
                      <p>{filteredCriteria[selectedCategory].high_description || 'No description available'}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              
              <Card className="mb-3">
                <Card.Header>Level Descriptions</Card.Header>
                <Card.Body>
                  <Table bordered hover responsive>
                    <thead>
                      <tr>
                        <th style={{ width: '20%' }}>Level</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCriteria[selectedCategory].level_descriptions && 
                       Object.entries(filteredCriteria[selectedCategory].level_descriptions).map(([level, description]) => (
                        <tr key={level}>
                          <td>
                            <Badge bg={getLevelBadgeColor(parseInt(level))} className="p-2 w-100 d-block text-center">
                              Level {level}
                            </Badge>
                          </td>
                          <td>{description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
              
              {filteredCriteria[selectedCategory].subcategories && 
               filteredCriteria[selectedCategory].subcategories.length > 0 && (
                <Card>
                  <Card.Header>Subcategories</Card.Header>
                  <Card.Body>
                    <Accordion>
                      {filteredCriteria[selectedCategory].subcategories.map((subcategory, subIndex) => (
                        <Accordion.Item eventKey={subIndex.toString()} key={subIndex}>
                          <Accordion.Header>{subcategory.name}</Accordion.Header>
                          <Accordion.Body>
                            <div className="subcategory-details">
                              <Row>
                                <Col md={6} className="mb-3">
                                  <h6>Low Proficiency</h6>
                                  <p>{subcategory.description || 'No description available'}</p>
                                </Col>
                                <Col md={6} className="mb-3">
                                  <h6>Medium Proficiency</h6>
                                  <p>{subcategory.medium_description || 'No description available'}</p>
                                </Col>
                                <Col md={6}>
                                  <h6>Average Proficiency</h6>
                                  <p>{subcategory.average_description || 'No description available'}</p>
                                </Col>
                                <Col md={6}>
                                  <h6>High Proficiency</h6>
                                  <p>{subcategory.high_description || 'No description available'}</p>
                                </Col>
                              </Row>
                              
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
                  </Card.Body>
                </Card>
              )}
            </div>
          ) : (
            <Alert variant="info">
              Please select a skill category from the list to view its details.
            </Alert>
          )}
        </Col>
      </Row>
      
      <h3 className="mb-3 mt-4">All Categories</h3>
      <Accordion className="mb-4">
        {filteredCriteria.map((category, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header>
              <div className="d-flex justify-content-between align-items-center w-100 me-3">
                <span>{category.category}</span>
                {category.subcategories && category.subcategories.length > 0 && (
                  <Badge bg="info" pill>
                    {category.subcategories.length} subcategories
                  </Badge>
                )}
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <Card className="mb-3">
                <Card.Body>
                  <Row>
                    <Col md={6} className="mb-3">
                      <h6>Low Proficiency</h6>
                      <p>{category.description || 'No description available'}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <h6>Medium Proficiency</h6>
                      <p>{category.medium_description || 'No description available'}</p>
                    </Col>
                    <Col md={6}>
                      <h6>Average Proficiency</h6>
                      <p>{category.average_description || 'No description available'}</p>
                    </Col>
                    <Col md={6}>
                      <h6>High Proficiency</h6>
                      <p>{category.high_description || 'No description available'}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              
              <h5>Level Descriptions</h5>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {category.level_descriptions && Object.entries(category.level_descriptions).map(([level, description]) => (
                    <tr key={level}>
                      <td>
                        <Badge bg={getLevelBadgeColor(parseInt(level))}>
                          Level {level}
                        </Badge>
                      </td>
                      <td>{description}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {category.subcategories && category.subcategories.length > 0 && (
                <>
                  <h5 className="mt-4">Subcategories</h5>
                  <Accordion className="subcategory-accordion">
                    {category.subcategories.map((subcategory, subIndex) => (
                      <Accordion.Item eventKey={subIndex.toString()} key={subIndex}>
                        <Accordion.Header>{subcategory.name}</Accordion.Header>
                        <Accordion.Body>
                          <div className="subcategory-details">
                            <Row>
                              <Col md={6} className="mb-3">
                                <h6>Low Proficiency</h6>
                                <p>{subcategory.description || 'No description available'}</p>
                              </Col>
                              <Col md={6} className="mb-3">
                                <h6>Medium Proficiency</h6>
                                <p>{subcategory.medium_description || 'No description available'}</p>
                              </Col>
                              <Col md={6}>
                                <h6>Average Proficiency</h6>
                                <p>{subcategory.average_description || 'No description available'}</p>
                              </Col>
                              <Col md={6}>
                                <h6>High Proficiency</h6>
                                <p>{subcategory.high_description || 'No description available'}</p>
                              </Col>
                            </Row>
                            
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
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default Criteria;
