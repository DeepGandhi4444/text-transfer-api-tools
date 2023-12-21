var socket = io();

  //alerts functions start
function success(){
let success = document.getElementById('success');
success.style=" display:block";
}
function warning(){
  let warning = document.getElementsByClassName('alert-warning');
alert.style="display:block";
}
function danger(){
  let danger = document.getElementsByClassName('alert-danger');
danger.style="display:block";
}

  //alerts function ends
function get(){
var text =  document.getElementById("text").value;
  socket.emit('get',text);
  socket.on('api',async(api)=>{
    var id = await api;    
    showpass(id)
    success()
  })


}

function  showpass(api){

  var i = 0;
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("mybar");
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
    document.getElementById('success').style.display="block";
    document.getElementById('id').style.display="block";
  
qrcode(api);


    document.getElementById("id").innerHTML ="<a href=\"/api/"+api+"\" target=\"_blank\" id=\"link\">localhost:3000/api/"+api+"</a>";
  }
  console.log(api);
}

function qrcode(link){
  const qrcode =new QRCode(document.getElementById('qrcode'), {
    text: "localhost:3000/api/"+link ,
    width: 128,
    height: 128,
    colorDark : '#000',
    colorLight : '#fff',
    correctLevel : QRCode.CorrectLevel.H
  });
 


const qrElement = document.getElementById('qrcode');
const qrActionButtons = Array.from(qrElement.querySelectorAll('.qr-action'));
console.log(qrElement);
qrActionButtons.find(b => b.dataset.qrAction === 'visit').href ="api/"+link;

document.addEventListener('click', e => {
  if (e.target) {
    if (qrActionButtons.indexOf(e.target) !== -1) {
      const button = e.target;
      const action = button.dataset.qrAction;
      if (action === 'download') {
        const a = document.createElement('a');
        a.download = 'QR-Code.png';
        a.href = qrElement.querySelector('img').src;
        console.log(a.href);
        a.click();
        a.remove();
      } else if (action === 'copy') {
        fetch(qrElement.querySelector('img').src).then(res => res.blob()).then(blob => navigator.clipboard.write([new ClipboardItem({[blob.type]:blob})]));
      } else if (action === 'visit') {
        // handled organically
      }
    }
  }
});
}