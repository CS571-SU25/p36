import { Form } from "react-bootstrap";

function CategoryFilter({ selectedCategory, setSelectedCategory, categories }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "1rem" }}>
      <Form.Label style={{ display: "block", fontSize: "1.25rem", marginBottom: "1rem" }}>
        <h4>
          Filter by Event Type
        </h4>
      </Form.Label>
      <Form.Select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={{ maxWidth: "300px", margin: "0 auto", display: "block" }}
      >
        <option value="all">All</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.title}
          </option>
        ))}
      </Form.Select>
    </div>
  );
}

export default CategoryFilter;
