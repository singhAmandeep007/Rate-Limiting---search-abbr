const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");
const searchStatus = document.getElementById("searchStatus");
const errorStatus = document.getElementById("errorStatus");

searchButton.addEventListener("click", async () => {
  let query = searchInput.value;

  try {
    let result = await fetch(`/api/search?q=${query}`);
    if (!result.ok) {
      let errorResult = await result.json();

      let errorMessage = errorResult?.message || "Unable to fetch data from the server.";

      errorStatus.innerHTML = errorMessage;

      throw new Error(errorMessage);
    }

    let data = await result.json();

    errorStatus.innerHTML = "";

    searchStatus.innerHTML = `Names matching query "${query}" <span class='${data.isFound ? "found" : "notFound"}'>${
      data.isFound ? "found" : "not found"
    }</span>.`;

    searchResults.innerHTML = data.matchingNames.map((name) => `<li>${name}</li>`).join("");
  } catch (error) {
    console.error(error);
  }
});
