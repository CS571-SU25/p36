function CategoryKey({ categories, categoryColors }) {
  return (
    <div style={{ minWidth: "150px", borderLeft: "1px solid #ddd", paddingLeft: "1rem" }}>
      <h5>Category Key</h5>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {categories.map((cat) => (
          <li
            key={cat.id}
            style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: categoryColors[cat.id] || "#000",
                marginRight: "0.5rem",
                borderRadius: "3px",
              }}
            />
            <span>{cat.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryKey;
