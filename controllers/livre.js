const Joi = require('joi');

module.exports = function(app,queryPromise){

//#region recuper toute 
app.get("/api/livres", async (req, res) => {
    try{
      livres = await queryPromise('select * from livre as l  inner join style as s on s.id =l.style_id order by titre asc');
     res.json(livres);
    }catch(e) {
      res.status(400).json({error:'impossible to get livres'});
    }
    });
  
  //#endregion
  //#region  recupere une 
  app.get("/api/livres/:idlivre", async (req, res) =>{
    const idlivre = req.params.idlivre;
  try {
   const [livre] = await queryPromise('select * from livre as l  inner join style as a on a.id =l.style_id where idlivre = ? ',[idlivre] ); 
    if (livre) {
      
        return res.json(livre);
    }
    console.log(livre);
    res.status(404).json({ error: "livre not found !" });
 } catch(e){
    console.log(e);
    return res
    .status(400)
    .json({error: 'imposible to update the current livre'});
    }
});
  //#endregion
  //#region suprimer 
  app.delete('/api/livres/:idlivre', async (req, res) => {
    const idlivre = req.params.idlivre;
    try {
      const result = await queryPromise('delete from livre where idlivre = ? ', [idlivre]);
     
      if (result.affectedRows > 0) {
        return res.status(204).send();
      }
      return res.status(404).json({ error: "livre not found" });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: "impossible to remove the current livre " });
    }
  });
  //#endregion
  //#region ajouter
  app.post("/api/livres/", async  (req, res)=> { 
    const {titre ,style_id ,tome , auteur } = req.body; // recuperation des données

    const schema = Joi.object({
      titre: Joi.string().required(),
      style_id: Joi.number().required(),
      auteur: Joi.string().required(),
      tome: Joi.number(),
    });

    const {error,value} = schema.validate(req.body);
    console.log('error',error);
    console.log('value',value);

    if(error != null) {
      const firstError = error.details[0];
      return res.status(400).json({error:firstError.message});
    }

  try {
    const {insertId,} = await queryPromise('insert into livre (titre,style_id,tome,auteur) values (?,?,?,?)',[titre,style_id,tome,auteur]);
    if (insertId != null) {
      const [livre] = await queryPromise('select * from livre as l  inner join style as a on a.id =l.style_id where idlivre = ? ',[insertId]);
  if (livre) {
    return res.json(livre);
  }
  return res.status(404).json({error:"livre not found"});
    }
  }catch(e){
    console.log(e);
    return res.status(400).json({error: "impossible to save the livre "});
  }
  });
  //#endregion
  //#region modifier
  app.post('/api/livres/:idlivre', async (req, res) => {
    const idlivre = req.params.idlivre;//recupere l id 
    const { titre, style_id, tome, auteur, } = req.body; // recupere les info a metre a jour 
    try {
      const [livre] = await queryPromise('select * from livre as l  inner join style as a on a.id =l.style_id where idlivre = ? ', [idlivre]);
      if (idlivre === null) {
        return res.status(404).json({ error: 'livre cannot be found.' });
      }
      livre.titre = titre;
      livre.style_id = style_id;
      livre.tome = tome;
      livre.auteur = auteur;
      const { affectedRows } = await queryPromise('update livre set titre = ?,style_id = ?,tome =?,auteur =? where idlivre = ?',
        [livre.titre,
        livre.style_id,
        livre.tome,
        livre.auteur,
        livre.idlivre
        ]
      );
      if (affectedRows == 0) {
        throw "update failed";
      }
      res.json(livre);
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .json({ error: "imposible to update the current livre" });
    }
  
    return res.send("ok");
  });
  
  //#endregion
} 