import { Form } from "react-bootstrap";

function CategoryFilter({ selectedCategory, setSelectedCategory, categories }) {
  return (
    <>
      <Form.Label><h4>Filter by Event Type</h4></Form.Label>
      <Form.Select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="all">All</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.title}
          </option>
        ))}
      </Form.Select>
    </>
  );
}

export default CategoryFilter;
