import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

function SkillMatrix() {
  const [matrixData, setMatrixData] = useState([]);

  useEffect(() => {
    // Fetch data from JSON (or an API)
    fetch("../data/criteria_with_all_levels.json") // Replace with your actual path
      .then((response) => response.json())
      .then((data) => setMatrixData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <Table striped bordered hover responsive className="skill-matrix-table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Subcategory</th>
          <th>Description</th>
          {/* Add more columns as needed */}
        </tr>
      </thead>
      <tbody>
        {matrixData.map((category) => (
          <React.Fragment key={category.category}>
            <tr>
              <td>{category.category}</td>
              <td></td>
              <td>{category.description}</td>
            </tr>
            {category.subcategories.map((subcategory) => (
              <tr key={subcategory.name}>
                <td></td>
                <td>{subcategory.name}</td>
                <td>{subcategory.description}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </Table>
  );
}

export default SkillMatrix;
