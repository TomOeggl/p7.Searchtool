//create the main constants and Object prototypes
const recipes = [];
const renderQueue = [];
const searchBar = document.getElementById("searchbar");
const inputByIngredient = document.getElementById("ingredient-input-textfield");
const inputByAppliance = document.getElementById("appliance-input-textfield");
const inputByUtensil = document.getElementById("utensil-input-textfield");
const dropdownButtonIngredient = document.getElementById(
  "ingredient-dropdown-button"
);
const dropdownButtonAppliance = document.getElementById(
  "appliance-dropdown-button"
);

const dropdownButtonUtensil = document.getElementById(
  "utensil-dropdown-button"
);
const recipeContainer = document.getElementById("recipe-container");
//const filteredArray = array1.filter(value => array2.includes(value));

const searchtree = {
  ingredients: [], // ingredientName: Appearances(Recipe Indezes)
  appliances: [], // applianceName: Appearances(Recipe Indezes)
  utensils: [], // utensilName: Appearances(Recipe Indezes)
  recipeNames: [],
  searchKeys: [],
};

async function main() {
  await readJsonRecipes();

  growSearchtree(recipes);

  growSeeds(searchtree);
  console.log("Search dictionary created sucessfully: ");
  console.log(searchtree);
  populateDropdownMenu("ingredient-dropdown-menu", "ingredients");
  populateDropdownMenu("appliance-dropdown-menu", "appliances");
  populateDropdownMenu("utensil-dropdown-menu", "utensils");
  console.log(recipes);
  let crawler = new searchCrawler("mas", "ingredients", true);
  //crawler.sumUp();
  //console.log(crawler.loot);
  console.log(crawler.results());
  renderArray(crawler.results());
  //console.log(lookUpTargets(new searchVector("coc", undefined, false)));
  //let newTrace = new trace("oven", recipes);
  //console.log(findString(newTrace));
  //console.log(compareString("Kikon", "kiko"));
}

main();



function reference() {
  searchTarget = "";
  word = ""; // = longKey
  type = "";
  recipeReferences = [];
  originalString = "";
}

function targetInformation() {
  this.indezes = [];
  this.originalName = "";
}

function dropdownItem(name, type, originalName) {
  this.domElement = document.createElement("button");
  this.domElement.className = "dropdown-item custom-dropdown-item";
  switch (type) {
    case "ingredients": {
      this.domElement.classList.add("bg-ingredients");
      break;
    }
    case "appliances": {
      this.domElement.classList.add("bg-appliance");
      break;
    }
    case "utensils": {
      this.domElement.classList.add("bg-utensil");
      break;
    }
  }
  this.domElement.textContent = originalName;
  this.domElement.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Creating searchCrawler from dropdownItem");
    let buttonCrawler = new searchCrawler(
      this.domElement.textContent,
      type,
      true
    );
  });
}

function searchTag(name, type) {
  switch (type) {
    case "ingredient": {
      type = "ingredients";
      break;
    }
    case "appliance": {
      type = "appliances";
      break;
    }
  }
  this.domElement = document.createElement("p");
  this.domElement.className = "search-tag mx-3";
  this.domButton = document.createElement("button");
  this.domButton.className = "search-tag__button";
  let reader;
  switch (type) {
    case undefined: {
      this.domElement.classList.add("tag-neutral");
      this.domButton.classList.add("search-tag__button--inverted");
      console.log("inverted");
    }
    case "ingredients": {
      this.domElement.classList.add("bg-ingredient");
      break;
    }
    case "appliances": {
      this.domElement.classList.add("bg-appliance");
      break;
    }

    case "utensils": {
      this.domElement.classList.add("bg-utensil");
      break;
    }
  } /*
  if (type !== undefined) {
    reader = searchtree[type][name];
  }
  //console.log(reader.originalName);
  if (reader !== undefined) {
    this.domElement.textContent = reader.originalName;
  } else {
    this.domElement.textContent = name;
  }
*/
  this.domElement.textContent = name;
  let hostNode = document.getElementById("tag-container");

  this.domElement.appendChild(this.domButton);

  this.domButton.innerHTML = "<i class='far fa-lg fa-times-circle'></i>";
  this.domButton.type = "button";
  this.domButton.addEventListener("click", (event) => {
    hostNode.removeChild(this.domElement);
    renderQueue.splice(renderQueue.indexOf(this), 1);
    renderArray(intersectResults());
    //console.log(renderQueue);
    delete this;
  });
  this.appendToDom = function () {
    //console.log(hostNode);
    //console.log(this.domElement);
    hostNode.append(this.domElement);
    renderQueue.push(this);

    console.log(renderQueue);
    renderArray(intersectResults());
  };
  this.parentCrawler;
  this.log = function () {
    console.log("Searchtag created:");
    console.log(this);
  };
}

//saves search results
function loot(originalString) {
  this.originalString = originalString;
  this.referenceByLocation = [];
  this.entriesByLocation = [];
  this.allReferences = Array(recipes.length + 1);
  this.allReferences.fill(false, 0);
}

//hosts general search functionality, coordinates child objects, gathers results
function searchCrawler(string, type, publishTag) {
  //filter typos
  switch (type) {
    case "ingredients": {
      type = "ingredient";
      break;
    }
    case "appliances": {
      type = "appliance";
      break;
    }
    case "utensil": {
      type = "utensils";
      break;
    }
  }

  this.loot = new loot(string);
  this.type = type;
  this.trace = new trace(string, recipes, this.loot);
  this.sumUp = function () {
    if (this.type !== undefined) {
      //console.log(this.loot);
      //console.log(renderQueue);
      //console.log(this.loot.referenceByLocation[type]);
      this.loot.referenceByLocation[type].forEach((element) => {
        this.loot.allReferences[element] = true;
      });
    } else {
      //console.log("entered second branch");
      console.log(this.loot.referenceByLocation);
      for (const [key, value] of Object.entries(
        this.loot.referenceByLocation
      )) {
        this.loot.referenceByLocation[key].forEach((element) => {
          this.loot.allReferences[element] = true;
        });
      }
      this.loot.referenceByLocation.forEach((element) => {
        console.log(element);
      });
      this.loot.referenceByLocation.map(function (element) {
        console.log(element);
        element.map(function (subelement) {
          console.log(subelement);
          this.loot.allReferences[subelement] = true;
        });
      });
    }
  };
  //check if string is composed of more the one word, if so call recursive instances
  let splitString = string.split(" ");

  if (splitString.length > 1) {
    console.log(splitString);
    console.log("string split");
    let subresults = [];
    splitString.forEach((element) => {
      let splitCrawler = new searchCrawler(element, type, false);
      subresults.push(splitCrawler);
    });
    let mergeObject = intersectResults(subresults);
    //this.loot.allReferences = mergeObject.allReferences;
    this.loot.referenceByLocation.appliance = mergeObject.appliance;
    this.loot.referenceByLocation.ingredient = mergeObject.ingredient;
    this.loot.referenceByLocation.utensils = mergeObject.utensils;
    this.sumUp();
    console.log("Merging loot objects: ");
    console.log(mergeObject);
    console.log(" Global Loot object is: ");

    console.log(this.loot);
  }

  findString(this.trace);

  this.results = function () {
    this.sumUp();

    let results = [];
    for (var i = 0, len = this.loot.allReferences.length; i < len; i++) {
      if (this.loot.allReferences[i]) {
        results.push(i);
      }
    }
    return results;
  };

  this.entryResults = function () {
    if (type !== undefined) {
      switch (type) {
        case "ingredients": {
          type = "ingredient";
          break;
        }
        case "appliances": {
          type = "appliance";
          break;
        }
        case "utensil": {
          type = "utensils";
          break;
        }
      }
      return this.loot.entriesByLocation[type];
    } else {
      return this.loot.entriesByLocation;
    }
  };

  if (publishTag) {
    this.tag = new searchTag(string, type);
    this.tag.parentCrawler = this;
    this.tag.appendToDom();
    console.log(this.loot);
    console.log(this.entryResults());

    //this.tag.log();
    //renderArray(intersectResults());
  }
}
const origin = [];

//helps navigation array to give back correct reference
function trace(string, target, loot) {
  this.string = string;
  this.target = target;
  this.callbackKey = "";
  this.root;
  this.loot = loot;
}

//recursive function crawling through recipe array
function findString(traceObject) {
  let trace = traceObject;
  //console.log(trace);
  if (trace.callbackKey === "id") {
    origin.push(trace.target);
    trace.root = origin[trace.target - 1];
  }
  switch (typeof trace.target) {
    case "string": {
      let splitString = trace.target.split(" ");
      splitString.map(function (element) {
        let key = trace.callbackKey;
        let value = trace.target;
        //console.log(trace);
        compareAndCreateEntry(trace);
        if (compareString(trace.string, element)) {
          //trace.loot.referenceByLocation.push(trace.callbackKey, trace.root);
          //console.log(trace.loot.referenceByLocation);
          if (trace.loot.referenceByLocation[key] === undefined) {
            trace.loot.referenceByLocation[key] = [];
            trace.loot.referenceByLocation[key].push(trace.root);
            //trace.loot.referenceByLocation[key].push(trace.target);
          } else {
            trace.loot.referenceByLocation[key].push(trace.root);
            //trace.loot.referenceByLocation[key].push(trace.target);
          }
        }
      });

      break;
    }
    case "object": {
      //console.log(trace);
      if (Array.isArray(trace.target)) {
        //console.log(trace.target);
        trace.callbackKey = "utensils";
        trace.target.forEach((element) => {
          trace.target = element;
          findString(trace);
          //console.log("trace target from element: " + trace.target);
          //console.log(element);
        });
      } else {
        for (const [key, value] of Object.entries(trace.target)) {
          if (value && typeof value === "object") {
            trace.target = value;
            findString(trace);
            compareAndCreateEntry(key, value);
            //fill entriesByLocation
          } else {
            trace.target = value;
            trace.callbackKey = key;
            findString(trace);
            //console.log("trace key is: " + key + " trace target is + " + value);
            //console.log(key[1]);

            compareAndCreateEntry(trace);
          }
        }
        return false;
      }
    }
    case "number": {
      //console.log(trace);
      break;
    }

    case "undefined": {
      break;
    }
    default: {
      console.log(trace);
      console.log("default");
    }
  }

  function compareAndCreateEntry(trace) {
    let key = trace.callbackKey;
    let value = trace.target;
    //console.log(trace);

    if (value !== "index0") {
      if (key == "ingredient" || key == "appliance" || key === "utensils") {
        if (compareString(trace.string, value)) {
          if (trace.loot.entriesByLocation[key] === undefined) {
            trace.loot.entriesByLocation[key] = [];

            trace.loot.entriesByLocation[key].push(value);
          } else {
            if (
              trace.loot.entriesByLocation[key].some(
                (x) => filterToLowerCase(x) === filterToLowerCase(value)
              ) === false
            ) {
              trace.loot.entriesByLocation[key].push(value);
            }
          }
        }
        //console.log(key, value);
      }
    }
  }
}

function compareString(string, target) {
  let stringLength = string.length;
  let processedTarget = target;
  let success = false;
  if (target.length < string.length) {
    return success;
  } else if (target.length > string.length) {
    processedTarget = target.substring(0, stringLength);
  }
  if (filterToLowerCase(string) === filterToLowerCase(processedTarget)) {
    success = true;
    return success;
  } else {
    return success;
  }
}

// intersects results of all previous (still active) search inputs
function intersectResults(crawlerArray) {
  if (crawlerArray === undefined) {
    if (renderQueue.length > 1) {
      //console.log("Intersecting results: ");
      //console.log(renderQueue);
      let intersectedArray = [];
      //let array0 = lookUp(renderQueue[0].parentVector);
      let array0 = renderQueue[0].parentCrawler.results();
      //console.log(array0);
      for (var i = 1, len = renderQueue.length; i < len; i++) {
        let arrayLooped = renderQueue[i].parentCrawler.results();
        intersectedArray = array0.filter((value) =>
          arrayLooped.includes(value)
        );
        //console.log(intersectedArray);
        array0 = intersectedArray;
      }
      //console.log(intersectedArray);
      return intersectedArray;
    } else if (renderQueue.length === 1) {
      //console.log(renderQueue);
      return renderQueue[0].parentCrawler.results();
    } else {
      return [48];
    }
  } else {
    if (crawlerArray.length > 1) {
      //console.log("Intersecting results from crawlerArray: ");
      //console.log(crawlerArray);
      let intersectedArray = [];
      //let array0 = lookUp(crawlerArray[0].parentVector);
      let array0 = crawlerArray[0].results();
      //console.log(array0);
      for (var i = 1, len = crawlerArray.length; i < len; i++) {
        let arrayLooped = crawlerArray[i].results();
        intersectedArray = array0.filter((value) =>
          arrayLooped.includes(value)
        );
        //console.log(intersectedArray);
        array0 = intersectedArray;
      }

      let intersectedReferences = [];

      function subsect(type) {
        let intersectedArray = [];
        console.log(crawlerArray[0].loot.referenceByLocation[type]);
        //let array0 = lookUp(crawlerArray[0].parentVector);
        let array0 = [];
        if (crawlerArray[0].loot.referenceByLocation[type] !== undefined) {
          array0 = crawlerArray[0].loot.referenceByLocation[type];
        }
        console.log(array0);
        for (var i = 1, len = crawlerArray.length; i < len; i++) {
          let arrayLooped = [];
          if (crawlerArray[i].loot.referenceByLocation[type] !== undefined) {
            arrayLooped = crawlerArray[i].loot.referenceByLocation[type];
          }
          intersectedArray = array0.filter((value) =>
            arrayLooped.includes(value)
          );
          console.log(intersectedArray);
          array0 = intersectedArray;
        }
        intersectedReferences[type] = intersectedArray;
      }

      subsect("ingredient");
      subsect("appliance");
      subsect("utensils");
      intersectedReferences["allReferences"] = intersectedArray;
      console.log(intersectedReferences);
      return intersectedReferences;
    } else {
      return [48];
    }
  }
}

const results = {
  toCompare: [],
  toRender: [],
};



//...EVENTLISTENERS...
{
  searchBar.addEventListener("submit", function (event) {
    event.preventDefault();
    var searchInput = document.getElementById("search-input");
    console.log(searchInput.value);
    /*let searchVectorFromInput = new searchVector(
      searchInput.value,
      undefined,
      true
    );
    console.log("Search Results are: ");
    console.log(intersectResults(searchVectorFromInput));
    createRenderQueue(intersectResults(searchVectorFromInput));
    console.log("Rendering to DOM");

    renderArray(results.toRender);*/
    let searchCrawlerFromInput = new searchCrawler(
      searchInput.value,
      undefined,
      true
    );
    //renderArray(searchCrawlerFromInput.results());
  });

  inputByIngredient.addEventListener("keydown", function (event) {
    let keyModifier;
    switch (event.key) {
      case "Backspace": {
        keyModifier = "";
        break;
      }
      case "Space": {
        keyModifier = "";
        break;
      }
      case "Enter": {
        keyModifier = "";
        break;
      }
      default: {
        keyModifier = event.key;
      }
    }
    console.log(event.code);
    let textInput = event.target.value + keyModifier;
    console.log(textInput);
    if (event.code !== "Enter") {
      let dropdownMenuIngredient = document.getElementById(
        "ingredient-dropdown-menu"
      );
      if (textInput.length > 2) {
        let searchCrawlerFromKeydown = new searchCrawler(
          textInput,
          "ingredients"
        );
        console.log(searchCrawlerFromKeydown);
        populateDropdownMenu(
          "ingredient-dropdown-menu",
          "ingredients",
          searchCrawlerFromKeydown.entryResults()
        );

        if (dropdownMenuIngredient.classList.contains("show") === false) {
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

      let searchCrawlerFromInput = new searchCrawler(
        textInput,
        "ingredients",
        true
      );
      console.log("Search Results are: ");
      console.log(
        searchCrawlerFromInput.loot.referenceByLocation["ingredient"]
      );
    }
  });

  inputByAppliance.addEventListener("keydown", function (event) {
    let keyModifier;
    switch (event.key) {
      case "Backspace": {
        keyModifier = "";
        break;
      }
      case "Space": {
        keyModifier = "";
        break;
      }
      case "Enter": {
        keyModifier = "";
        break;
      }
      default: {
        keyModifier = event.key;
      }
    }

    let textInput = event.target.value + keyModifier;

    if (event.code !== "Enter") {
      let dropdownMenuAppliance = document.getElementById(
        "appliance-dropdown-menu"
      );
      if (textInput.length > 2) {
        let searchCrawlerFromKeydown = new searchCrawler(
          textInput,
          "appliances"
        );
        console.log(searchCrawlerFromKeydown);
        populateDropdownMenu(
          "appliance-dropdown-menu",
          "appliances",
          searchCrawlerFromKeydown.entryResults()
        );

        if (dropdownMenuAppliance.classList.contains("show") === false) {
          document
            .getElementById("appliance-dropdown-menu")
            .classList.add("show");
          document.getElementById("appliance-dropdown-menu").style.marginLeft =
            "0rem";
          document.getElementById("appliance-dropdown-menu").style.width =
            "20rem";
        }
      }
    }
    if (event.code == "Enter") {
      //event.preventDefault();
      //var searchInput = document.getElementById("search-input");

      let searchCrawlerFromInput = new searchCrawler(
        textInput,
        "appliances",
        true
      );
      console.log("Search Results are: ");
      console.log(searchCrawlerFromInput.loot.referenceByLocation["appliance"]);
    }
  });

  inputByUtensil.addEventListener("keydown", function (event) {
    let keyModifier;
    switch (event.key) {
      case "Backspace": {
        keyModifier = "";
        break;
      }
      case "Space": {
        keyModifier = "";
        break;
      }
      case "Enter": {
        keyModifier = "";
        break;
      }
      default: {
        keyModifier = event.key;
      }
    }

    let textInput = event.target.value + keyModifier;

    if (event.code !== "Enter") {
      let dropdownMenuUtensil = document.getElementById(
        "utensil-dropdown-menu"
      );
      if (textInput.length > 2) {
        let searchCrawlerFromKeydown = new searchCrawler(textInput, "utensils");
        console.log(searchCrawlerFromKeydown);
        populateDropdownMenu(
          "utensil-dropdown-menu",
          "utensils",
          searchCrawlerFromKeydown.entryResults()
        );

        if (dropdownMenuUtensil.classList.contains("show") === false) {
          document
            .getElementById("utensil-dropdown-menu")
            .classList.add("show");
          document.getElementById("utensil-dropdown-menu").style.marginLeft =
            "0rem";
          document.getElementById("utensil-dropdown-menu").style.width =
            "20rem";
        }
      }
    }
    if (event.code == "Enter") {
      //event.preventDefault();
      //var searchInput = document.getElementById("search-input");

      let searchCrawlerFromInput = new searchCrawler(
        textInput,
        "utensils",
        true
      );
      console.log(searchCrawlerFromInput);
      console.log("Search Results are: ");
      console.log(searchCrawlerFromInput.loot.referenceByLocation["utensils"]);
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
        "-37.1rem";
      document
        .getElementById("ingredient-dropdown-menu")
        .classList.remove("show");
      while (
        document.getElementById("ingredient-dropdown-menu").lastElementChild
      ) {
        document
          .getElementById("ingredient-dropdown-menu")
          .removeChild(
            document.getElementById("ingredient-dropdown-menu").lastElementChild
          );
      }
      populateDropdownMenu("ingredient-dropdown-menu", "ingredients");
    }
    if (
      event.target.id === "appliance-input-textfield" ||
      event.target.classList.contains("appliance-dropdown-item") !== false
    ) {
    } else {
      document.getElementById("appliance-dropdown-menu").style.width = "40rem";
      document.getElementById("appliance-dropdown-menu").style.marginLeft =
        "-37.1rem";
      document
        .getElementById("appliance-dropdown-menu")
        .classList.remove("show");
      while (
        document.getElementById("appliance-dropdown-menu").lastElementChild
      ) {
        document
          .getElementById("appliance-dropdown-menu")
          .removeChild(
            document.getElementById("appliance-dropdown-menu").lastElementChild
          );
      }
      populateDropdownMenu("appliance-dropdown-menu", "appliances");
    }
    if (
      event.target.id === "utensil-input-textfield" ||
      event.target.classList.contains("utensil-dropdown-item") !== false
    ) {
    } else {
      document.getElementById("utensil-dropdown-menu").style.width = "40rem";
      document.getElementById("utensil-dropdown-menu").style.marginLeft =
        "-37.1rem";
      document.getElementById("utensil-dropdown-menu").classList.remove("show");
      while (
        document.getElementById("utensil-dropdown-menu").lastElementChild
      ) {
        document
          .getElementById("utensil-dropdown-menu")
          .removeChild(
            document.getElementById("utensil-dropdown-menu").lastElementChild
          );
      }
      populateDropdownMenu("utensil-dropdown-menu", "utensils");
    }
  });

  dropdownButtonIngredient.addEventListener("show.bs.dropdown", (event) => {
    let ingredientInputGroup = document.getElementById(
      "ingredient-input-group"
    );
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

  dropdownButtonAppliance.addEventListener("show.bs.dropdown", (event) => {
    let ingredientInputGroup = document.getElementById("appliance-input-group");
    ingredientInputGroup.style.width = "40rem";
  });
  document
    .getElementById("appliance-input-group")
    .addEventListener("hide.bs.dropdown", (event) => {
      let ingredientInputGroup = document.getElementById(
        "appliance-input-group"
      );
      ingredientInputGroup.style.width = "20rem";
      ingredientInputGroup.classList.remove("show");
    });

  dropdownButtonUtensil.addEventListener("show.bs.dropdown", (event) => {
    let utensilInputGroup = document.getElementById("utensil-input-group");
    utensilInputGroup.style.width = "40rem";
  });
  document
    .getElementById("utensil-input-group")
    .addEventListener("hide.bs.dropdown", (event) => {
      let utensilInputGroup = document.getElementById("utensil-input-group");
      utensilInputGroup.style.width = "20rem";
      utensilInputGroup.classList.remove("show");
    });
}
function populateDropdownMenu(targetMenu, type, results) {
  let dropdownMenu = document.getElementById(targetMenu);

  let targetNode;
  let newRow;

  if (results === undefined) {
    switch (type) {
      case "ingredients": {
        type = "ingredient";
        break;
      }
      case "appliances": {
        type = "appliance";
        break;
      }
      case "utensil": {
        type = "utensils";
        break;
      }
    }
    let emptyCrawler = new searchCrawler("", type, false);
    let entriesByType = emptyCrawler.entryResults();
    //console.log(entriesByType);
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
      if (entriesByType[e] !== undefined) {
        let dropItem = new dropdownItem(
          entriesByType[e],
          type,
          entriesByType[e]
        );

        targetNode.append(dropItem.domElement);
      }
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
      let dropItem = new dropdownItem(results[e], type, results[e]);
      console.log(dropItem);
      targetNode.append(dropItem.domElement);
      dropItem.domElement.style.marginLeft = "1rem";
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
  //console.log(referenceArray);
  let uniqueReferences = [...new Set(referenceArray)];
  let concatReferences = [].concat.apply([], uniqueReferences);
  //console.log("unique references are: ");
  //console.log(concatReferences);
  results.toRender.splice(0, results.toRender.length);
  results.toRender = concatReferences;
}

function createDomRecipeCard(recipeIndex) {
  if (recipeIndex !== 0) {
    let cardRecipe = recipes[recipeIndex];
    //console.log(cardRecipe);
    //console.log(recipeIndex);

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
        itemConstructor =
          itemConstructor + " " + cardRecipe.ingredients[i].unit;
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
