import React, { useState, useEffect } from 'react';
import { Card, Table, Accordion, Badge } from 'react-bootstrap';
import criteriaData from '../data/criteria.json';

const Criteria = () => {
  const [criteria, setCriteria] = useState([]);
  
  useEffect(() => {
    // Load criteria data
    setCriteria(criteriaData);
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

  return (
    <div className="criteria">
      <h2 className="mb-4">Skill Criteria</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Master Criteria Reference</Card.Title>
          <p>This page shows the detailed criteria for evaluating skills across different categories.</p>
        </Card.Body>
      </Card>
      
      <Accordion defaultActiveKey="0">
        {criteria.map((category, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header>{category.category}</Accordion.Header>
            <Accordion.Body>
              <Card className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6>Low Proficiency</h6>
                      <p>{category.description || 'No description available'}</p>
                    </div>
                    <div>
                      <h6>High Proficiency</h6>
                      <p>{category.high_description || 'No description available'}</p>
                    </div>
                  </div>
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
                  <ul className="list-group">
                    {category.subcategories.map((subcategory, subIndex) => (
                      <li className="list-group-item" key={subIndex}>
                        {subcategory.name}
                      </li>
                    ))}
                  </ul>
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
