function openView() {
  document.getElementById("settings").style.left = 0;
}

function closeView() {
  document.getElementById("settings").style.left = "-400px";
}
function skinList()
{
  let select = document.getElementById("skin"); 
  select.innerHTML = '';
  let el = document.createElement("option");
  for (const [key, value] of Object.entries(DALFC.skin.skins)) {
    let el = document.createElement("option");
    el.textContent = value;
    el.value = value;
    select.appendChild(el);
  }
}
function animationList()
{
  let select = document.getElementById("animation"); 
  select.innerHTML = '';
  let el = document.createElement("option");
  for (const [key, value] of Object.entries(DALFC.animation.animations)) {
    let el = document.createElement("option");
    el.textContent = value;
    el.value = value;
    select.appendChild(el);
  }
}
function loadList()
{
  let listname = document.querySelector('input[name="modle"]:checked').value;
  let select = document.getElementById("selectmodle"); 
  select.innerHTML = '';
  let el = document.createElement("option");
  el.textContent = "None";
  el.value = "none";
  select.appendChild(el);
  let options;
  if (listname == "citymodle")  options = citymodleList;
  else if (listname == "hero")  options = heroList;
  else if (listname == "weapon")  options = weaponList;
  for (const [key, value] of Object.entries(options)) {
    let el = document.createElement("option");
    el.textContent = key;
    el.value = value;
    select.appendChild(el);
  }
}
function loadBundle()
{
  if (document.getElementById("selectmodle").value != "none")
  DALFC.user.load(document.getElementById("selectmodle").value);;
}
function screenshot()
{
  let cv = document.getElementsByTagName("canvas")[0];
  let imgSave = window.open();
  imgSave.document.body.style.backgroundColor = "#7F7F7F";
  imgSave.document.body.style.margin = "0px";
  imgSave.document.body.innerHTML = '<img src="' + cv.toDataURL("png") + '">';
}
function setPosition()
{
  let px = parseInt(document.querySelector('input[name="positionX"]').value,10);
  let py = parseInt(document.querySelector('input[name="positionY"]').value,10);
  DALFC.skeleton.setPosition(px, py);
}
function setZoomDelta()
{
  DALFC.user.setZoomDelta(parseFloat(document.querySelector('input[name="zoomDelta"]').value,10));
}
function setZoom()
{
  DALFC.user.setZoom(parseFloat(document.querySelector('input[name="zoom"]').value / 10,10));
}
function setScale()
{
  DALFC.skeleton.setScale(parseFloat(document.querySelector('input[name="scale"]').value,10));
}
function setMix()
{
  DALFC.state.setDefaultMix(parseFloat(document.querySelector('input[name="mix"]').value / 10,10));
  document.getElementById("MixValue").innerHTML = document.querySelector('input[name="mix"]').value / 10;
}
function resetMix()
{
  DALFC.state.setDefaultMix(0);
  document.querySelector('input[name="mix"]').value = 0;
  document.getElementById("MixValue").innerHTML = "0.0";
}
function setSpeed()
{
  DALFC.animation.setSpeed(parseFloat(document.querySelector('input[name="speed"]').value / 10,10));
  document.getElementById("SpeedValue").innerHTML = document.querySelector('input[name="speed"]').value /10;
}
function resetSpeed()
{
  DALFC.animation.setSpeed(1);
  document.querySelector('input[name="speed"]').value = 10;
  document.getElementById("SpeedValue").innerHTML = "1.0";
}
function setSkin()
{
  DALFC.skin.setSkin(document.getElementById("skin").value);
  //console.log(document.getElementById("skin").value);
}
function setAnimation()
{
  DALFC.animation.setAnimation(document.getElementById("animation").value);
  //console.log(document.getElementById("animation").value);
}
function resetSkel()
{
  DALFC.user.resetSkel();
  updatePosition(DALFC.skeleton.getPositionX(), DALFC.skeleton.getPositionY());
  document.querySelectorAll('input[name=bones]')[0].checked = false;
  document.querySelectorAll('input[name=regions]')[0].checked = false;
  document.querySelectorAll('input[name=bounds]')[0].checked = false;
  document.querySelectorAll('input[name=meshhull]')[0].checked = false;
  document.querySelectorAll('input[name=meshtriangles]')[0].checked = false;
  document.querySelectorAll('input[name=PMA]')[0].checked = false;
  document.querySelectorAll('input[name=flipX]')[0].checked = false;
  document.querySelectorAll('input[name=flipY]')[0].checked = false;
  document.querySelectorAll('input[name=pause]')[0].checked = false;
  document.querySelectorAll('input[name=loop]')[0].checked = true;
  document.querySelector('input[name="scale"]').value = 1;
  resetMix();
  resetSpeed();
}
function resetUser()
{
  DALFC.user.setZoom(1);
  DALFC.user.backgroundColor(0,0,0,0);
  document.querySelector('input[name="zoom"]').value = 10;
  document.querySelector('input[name="zoomDelta"]').value = 0.25;
}
const pickr = Pickr.create({
    el: '.color',
    theme: 'nano', // or 'monolith', or 'nano'

    swatches: [],

    components: {

        // Main components
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
            input: true,
            save: true
        }
    }
});
pickr.on('change', (color) => {
    //console.log('change', color.toRGBA());
    let c = color.toRGBA();
    DALFC.user.backgroundColor(c[0] / 255, c[1] / 255, c[2] / 255, c[3]);
})