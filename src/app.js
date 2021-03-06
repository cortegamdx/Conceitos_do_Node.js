const express = require("express");
const cors = require("cors");

 const { uuid,isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


function isValidId(request,response,next){
  const {id} = request.params
   
  if(!isUuid(id)){
    return response.status(400).json({error:'Repository id not found!'});
  }
  return next();
}
function idExists(request,response,next){
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0){
    return response.status(400).json({error : 'Repository id not found'})
  }
  return next();
}


app.get("/repositories", (request, response) => {
  
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
 const {title,url,techs} = request.body;

 const id = uuid();
 const likes = 0;

 const repository = {
   id,
   title,
   url,
   techs,
   likes
 }
 repositories.push(repository);
 
 return response.json(repository);

});

app.put("/repositories/:id", isValidId,(request, response) => {
  const {id} = request.params
  const {title,url,techs} = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  const repository = repositories[repositoryIndex];
 
  repository.title = title;
  repository.url = url;
  repository.techs = techs; 
  
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id",idExists, (request, response) => {
  const {id} = request.params
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  repositories.splice(repositoryIndex,1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", idExists,(request, response) => {
  const {id} = request.params
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
