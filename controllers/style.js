module.exports = function(app,queryPromise){
    app.get("/api/styles", async (req, res) => {
        try{
          styles = await queryPromise('select * from style');
         res.json(styles);
        }catch(e) {
          res.status(400).json({error:'impossible to get style'});
        }
        });

        app.get("/api/style/:id", async (req, res) =>{
            const id = req.params.id;
          try {
           const [style] = await queryPromise('select * from style where id = ? ',[id] ); 
            if (style) {
              
                return res.json(style);
            }
            console.log(style);
            res.status(404).json({ error: "style not found !" });
         } catch(e){
            console.log(e);
            return res
            .status(400)
            .json({error: 'imposible to update the current style'});
            }
        });
        app.delete('/api/style/:id', async (req, res) => {
            const id = req.params.id;
            try {
              const result = await queryPromise('delete from style where id = ? ', [id]);
             
              if (result.affectedRows > 0) {
                return res.status(204).send();
              }
              return res.status(404).json({ error: "style not found" });
            } catch (e) {
              console.log(e);
              return res.status(400).json({ error: "impossible to remove the current style " });
            }
        });
            app.post("/api/style/", async  (req, res)=> { 
                const {nom} = req.body; // recuperation des données
              try {
                const {insertId,} = await queryPromise('insert into style (style) values (?)',[style]);
                if (insertId != null) {
                  const [style] = await queryPromise('select * from style where id = ? ',[insertId]);
              if (style) {
                return res.json(style);
              }
              return res.status(404).json({error:"style not found"});
                }
              }catch(e){
                console.log(e);
                return res.status(400).json({error: "impossible to save the style "});
              }
              });

              app.post('/api/style/:id', async (req, res) => {
                const id = req.params.id;//recupere l id 
                const { style } = req.body; // recupere les info a metre a jour 
                try {
                  const [style] = await queryPromise('select * from style where id = ? ', [id]);
                  if (id === null) {
                    return res.status(404).json({ error: 'style cannot be found.' });
                  }
                  style.style = nom;
                  const { affectedRows } = await queryPromise('update style set nom = ? where idlivre = ?',
                    [style.style,
                    style.id
                    ]
                  );
                  if (affectedRows == 0) {
                    throw "update failed";
                  }
                  res.json(style);
                } catch (e) {
                  console.log(e);
                  return res
                    .status(400)
                    .json({ error: "imposible to update the current livre" });
                }
              
                return res.send("ok");
              });


        


}
