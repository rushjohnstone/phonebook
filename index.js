const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
var morgan = require('morgan')

persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

morgan.token('content', (request) => {
    if(request.method === 'POST'){
        return JSON.stringify(request.body)
    } else {
        return null
    }
})


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people <br><br>${new Date()}`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find((person) => person.id === id)
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const nameMatch = (name) => persons.some(person => person.name === name)

app.post('/api/persons', (request, response) => {
    const body = request.body
    const id = Math.floor(Math.random() * (1000 - 4) + 4)
    const person = {
        "id": id,
        "name": body.name,
        "number": body.number
    }

    if (!body.name) {
        return response.status(400).json({ 
            error: 'name missing' 
        })
    } else if (nameMatch(body.name)) {
        return response.status(400).json({ 
            error: 'name is already in the phonebook' 
        })
    } else if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing' 
        })
    }

    persons = persons.concat(person)
    response.json(person)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})