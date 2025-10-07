
  document.getElementById("searchForm").addEventListener("submit", function(event) {
    const input = document.getElementById("searchInput").value.trim();
    if (input) {
      // Update action URL with input value (URL-encoded)
      this.action = "listings/search/" + encodeURIComponent(input);
    }
  });
