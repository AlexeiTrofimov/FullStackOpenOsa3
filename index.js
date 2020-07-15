const express = require('express');
const { response } = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())



let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "name": "Teemu Teekkari",
      "number": "34733101",
      "id": 5
    },
    {
      "name": "Essi Esimerkki",
      "number": "24-34-123321",
      "id": 6
    },
    {
      "name": "John Smith",
      "number": "123456789",
      "id": 7
    }
]

app.get('/info', (request, response) => {
    var today = new Date();
    response.send(
        `<div>
        <p>Phonebook has info for ${persons.length} people</p> 
        <p>${today}</p>
        </div>`
    )
})
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
    morgan.token('data', function(req, res) {return ""})
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
    morgan.token('data', () => {return ""})
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end
    
})

app.post('/api/persons', (request,response) => {
    const body = request.body
    
    if (persons.find(person => person.name === body.name)){
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }
    else if (body.name === undefined || body.number === undefined){
        return response.status(400).json({ 
            error: 'content missing' 
          })
    }
    else{
        const person = {
            name: body.name,
            number: body.number,
            id: Math.floor(Math.random()*Math.floor(9999))
        }
        persons = persons.concat(person)
        response.json(body)
        
        morgan.token('data', () => {return JSON.stringify(request.body)})
    }
    
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})