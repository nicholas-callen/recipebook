const express = require('express')

const app = express()

app.use(express.json())

const cors = require('cors')

app.use(cors())

const mongoose = require('mongoose')

const dotenv = require('dotenv')

dotenv.config()

const MongoClient = require('mongodb').MongoClient

const uri = process.env.MONGODB_URI

const port = process.env.PORT || 8000

app.get('/', (req, res) => {
    res.send('cookbook server');
})

// READ RECIPES

app.get('/recipes/:id', (req, res) => {
    console.log("getting " + req.params.id)
    const Recipe = mongoose.model('Recipe', recipeSchema)   
    mongoose.connect(uri)
    Recipe.findById(mongoose.Types.ObjectId(req.params.id), (err, recipe) => {
        if (err) throw(err)
        else {
            console.log(recipe)
            res.json(recipe)
        }
    })
})

app.get('/user/:username/recipes/:id', (req, res) => {
    const Recipe = mongoose.model('Recipe', recipeSchema)
    const User = mongoose.model('User', userSchema)   
    mongoose.connect(uri)
    User.findOne({'username': req.params.username}, (err, user) => {
        if (err) throw(err)
        if (user) {
            let foundrecipe
            let found = false
            for (let i = 0; i < user.customRecipes.length; i++) {
                if (user.customRecipes[i].id == req.params.id) {
                    console.log("found custom")
                    found = true
                    foundrecipe = user.customRecipes[i]
                    res.json(user.customRecipes[i])
                    // update recommendation fields
                    for (let recipecuisine of foundrecipe.cuisine) {
                        let foundcuisine = false
                        for (let i = 0; i < user.cuisines.length; i++) {
                            if (user.cuisines[i].cuisine === recipecuisine) {
                                user.cuisines[i].score++
                                foundcuisine = true
                            }
                        }
                        if (!foundcuisine) {
                            user.cuisines.push(
                                {
                                    cuisine: recipecuisine,
                                    score: 1
                                }
                            )
                        }
                    }
                    if (user.time.low >= foundrecipe.time.low) {
                        user.time.low = (user.time.low + foundrecipe.time.low) / 2
                    } else if (user.time.high <= foundrecipe.time.high) {
                        user.time.high = (user.time.high + foundrecipe.time.high) / 2
                    }
                    if (foundrecipe.skill.easy) {
                        user.skills.easy++
                    }
                    if (foundrecipe.skill.medium) {
                        user.skills.medium++
                    }
                    if (foundrecipe.skill.hard) {
                        user.skills.hard++
                    }
                    if (foundrecipe.restrictions.vegetarian) {
                        user.restrictions.vegetarian++
                    }
                    if (foundrecipe.restrictions.gluten_free) {
                        user.restrictions.gluten_free++
                    }
                    if (foundrecipe.restrictions.dairy_free) {
                        user.restrictions.dairy_free++
                    }
                    user.save()
                }
            }
            if (!found) {  
                Recipe.findById(mongoose.Types.ObjectId(req.params.id))
                .then((recipe) => {
                    found = true
                    foundrecipe = recipe
                    // update recommendation fields
                    for (let recipecuisine of foundrecipe.cuisine) {
                        let foundcuisine = false
                        for (let i = 0; i < user.cuisines.length; i++) {
                            if (user.cuisines[i].cuisine === recipecuisine) {
                                user.cuisines[i].score++
                                foundcuisine = true
                            }
                        }
                        if (!foundcuisine) {
                            user.cuisines.push(
                                {
                                    cuisine: recipecuisine,
                                    score: 1
                                }
                            )
                        }
                    }
                    if (user.time.low >= foundrecipe.time.low) {
                        user.time.low = (user.time.low + foundrecipe.time.low) / 2
                    } else if (user.time.high <= foundrecipe.time.high) {
                        user.time.high = (user.time.high + foundrecipe.time.high) / 2
                    }
                    if (foundrecipe.skill.easy) {
                        user.skills.easy++
                    }
                    if (foundrecipe.skill.medium) {
                        user.skills.medium++
                    }
                    if (foundrecipe.skill.hard) {
                        user.skills.hard++
                    }
                    if (foundrecipe.restrictions.vegetarian) {
                        user.restrictions.vegetarian++
                    }
                    if (foundrecipe.restrictions.gluten_free) {
                        user.restrictions.gluten_free++
                    }
                    if (foundrecipe.restrictions.dairy_free) {
                        user.restrictions.dairy_free++
                    }
                    user.save()
                    res.json(foundrecipe)
                })
            }
        }
    })
})

// LOGIN

app.get('/user/:username/password/:password', (req, res) => {
    if (req.params.username === "" || req.params.password === "") res.send(false)
    console.log("finding user " + req.params.username + " with password attempt " + req.params.password)
    const User = mongoose.model('User', userSchema)   
    mongoose.connect(uri)
    User.findOne({'username': req.params.username}, (err, user) => {
        if (err) throw(err)
        if (user) {
            res.send(user.password === req.params.password)
        } else {
            res.send(false)
        }
    })
})

app.get('/createuser/:username/password/:password', (req, res) => {
    console.log("creating user " + req.params.username + " with password " + req.params.password)
    const User = mongoose.model('User', userSchema)   
    mongoose.connect(uri)
    User.findOne({'username': req.params.username}, (err, user) => {
        if (err) throw(err)
        if (user) {
            res.send(false)
        } else {
            const newUser = new User({
                username: req.params.username,
                password: req.params.password,
                customRecipes: [],
                groups: [[]],
                cuisines: [],
                time: { low: 0, high: 100 },
                skills: { easy: 0, medium: 0, hard: 0 },
                restrictions: { vegetarian: 0, gluten_free: 0, dairy_free: 0}
            })
            newUser.save()
            res.send(true)
        }
    })
})

// SEARCH

app.get('/searchrecipes/:query', (req, res) => {
    MongoClient.connect(uri, (err, db) => {
        if (err) throw(err)
        const recipes = db.db("test").collection("recipes")
        let items = []
        const cursor = recipes.find({$text: {$search: req.params.query}})
        cursor.forEach((item) => {
            items.push(item)
        }).then(() => {
            res.send(items)
        })
    })
})

app.get('/user/:username/searchrecipes/:query', (req, res) => {
    MongoClient.connect(uri, (err, db) => {
        if (err) throw(err)
        let query = req.params.query
        const recipes = db.db("test").collection("recipes")
        let items = []
        let seen = []
        const users = db.db("test").collection("users")
        users.findOne({"username": req.params.username})
        .then((user) => {
            if (user) {
                console.log(user)
                for (let i = 0; i < user.customRecipes.length; i++) {
                    // check for match
                    let current = user.customRecipes[i]
                    let valid = false
                    if (current.name.includes(query) || current.author.includes(query) || current.cuisine.includes(query) || current.restrictions.query) {
                        valid = true
                    }
                    for (let ingredient of current.ingredients) {
                        if (ingredient.includes(query)) {
                            valid = true
                        }
                    }
                    for (let instruction of current.instructions) {
                        if (instruction.includes(query)) {
                            valid = true
                        }
                    }
                    for (let tag of current.tags) {
                        if (tag.includes(query)) {
                            valid = true
                        }
                    }
                    if (valid) {
                        items.push(current)
                        seen.push(current.name)
                    }
                }
            }
        })
        .then(() => {
            recipes.find({$text: {$search: query}}).forEach((item) => {
                console.log(item)
                if (!seen.includes(item.name)) items.push(item)
            })
            .then(() => {
                res.json(items)
            })
        })
    })
})

// RECOMMENDATION

app.get('/user/:username/recommended', (req, res) => {
    const Recipe = mongoose.model('Recipe', recipeSchema)
    const User = mongoose.model('User', userSchema)   
    mongoose.connect(uri)
    let scores = []
    User.findOne({'username': req.params.username})
    .then((user) => {
        if (user) {
            // custom recipes
            for (let i = 0; i < user.customRecipes.length; i++) {
                let score = 0
                let current = user.customRecipes[i]
                for (let j = 0; j < user.cuisines.length; j++) {
                    if (current.cuisine.includes(user.cuisines[j].cuisine)) score += user.cuisines[j].score
                }
                score += (current.time.low >= user.time.low)
                score += (current.time.high <= user.time.high)
                score += current.skill.easy * user.skills.easy
                score += current.skill.medium * user.skills.medium
                score += current.skill.hard * user.skills.hard
                score += current.restrictions.vegetarian * user.restrictions.vegetarian
                score += current.restrictions.gluten_free * user.restrictions.gluten_free
                score += current.restrictions.dairy_free * user.restrictions.dairy_free
                scores.push({'score': score, "recipe": current})
            }
            // general recipes
            Recipe.find({})
            .then((recipelist) => {
                recipelist.map(current => {
                    let score = 0
                    for (let j = 0; j < user.cuisines.length; j++) {
                        if (current.cuisine.includes(user.cuisines[j].cuisine)) score += user.cuisines[j].score
                    }
                    score += (current.time.low >= user.time.low)
                    score += (current.time.high <= user.time.high)
                    score += current.skill.easy * user.skills.easy
                    score += current.skill.medium * user.skills.medium
                    score += current.skill.hard * user.skills.hard
                    score += current.restrictions.vegetarian * user.restrictions.vegetarian
                    score += current.restrictions.gluten_free * user.restrictions.gluten_free
                    score += current.restrictions.dairy_free * user.restrictions.dairy_free
                    scores.push({'score': score, "recipe": current})
                })
            })
            .then(() => {
                res.send(scores)
            })
        }
    })
})

// SUBSTITUTIONS
//substitutions added to db and testing works
app.get('/substitutions/:ingredient', (req, res) => {
    let query = req.params.ingredient.toLowerCase()
    const Substitution = mongoose.model('Ingredient', substitutionSchema) 
    mongoose.connect(uri)
    Substitution.findOne({'ingredient': query})
    .then((substitution) => {
        if (substitution) {
            console.log(substitution)
            res.json({'options': substitution.substitutes})
        } else {
            res.json({'options': ''})
        }
    })
})

// CATEGORIES

app.get('/user/:username/group/:groupnumber', (req, res) => {
    const User = mongoose.model('User', userSchema)   
    mongoose.connect(uri)
    User.findOne({'username': req.params.username})
    .then((user) => {
        if (user) {
            res.json(user.groups[req.params.groupnumber])
        }
    })
})

// RECIPE CREATION

app.post('/', (req) => {
    console.log(req.body)
    const Recipe = mongoose.model('Recipe', recipeSchema)
    const newRecipe = new Recipe({
        name: req.body.name,
        author: req.body.author,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        cuisine: req.body.cuisine,
        notes: req.body.notes,
        tags: req.body.tags,
        time: req.body.time,
        skill: req.body.skill,
        restrictions: req.body.restrictions
    })
    mongoose.connect(uri)
    newRecipe.save()
})

app.post('/:username', (req) => {
    console.log("user " + req.params.username + "\n" + req.body)
    const Recipe = mongoose.model('Recipe', recipeSchema)
    const newRecipe = new Recipe({
        name: req.body.name,
        author: req.body.author,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        cuisine: req.body.cuisine,
        notes: req.body.notes,
        tags: req.body.tags,
        time: req.body.time,
        skill: req.body.skill,
        restrictions: req.body.restrictions
    })
    const User = mongoose.model('User', userSchema)   
    mongoose.connect(uri)
    User.findOne({'username': req.params.username})
    .then((user) => {
        if (user) {
            user.customRecipes.push(newRecipe)
            user.save()
        }
    })
})

app.post('/:username/editrecipe', (req) => {
    console.log("user " + req.params.username + "\n" + req.body)
    const Recipe = mongoose.model('Recipe', recipeSchema)
    const User = mongoose.model('User', userSchema)   
    mongoose.connect(uri)
    User.findOne({'username': req.params.username})
    .then((user) => {
        if (user) {
            for (let i = 0; i < user.customRecipes.length; i++) {
                if (user.customRecipes[i].name === req.body.name) {
                    user.customRecipes[i].instructions = (req.body.instructions) ? req.body.instructions : user.customRecipes[i].instructions
                    user.customRecipes[i].ingredients = (req.body.ingredients) ? req.body.ingredients : user.customRecipes[i].instructions
                    user.customRecipes[i].notes = (req.body.notes) ? req.body.notes : user.customRecipes[i].notes
                    user.save()
                }
            }
        }
    })
})

app.post('/:username/maderecipe/', (req) => {
    
})

app.post('/user/:username/addtogroup/:groupnumber/:id', (req, res) => {
    console.log("user " + req.params.username + " group " + req.params.groupnumber + " id " + req.params.id)
    const Recipe = mongoose.model('Recipe', recipeSchema)
    const newRecipe = new Recipe({
        name: req.body.name,
        author: req.body.author,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        cuisine: req.body.cuisine,
        notes: req.body.notes,
        tags: req.body.tags,
        time: req.body.time,
        skill: req.body.skill,
        restrictions: req.body.restrictions
    })
    const User = mongoose.model('User', userSchema)
    mongoose.connect(uri)
    User.findOne({'username': req.params.username})
    .then((user) => {
        if (user) {
            if (user.groups[req.params.groupnumber]) {
                (user.groups[req.params.groupnumber]).push(newRecipe)
                user.save()
                res.send(true)
            } else {
                (user.groups[req.params.groupnumber]) = newRecipe
                user.save()
                res.send(true)
            }
        }
        else {
            res.send(false)
        }
    })
})

app.listen(port, () => {
    console.log(`app running at port ${port}`);
})

const recipeSchema = new mongoose.Schema({
    name: String,
    author: String,
    ingredients: [String],
    instructions: [String],
    cuisine: [String],
    time: { low: Number, high: Number },
    skill: { easy: Boolean, medium: Boolean, hard: Boolean},
    restrictions: { vegetarian: Boolean, gluten_free: Boolean, dairy_free: Boolean},
    notes: [String],
    tags: [String]
});

const userSchema = new mongoose.Schema({
   username: String,
   password: String,
   customRecipes: [recipeSchema],
   groups: [[recipeSchema]],
   cuisines: [{ cuisine: String, score: Number }],
   time: { low: Number, high: Number },
   skills: { easy: Number, medium: Number, hard: Number },
   restrictions: { vegetarian: Number, gluten_free: Number, dairy_free: Number}
});

const substitutionSchema = new mongoose.Schema({
    ingredient: String,
    substitutes: String
});

function updateRecommendeds(user, foundrecipe) {
    console.log(`updating recommendations for ${user}`)
    // update recommendation fields based on foundrecipe
    console.log(foundrecipe)

}
