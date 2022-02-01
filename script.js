//create the main constants and Object prototypes
const recipes = [];
const renderQueue = [];
const searchBar = document.getElementById("searchbar");
const inputByIngredient = document.getElementById("ingredient-input-textfield");
const dropdownButtonIngredient = document.getElementById(
  "ingredient-dropdown-button"
);
const recipeContainer = document.getElementById("recipe-container");

console.log("JS is running.");

const searchtree = {
  ingredients: [], // ingredientName: Appearances(Recipe Indezes)
  appliances: [], // applianceName: Appearances(Recipe Indezes)
  utensils: [], // utensilName: Appearances(Recipe Indezes)
  recipeNames: [],
  searchKeys: [],
};

function searchKey() {
  shortKey = "";
  references = [];
}

function reference() {
  searchTarget = "";
  word = ""; // = longKey
  type = "";
  recipeReferences = [];
}

searchBar.addEventListener("submit", function (event) {
  event.preventDefault();
  var searchInput = document.getElementById("search-input");
  console.log(searchInput.value);
  let searchVectorFromInput = new searchVector(searchInput.value);
  console.log("Search Results are: ");
  console.log(lookUp(searchVectorFromInput));
  createRenderQueue(lookUp(searchVectorFromInput));
  console.log("Rendering to DOM");
  //console.log(recipes[1]);
  renderArray(results.toRender);
});

inputByIngredient.addEventListener("keydown", function (event) {
  if (event.code !== "Enter") {
    let dropdownMenuIngredient = document.getElementById(
      "ingredient-dropdown-menu"
    );
    if (inputByIngredient.value.length > 2) {
      let searchVectorFromKeydown = new searchVector(
        inputByIngredient.value,
        "ingredients"
      );
      populateDropdownMenu(
        "ingredient-dropdown-menu",
        "ingredients",
        lookUp(searchVectorFromKeydown)
      );

      if (dropdownMenuIngredient.classList.contains("show") === false) {
        console.log("added show");
        document
          .getElementById("ingredient-dropdown-menu")
          .classList.add("show");
        document.getElementById("ingredient-dropdown-menu").style.marginLeft =
          "0rem";
        document.getElementById("ingredient-dropdown-menu").style.width =
          "20rem";
      }
    }
  }
  if (event.code == "Enter") {
    //event.preventDefault();
    //var searchInput = document.getElementById("search-input");
    console.log(inputByIngredient.value);
    let searchVectorFromInput = new searchVector(
      inputByIngredient.value,
      "ingredients"
    );
    console.log("Search Results are: ");
    console.log(lookUp(searchVectorFromInput));
    createRenderQueue(lookUp(searchVectorFromInput));
    console.log("Rendering to DOM");
    //console.log(recipes[1]);
    renderArray(results.toRender);
  }
});

document.querySelector("body").addEventListener("click", (event) => {
  if (
    event.target.id === "ingredient-input-textfield" ||
    event.target.classList.contains("ingredient-dropdown-item") !== false
  ) {
  } else {
    document.getElementById("ingredient-dropdown-menu").style.width = "40rem";
    document.getElementById("ingredient-dropdown-menu").style.marginLeft =
      "-37.6rem";
    document
      .getElementById("ingredient-dropdown-menu")
      .classList.remove("show");
  }
});

dropdownButtonIngredient.addEventListener("show.bs.dropdown", (event) => {
  console.log(event);
  let ingredientInputGroup = document.getElementById("ingredient-input-group");
  ingredientInputGroup.style.width = "40rem";
});
document
  .getElementById("ingredient-input-group")
  .addEventListener("hide.bs.dropdown", (event) => {
    let ingredientInputGroup = document.getElementById(
      "ingredient-input-group"
    );
    ingredientInputGroup.style.width = "20rem";
  });

function populateDropdownMenu(targetMenu, type, results) {
  let dropdownMenu = document.getElementById(targetMenu);
  let subReader = Object.entries(searchtree[type]);
  let targetNode;
  let newRow;

  if (results === undefined) {
    newRow = document.createElement("div");
    newRow.className = "row";
    dropdownMenu.append(newRow);
    for (var e = 0, len = 30; e < len; e++) {
      switch (e) {
        case 0:
          createDropdownMultiRow();
          break;
        case 10:
          createDropdownMultiRow();
          break;
        case 20:
          createDropdownMultiRow();
          break;
      }
      let dropItem = new dropdownItem(subReader[e][0], type);

      targetNode.append(dropItem.domElement);
    }
  } else {
    while (dropdownMenu.lastElementChild) {
      dropdownMenu.removeChild(dropdownMenu.lastElementChild);
    }
    /*newRow = document.createElement("div");
    newRow.className = "row";
    dropdownMenu.append(newRow);
    let newCol = document.createElement("div");
    newCol.className = "col-sm-4";
    newRow.appendChild(newCol);*/
    targetNode = dropdownMenu;
    for (var e = 0, len = results.length; e < len; e++) {
      if (results[e].type == type) {
        let dropItem = new dropdownItem(results[e].searchTarget, type);
        console.log(dropItem);
        targetNode.append(dropItem.domElement);
        dropItem.domElement.style.marginLeft = "1rem";
      }
    }
  }
  function createDropdownMultiRow() {
    let newCol = document.createElement("div");
    newCol.className = "col-sm-4";
    newRow.appendChild(newCol);
    let newUL = document.createElement("ul");
    newUL.className = "multi-column-dropdown";
    newCol.appendChild(newUL);
    targetNode = newUL;
  }
}

function dropdownItem(name, type) {
  this.domElement = document.createElement("button");
  this.domElement.className = "dropdown-item ingredient-dropdown-item";
  this.domElement.textContent = name;
  this.domElement.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Creating searchvector from dropdownItem");
    searchAndRender(name, type);
  });
}

function searchTag(name, type) {
  this.domElement = document.createElement("p");
  this.domElement.className = "search-tag mx-3";
  switch (type) {
    case "ingredients": {
      this.domElement.classList.add("bg-ingredient");
      break;
    }
  }
  this.domElement.textContent = name;
  let hostNode = document.getElementById("tag-container");
  this.domButton = document.createElement("button");
  this.domElement.appendChild(this.domButton);
  this.domButton.className = "search-tag__button";
  this.domButton.innerHTML = "<i class='far fa-lg fa-times-circle'></i>";
  this.domButton.type = "button";
  this.domButton.addEventListener("click", (event) => {
    hostNode.removeChild(this.domElement);
  });
  this.appendToDom = function(){
    
    console.log(hostNode);
    console.log(this.domElement);
    hostNode.append(this.domElement);
  }
  this.parentVector;
  this.log = function (){
    console.log("Searchtag created:");
    console.log(this);
  }
}

function searchAndRender(name, type) {
  let searchVectorFromIngredientItem = new searchVector(name, type);
  console.log("Search Results are: ");
  console.log(lookUp(searchVectorFromIngredientItem));
  createRenderQueue(lookUp(searchVectorFromIngredientItem));
  console.log("Rendering to DOM");

  renderArray(results.toRender);
}

function searchVector(string, type) {
  this.fullString = filterToLowerCase(string);
  if (type !== undefined) {
    this.typeReq = filterToLowerCase(type);
  }
  this.searchKeys = extractSearchKeys(this.fullString);
  this.searchKeys.shift();
  console.log("SearchVector created: ");
  console.log(this);
  this.tag = new searchTag (string, type);
  this.tag.appendToDom();
  this.tag.parentVector = this;
  this.tag.log();
}

const results = {
  toCompare: [],
  toRender: [],
};

function lookUp(searchVector) {
  let lookUpResults = [];
  let filteredResults = [];
  for (var i = 0, len = searchVector.searchKeys.length; i < len; i++) {
    //only run search if individual key is longer then 2 characters
    if (searchVector.searchKeys[i].length > 2) {
      let shortKey = searchVector.searchKeys[i].substring(0, 3);
      let stringLength = searchVector.searchKeys[i].length;
      let stringToCompare = searchVector.searchKeys[i];
      if (searchVector.typeReq === undefined) {
        lookUpResults.push(searchtree.searchKeys[shortKey].references);
      } else {
        //console.log("Entered type filtering function");
        for (
          var x = 0, len2 = searchtree.searchKeys[shortKey].references.length;
          x < len2;
          x++
        ) {
          //console.log(searchtree.searchKeys[shortKey].references[x].type);
          //console.log(searchVector.typeReq);
          if (
            searchtree.searchKeys[shortKey].references[x].type ==
            searchVector.typeReq
          ) {
            lookUpResults.push(searchtree.searchKeys[shortKey].references[x]);
          }
        }
      }
      let flatResults = [].concat.apply([], lookUpResults);
      //lookUpResults = flatResults;

      for (var y = 0, len3 = flatResults.length; y < len3; y++) {
        let lookUpString = flatResults[y].word.substring(0, stringLength);

        if (lookUpString === stringToCompare) {
          filteredResults.push(flatResults[y]);
        }
      }

      //filteredResults = flatResults;
    }
  }

  //return only references that contain all keys
  if (searchVector.searchKeys.length > 1) {
    //console.log("Entered filtering function");
    //console.log("filtered results are: ");
    //console.log(filteredResults);
    let countingDict = [];
    for (a = 0, lena = filteredResults.length; a < lena; a++) {
      if (countingDict[filteredResults[a].searchTarget] === undefined) {
        countingDict[filteredResults[a].searchTarget] = 1;
      } else {
        countingDict[filteredResults[a].searchTarget]++;
        //console.log(countingDict[filteredResults[a].searchTarget]);
      }
    }
    /*console.log(countingDict);
    let swapped = Object.fromEntries(
      Object.entries(countingDict).map((a) => a.reverse())
    );
    console.log(swapped);*/

    let dictReader = Object.entries(countingDict);
    console.log(dictReader);
    //console.log(dictReader.length);

    for (b = 0, lenb = dictReader.length; b < lenb; b++) {
      if (dictReader[b][1] === searchVector.searchKeys.length) {
        console.log("Final searchtarget is: ");
        console.log(dictReader[b][0]);

        if (searchtree.ingredients[dictReader[b][0]] !== undefined) {
          filteredResults.splice(0, filteredResults.length);
          filteredResults = searchtree.ingredients[dictReader[b][0]];
        }
        if (searchtree.appliances[dictReader[b][0]] !== undefined) {
          filteredResults.splice(0, filteredResults.length);
          filteredResults = searchtree.appliances[dictReader[b][0]];
        }
        if (searchtree.utensils[dictReader[b][0]] !== undefined) {
          filteredResults.splice(0, filteredResults.length);
          filteredResults = searchtree.utensils[dictReader[b][0]];
        }
        if (searchtree.recipeNames[dictReader[b][0]] !== undefined) {
          filteredResults.splice(0, filteredResults.length);
          filteredResults = searchtree.recipeNames[dictReader[b][0]];
        }
      }
    }
  }
  //console.log(filteredResults);
  return filteredResults;
}

function createRenderQueue(searchResults) {
  let storageArray = [];
  for (var e = 0, len = searchResults.length; e < len; e++) {
    if (len === 1) {
      if (
        searchResults[0].recipeReferences === undefined &&
        searchResults.length === 1
      ) {
        storageArray = searchResults;
      } else if (searchResults[0].recipeReferences.length > 1) {
        storageArray = searchResults[0].recipeReferences;
      } else {
        storageArray.push(searchResults[0].recipeReferences);
      }
    } else {
      if (searchResults[e].recipeReferences !== undefined) {
        storageArray.push(searchResults[e].recipeReferences[0]);
      } else {
        storageArray.push(searchResults);
      }
    }
  }
  let referenceArray = [].concat.apply([], storageArray);
  console.log(referenceArray);
  let uniqueReferences = [...new Set(referenceArray)];
  let concatReferences = [].concat.apply([], uniqueReferences);
  console.log("unique references are: ");
  console.log(concatReferences);
  results.toRender.splice(0, results.toRender.length);
  results.toRender = concatReferences;
}

function createDomRecipeCard(recipeIndex) {
  let cardRecipe = recipes[recipeIndex];

  let mainChildNode = document.createElement("div");
  mainChildNode.className = "col-4";
  recipeContainer.appendChild(mainChildNode);

  let card = document.createElement("div");
  card.className = "card recipe-card";
  mainChildNode.appendChild(card);

  let cardImage = document.createElement("img");
  cardImage.className = "card-img-top img-fluid";
  cardImage.src = "https://source.unsplash.com/-YHSwy6uqvk";
  card.appendChild(cardImage);

  let cardBody = document.createElement("div");
  cardBody.className = "card-body";
  card.appendChild(cardBody);

  let topRow = document.createElement("div");
  topRow.className = "row";
  cardBody.appendChild(topRow);

  let titleCol = document.createElement("div");
  titleCol.className = "col w-75";
  topRow.appendChild(titleCol);

  let cardTitle = document.createElement("h3");
  cardTitle.className = "card-title mt-3 ml-3";
  cardTitle.textContent = cardRecipe.name;
  titleCol.appendChild(cardTitle);

  let timeCol = document.createElement("div");
  timeCol.className = "col w-25 mt-4 text-right";
  topRow.appendChild(timeCol);

  let cookingTime = document.createElement("h5");
  let clockIcon = document.createElement("i");
  let innerHTMLString =
    "<b><i class='far fa-clock mr-2 fa-lg '></i>" +
    cardRecipe.time +
    " min</b>";
  cookingTime.className = "text-end";
  clockIcon.className = "far fa-clock mr-2 fa-lg";

  timeCol.appendChild(cookingTime);
  cookingTime.innerHTML = innerHTMLString;
  //cookingTime.appendChild(clockIcon);
  //cookingTime.textContent = cardRecipe.time + " min";

  let bottomRow = document.createElement("div");
  bottomRow.className = "row";
  cardBody.appendChild(bottomRow);

  let ingredientCol = document.createElement("div");
  ingredientCol.className = "col w-50 mt-4";
  bottomRow.appendChild(ingredientCol);

  let ingredientList = document.createElement("ul");
  ingredientList.className = "list-group ingredient-list";
  ingredientCol.appendChild(ingredientList);

  for (var i = 0, len = cardRecipe.ingredients.length; i < len; i++) {
    let listedIngredient = document.createElement("li");
    let itemConstructor = "";
    if (cardRecipe.ingredients[i].quantity !== undefined) {
      itemConstructor = " " + cardRecipe.ingredients[i].quantity;
    }
    if (cardRecipe.ingredients[i].unit !== undefined) {
      itemConstructor = itemConstructor + " " + cardRecipe.ingredients[i].unit;
    }
    listedIngredient.className = "list-group-item ingredient lh-1";
    listedIngredient.innerHTML =
      "<b>" +
      cardRecipe.ingredients[i].ingredient +
      ":" +
      "</b>" +
      itemConstructor;
    ingredientList.appendChild(listedIngredient);
  }

  let textCol = document.createElement("div");
  textCol.className = "col w-50 mt-4";
  bottomRow.appendChild(textCol);

  let recipeText = document.createElement("p");
  recipeText.className = "card-text recipe-text";
  recipeText.textContent = cardRecipe.description;
  textCol.appendChild(recipeText);
}

function renderArray(indexArray) {
  while (recipeContainer.lastElementChild) {
    recipeContainer.removeChild(recipeContainer.lastElementChild);
  }
  for (var i = 0, len = indexArray.length; i < len; i++) {
    createDomRecipeCard(indexArray[i]);
  }
}

async function readJsonRecipes() {
  const parsedData = await fetch("/files/recipes.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((json) => {
      //transfer json data into recipes array
      let carrier = json;

      //push recipes to array starting with [1] instead of [0], this way the original recipe id equals the index nummer
      recipes.push("index0");

      for (var i = 0, len = carrier.recipes.length; i < len; i++) {
        recipes.push(carrier.recipes[i]);
      }
    })
    .catch(function () {
      this.dataError = true;
    });
}

// Main host process below, builds searchtree object after json is fetched

async function main() {
  await readJsonRecipes();

  /* some console logs for testing and debugging -- comment for stable builds */
  growSearchtree(recipes);
  //console.log("Searchtree Object is : ");
  //console.log(searchtree);
  //console.log("recipes object is: ");
  //console.log(recipes);
  //let readingArray = [];
  //let readingArray = Object.entries(searchtree.ingredients);
  //console.log(Object.entries(searchtree));
  //console.log(readingArray[0][0]);
  //let searchtarget = readingArray[0][0];
  //let searchkeys = searchtarget.split("_");
  //console.log(searchkeys);
  /* End of main data display to console */

  growSeeds(searchtree);
  console.log(searchtree);
  populateDropdownMenu("ingredient-dropdown-menu", "ingredients");
  
  //let testVector = new searchVector("coco");
  //console.log(testVector);
  //console.log(lookUp(testVector));
}

main();

function targetInformation(){
  this.indezes = [];
  this.originalName = "";
}

// builds the main dictionary/searchtree for search requests. calls inner and outer functions
// takes in the recipes array object to extract searchable strings and push them to a structured dictionary
function growSearchtree(cookbook) {
  // extracts ingredient strings and pushes them as well as their origin recipe id to searchtree/ingredients
  // cookbook is the recipes object, dictionary is the searchtree (target), x is the index/id of the the recipe worked on
  function extractIngredients(cookbook, dictionary, x) {
    //check for undefined / if there are ingredients
    if (cookbook[x].ingredients !== undefined) {
      // run through all ingredients of the recipe, read the name as string (a searchable target) and filter that
      for (var e = 0, len = cookbook[x].ingredients.length; e < len; e++) {
        let ingredientKey = "";

        ingredientKey = filterToLowerCase(
          cookbook[x].ingredients[e].ingredient
        );
        //we are building a dictionary, so the ingredient name is the key, the values are the id's of the recipes the ingredient appears in
        //if the key doesn't exist already create it, else just push the recipe the the values array
        if (dictionary.ingredients[ingredientKey] === undefined) {
          dictionary.ingredients[ingredientKey] = [];
          dictionary.ingredients[ingredientKey].push(x);
        } else {
          dictionary.ingredients[ingredientKey].push(x);
        }
      }
    }
  }
  //same logic, but targeting a different data structure and content in this case Appliances
  function extractAppliances(cookbook, dictionary, x) {
    if (cookbook[x].appliance !== undefined) {
      for (var e = 0, len = 1; e < len; e++) {
        let applianceKey = "";

        if (cookbook[x].appliance) {
          applianceKey = filterToLowerCase(cookbook[x].appliance);
        } else {
          applianceKey = filterToLowerCase(cookbook[x].appliance);
        }

        if (dictionary.appliances[applianceKey] === undefined) {
          dictionary.appliances[applianceKey] = [];
          dictionary.appliances[applianceKey].push(x);
        } else {
          dictionary.appliances[applianceKey].push(x);
        }
      }
    }
  }
  //same logic, but targeting a different data structure and content in this case Utensils
  function extractUtensils(cookbook, dictionary, x) {
    if (cookbook[x].utensils !== undefined) {
      for (var e = 0, len = cookbook[x].utensils.length; e < len; e++) {
        let utensilKey = "";

        utensilKey = filterToLowerCase(cookbook[x].utensils[e]);

        if (dictionary.utensils[utensilKey] === undefined) {
          dictionary.utensils[utensilKey] = [];
          dictionary.utensils[utensilKey].push(x);
        } else {
          dictionary.utensils[utensilKey].push(x);
        }
      }
    }
  }
  function extractNames(cookbook, dictionary, x) {
    if (cookbook[x].name !== undefined) {
      for (var e = 0, len = 1; e < len; e++) {
        let nameKey = "";

        if (cookbook[x].name) {
          nameKey = filterToLowerCase(cookbook[x].name);
        } else {
          nameKey = filterToLowerCase(cookbook[x].name);
        }

        if (dictionary.recipeNames[nameKey] === undefined) {
          dictionary.recipeNames[nameKey] = [];
          dictionary.recipeNames[nameKey].push(x);
        } else {
          dictionary.recipeNames[nameKey].push(x);
        }
      }
    }
  }
  //run all three variations to build the searchtree dictionary from the cookbook (recipes) object
  for (var i = 1, len = cookbook.length; i < len; i++) {
    extractIngredients(cookbook, searchtree, i);
    extractAppliances(cookbook, searchtree, i);
    extractUtensils(cookbook, searchtree, i);
    extractNames(cookbook, searchtree, i);
  }
}

//takes strings(full searchtargets, e.g. "coconut milk") as an input and returns individual words
function extractSearchKeys(searchtarget) {
  //split at spaces
  let carrier = searchtarget.split(" ");
  let searchKeys = [];

  //push initial unsplitted word to index 0 of array for later reference
  searchKeys.push(searchtarget);

  //if the splitting isn't complete run it again
  for (var i = 0, len = carrier.length; i < len; i++) {
    searchKeys.push(carrier[i].split("_"));
  }

  //flatten in case a nested array is created that way
  let flatSearchKeys = [].concat.apply([], searchKeys);
  return flatSearchKeys;
}
// adds a layer of short string keys(searchKeys) to the searchtree object through which the data can be accessed
// extract all individual searchable strings from the searchtree dictionary, further break them into the combination of three characters (shortkeys)(search starts after user entered 3 letters)
// fill searchkeys sub dictionary with these shortkeys, store reference (key/index) to original key or recipe
async function growSeeds(dictionary) {
  function insertShortKey(dictionary, key) {
    if (dictionary.searchKeys[key.shortKey] === undefined) {
      dictionary.searchKeys[key.shortKey] = key;
    } else {
      dictionary.searchKeys[key.shortKey].references.push(key.references[0]);
    }
  }

  function insertShortKeyArray(dictionary, keyArray) {
    for (var i = 0, len = keyArray.length; i < len; i++) {
      insertShortKey(dictionary, keyArray[i]);
    }
  }

  function createShortKeyArray(longKeyArray, originDict, originDictKey) {
    let shortKeyArray = [];
    //console.log("Longkey Index 0 is " + longKeyArray[0]);
    //start at 1 to jump over unsplit key
    for (var i = 1, len = longKeyArray.length; i < len; i++) {
      shortKeyArray.push(
        createShortKey(
          longKeyArray[i],
          originDict,
          longKeyArray[0],
          originDictKey
        )
      );
    }
    //console.log("ShortKeyArray is: ");
    //console.log(shortKeyArray);
    //console.log("longkeyArray is:");
    //console.log(longKeyArray);
    return shortKeyArray;
  }

  //takes in a single word, origindictionary and originkey and creates a searchKey + reference Object out of it
  function createShortKey(longKey, originDict, originKey, originDictKey) {
    let shortKey = longKey.substring(0, 3);
    let key = new searchKey();
    key.shortKey = shortKey;
    key.references = [];
    let keyReference = new reference();
    keyReference.searchTarget = originKey;
    keyReference.word = longKey;
    keyReference.type = originDictKey;
    keyReference.recipeReferences = [];
    keyReference.recipeReferences.push(originDict[originKey]);
    key.references.push(keyReference);

    return key;
  }

  //takes a subdictionary (e.g. ingredients) of the searchtree and divides the keys further down into words and the first 3 letters (shortkeys) of each
  //pushes all shortkeys to the searchKeys subdictionary of searchtree, single entry for each key, if multiple appearences store into searchKeys.orgin
  function processSearchtargets(subDictionaryKey) {
    let subDictionary = dictionary[subDictionaryKey];

    //read the key names of the subdictionary into an array
    let subReader = Object.entries(dictionary[subDictionaryKey]);

    // run trough all entries and extract the individual words as well as there 3 char primitives to store them in the searchKeys dict
    for (var i = 0, len = subReader.length; i < len; i++) {
      let currentSearchtarget = subReader[i][0];
      //first isolate the individual words (if there is more then one)
      let extractedSearchKeys = extractSearchKeys(currentSearchtarget);

      //then isolate the shortKeys
      let keysToStore = createShortKeyArray(
        extractedSearchKeys,
        subDictionary,
        subDictionaryKey
      );
      //and finally integrate them into the searchtree.searchKeys subdict
      insertShortKeyArray(searchtree, keysToStore);
    }
  }

  processSearchtargets("ingredients");
  processSearchtargets("appliances");
  processSearchtargets("utensils");
  processSearchtargets("recipeNames");
  //console.log("Final searchtree is: ");
  //console.log(searchtree);
}

// replaces all certain special characters and space to make data uniform

function filterToLowerCase(string) {
  let polished = string
    .replace(/['"]+/g, "")
    .toLowerCase()
    .replace("-", "_")

    .replace("î", "i")
    .replace("è", "e")
    .replace(" ", "_");
  return polished;
}

function countArrayElements(arr) {
  var len = 0;

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== undefined) {
      len++;
    }
    //console.log(arr[i]);
  }
  return len;
}
