let copy = text => {
    let textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    Swal.fire({
        icon: 'success',
        title: 'Text-Copied',
        confirmButtonColor: 'bg-success' 
      });
}
function linkedin(){
    document.getElementById("linked_in").style.display="block";
    document.getElementById("npm").style.display="none";
    document.getElementById("git_hub").style.display="none";
}
function github(){
    document.getElementById("linked_in").style.display="none";
    document.getElementById("npm").style.display="none";
    document.getElementById("git_hub").style.display="block";
}
function npm(){
    document.getElementById("linked_in").style.display="none";
    document.getElementById("npm").style.display="block";
    document.getElementById("git_hub").style.display="none";
}
function viewDoc(url){
    Swal.fire({
        imageUrl: `${url}`, 
        imageAlt: 'Image Alt Text', 
        imageWidth: '100%',  
        imageHeight: '90%', 
      });  
}
function downloade(url){
    let originalName=url.split('/');
    let root=document.createElement('a');
    root.href=url;
    root.download=`kavin-${originalName[3]}`;
    document.body.appendChild(root);
    root.click();
    document.body.removeChild(root);
  
}