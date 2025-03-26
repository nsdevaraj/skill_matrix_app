import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Accordion,
  Badge,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Modal,
} from "react-bootstrap";
import criteriaWithAllLevels from "../data/criteria_with_all_levels.json";

const Criteria = () => {
  const [criteria, setCriteria] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  // State for Add New Skill form
  const [showAddSkillForm, setShowAddSkillForm] = useState(false);
  const [newSkill, setNewSkill] = useState({
    category: "",
    description: "",
    medium_description: "",
    average_description: "",
    high_description: "",
    subcategories: [],
    level_descriptions: {},
  });
  const [validationErrors, setValidationErrors] = useState({});

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
    switch (level) {
      case 1:
        return "danger";
      case 2:
        return "warning";
      case 3:
        return "info";
      case 4:
        return "primary";
      case 5:
        return "success";
      default:
        return "secondary";
    }
  };

  // Function to filter criteria based on search term
  const filteredCriteria = criteria.filter(
    (category) =>
      category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (category.subcategories &&
        category.subcategories.some(
          (sub) =>
            sub.name &&
            sub.name.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSkill((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Function to validate form
  const validateForm = () => {
    const errors = {};

    if (!newSkill.category.trim()) {
      errors.category = "Category name is required";
    }

    if (!newSkill.description.trim()) {
      errors.description = "Low proficiency description is required";
    }

    if (!newSkill.medium_description.trim()) {
      errors.medium_description = "Medium proficiency description is required";
    }

    if (!newSkill.average_description.trim()) {
      errors.average_description =
        "Average proficiency description is required";
    }

    if (!newSkill.high_description.trim()) {
      errors.high_description = "High proficiency description is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Create a new skill object
      const skillToAdd = {
        ...newSkill,
        subcategories: [], // Initialize with empty subcategories
      };

      // Log the new skill as JSON to console
      console.log("New Skill Added:");
      console.log(JSON.stringify(skillToAdd, null, 2));

      // Add the new skill to the criteria list (in a real app, this would be saved to a database)
      setCriteria((prev) => [...prev, skillToAdd]);

      // Reset form and close modal
      setNewSkill({
        category: "",
        description: "",
        medium_description: "",
        average_description: "",
        high_description: "",
        subcategories: [],
        level_descriptions: {},
      });
      setShowAddSkillForm(false);

      // Show success message (in a real app)
      alert("New skill added successfully! Check the console for JSON output.");
    }
  };

  return (
    <div className="criteria">
      <h2 className="mb-4">Skill Criteria</h2>

      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Header>Skill Categories</Card.Header>
            <Card.Body style={{ maxHeight: "600px", overflowY: "auto" }}>
              <div className="list-group">
                {filteredCriteria.map((category, index) => (
                  <Button
                    key={index}
                    variant="outline-primary"
                    className={`list-group-item list-group-item-action text-start mb-2 ${
                      selectedCategory === index ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(index)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{category.category}</span>
                      {category.subcategories &&
                        category.subcategories.length > 0 && (
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
              </Card>

              {filteredCriteria[selectedCategory].subcategories &&
                filteredCriteria[selectedCategory].subcategories.length > 0 && (
                  <Card>
                    <Card.Header>Skills</Card.Header>
                    <Card.Body>
                      <Accordion>
                        {filteredCriteria[selectedCategory].subcategories.map(
                          (subcategory, subIndex) => (
                            <Accordion.Item
                              eventKey={subIndex.toString()}
                              key={subIndex}
                            >
                              <Accordion.Header>
                                {subcategory.name}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="subcategory-details">
                                  <Row>
                                    <Col md={6} className="mb-3">
                                      <h6>Low Proficiency</h6>
                                      <p>
                                        {subcategory.description ||
                                          "No description available"}
                                      </p>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                      <h6>Medium Proficiency</h6>
                                      <p>
                                        {subcategory.medium_description ||
                                          "No description available"}
                                      </p>
                                    </Col>
                                    <Col md={6}>
                                      <h6>Average Proficiency</h6>
                                      <p>
                                        {subcategory.average_description ||
                                          "No description available"}
                                      </p>
                                    </Col>
                                    <Col md={6}>
                                      <h6>High Proficiency</h6>
                                      <p>
                                        {subcategory.high_description ||
                                          "No description available"}
                                      </p>
                                    </Col>
                                  </Row>

                                  {subcategory.skills &&
                                  subcategory.skills.length > 0 ? (
                                    <>
                                      <h6 className="mt-3">Related Skills</h6>
                                      <ul className="list-group">
                                        {subcategory.skills.map(
                                          (skill, skillIndex) => (
                                            <li
                                              className="list-group-item"
                                              key={skillIndex}
                                            >
                                              {skill}
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </>
                                  ) : null}
                                </div>
                              </Accordion.Body>
                            </Accordion.Item>
                          )
                        )}
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
                {category.subcategories &&
                  category.subcategories.length > 0 && (
                    <Badge bg="info" pill>
                      {category.subcategories.length} subcategories
                    </Badge>
                  )}
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <Table bordered hover>
                <tbody>
                  {category.level_descriptions &&
                    Object.entries(category.level_descriptions).map(
                      ([level, description]) => (
                        <tr key={level}>
                          <td>
                            <Badge bg={getLevelBadgeColor(parseInt(level))}>
                              Level {level}
                            </Badge>
                          </td>
                          <td>{description}</td>
                        </tr>
                      )
                    )}
                </tbody>
              </Table>

              {category.subcategories && category.subcategories.length > 0 && (
                <>
                  <h5 className="mt-4">Skill set</h5>
                  <Accordion className="subcategory-accordion">
                    {category.subcategories.map((subcategory, subIndex) => (
                      <Accordion.Item
                        eventKey={subIndex.toString()}
                        key={subIndex}
                      >
                        <Accordion.Header>{subcategory.name}</Accordion.Header>
                        <Accordion.Body>
                          <div className="subcategory-details">
                            <Row>
                              <Col md={6} className="mb-3">
                                <h6>Low Proficiency</h6>
                                <p>
                                  {subcategory.description ||
                                    "No description available"}
                                </p>
                              </Col>
                              <Col md={6} className="mb-3">
                                <h6>Medium Proficiency</h6>
                                <p>
                                  {subcategory.medium_description ||
                                    "No description available"}
                                </p>
                              </Col>
                              <Col md={6}>
                                <h6>Average Proficiency</h6>
                                <p>
                                  {subcategory.average_description ||
                                    "No description available"}
                                </p>
                              </Col>
                              <Col md={6}>
                                <h6>High Proficiency</h6>
                                <p>
                                  {subcategory.high_description ||
                                    "No description available"}
                                </p>
                              </Col>
                            </Row>

                            {subcategory.skills &&
                            subcategory.skills.length > 0 ? (
                              <>
                                <h6 className="mt-3">Related Skills</h6>
                                <ul className="list-group">
                                  {subcategory.skills.map(
                                    (skill, skillIndex) => (
                                      <li
                                        className="list-group-item"
                                        key={skillIndex}
                                      >
                                        {skill}
                                      </li>
                                    )
                                  )}
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
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Master Criteria Reference</Card.Title>
          <p>
            This page shows the detailed criteria for evaluating skills across
            different categories with four proficiency levels: Low, Medium,
            Average, and High.
          </p>

          <Row className="mt-3">
            <Col md={8}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search for skills or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Button
                variant="success"
                className="w-100"
                onClick={() => setShowAddSkillForm(true)}
              >
                Add New Skill
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {/* Add New Skill Modal Form */}
      <Modal
        show={showAddSkillForm}
        onHide={() => setShowAddSkillForm(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Skill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Skill Category Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={newSkill.category}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.category}
                placeholder="Enter skill category name"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.category}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Low Proficiency Description{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={newSkill.description}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.description}
                    placeholder="Describe low proficiency level"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.description}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Medium Proficiency Description{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="medium_description"
                    value={newSkill.medium_description}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.medium_description}
                    placeholder="Describe medium proficiency level"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.medium_description}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Average Proficiency Description{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="average_description"
                    value={newSkill.average_description}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.average_description}
                    placeholder="Describe average proficiency level"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.average_description}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    High Proficiency Description{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="high_description"
                    value={newSkill.high_description}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.high_description}
                    placeholder="Describe high proficiency level"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.high_description}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Alert variant="info">
              <small>
                Note: Subcategories and level descriptions can be added after
                creating the main skill category. The form will output the new
                skill data as JSON to the browser console.
              </small>
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddSkillForm(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Add Skill
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Criteria;
