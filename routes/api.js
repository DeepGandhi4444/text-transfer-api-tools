const express = require('express')
const router = express.Router()
const fs = require('fs')
// router.set('view 
router.use(express.static('public'));

// middleware that is specific to this router
router.use((req, res, next) => {
  // console.log('Time: ', Date().get)
  next()
})


function dycrpyt(text){
  var text2 = "";
  var empty=text.split(";")
  for(var i =0;i<empty.length;i++){
    text2+=String.fromCharCode(empty[i]);
  }
  return text2;
}

router.get('/:id', (req, res,next) => {
  var content
  var text;
  var id = req.params.id;
  fs.readFile('api/temp-code/acc-data.csv', 'utf8', function(err, data){ 
    var condition =data.includes(id);
     if(condition == true){
      content = data.split('\n')
      console.log(content);
      for(var i = 0; i<content.length;i++){
        // if (content.includes('\n')){
        //   words = content[i].split(',');
        // }
       var  words = content[i].split(',');
        if(words[0]==id){
          text = dycrpyt(words[2])
        }
      }
     } 
     fs.writeFileSync('views/api_data.ejs', `<p>${text}</p>`, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
    res.render('api.ejs')

    })   
    
  })

module.exports = router