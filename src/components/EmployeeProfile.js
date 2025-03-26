import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Accordion, ListGroup } from "react-bootstrap";

function EmployeeProfile() {
  const { id } = useParams(); // Get employee ID from the URL
  const [employee, setEmployee] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch employee data
    const fetchEmployee = async () => {
      try {
        const response = await fetch("../data/team_overview.json"); // Adjust the path as needed
        const data = await response.json();
        const foundEmployee = data.find((emp) => emp.id === id);

        if (foundEmployee) {
          setEmployee(foundEmployee);
        } else {
          setError("Employee not found.");
        }
      } catch (err) {
        setError("Failed to load employee data.");
        console.error("Error fetching employee data:", err);
      }
    };

    const fetchCriteria = async () => {
      try {
        const response = await fetch("/data/criteria_with_all_levels.json");
        const data = await response.json();
        setCriteria(data);
      } catch (error) {
        console.error("Error fetching criteria:", error);
      }
    };

    fetchEmployee();
    fetchCriteria();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!employee) {
    return <div>Loading employee data...</div>;
  }
  // Extract the relevant data about the employee skills levels if any
  const employeeSkills = employee.competencies || {};

  return (
    <div className="container mt-4">
      <h2>
        {employee.id} - {employee.position}
      </h2>
      <Link to="/" className="btn btn-secondary mb-3">
        Back to Matrix
      </Link>

      {criteria.map((category) => (
        <Card key={category.category} className="category-card">
          <Card.Header>{category.category}</Card.Header>
          <Card.Body>
            <Accordion defaultActiveKey={category.subcategories[0]?.name}>
              {category.subcategories.map((subcategory) => (
                <Accordion.Item
                  eventKey={subcategory.name}
                  key={subcategory.name}
                >
                  <Accordion.Header className="subcategory-accordion">
                    {subcategory.name}
                  </Accordion.Header>
                  <Accordion.Body className="subcategory-accordion">
                    <div>{subcategory.description}</div>
                    <ListGroup>
                      <ListGroup.Item>
                        Low Proficiency{" "}
                        <span className="badge badge-low">
                          {subcategory.description}
                        </span>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Medium Proficiency{" "}
                        <span className="badge badge-medium">
                          {subcategory.medium_description}
                        </span>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Average Proficiency{" "}
                        <span className="badge badge-average">
                          {subcategory.average_description}
                        </span>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        High Proficiency{" "}
                        <span className="badge badge-high">
                          {subcategory.high_description}
                        </span>
                      </ListGroup.Item>
                    </ListGroup>
                    {/*  <ListGroup>
                      {[1, 2, 3, 4, 5].map(level => (
                        <ListGroup.Item key={level}>Level {level}</ListGroup.Item>
                      ))}
                    </ListGroup> */}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default EmployeeProfile;
