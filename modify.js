dropdownButtonUtensil.addEventListener("show.bs.dropdown", (event) => {
    
    let utensilInputGroup = document.getElementById("utensil-input-group");
    utensilInputGroup.style.width = "40rem";
  });
  document
    .getElementById("utensil-input-group")
    .addEventListener("hide.bs.dropdown", (event) => {
      let utensilInputGroup = document.getElementById(
        "utensil-input-group"
      );
      utensilInputGroup.style.width = "20rem";
      utensilInputGroup.classList.remove("show");
    });