require('dotenv').config();

const express    = require('express'),
      app        = express(),
      board      = []

app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.json() )

app.get( '/', (req, res) => {

})

app.post( '/submit', (req, res) => {
    dreams.push( req.body.newdream )
    res.writeHead( 200, { 'Content-Type': 'application/json' })
    res.end( JSON.stringify( board ) )
})

app.listen( process.env.PORT )