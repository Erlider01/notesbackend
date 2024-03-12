module.exports = (error, request, response, next) => {
  if (error.name === 'CastError') {
    response.status(400).send({
      error: 'id used is malformed',
      ErrorName: 'CastError'
    }).end()
  } else { response.status(500).send({ error: 'ops a ocurrido un error' }) }
}
