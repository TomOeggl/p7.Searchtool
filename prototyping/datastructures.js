var recipe = {
    id = 0,
    name : "",
    servings = 0,
    ingredients = [],
    time = 0,
    description: "",
    appliance: "",
    utensils: [],
}

var ingredient = {
    name: "",
    quantity: 0,
    unit: "",
}

var searchtarget = {
    name: "",
    searchkeys: [],
    type: "",
    matches(searchvector) = compare(searchvector); //to searchkeys and type
    appearsIn = return recipes[],
    indexByInitial = -1,
}

var searchkey = {
    key: "xxx",
    cutFrom = [], //searchtargets - object references
    appearsIn = return recipes [], //object references
    indexByInitial = -1,
    appendKeys = //append newly typed letters to the searchkey
}

var searchvector = {
    keys = [],
    types = [],
}

var searchtree ={
    type: ParentContainer [],
    indexByInitial: ParentContainer [],
    searchkeys: [],
    searchtargets: []


}
var #recipes = {
    indexById = [], //Array of Recipes stored by their ID as indexkey
}

var renderQueue = {
    toRender = [], //Array of Id's (recipes) to render on the next call
}

var currentDom = {
    currentRecipes = [], //Currently rendered Recipes (Searchresults) with their references
}
