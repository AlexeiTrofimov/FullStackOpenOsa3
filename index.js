require('dotenv').config()
const express = require('express');
const { response } = require('express');
const morgan = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const Person = require('./models/person')


morgan.token('data', (request) => {return JSON.stringify(request.body)})
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())


app.get('/info', (request, response) => {
    var today = new Date();
    Person.countDocuments({}, (err,result) => {
      response.send(
        `<div>
        <p>Phonebook has info for ${result} people</p> 
        <p>${today}</p>
        </div>`
      )
    })
    
})
  
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })  
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = Number(request.params.id)
    Person.findById(request.params.id).then(person => {
      if (person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }

    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end
    })
    .catch(error => next(error))
    
})

app.post('/api/persons', (request,response, next) => {
    const body = request.body
    
    const person = new Person ({
      name: body.name,
      number: body.number,
    })
    person.save().then(savedPerson => {
      response.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
    
    
})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})