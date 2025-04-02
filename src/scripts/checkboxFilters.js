/**
 * Listing checkbox filter functionality
 * Handles filtering listing cards based on selected features
 */

// Only execute this code in the browser, not during server-side rendering
export function initializeFilters() {
  // Elements
  const checkboxFilters = document.querySelectorAll(".feature-filter");
  const clearFiltersBtn = document.getElementById("clearFilters");
  const listingCards = document.querySelectorAll(".listing-card");
  const noResultsMessage = document.getElementById("noFilterResults");
  const filteredCountElement = document.getElementById("filteredCount");
  const activeFilterCountElement = document.getElementById("activeFilterCount");

  // Apply filters based on checked boxes
  const applyFilters = () => {
    // Get all selected features
    const selectedFeatures = [];
    checkboxFilters.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedFeatures.push(checkbox.dataset.feature);
      }
    });

    // Update active filter count
    if (activeFilterCountElement) {
      if (selectedFeatures.length > 0) {
        activeFilterCountElement.textContent = selectedFeatures.length;
        activeFilterCountElement.classList.remove("hidden");
      } else {
        activeFilterCountElement.classList.add("hidden");
      }
    }

    // If no filters selected, show all listings
    if (selectedFeatures.length === 0) {
      listingCards.forEach((card) => {
        card.style.display = "block";
      });

      if (noResultsMessage) {
        noResultsMessage.style.display = "none";
      }

      if (filteredCountElement) {
        filteredCountElement.textContent = listingCards.length;
      }

      return;
    }

    // Filter listings based on selected features
    let visibleCount = 0;

    listingCards.forEach((card) => {
      const cardElement = card;
      const cardFeatures = (cardElement.dataset.features || "").split(",");

      // Listing must have ALL selected features to be visible
      const hasAllFeatures = selectedFeatures.every((feature) =>
        cardFeatures.includes(feature)
      );

      // Show or hide the card
      cardElement.style.display = hasAllFeatures ? "block" : "none";

      if (hasAllFeatures) visibleCount++;
    });

    // Update filtered count
    if (filteredCountElement) {
      filteredCountElement.textContent = visibleCount;
    }

    // Show "no results" message if no listings match filters
    if (noResultsMessage) {
      noResultsMessage.style.display = visibleCount === 0 ? "block" : "none";
    }
  };

  // Add event listeners to all checkboxes
  checkboxFilters.forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilters);
  });

  // Clear filters button
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", () => {
      checkboxFilters.forEach((checkbox) => {
        checkbox.checked = false;
      });

      applyFilters();
    });
  }
}
